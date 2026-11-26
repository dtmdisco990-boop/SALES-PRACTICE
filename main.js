/* Frame Margin — menu, level select drawer, level loop, win / lose screens */
(function () {
  'use strict';
  var FM = window.FM, U = FM.util, $ = U.$, el = U.el, UI = FM.ui;
  var M = FM.main = { busy: false, level: 0 };

  function renderLevels(justUnlocked) {
    var grid = $('#level-grid'), n;
    grid.innerHTML = '';
    for (n = 1; n <= FM.MAX_LEVEL; n++) {
      (function (lv) {
        var unlocked = FM.save.isUnlocked(lv), cleared = FM.save.isCleared(lv);
        var cls = 'lvl' + (cleared ? ' cleared' : '') + (unlocked && !cleared && lv === FM.save.data.unlocked ? ' current' : '') +
          (lv === justUnlocked ? ' just-unlocked' : '');
        var b = el('button', {
          type: 'button', 'class': cls, 'data-level': lv, disabled: !unlocked, text: String(lv),
          'aria-label': 'Level ' + lv + (unlocked ? (cleared ? ', cleared' : '') : ', locked')
        });
        b.addEventListener('click', function () {
          if (M.busy || !FM.save.isUnlocked(lv)) return;
          FM.audio.init();
          FM.audio.play('click');
          M.playLevel(lv);
        });
        grid.appendChild(b);
      })(n);
    }
    $('#drawer-count').textContent = FM.save.data.cleared.length + '/' + FM.MAX_LEVEL + ' cleared';
  }

  function setDrawer(open, persist) {
    $('#drawer').classList.toggle('open', open);
    $('#drawer-toggle').setAttribute('aria-expanded', open ? 'true' : 'false');
    $('#drawer-body').toggleAttribute('inert', !open);
    if (persist) FM.save.setDrawer(open);
  }

  function setMute(m, persist) {
    var b = $('#btn-mute');
    FM.audio.setMuted(m);
    b.setAttribute('aria-pressed', m ? 'true' : 'false');
    b.setAttribute('aria-label', m ? 'Unmute sound' : 'Mute sound');
    if (persist) FM.save.setMuted(m);
  }

  M.showMenu = function (justUnlocked) {
    M.busy = false;
    M.level = 0;
    FM.prechat.reset();
    UI.coach.hide();
    renderLevels(justUnlocked);
    UI.showScreen('menu');
    $('#btn-start').focus();
  };

  function showWin(level, r, newly) {
    var last = level === FM.MAX_LEVEL;
    FM.audio.play(last ? 'victory' : 'win');
    if (last) UI.confetti(110);
    if (newly) {
      setTimeout(function () {
        FM.audio.play('unlock');
        UI.toast('Level ' + newly + ' unlocked', 'good');
      }, 550);
    }
    return UI.modal({
      cls: 'win',
      tag: last ? 'Final boss beaten' : 'Level ' + level + ' cleared',
      title: last ? 'You kept the store alive' : r.title,
      text: last ? 'All 15 buyers handled with the margin intact. Frame Margin complete.' : r.text,
      stats: [['Margin kept', U.pct(r.stats.margin)], ['Given away', U.money(r.stats.given)], ['Patience left', String(r.stats.patience)]],
      note: newly ? 'Level ' + newly + ' is now unlocked in Level Select.' : '',
      buttons: last
        ? [{ label: 'Back to Menu', value: 'menu', primary: true }, { label: 'Replay Level 15', value: 'retry' }]
        : [{ label: 'Next: Level ' + (level + 1), value: 'next', primary: true }, { label: 'Menu', value: 'menu' }]
    });
  }

  function showLose(level, r) {
    /* on the strict final level the rule is "give nothing", so show that instead of a margin that still looks healthy */
    var stats = r.stats.strict
      ? [['Given away', U.money(r.stats.given)], ['Allowed', U.money(0)], ['Patience left', String(r.stats.patience)]]
      : [['Margin', U.pct(r.stats.margin)], ['Floor', U.pct(r.stats.floor)], ['Patience left', String(r.stats.patience)]];
    FM.audio.play('lose');
    return UI.modal({
      cls: 'lose',
      tag: 'Level ' + level + ' lost',
      title: r.title,
      text: r.text,
      stats: stats,
      buttons: [{ label: 'Retry Level ' + level, value: 'retry', primary: true }, { label: 'Menu', value: 'menu' }]
    });
  }

  /* plays level n; losing only ever offers a retry of the SAME level */
  M.playLevel = async function (n) {
    var level = U.clamp(n, 1, FM.MAX_LEVEL), cfg, r, next, newly;
    M.busy = true;
    for (;;) {
      M.level = level;
      newly = 0;
      cfg = FM.levelCfg(level);
      UI.showScreen('game');
      await FM.prechat.run(cfg);
      r = await FM.chat.run(cfg);
      M.lastResult = r;
      if (r.win) {
        newly = FM.save.clear(level);
        next = await showWin(level, r, newly);
      } else {
        next = await showLose(level, r);
      }
      if (next === 'menu') { M.showMenu(newly); return; }
      if (next === 'next') level = Math.min(FM.MAX_LEVEL, level + 1);
    }
  };

  async function onStart() {
    var level, choice;
    if (M.busy) return;
    M.busy = true;
    FM.audio.init();
    FM.audio.play('start');
    level = FM.save.data.unlocked;
    choice = await UI.modal({
      tag: level > 1 ? 'Continuing at Level ' + level : 'Opening the store',
      title: 'Play Tutorial First?',
      text: 'Learn the photo table, bagging, buyer chats and store emergencies - or dive right in.',
      buttons: [
        { label: 'Play Tutorial First', value: 'tutorial', primary: true },
        { label: 'Jump Straight Into Game', value: 'game' }
      ]
    });
    if (choice === 'tutorial') await FM.tutorial.run();
    await M.playLevel(level);
  }

  function init() {
    var problems;
    FM.save.load();
    FM.audio.muted = FM.save.data.muted;
    $('#menu-art').innerHTML = FM.art.glasses({ frame: '#ffb703', lens: '#8ecae6' });
    renderLevels();
    setDrawer(FM.save.data.drawerOpen, false);
    setMute(FM.audio.muted, false);

    $('#btn-start').addEventListener('click', function () {
      onStart().catch(function (e) { FM.errors.push('flow: ' + ((e && e.message) || e)); if (window.console) console.error(e); });
    });
    $('#drawer-toggle').addEventListener('click', function () {
      FM.audio.init();
      FM.audio.play('click');
      setDrawer(!$('#drawer').classList.contains('open'), true);
    });
    $('#btn-mute').addEventListener('click', function () {
      setMute(!FM.audio.muted, true);
      FM.audio.play('click');
    });
    /* quit to menu: the first click arms the button for 3 seconds, a second click confirms.
       Reloading is the one way to stop every running timer and animation cleanly; the save is already on disk. */
    $('#btn-quit').addEventListener('click', function () {
      var b = $('#btn-quit');
      FM.audio.play('click');
      if (b.classList.contains('armed')) { window.location.reload(); return; }
      b.classList.add('armed');
      b.setAttribute('aria-label', 'Confirm: quit to menu');
      clearTimeout(M.quitTimer);
      M.quitTimer = setTimeout(function () {
        b.classList.remove('armed');
        b.setAttribute('aria-label', 'Quit to menu');
      }, 3000);
    });

    UI.showScreen('menu');
    problems = FM.validateLevels();
    if (problems.length && window.console) console.warn('Frame Margin level data problems:', problems);
    M.ready = true;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
