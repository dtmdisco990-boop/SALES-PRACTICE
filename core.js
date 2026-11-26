/* Frame Margin — core: namespace, helpers, save data, margin maths, glasses art */
(function () {
  'use strict';
  var FM = window.FM = window.FM || {};

  FM.MAX_LEVEL = 15;
  FM.PAID_C = 10000;   // $100.00 paid, in cents
  FM.COST_C = 6600;    // $66.00 cost, in cents
  FM.TRIGGERS = ['cheap', 'obviously', 'fake', 'calm down', 'your problem'];

  /* every uncaught error lands here so a clean run can be verified */
  FM.errors = [];
  window.addEventListener('error', function (e) {
    FM.errors.push((e.message || 'error') + ' @ ' + (e.filename || '?') + ':' + (e.lineno || 0));
  });
  window.addEventListener('unhandledrejection', function (e) {
    FM.errors.push('unhandled rejection: ' + ((e.reason && e.reason.message) || e.reason));
  });

  var U = FM.util = {
    $: function (s, r) { return (r || document).querySelector(s); },
    $$: function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); },
    el: function (tag, attrs, kids) {
      var e = document.createElement(tag), k, v;
      if (attrs) {
        for (k in attrs) {
          v = attrs[k];
          if (v == null || v === false) continue;
          if (k === 'class') e.className = v;
          else if (k === 'text') e.textContent = v;
          else if (k === 'html') e.innerHTML = v;
          else if (k.slice(0, 2) === 'on' && typeof v === 'function') e.addEventListener(k.slice(2), v);
          else e.setAttribute(k, v === true ? '' : v);
        }
      }
      if (kids != null) {
        (Array.isArray(kids) ? kids : [kids]).forEach(function (c) {
          if (c == null) return;
          e.appendChild(c.nodeType ? c : document.createTextNode(String(c)));
        });
      }
      return e;
    },
    clamp: function (v, a, b) { return Math.max(a, Math.min(b, v)); },
    lerp: function (a, b, t) { return a + (b - a) * t; },
    randInt: function (a, b) { return Math.floor(a + Math.random() * (b - a + 1)); },
    pick: function (arr) { return arr[Math.floor(Math.random() * arr.length)]; },
    shuffle: function (arr) {
      var a = arr.slice(), i, j, t;
      for (i = a.length - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); t = a[i]; a[i] = a[j]; a[j] = t; }
      return a;
    },
    money: function (n) { return '$' + (Math.round(n * 100) / 100).toFixed(2); },
    pct: function (n) { return n.toFixed(2) + '%'; },
    secs: function (n) { return (Math.round(n * 100) / 100).toString() + 's'; },
    wait: function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); },
    digits: function (n) { var s = '', i; for (i = 0; i < n; i++) s += Math.floor(Math.random() * 10); return s; },
    orderId: function () { return U.randInt(10, 29) + '-' + U.digits(5) + '-' + U.digits(5); },
    /* returns a copy of an id with two neighbouring digits swapped or one digit changed — always different */
    nearMiss: function (id) {
      var chars = id.split(''), idx = [], i, a, b, d;
      for (i = 0; i < chars.length; i++) if (/\d/.test(chars[i])) idx.push(i);
      for (i = 0; i < 40; i++) {
        a = U.pick(idx);
        if (Math.random() < 0.5) {
          b = idx[idx.indexOf(a) + 1];
          if (b !== undefined && chars[a] !== chars[b]) { d = chars[a]; chars[a] = chars[b]; chars[b] = d; return chars.join(''); }
        } else {
          d = String((parseInt(chars[a], 10) + U.randInt(1, 9)) % 10);
          chars[a] = d; return chars.join('');
        }
      }
      chars[idx[0]] = String((parseInt(chars[idx[0]], 10) + 1) % 10);
      return chars.join('');
    }
  };

  FM.findTrigger = function (text) {
    var s = String(text).toLowerCase(), i;
    for (i = 0; i < FM.TRIGGERS.length; i++) if (s.indexOf(FM.TRIGGERS[i]) !== -1) return FM.TRIGGERS[i];
    return null;
  };

  /* ---------- margin maths (all in integer cents) ---------- */
  FM.calc = {
    margin: function (givenC) {
      var net = FM.PAID_C - givenC;
      return net <= 0 ? -100 : (net - FM.COST_C) / net * 100;
    },
    headroomC: function (cfg) {
      if (cfg.strict) return 0;
      var f = cfg.floor / 100;
      return Math.max(0, Math.floor((FM.PAID_C - FM.COST_C - FM.PAID_C * f) / (1 - f) + 1e-6));
    },
    breaks: function (givenC, cfg) {
      if (cfg.strict) return givenC > 0;
      return FM.calc.margin(givenC) + 1e-9 < cfg.floor;
    }
  };

  /* ---------- save data ---------- */
  var KEY = 'frameMargin.save.v1', mem = {};
  var store = {
    get: function () { try { return window.localStorage.getItem(KEY); } catch (e) { return mem[KEY] || null; } },
    set: function (v) { try { window.localStorage.setItem(KEY, v); } catch (e) { mem[KEY] = v; } }
  };
  FM.save = {
    KEY: KEY,
    data: { unlocked: 1, cleared: [], drawerOpen: false, muted: false },
    load: function () {
      var d;
      try { d = JSON.parse(store.get() || 'null'); } catch (e) { d = null; }
      if (d && typeof d === 'object') {
        this.data.unlocked = U.clamp(parseInt(d.unlocked, 10) || 1, 1, FM.MAX_LEVEL);
        this.data.cleared = Array.isArray(d.cleared) ? d.cleared.filter(function (n) {
          return Number.isInteger(n) && n >= 1 && n <= FM.MAX_LEVEL;
        }) : [];
        this.data.drawerOpen = !!d.drawerOpen;
        this.data.muted = !!d.muted;
      }
      return this.data;
    },
    persist: function () { store.set(JSON.stringify(this.data)); },
    isUnlocked: function (n) { return n >= 1 && n <= this.data.unlocked; },
    isCleared: function (n) { return this.data.cleared.indexOf(n) !== -1; },
    /* beating level n unlocks n + 1; returns the newly unlocked level number (or 0) */
    clear: function (n) {
      var newly = 0;
      if (this.data.cleared.indexOf(n) === -1) this.data.cleared.push(n);
      if (n < FM.MAX_LEVEL && this.data.unlocked < n + 1) { this.data.unlocked = n + 1; newly = n + 1; }
      this.persist();
      return newly;
    },
    setDrawer: function (open) { this.data.drawerOpen = !!open; this.persist(); },
    setMuted: function (m) { this.data.muted = !!m; this.persist(); },
    reset: function () { this.data = { unlocked: 1, cleared: [], drawerOpen: false, muted: false }; this.persist(); }
  };

  /* ---------- glasses art (inline SVG, no image files) ---------- */
  function rim(shape, cx) {
    switch (shape) {
      case 'square': return '<rect x="' + (cx - 40) + '" y="21" width="80" height="62" rx="14"/>';
      case 'oval': return '<ellipse cx="' + cx + '" cy="52" rx="42" ry="30"/>';
      case 'hex': return '<polygon points="' + [[-40, 0], [-21, -33], [21, -33], [40, 0], [21, 33], [-21, 33]].map(function (p) {
        return (cx + p[0]) + ',' + (52 + p[1]);
      }).join(' ') + '"/>';
      case 'aviator': return '<path d="M' + (cx - 40) + ' 28 Q' + cx + ' 14 ' + (cx + 40) + ' 28 Q' + (cx + 44) + ' 70 ' + cx + ' 88 Q' + (cx - 44) + ' 70 ' + (cx - 40) + ' 28Z"/>';
      case 'cat': return '<path d="M' + (cx - 40) + ' 30 Q' + cx + ' 24 ' + (cx + 44) + ' 18 Q' + (cx + 40) + ' 76 ' + cx + ' 82 Q' + (cx - 38) + ' 78 ' + (cx - 40) + ' 30Z"/>';
      default: return '<circle cx="' + cx + '" cy="52" r="36"/>';
    }
  }
  FM.art = {
    glasses: function (o) {
      o = o || {};
      var frame = o.frame || '#3b2a1c', lens = o.lens || '#8ecae6', shape = o.shape || 'round';
      var L = rim(shape, 64), R = rim(shape, 176);
      if (shape === 'cat') L = '<g transform="translate(128 0) scale(-1 1)">' + rim(shape, 64) + '</g>';
      return '<svg' + (o.cls ? ' class="' + o.cls + '"' : '') + ' viewBox="0 0 240 104" role="img" aria-label="eyeglasses">' +
        '<g fill="' + lens + '" fill-opacity=".38" stroke="none">' + L + R + '</g>' +
        '<g fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="4" stroke-linecap="round">' +
        '<path d="M46 40 L58 30"/><path d="M158 40 L170 30"/></g>' +
        '<g fill="none" stroke="' + frame + '" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">' +
        L + R + '<path d="M103 46 Q120 32 137 46"/><path d="M24 44 L5 36"/><path d="M216 44 L235 36"/></g></svg>';
    }
  };
})();
