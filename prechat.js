/* Frame Margin — the sequence before every chat:
   A) glasses animate onto the photo table   B) Take Photo -> flash + shutter click
   C) glasses slide into a protective bag    D) the monitor slides up with eBay Messages */
(function () {
  'use strict';
  var FM = window.FM, U = FM.util, $ = U.$, wait = U.wait;
  var P = FM.prechat = { step: 'idle', log: [] };

  function caption(t) { $('#scene-caption').textContent = t; }
  function mark(s) { P.step = s; P.log.push(s); }

  /* put the studio back to its empty state and drop the monitor instantly */
  P.reset = function () {
    var mon = $('#monitor'), btn = $('#btn-photo');
    mon.classList.add('no-anim');
    mon.classList.remove('up');
    mon.setAttribute('inert', '');
    void mon.offsetWidth;
    mon.classList.remove('no-anim');
    $('#glasses').className = 'glasses';
    $('#g-shadow').className = 'g-shadow';
    $('#bag-back').className = 'bag-back';
    $('#bag-front').className = 'bag-front';
    $('#finder').className = 'finder';
    $('#snap').className = 'snap';
    btn.disabled = true;
    btn.onclick = null;
    caption('');
    P.step = 'idle';
    P.log = [];
  };

  /* opts.onStep(name) may return a promise; used by the tutorial to pause and explain */
  P.run = async function (cfg, opts) {
    opts = opts || {};
    var hook = opts.onStep || function () {};
    var g = $('#glasses'), btn = $('#btn-photo'), mon = $('#monitor'), art = FM.art.glasses(cfg.art);

    P.reset();
    FM.chat.prepare(cfg);
    $('#scene-level').textContent = cfg.n ? 'Level ' + cfg.n : 'Tutorial';
    $('#scene-name').textContent = cfg.name;
    $('#scene-rules').textContent = 'Margin floor ' + U.pct(cfg.floor) + (cfg.strict ? ' STRICT' : '') +
      '  ·  ' + U.secs(cfg.timer) + ' per reply';
    g.innerHTML = art;
    $('#snap-img').innerHTML = art;
    caption('New order in: ' + cfg.item + '.');
    await wait(300);

    /* --- Step A: glasses animate onto the photo table --- */
    mark('glasses-in');
    g.classList.add('on-table');
    $('#g-shadow').classList.add('show');
    FM.audio.play('slide');
    await wait(620);
    FM.audio.play('clack');
    await wait(180);
    $('#finder').classList.add('show');
    caption('Glasses are on the photo table. Take the listing photo.');
    await hook('table');

    /* --- Step B: Take Photo -> bright flash + crisp shutter click --- */
    mark('await-photo');
    btn.disabled = false;
    btn.focus();
    await new Promise(function (res) {
      btn.onclick = function () { btn.onclick = null; res(); };
    });
    btn.disabled = true;
    mark('photo');
    $('#finder').classList.add('lock');
    FM.audio.play('shutter');
    FM.ui.flash();
    await wait(140);
    $('#snap').classList.add('show');
    caption('Listing photo captured.');
    await wait(620);
    $('#finder').classList.remove('show');
    await hook('photo');

    /* --- Step C: glasses go into the protective shipping bag --- */
    mark('bagging');
    caption('Sliding the glasses into a protective shipping bag...');
    g.classList.add('lift');                       // pick the glasses up first...
    $('#g-shadow').classList.remove('show');
    await wait(300);
    $('#bag-back').classList.add('in');            // ...slide the open bag in underneath...
    $('#bag-front').classList.add('in');
    FM.audio.play('bag');
    await wait(640);
    g.classList.add('drop');                       // ...then lower them inside
    await wait(540);
    $('#bag-front').classList.add('sealed');
    FM.audio.play('zip');
    await wait(400);
    $('#bag-front').classList.add('labeled');
    FM.audio.play('stamp');
    await wait(420);
    mark('bagged');
    caption('Bagged, sealed and labelled.');
    await hook('bagged');
    await wait(260);

    /* --- Step D: the monitor slides up showing eBay Messages --- */
    mark('monitor');
    caption('New eBay message from ' + cfg.user + '...');
    FM.audio.play('msgIn');
    await wait(480);
    mon.classList.add('up');
    mon.removeAttribute('inert');
    FM.audio.play('monitor');
    await wait(740);
    mark('ready');
    await hook('monitor');
  };
})();
