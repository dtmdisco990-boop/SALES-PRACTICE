/* Frame Margin — shared UI: screens, modal, coach card, toast, flash, confetti */
(function () {
  'use strict';
  var FM = window.FM, U = FM.util, $ = U.$, el = U.el;
  var UI = FM.ui = {};

  UI.showScreen = function (name) {
    U.$$('.screen').forEach(function (s) { s.classList.toggle('is-active', s.id === 'screen-' + name); });
    $('#btn-mute').hidden = name !== 'game';
    $('#btn-quit').hidden = name !== 'game';
    $('#btn-quit').classList.remove('armed');
    UI.screen = name;
  };

  /* bright full-screen camera flash */
  UI.flash = function () {
    var f = $('#flash');
    f.classList.remove('fire');
    void f.offsetWidth;            // restart the animation if it is already running
    f.classList.add('fire');
    UI.flashCount = (UI.flashCount || 0) + 1;
  };

  var toastTimer = 0;
  UI.toast = function (msg, cls, ms) {
    var t = $('#toast');
    t.textContent = msg;
    t.className = 'toast show ' + (cls || '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, ms || 1900);
  };

  /* o: { tag, title, text, stats:[[label,value]], note, cls, buttons:[{label,value,primary}] } -> Promise(value) */
  UI.modal = function (o) {
    return new Promise(function (resolve) {
      var ov = $('#overlay-modal'), m = $('#modal'), acts = el('div', { 'class': 'actions' }), first = null, closed = false;
      m.className = 'modal ' + (o.cls || '');
      m.innerHTML = '';
      m.setAttribute('aria-labelledby', 'modal-title');
      if (o.tag) m.appendChild(el('span', { 'class': 'tag', text: o.tag }));
      m.appendChild(el('h2', { id: 'modal-title', text: o.title }));
      if (o.text) m.appendChild(el('p', { text: o.text }));
      if (o.stats) {
        m.appendChild(el('div', { 'class': 'stats' }, o.stats.map(function (s) {
          return el('div', { 'class': 'stat' }, [el('small', { text: s[0] }), el('b', { text: s[1] })]);
        })));
      }
      if (o.note) m.appendChild(el('p', { 'class': 'note', text: o.note }));
      o.buttons.forEach(function (b) {
        var btn = el('button', { type: 'button', 'class': 'btn ' + (b.primary ? 'btn-primary' : 'btn-ghost'), text: b.label, 'data-value': b.value });
        btn.addEventListener('click', function () {
          if (closed) return;
          closed = true;
          FM.audio.play('click');
          ov.classList.remove('show');
          setTimeout(function () { ov.hidden = true; resolve(b.value); }, 210);
        });
        if (b.primary && !first) first = btn;
        acts.appendChild(btn);
      });
      m.appendChild(acts);
      ov.hidden = false;
      void ov.offsetWidth;
      ov.classList.add('show');
      (first || acts.firstChild).focus();
    });
  };

  UI.coach = {
    say: function (text, label) {
      return new Promise(function (resolve) {
        var c = $('#coach'), btn = $('#coach-btn'), card = c.firstElementChild;
        $('#coach-msg').textContent = text;
        btn.textContent = label || 'Got it';
        c.hidden = false;
        card.style.animation = 'none';
        void card.offsetWidth;
        card.style.animation = '';
        btn.onclick = function () {
          btn.onclick = null;
          FM.audio.play('click');
          c.hidden = true;
          resolve();
        };
        btn.focus();
      });
    },
    hide: function () { $('#coach').hidden = true; $('#coach-btn').onclick = null; }
  };

  UI.confetti = function (n) {
    var box = $('#confetti'), colors = ['#ffb703', '#2ec4b6', '#ff4d5e', '#8ecae6', '#2fbf71', '#ffffff'], i, p;
    box.innerHTML = '';
    for (i = 0; i < (n || 80); i++) {
      p = document.createElement('i');
      p.style.left = (Math.random() * 100) + '%';
      p.style.background = U.pick(colors);
      p.style.animationDuration = (1.6 + Math.random() * 1.8) + 's';
      p.style.animationDelay = (Math.random() * 0.9) + 's';
      box.appendChild(p);
    }
    setTimeout(function () { box.innerHTML = ''; }, 4800);
  };
})();
