/* Frame Margin — every sound is synthesised with the Web Audio API (no audio files) */
(function () {
  'use strict';
  var FM = window.FM;
  var VOL = 0.55;
  var A = FM.audio = { ctx: null, master: null, analyser: null, muted: false, played: [], counts: {}, errors: [] };
  var noiseBuf = null;

  /* must be called from a user gesture (the START click) */
  A.init = function () {
    if (A.ctx) { if (A.ctx.state === 'suspended') A.ctx.resume(); return true; }
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    try {
      var c = new AC(), len = c.sampleRate, d, i, comp;
      A.master = c.createGain();
      A.master.gain.value = A.muted ? 0 : VOL;
      A.analyser = c.createAnalyser();
      A.analyser.fftSize = 2048;
      comp = c.createDynamicsCompressor();
      A.master.connect(A.analyser);
      A.analyser.connect(comp);
      comp.connect(c.destination);
      noiseBuf = c.createBuffer(1, len, c.sampleRate);
      d = noiseBuf.getChannelData(0);
      for (i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      A.ctx = c;
      if (c.state === 'suspended') c.resume();
    } catch (e) {
      A.ctx = null;
      A.errors.push('init: ' + e.message);
      return false;
    }
    return true;
  };

  A.setMuted = function (m) {
    A.muted = !!m;
    if (A.ctx && A.master) A.master.gain.setTargetAtTime(A.muted ? 0 : VOL, A.ctx.currentTime, 0.01);
  };

  /* peak amplitude currently flowing through the master bus — used to confirm real output */
  A.peak = function () {
    if (!A.analyser) return 0;
    var buf = new Float32Array(A.analyser.fftSize), i, p = 0;
    A.analyser.getFloatTimeDomainData(buf);
    for (i = 0; i < buf.length; i++) if (Math.abs(buf[i]) > p) p = Math.abs(buf[i]);
    return p;
  };

  function tone(o) {
    var c = A.ctx, t0 = c.currentTime + (o.t || 0), d = o.d || 0.12;
    var osc = c.createOscillator(), g = c.createGain();
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(o.f, t0);
    if (o.f2) osc.frequency.exponentialRampToValueAtTime(Math.max(1, o.f2), t0 + d);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(o.g || 0.2, t0 + Math.min(o.a || 0.004, d * 0.4));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
    osc.connect(g); g.connect(A.master);
    osc.start(t0); osc.stop(t0 + d + 0.03);
  }

  function noise(o) {
    var c = A.ctx, t0 = c.currentTime + (o.t || 0), d = o.d || 0.08;
    var src = c.createBufferSource(), flt = c.createBiquadFilter(), g = c.createGain();
    src.buffer = noiseBuf; src.loop = true;
    flt.type = o.type || 'highpass';
    flt.frequency.setValueAtTime(o.f || 1000, t0);
    if (o.f2) flt.frequency.exponentialRampToValueAtTime(o.f2, t0 + d);
    flt.Q.value = o.q || 0.7;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(o.g || 0.3, t0 + Math.min(o.a || 0.002, d * 0.4));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
    src.connect(flt); flt.connect(g); g.connect(A.master);
    src.start(t0, Math.random() * 0.5); src.stop(t0 + d + 0.03);
  }

  function arp(freqs, gap, o) {
    freqs.forEach(function (f, i) {
      tone({ f: f, type: o.type || 'triangle', t: i * gap, d: o.d || 0.16, g: o.g || 0.18 });
    });
  }

  var S = {
    /* interface */
    click: function () { tone({ f: 720, f2: 520, type: 'triangle', d: 0.06, g: 0.18 }); },
    start: function () { arp([392, 523, 659, 784], 0.07, { d: 0.18, g: 0.2 }); },
    unlock: function () { arp([784, 988, 1175, 1568], 0.06, { type: 'sine', d: 0.2, g: 0.14 }); },
    /* photo table */
    slide: function () { noise({ type: 'bandpass', f: 500, f2: 1800, q: 0.8, d: 0.45, g: 0.55, a: 0.08 }); },
    clack: function () {
      tone({ f: 1400, f2: 700, type: 'square', d: 0.03, g: 0.1 });
      noise({ f: 3000, d: 0.03, g: 0.2 });
      tone({ f: 900, f2: 500, type: 'square', t: 0.05, d: 0.03, g: 0.07 });
    },
    /* crisp two-stage camera shutter: mirror slap, then the curtain closing */
    shutter: function () {
      noise({ type: 'highpass', f: 3200, d: 0.022, g: 0.75 });
      tone({ f: 2400, f2: 900, type: 'square', d: 0.014, g: 0.22 });
      tone({ f: 160, f2: 70, type: 'sine', d: 0.05, g: 0.35 });
      noise({ type: 'bandpass', f: 4500, q: 1.2, t: 0.065, d: 0.03, g: 0.6 });
      tone({ f: 1900, f2: 700, type: 'square', t: 0.065, d: 0.012, g: 0.18 });
      noise({ type: 'highpass', f: 6000, t: 0.1, d: 0.05, g: 0.12 });
    },
    bag: function () {
      noise({ type: 'bandpass', f: 2400, f2: 900, q: 0.6, d: 0.28, g: 0.5, a: 0.03 });
      noise({ type: 'bandpass', f: 1500, f2: 3200, q: 0.6, t: 0.22, d: 0.22, g: 0.4, a: 0.03 });
    },
    zip: function () { noise({ type: 'bandpass', f: 900, f2: 4200, q: 3, d: 0.3, g: 1.6, a: 0.01 }); },
    stamp: function () { tone({ f: 140, f2: 60, d: 0.12, g: 0.5 }); noise({ type: 'lowpass', f: 900, d: 0.06, g: 0.3 }); },
    monitor: function () {
      noise({ type: 'lowpass', f: 300, f2: 1200, d: 0.5, g: 0.2, a: 0.1 });
      tone({ f: 660, t: 0.5, d: 0.1, g: 0.12 });
      tone({ f: 990, t: 0.6, d: 0.16, g: 0.12 });
    },
    /* chat */
    msgIn: function () { tone({ f: 620, d: 0.08, g: 0.2 }); tone({ f: 930, t: 0.08, d: 0.12, g: 0.2 }); },
    msgOut: function () { tone({ f: 520, f2: 1040, d: 0.12, g: 0.16 }); noise({ type: 'highpass', f: 2500, d: 0.08, g: 0.05 }); },
    tick: function () { tone({ f: 1300, type: 'square', d: 0.03, g: 0.09 }); },
    good: function () { arp([660, 880], 0.08, { d: 0.13, g: 0.16 }); },
    give: function () { arp([1200, 1000, 800], 0.07, { d: 0.1, g: 0.16 }); },
    hurt: function () { tone({ f: 220, f2: 110, type: 'sawtooth', d: 0.22, g: 0.22 }); noise({ type: 'lowpass', f: 500, d: 0.1, g: 0.25 }); },
    trigger: function () {
      tone({ f: 180, f2: 90, type: 'sawtooth', d: 0.5, g: 0.3 });
      tone({ f: 191, f2: 96, type: 'square', d: 0.5, g: 0.2 });
      noise({ type: 'bandpass', f: 1200, q: 2, d: 0.25, g: 0.3 });
    },
    win: function () {
      noise({ type: 'highpass', f: 4000, d: 0.05, g: 0.25 });
      tone({ f: 1568, type: 'triangle', t: 0.05, d: 0.4, g: 0.22 });
      tone({ f: 2093, type: 'triangle', t: 0.13, d: 0.5, g: 0.22 });
      tone({ f: 2637, t: 0.13, d: 0.5, g: 0.1 });
    },
    lose: function () { arp([392, 330, 262, 196], 0.16, { type: 'sawtooth', d: 0.24, g: 0.14 }); },
    victory: function () { arp([523, 659, 784, 1047, 784, 1047, 1319], 0.12, { d: 0.3, g: 0.2 }); },
    /* store emergencies */
    alarm: function () {
      for (var i = 0; i < 3; i++) {
        tone({ f: 880, type: 'square', t: i * 0.3, d: 0.14, g: 0.16 });
        tone({ f: 660, type: 'square', t: i * 0.3 + 0.15, d: 0.14, g: 0.16 });
      }
    },
    step: function () { tone({ f: 300, f2: 220, type: 'triangle', d: 0.05, g: 0.14 }); },
    bump: function () { tone({ f: 120, type: 'square', d: 0.05, g: 0.12 }); },
    'catch': function () { noise({ type: 'lowpass', f: 800, d: 0.12, g: 0.4 }); arp([392, 587, 784], 0.09, { d: 0.14, g: 0.2 }); },
    lid: function () { tone({ f: 200, f2: 320, type: 'square', d: 0.08, g: 0.14 }); noise({ type: 'lowpass', f: 700, t: 0.06, d: 0.06, g: 0.25 }); },
    rip: function () { noise({ type: 'bandpass', f: 3000, f2: 1200, q: 1.5, d: 0.22, g: 0.35 }); },
    roll: function () { tone({ f: 260, type: 'square', d: 0.04, g: 0.14 }); tone({ f: 390, type: 'square', t: 0.07, d: 0.05, g: 0.14 }); },
    feed: function () {
      for (var i = 0; i < 7; i++) tone({ f: 150 + (i % 2) * 30, type: 'sawtooth', t: i * 0.06, d: 0.05, g: 0.14 });
      noise({ type: 'bandpass', f: 1800, q: 2, d: 0.42, g: 0.08 });
    },
    beep: function () { tone({ f: 1760, type: 'square', d: 0.09, g: 0.14 }); },
    toggle: function () { tone({ f: 540, type: 'triangle', d: 0.05, g: 0.14 }); },
    select: function () { tone({ f: 700, d: 0.06, g: 0.14 }); },
    err: function () { tone({ f: 160, type: 'square', d: 0.16, g: 0.2 }); tone({ f: 120, type: 'square', t: 0.12, d: 0.2, g: 0.2 }); },
    ok: function () { arp([660, 880, 1320], 0.08, { d: 0.16, g: 0.18 }); },
    fail: function () { tone({ f: 300, f2: 80, type: 'sawtooth', d: 0.55, g: 0.24 }); }
  };
  A.names = Object.keys(S);

  A.play = function (name) {
    A.played.push(name);
    if (A.played.length > 400) A.played.shift();
    A.counts[name] = (A.counts[name] || 0) + 1;
    if (!S[name]) { A.errors.push('unknown sound: ' + name); return false; }
    if (!A.ctx || A.muted) return false;
    try {
      if (A.ctx.state === 'suspended') A.ctx.resume();
      S[name]();
      return true;
    } catch (e) {
      A.errors.push(name + ': ' + e.message);
      return false;
    }
  };

  /* builds every sound's node graph once and reports anything that throws */
  A.selfTest = function () {
    var out = { hasContext: !!A.ctx, state: A.ctx ? A.ctx.state : 'none', total: A.names.length, failed: [] };
    if (!A.ctx) return out;
    A.names.forEach(function (n) {
      try { S[n](); } catch (e) { out.failed.push(n + ': ' + e.message); }
    });
    return out;
  };
})();
