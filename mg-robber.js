/* Side-task 1 — Store Robber Chase
   Top-down 11x7 grid. Robber: Entrance (1,3) -> top or bottom aisle -> Exit (9,3). Player starts on the Exit. */
(function () {
  'use strict';
  var FM = window.FM, U = FM.util, el = U.el;

  var MAP = [
    '###########',
    '#.........#',   // top aisle    (y = 1)
    '#.RR.RR.R.#',
    '#ERR.RR.RX#',   // E = entrance (1,3)   X = exit (9,3)   R = glass display rack
    '#.RR.RR.R.#',
    '#.........#',   // bottom aisle (y = 5)
    '###########'
  ];
  var COLS = 11, ROWS = 7, ENTRANCE = { x: 1, y: 3 }, EXIT = { x: 9, y: 3 }, CROSS = [4, 7], TOP = 1, BOTTOM = 5;
  var KEYS = {
    ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
    w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0]
  };

  function open(x, y) {
    var c = MAP[y] ? MAP[y].charAt(x) : '#';
    return c === '.' || c === 'E' || c === 'X';
  }

  FM.mg.register('robber', {
    title: 'Store Robber Chase',
    MAP: MAP, ENTRANCE: ENTRANCE, EXIT: EXIT,
    brief: function () {
      return '<p>A robber grabbed a tray of frames at the <b>entrance</b> and is sprinting down the <b>top or bottom aisle</b> for the <b>EXIT</b>.</p>' +
        '<p>You start at the exit. Move with <b>Arrow keys</b>, <b>WASD</b> or the on-screen <b>D-pad</b> and tackle the robber <b>in an aisle</b> before they reach the door.</p>' +
        '<p>Standing in the doorway will not stop them, and they may cut through a cross-aisle.</p>';
    },
    build: function (ctx) {
      var grid = el('div', { 'class': 'rb-grid' }), pad = el('div', { 'class': 'rb-pad' });
      var robberEl = el('div', { 'class': 'rb-ent rb-robber' }, el('span'));
      var playerEl = el('div', { 'class': 'rb-ent rb-player' }, el('span'));
      var timer = 0, lastMove = 0, x, y, c, cls;

      var st = ctx.state = {
        cols: COLS, rows: ROWS,
        player: { x: EXIT.x, y: EXIT.y },
        robber: { x: ENTRANCE.x, y: ENTRANCE.y },
        aisle: Math.random() < 0.5 ? TOP : BOTTOM,
        feints: ctx.tutorial ? 0 : (ctx.d < 0.3 ? 0 : ctx.d < 0.7 ? 1 : 2),
        stepMs: ctx.tutorial ? 520 : Math.round(U.lerp(360, 170, ctx.d)),
        steps: 0
      };

      for (y = 0; y < ROWS; y++) {
        for (x = 0; x < COLS; x++) {
          c = MAP[y].charAt(x);
          cls = c === '#' ? 'wall' : c === 'R' ? 'rack' : c === 'E' ? 'entrance' : c === 'X' ? 'exit' : 'floor';
          grid.appendChild(el('div', { 'class': 'rb-cell ' + cls, text: c === 'E' ? 'IN' : c === 'X' ? 'EXIT' : '' }));
        }
      }
      grid.appendChild(robberEl);
      grid.appendChild(playerEl);

      function place(node, p) { node.style.transform = 'translate(' + (p.x * 100) + '%,' + (p.y * 100) + '%)'; }

      function caught(msg) {
        robberEl.classList.add('caught');
        FM.audio.play('catch');
        ctx.win(msg);
      }

      /* only a HELD key (auto-repeat) is rate-limited; every deliberate press or tap always moves */
      function move(dx, dy, isRepeat) {
        var now = performance.now(), nx = st.player.x + dx, ny = st.player.y + dy;
        if (!ctx.live() || (isRepeat && now - lastMove < 85)) return;
        if (!open(nx, ny)) { if (!isRepeat) FM.audio.play('bump'); return; }
        lastMove = now;
        st.player.x = nx;
        st.player.y = ny;
        place(playerEl, st.player);
        FM.audio.play('step');
        if (nx === st.robber.x && ny === st.robber.y) caught('Tackled! The frames are safe.');
      }
      st.move = move;

      function robberStep() {
        var r = st.robber, p = st.player, threat;
        if (!ctx.live()) return;
        if (document.hidden) { timer = setTimeout(robberStep, 200); return; }   // the robber waits while the tab is hidden
        /* at a cross-aisle the robber may switch aisles if you are blocking the one they are on */
        if (r.y === st.aisle && CROSS.indexOf(r.x) !== -1 && st.feints > 0) {
          threat = (st.aisle === TOP ? p.y < EXIT.y : p.y > EXIT.y) && p.x >= r.x;
          if (threat && Math.random() < 0.8) {
            st.aisle = st.aisle === TOP ? BOTTOM : TOP;
            st.feints--;
            ctx.status('The robber cut through a cross-aisle!', 'bad');
          }
        }
        if (r.x === EXIT.x) r.y += EXIT.y > r.y ? 1 : -1;        // final run down the exit column
        else if (r.y === st.aisle) r.x += 1;                     // sprint along the aisle
        else r.y += st.aisle > r.y ? 1 : -1;                     // heading for the aisle
        st.steps++;
        place(robberEl, r);
        if (r.x === EXIT.x && r.y === EXIT.y) { ctx.fail('The robber reached the exit with a tray of frames.'); return; }
        if (r.x === p.x && r.y === p.y) { caught('The robber ran straight into you. Frames recovered.'); return; }
        timer = setTimeout(robberStep, st.stepMs);
      }

      function onKey(e) {
        var k = e.key && e.key.length === 1 ? e.key.toLowerCase() : e.key, v = KEYS[k];
        if (!v || e.ctrlKey || e.metaKey || e.altKey) return;
        e.preventDefault();
        move(v[0], v[1], e.repeat);
      }

      [['u', '▲', 0, -1, 'up'], ['l', '◀', -1, 0, 'left'], ['r', '▶', 1, 0, 'right'], ['d', '▼', 0, 1, 'down']].forEach(function (b) {
        var btn = el('button', { type: 'button', 'class': b[0], 'aria-label': 'Move ' + b[4], 'data-dir': b[4], text: b[1] });
        btn.addEventListener('pointerdown', function (e) { e.preventDefault(); move(b[2], b[3]); });
        btn.addEventListener('click', function (e) { if (e.detail === 0) move(b[2], b[3]); });   // keyboard / assistive activation
        pad.appendChild(btn);
      });

      ctx.root.appendChild(el('div', { 'class': 'rb-wrap' }, [
        grid,
        el('div', { 'class': 'rb-side' }, [
          el('div', { 'class': 'rb-legend', html: '<span><i style="background:#2ec4b6"></i>You</span><span><i style="background:#151515"></i>Robber</span>' }),
          pad
        ])
      ]));
      place(robberEl, st.robber);
      place(playerEl, st.player);
      ctx.status('Watch which aisle they pick...');

      document.addEventListener('keydown', onKey);
      ctx.onCleanup(function () {
        document.removeEventListener('keydown', onKey);
        clearTimeout(timer);
      });
      timer = setTimeout(robberStep, 700);
    }
  });
})();
