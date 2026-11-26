/* Frame Margin — the eBay Messages negotiation engine */
(function () {
  'use strict';
  var FM = window.FM, U = FM.util, $ = U.$, el = U.el, wait = U.wait;
  var C = FM.chat = { state: null };

  var REACT = {
    b: ["Hmph.", "...fine. But I'm not done.", "You sellers and your policies.", "Whatever. Next thing."],
    g: ["That's a start.", "Should have led with that.", "OK. Keep going."],
    w: ["That is NOT an answer.", "Are you even reading my messages?", "Unbelievable. Useless.", "Wow. Great customer service."],
    t: ["EXCUSE ME?!", "Did you seriously just say that to a customer?", "Screenshotting this for eBay.", "WOW. Just wow."]
  };

  function log() { return $('#chat-log'); }
  function scroll() { var l = log(); l.scrollTop = l.scrollHeight; }
  /* keep the newest message in view whenever the log is resized (e.g. the reply options appear on a phone) */
  if (window.ResizeObserver) new ResizeObserver(scroll).observe(log());
  window.addEventListener('resize', scroll);
  function bubble(cls, text) {
    var b = el('div', { 'class': 'msg ' + cls, text: text });
    log().appendChild(b);
    scroll();
    return b;
  }
  function sys(text, cls) { return bubble('sys ' + (cls || ''), text); }
  function idle(text) {
    var box = $('#reply-options');
    box.innerHTML = '';
    box.appendChild(el('div', { 'class': 'reply-idle', text: text }));
  }
  function bump(sel) {
    var c = $(sel).parentNode;
    c.classList.remove('bump');
    void c.offsetWidth;
    c.classList.add('bump');
  }

  function drawHud(S) {
    var cfg = S.cfg, m = FM.calc.margin(S.givenC);
    var room = Math.max(0, FM.calc.headroomC(cfg) - S.givenC), chip = $('.chip-margin');
    $('#hud-given').textContent = U.money(S.givenC / 100);
    $('#hud-margin').textContent = U.pct(m);
    $('#hud-floor').textContent = '(floor ' + U.pct(cfg.floor) + (cfg.strict ? ' strict' : '') + ')';
    $('#hud-room').textContent = U.money(room / 100);
    chip.classList.toggle('danger', room < 200);
    chip.classList.toggle('warn', room >= 200 && room < 800);
    $('#meter-fill').style.width = U.clamp(m / 34 * 100, 0, 100) + '%';
    $('#meter-floor').style.left = U.clamp(cfg.floor / 34 * 100, 0, 100) + '%';
    $('#hud-round').textContent = 'Round ' + Math.min(S.round + 1, cfg.rounds.length) + ' / ' + cfg.rounds.length;
  }

  function drawBars(S) {
    var cfg = S.cfg, p = U.clamp(S.patience, 0, 100), bar = $('#patience-bar'), t = $('#timer');
    var frac = S.awaiting ? U.clamp(S.remaining / cfg.timer, 0, 1) : 1;
    $('#patience-fill').style.transform = 'scaleX(' + (p / 100).toFixed(4) + ')';
    bar.classList.toggle('low', p < 25);
    bar.classList.toggle('mid', p >= 25 && p < 55);
    $('#timer-fill').style.transform = 'scaleX(' + frac.toFixed(4) + ')';
    $('#timer-num').textContent = S.awaiting ? S.remaining.toFixed(1) + 's' : '';
    t.classList.toggle('live', !!S.awaiting);
    t.classList.toggle('hot', !!S.awaiting && S.remaining <= Math.min(3, cfg.timer * 0.5));
  }

  /* fill in the monitor before it slides up */
  C.prepare = function (cfg) {
    var av = $('#c-avatar'), S = { cfg: cfg, round: 0, givenC: 0, patience: cfg.patienceStart, remaining: cfg.timer, awaiting: false };
    log().innerHTML = '';
    av.textContent = cfg.user.charAt(0);
    av.style.background = cfg.color || '#888';
    $('#c-name').textContent = cfg.user;
    $('#c-meta').textContent = '(' + cfg.fb + ')  ·  ' + cfg.item;
    $('#hud-paid').textContent = U.money(FM.PAID_C / 100);
    $('#hud-cost').textContent = U.money(FM.COST_C / 100);
    drawHud(S);
    drawBars(S);
    idle('Waiting for the buyer...');
  };

  /* opts: { onRound(i) -> promise (tutorial pause), noTasks }
     resolves { win, why, title, text, stats } — why is win | time | patience | margin | task */
  C.run = function (cfg, opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      var S = C.state = {
        cfg: cfg, round: 0, givenC: 0, patience: cfg.patienceStart, remaining: cfg.timer,
        awaiting: false, paused: false, over: false, lastTrigger: null, options: [], picks: [], tickAt: 0
      };
      var raf = 0, last = 0, askResolve = null;

      /* time spent with the tab hidden is never charged to the player */
      function onVisibility() { last = 0; }

      function end(win, why, detail) {
        if (S.over) return;
        S.over = true;
        S.awaiting = false;
        cancelAnimationFrame(raf);
        document.removeEventListener('keydown', onKey);
        document.removeEventListener('visibilitychange', onVisibility);
        idle(win ? 'Conversation closed.' : 'Conversation lost.');
        drawBars(S);
        var m = FM.calc.margin(S.givenC), given = U.money(S.givenC / 100), title, text, r;
        if (win) {
          title = 'Sale saved'; text = cfg.user + ' kept the frames.';
        } else if (why === 'time') {
          title = 'Out of time';
          text = 'You took longer than ' + U.secs(cfg.timer) + ' to reply, so ' + cfg.user + ' opened a case.';
        } else if (why === 'patience') {
          title = 'Customer patience ran out';
          text = S.lastTrigger ? 'Saying "' + S.lastTrigger + '" was the last straw. ' + cfg.user + ' left and filed a return.'
            : cfg.user + ' ran out of patience and filed a return.';
        } else if (why === 'margin') {
          title = 'Margin floor broken';
          text = cfg.strict ? 'You gave away ' + given + '. The ' + U.pct(cfg.floor) + ' floor is strict here: giving away even $0.01 loses.'
            : 'You gave away ' + given + ', so margin fell to ' + U.pct(m) + ' — below the ' + U.pct(cfg.floor) + ' floor.';
        } else if (why === 'task') {
          title = 'Store emergency failed'; text = detail || 'The side-task went wrong.';
        } else {
          title = 'Something went wrong'; text = detail || '';
        }
        if (askResolve) { r = askResolve; askResolve = null; r(null); }
        resolve({
          win: !!win, why: why, title: title, text: text,
          stats: { margin: m, given: S.givenC / 100, patience: Math.max(0, Math.round(S.patience)), floor: cfg.floor, strict: !!cfg.strict, replies: S.picks.length }
        });
      }

      /* real elapsed time per frame, so a slow frame rate cannot stretch the reply timer */
      function loop(now) {
        var dt = last && !document.hidden ? Math.min(1, (now - last) / 1000) : 0;
        last = now;
        if (S.over) return;
        if (S.awaiting && !S.paused) {
          S.remaining -= dt;
          S.patience -= cfg.drain * dt;
          if (S.remaining <= Math.min(3, cfg.timer * 0.5) && now - S.tickAt > 480) { S.tickAt = now; FM.audio.play('tick'); }
          if (S.patience <= 0) { S.patience = 0; end(false, 'patience'); return; }
          if (S.remaining <= 0) { S.remaining = 0; end(false, 'time'); return; }
          drawBars(S);
        }
        raf = requestAnimationFrame(loop);
      }

      function choose(i) {
        var o = S.options[i], r = askResolve;
        if (!S.awaiting || S.paused || S.over || !o || !r) return;
        S.awaiting = false;
        askResolve = null;
        idle('...');
        drawBars(S);
        r(o);
      }
      S.pick = choose;

      function onKey(e) {
        var n;
        if (e.repeat || e.ctrlKey || e.metaKey || e.altKey || !S.awaiting || S.paused) return;
        if (!$('#overlay-modal').hidden || !$('#overlay-mg').hidden || !$('#coach').hidden) return;
        n = parseInt(e.key, 10);
        if (n >= 1 && n <= S.options.length) { e.preventDefault(); choose(n - 1); }
      }

      function ask(R) {
        return new Promise(function (res) {
          var box = $('#reply-options');
          askResolve = res;
          S.lastTrigger = null;
          S.options = U.shuffle(R.o).map(function (o) { return { kind: o[0], text: o[1], give: o[2] || 0 }; });
          box.innerHTML = '';
          S.options.forEach(function (o, i) {
            var b = el('button', { type: 'button', 'class': 'opt' }, [el('kbd', { text: String(i + 1) }), el('span', { text: o.text })]);
            b.style.animationDelay = (i * 35) + 'ms';
            b.addEventListener('click', function () { choose(i); });
            box.appendChild(b);
          });
          S.remaining = cfg.timer;
          S.awaiting = true;
          last = 0;                 // the reply clock starts on the next frame
          drawBars(S);
          scroll();                 // the reply zone just grew: keep the buyer's newest demand visible
        });
      }

      function hurt(n) {
        var bar = $('#patience-bar');
        S.patience = Math.max(0, S.patience - n);
        bar.classList.remove('hit');
        void bar.offsetWidth;
        bar.classList.add('hit');
      }

      /* scores a reply; returns the effective kind, or null if the reply lost the level */
      function apply(o) {
        var trig = FM.findTrigger(o.text), kind = o.kind, before = S.patience;
        bubble('me', o.text);
        FM.audio.play('msgOut');
        if (trig) {
          kind = 't';
          S.lastTrigger = trig;
          hurt(45 * cfg.mult);
          sys('"' + trig + '" set them off  (−' + Math.round(before - S.patience) + ' patience)', 'bad');
          FM.audio.play('trigger');
        } else if (kind === 'b') {
          S.patience = Math.min(100, S.patience + 6);
          FM.audio.play('good');
        } else if (kind === 'g') {
          S.givenC += Math.round(o.give * 100);
          S.patience = Math.min(100, S.patience + 12);
          sys('You gave away ' + U.money(o.give) + '  (total ' + U.money(S.givenC / 100) + ')', 'warn');
          FM.audio.play('give');
          bump('#hud-given');
        } else {
          hurt(18 * cfg.mult);
          sys('Weak reply  (−' + Math.round(before - S.patience) + ' patience)', 'bad');
          FM.audio.play('hurt');
        }
        S.picks.push({ round: S.round, kind: kind, trigger: trig, give: o.give });
        drawHud(S);
        drawBars(S);
        if (FM.calc.breaks(S.givenC, cfg)) { end(false, 'margin'); return null; }
        if (S.patience <= 0) { S.patience = 0; end(false, 'patience'); return null; }
        return kind;
      }

      async function customerSays(text, quick) {
        var t = bubble('them typing', ''), ms;
        t.innerHTML = '<i></i><i></i><i></i>';
        ms = quick ? 420 : U.clamp(480 + text.length * 7, 600, 1250) * (1 - 0.45 * cfg.d);
        await wait(ms);
        if (S.over) { t.remove(); return; }
        t.className = 'msg them';
        t.textContent = text;
        FM.audio.play('msgIn');
        scroll();
      }

      async function play() {
        var i, j, R, o, kind, task, res;
        await wait(300);
        for (i = 0; i < cfg.rounds.length; i++) {
          S.round = i;
          drawHud(S);
          R = cfg.rounds[i];
          for (j = 0; j < R.m.length; j++) await customerSays(R.m[j], j > 0);
          if (opts.onRound) { S.paused = true; await opts.onRound(i); S.paused = false; }
          o = await ask(R);
          if (!o || S.over) return;
          kind = apply(o);
          if (!kind || S.over) return;
          if (i === cfg.rounds.length - 1) {
            /* a rude or evasive last word still gets a reaction before the buyer gives up */
            if (kind === 't' || kind === 'w') await customerSays(U.pick(REACT[kind]), true);
            break;
          }
          await customerSays(U.pick(REACT[kind]), true);
          task = opts.noTasks ? null : (cfg.tasks || []).filter(function (t) { return t.after === i + 1; })[0];
          if (task) {
            sys('STORE EMERGENCY — ' + FM.mg.defs[task.id].title, 'alarm');
            await wait(700);
            res = await FM.mg.run(task.id, { d: cfg.d });
            if (!res.success) { end(false, 'task', res.reason); return; }
            sys('Emergency handled. Back to the buyer.', 'ok');
            await wait(350);
          }
        }
        await customerSays(cfg.close, false);
        sys('Case closed — sale saved.', 'ok');
        await wait(750);
        end(true, 'win');
      }

      document.addEventListener('keydown', onKey);
      document.addEventListener('visibilitychange', onVisibility);
      drawHud(S);
      drawBars(S);
      raf = requestAnimationFrame(loop);
      play().catch(function (err) {
        if (window.console) console.error(err);
        end(false, 'error', String((err && err.message) || err));
      });
    });
  };
})();
