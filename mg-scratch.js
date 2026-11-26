/* Side-task 5 — Scratched Frame Inspection
   Compare two 4x3 grids (Dispatch vs Arrival), click the 1 new scratch cell, then "Hold for condition review" */
(function () {
  'use strict';
  var FM = window.FM, U = FM.util, el = U.el;
  var COLS = 4, ROWS = 3, CELLS = COLS * ROWS;

  /* one scratch mark, drawn inside a 100x100 cell */
  function scratchSvg(half) {
    var cx = U.randInt(36, 64), cy = U.randInt(36, 64);
    var ang = U.randInt(20, 70) * (Math.random() < 0.5 ? 1 : -1) * Math.PI / 180;
    var dx = Math.cos(ang) * half, dy = Math.sin(ang) * half;
    function p(x, y) { return x.toFixed(1) + ' ' + y.toFixed(1); }
    var line = 'M' + p(cx - dx, cy - dy) + ' L' + p(cx + dx, cy + dy);
    /* a pale halo under a dark core keeps the mark readable on the light backdrop AND on the dark frame */
    return '<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' +
      '<path d="' + line + '" stroke="#ffffff" stroke-opacity=".95" stroke-width="6.5" stroke-linecap="round" fill="none"/>' +
      '<path d="' + line + '" stroke="#3b4453" stroke-width="2.6" stroke-linecap="round" fill="none"/>' +
      '</svg>';
  }

  FM.mg.register('scratch', {
    title: 'Scratched Frame Inspection',
    time: function (d) { return U.lerp(22, 10, d); },
    timeout: 'Too slow - the damage claim was paid out automatically.',
    brief: function () {
      return '<p>A buyer says the frame arrived scratched. Compare your <b>Dispatch photo</b> with their <b>Arrival photo</b>:</p>' +
        '<ol class="mg-steps"><li>Find the 1 scratch that is new on arrival</li><li>Click that cell on the Arrival photo</li><li>Hold for condition review</li></ol>' +
        '<p>Marks that already show on the dispatch photo are <b>not</b> new. Flagging the wrong cell fails the review.</p>';
    },
    build: function (ctx) {
      var cells = U.shuffle(Array.apply(null, { length: CELLS }).map(function (_, i) { return i; }));
      var nOld = 2 + Math.round(ctx.d * 2), half = U.lerp(19, 14, ctx.d);
      var oldCells = cells.slice(0, nOld), newCell = cells[nOld], marks = {}, i;
      var st = ctx.state = { cols: COLS, rows: ROWS, oldCells: oldCells, newCell: newCell, selected: -1 };
      var gridA = el('div', { 'class': 'sc-grid sc-a' }), gridB = el('div', { 'class': 'sc-grid sc-b' });
      var submit = el('button', { type: 'button', 'class': 'btn btn-primary', disabled: true, text: 'Hold for condition review' });
      var art = FM.art.glasses({ cls: 'sc-frame', frame: '#2b3448', lens: '#9ec5e6' }), cellEls = [];

      oldCells.concat([newCell]).forEach(function (c) { marks[c] = scratchSvg(half); });

      function select(c) {
        if (!ctx.live()) return;
        st.selected = c;
        cellEls.forEach(function (b, j) {
          b.classList.toggle('sel', j === c);
          b.setAttribute('aria-pressed', j === c ? 'true' : 'false');
        });
        submit.disabled = false;
        FM.audio.play('select');
        ctx.status('Cell ' + (c + 1) + ' flagged. Hold it for review if that scratch is new.');
      }

      gridA.innerHTML = art;
      gridB.innerHTML = art;
      for (i = 0; i < CELLS; i++) {
        (function (c) {
          var a = el('div', { 'class': 'sc-cell', html: oldCells.indexOf(c) !== -1 ? marks[c] : '' });
          var b = el('button', {
            type: 'button', 'class': 'sc-cell', 'aria-pressed': 'false', 'data-i': c,
            'aria-label': 'Arrival photo, row ' + (Math.floor(c / COLS) + 1) + ', column ' + (c % COLS + 1),
            html: marks[c] || ''
          });
          b.addEventListener('click', function () { select(c); });
          cellEls.push(b);
          gridA.appendChild(a);
          gridB.appendChild(b);
        })(i);
      }

      submit.addEventListener('click', function () {
        if (!ctx.live() || st.selected < 0) return;
        if (st.selected === newCell) {
          FM.audio.play('stamp');
          ctx.win('New scratch documented. Order held for condition review.');
        } else if (oldCells.indexOf(st.selected) !== -1) {
          ctx.fail('That mark was already on the dispatch photo - it is not new damage.');
        } else {
          ctx.fail('There is no scratch in that cell. The real one went unreported.');
        }
      });

      ctx.root.appendChild(el('div', { 'class': 'sc-wrap' }, [
        el('div', { 'class': 'sc-pane' }, [el('h3', { text: 'Dispatch photo' }), gridA]),
        el('div', { 'class': 'sc-pane' }, [el('h3', { html: 'Arrival photo <em>- click here</em>' }), gridB]),
        el('div', { 'class': 'sc-foot' }, submit)
      ]));
      ctx.status('Spot the one scratch that only appears on arrival.');
    }
  });
})();
