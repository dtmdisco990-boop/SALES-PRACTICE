/* Frame Margin — difficulty curve, tutorial level and a content self-check */
(function () {
  'use strict';
  var FM = window.FM;

  /* Level 1: 12% floor, 15s replies  ->  Level 15: 33% floor, 4.5s replies */
  FM.levelCfg = function (n) {
    var base = FM.LEVELS[n - 1], k = n - 1, cfg = {}, key;
    var tier = n <= 4 ? 1 : n <= 9 ? 2 : n <= 14 ? 3 : 4;
    var drain = 1 + 0.18 * k;                 // patience lost per second while the buyer waits
    if (tier === 3) drain *= 1.2;             // double-problem buyers drain fast
    if (tier === 4) drain *= 1.3;             // the boss drains faster still
    for (key in base) cfg[key] = base[key];
    cfg.n = n;
    cfg.tier = tier;
    cfg.timer = 15 - 0.75 * k;
    cfg.floor = 12 + 1.5 * k;
    cfg.patienceStart = 100 - 5 * k;
    cfg.drain = drain;
    cfg.mult = 1 + 0.07 * k;                  // scales patience damage
    cfg.strict = n === FM.MAX_LEVEL;          // final boss: giving away even $0.01 loses
    cfg.d = k / (FM.MAX_LEVEL - 1);           // 0..1 difficulty for the side-tasks
    return cfg;
  };

  FM.TUTORIAL = {
    n: 0, tier: 0, name: 'Tutorial', user: 'practice_pat', fb: 12, color: '#2a9d8f',
    item: 'Demo Round 49-20-145', art: { shape: 'round', frame: '#2a6f97', lens: '#a9d6e5' },
    tasks: [], timer: 40, floor: 10, patienceStart: 100, drain: 0.5, mult: 0.6, strict: false, d: 0,
    rounds: [
      { m: ["Hi. I paid $100 but honestly that's too much. Give me $40 back or I cancel."],
        o: [['b', "Thanks for your message. The price was shown at checkout, so I can't adjust it - returns are open if you change your mind."],
            ['g', "Sure, I'll send $25.00 back.", 25],
            ['w', "Umm... I'm not sure. Maybe?"],
            ['t', "That's a cheap offer."]] },
      { m: ["Everyone gives discounts. You're being difficult. $15 at least!"],
        o: [['b', "I understand, but I can't discount a completed sale. They ship today, tracked - and the 30-day return covers you."],
            ['g', "OK, $15.00 back.", 15],
            ['w', "I don't make the rules... well, I do, but..."],
            ['t', "Calm down, it's just glasses."]] }
    ],
    close: "OK, thanks for explaining. Ship them!"
  };

  /* returns a list of problems in the level data (empty list = healthy) */
  FM.validateLevels = function () {
    var errs = [], all = FM.LEVELS.concat([FM.TUTORIAL]);
    if (FM.LEVELS.length !== FM.MAX_LEVEL) errs.push('expected ' + FM.MAX_LEVEL + ' levels, found ' + FM.LEVELS.length);
    all.forEach(function (L, i) {
      var tag = 'L' + (i + 1), wantRounds = i < 4 ? 3 : i < 14 ? 4 : i === 14 ? 5 : 2;
      if (L.rounds.length !== wantRounds) errs.push(tag + ': ' + L.rounds.length + ' rounds, wanted ' + wantRounds);
      (L.tasks || []).forEach(function (t) {
        if (FM.mg && !FM.mg.defs[t.id]) errs.push(tag + ': unknown side-task ' + t.id);
        if (t.after < 1 || t.after >= L.rounds.length) errs.push(tag + ': side-task after round ' + t.after + ' is out of range');
      });
      L.rounds.forEach(function (R, j) {
        var at = tag + ' R' + (j + 1), best = 0;
        if (!R.m || !R.m.length) errs.push(at + ': no customer message');
        if (i >= 9 && i <= 14 && R.m.length < 2) errs.push(at + ': double-problem level needs two demands');
        if (R.o.length !== 4) errs.push(at + ': needs 4 replies');
        R.o.forEach(function (o) {
          var trig = FM.findTrigger(o[1]);
          if (o[0] === 'b') best++;
          if (o[0] === 't' && !trig) errs.push(at + ': trigger reply has no trigger word: ' + o[1]);
          if (o[0] !== 't' && trig) errs.push(at + ': "' + trig + '" hidden in a non-trigger reply: ' + o[1]);
          if (o[0] === 'g' && !(o[2] > 0)) errs.push(at + ': concession without an amount');
          if (o[0] === 'g' && o[1].indexOf('$') === -1) errs.push(at + ': concession text should show the amount');
        });
        if (best !== 1) errs.push(at + ': needs exactly one best reply, has ' + best);
      });
    });
    return errs;
  };
})();
