/* Side-task 6 — Bulk Inventory Recount
   Sellable units of the target SKU = sealed cartons x 6 + loose frames - HOLD frames (wrong-SKU cartons ignored) */
(function () {
  'use strict';
  var FM = window.FM, U = FM.util, el = U.el;
  var PER_CARTON = 6;
  var SKUS = ['FM-RND-TORT', 'FM-SQR-BLK', 'FM-AVI-GLD', 'FM-CAT-CRY', 'FM-HEX-PRL', 'FM-OVL-RSE'];

  /* a look-alike SKU for the harder levels: the last two letters swapped (FM-RND-TORT -> FM-RND-TOTR) */
  function lookAlike(sku) {
    var t = sku.split(''), n = t.length, tmp = t[n - 1];
    t[n - 1] = t[n - 2]; t[n - 2] = tmp;
    return t.join('');
  }

  FM.mg.register('recount', {
    title: 'Bulk Inventory Recount',
    PER_CARTON: PER_CARTON,
    time: function (d) { return U.lerp(28, 13, d); },
    timeout: 'Too slow - the listing oversold while you were counting.',
    brief: function () {
      return '<p>eBay shows the wrong stock level. Recount the <b>sellable units of the target SKU</b> and submit the number:</p>' +
        '<ol class="mg-steps"><li>Sealed cartons &times; 6</li><li>Plus loose frames</li><li>Minus frames tagged HOLD</li><li>Ignore wrong-SKU cartons</li></ol>' +
        '<p>Read the SKU on every carton. A wrong count fails the recount.</p>';
    },
    build: function (ctx) {
      var target = U.pick(SKUS), hard = ctx.d >= 0.5 && !ctx.tutorial;
      var others = SKUS.filter(function (s) { return s !== target; });
      var sealed = U.randInt(2, 3 + Math.round(ctx.d * 3));
      var wrong = U.randInt(1, 2 + Math.round(ctx.d * 2));
      var loose = U.randInt(3, 6 + Math.round(ctx.d * 3));
      var hold = U.randInt(1, Math.min(3, loose - 1));
      var answer = sealed * PER_CARTON + loose - hold;
      var st = ctx.state = { target: target, sealed: sealed, wrongCartons: wrong, loose: loose, hold: hold, answer: answer };
      var cartons = [], frames = [], i;
      var shelf = el('div', { 'class': 'rc-shelf' }), looseBox = el('div', { 'class': 'rc-loose' });
      var input = el('input', { 'class': 'rc-input', type: 'number', inputmode: 'numeric', min: '0', max: '999', 'aria-label': 'Sellable unit count' });
      var submit = el('button', { type: 'button', 'class': 'btn btn-primary', text: 'Submit count' });
      var art = FM.art.glasses({ frame: '#2b3448', lens: '#9ec5e6' });

      for (i = 0; i < sealed; i++) cartons.push(target);
      for (i = 0; i < wrong; i++) cartons.push(hard && i === 0 ? lookAlike(target) : U.pick(others));
      U.shuffle(cartons).forEach(function (sku) {
        shelf.appendChild(el('div', { 'class': 'rc-carton', 'data-sku': sku }, [el('b', { text: sku }), el('span', { text: 'SEALED ×' + PER_CARTON })]));
      });
      for (i = 0; i < loose; i++) frames.push(i < hold);
      U.shuffle(frames).forEach(function (isHold) {
        looseBox.appendChild(el('div', { 'class': 'rc-frame' + (isHold ? ' hold' : ''), html: art + '<em>HOLD</em>' }));
      });

      function value() {
        var v = parseInt(input.value, 10);
        return isNaN(v) ? null : v;
      }
      function step(by) {
        var v;
        if (!ctx.live()) return;
        v = value();
        input.value = Math.max(0, (v === null ? 0 : v) + by);
        FM.audio.play('toggle');
      }
      function send() {
        var v;
        if (!ctx.live()) return;
        v = value();
        if (v === null) { ctx.status('Type your count first.', 'bad'); input.focus(); return; }
        if (v === answer) {
          FM.audio.play('stamp');
          ctx.win('Count confirmed: ' + answer + ' sellable units of ' + target + '.');
        } else {
          ctx.fail('Miscount - you entered ' + v + ', but there are ' + answer + ' sellable units (' + sealed + ' × 6 + ' + loose + ' loose − ' + hold + ' HOLD).');
        }
      }

      submit.addEventListener('click', send);
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); send(); } });

      ctx.root.appendChild(el('div', { 'class': 'rc-wrap' }, [
        el('div', { 'class': 'rc-target' }, ['Count sellable units of SKU ', el('b', { text: target }), '. One sealed carton = 6 frames.']),
        el('div', { 'class': 'rc-label', text: 'Shelf - sealed cartons' }),
        shelf,
        el('div', { 'class': 'rc-label', text: 'Loose frames of ' + target }),
        looseBox,
        el('div', { 'class': 'rc-foot' }, [
          el('button', { type: 'button', 'class': 'mg-btn rc-step', 'aria-label': 'Decrease count', text: '−', onclick: function () { step(-1); } }),
          input,
          el('button', { type: 'button', 'class': 'mg-btn rc-step', 'aria-label': 'Increase count', text: '+', onclick: function () { step(1); } }),
          submit
        ])
      ]));
      ctx.status('Sealed × 6, plus loose, minus HOLD. Skip other SKUs.');
      input.focus();
    }
  });
})();
