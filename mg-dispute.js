/* Side-task 4 — Item Not As Described Dispute
   Toggle exactly the Listing + Dispatch Inspection for the target Order ID, then "Request return review" */
(function () {
  'use strict';
  var FM = window.FM, U = FM.util, el = U.el;

  FM.mg.register('dispute', {
    title: 'Item Not As Described Dispute',
    time: function (d) { return U.lerp(24, 11, d); },
    timeout: 'Too slow - eBay auto-closed the case in the buyer\'s favour.',
    brief: function () {
      return '<p>A buyer opened an <b>Item Not As Described</b> case. Attach the evidence before the deadline:</p>' +
        '<ol class="mg-steps"><li>Toggle the Listing for the target Order ID</li><li>Toggle its Dispatch Inspection</li><li>Request return review</li></ol>' +
        '<p>Exactly <b>2 documents</b>, both for the <b>target Order ID</b>. Similar IDs and other paperwork are decoys.</p>';
    },
    build: function (ctx) {
      var order = U.orderId(), otherA = U.nearMiss(order), otherB = U.nearMiss(order), guard = 0;
      while ((otherB === otherA || otherB === order) && guard++ < 50) otherB = U.nearMiss(order);
      var docs = [
        { type: 'Listing', order: order, ok: true },
        { type: 'Dispatch Inspection', order: order, ok: true },
        { type: 'Listing', order: otherA },
        { type: 'Dispatch Inspection', order: otherA },
        { type: 'Buyer Message', order: order },
        { type: 'Courier Receipt', order: order },
        { type: 'Arrival Photo', order: order },
        { type: 'Dispatch Inspection', order: otherB }
      ];
      if (ctx.d < 0.3 || ctx.tutorial) docs = docs.slice(0, 6);
      docs = U.shuffle(docs);

      var st = ctx.state = { order: order, docs: docs, selected: [] };
      st.correct = docs.map(function (d, i) { return d.ok ? i : -1; }).filter(function (i) { return i >= 0; });

      var list = el('div', { 'class': 'ds-docs' }), count = el('span', { text: '0 of 2 attached' });
      var submit = el('button', { type: 'button', 'class': 'btn btn-primary', text: 'Request return review' });
      var cards = [];

      function toggle(i) {
        var at;
        if (!ctx.live()) return;
        at = st.selected.indexOf(i);
        if (at === -1) st.selected.push(i); else st.selected.splice(at, 1);
        cards[i].setAttribute('aria-pressed', at === -1 ? 'true' : 'false');
        count.textContent = st.selected.length + ' of 2 attached';
        FM.audio.play('toggle');
      }

      docs.forEach(function (d, i) {
        var b = el('button', { type: 'button', 'class': 'ds-doc', 'aria-pressed': 'false', 'data-i': i },
          [el('b', { text: d.type }), el('span', { text: 'Order ' + d.order })]);
        b.addEventListener('click', function () { toggle(i); });
        cards.push(b);
        list.appendChild(b);
      });

      submit.addEventListener('click', function () {
        var right;
        if (!ctx.live()) return;
        if (st.selected.length !== 2) {
          submit.classList.remove('wrong');
          void submit.offsetWidth;
          submit.classList.add('wrong');
          ctx.penalty(2, 'Attach exactly 2 documents');
          return;
        }
        right = st.selected.every(function (i) { return docs[i].ok; });
        if (right) {
          FM.audio.play('stamp');
          ctx.win('Listing and dispatch inspection attached. Return review requested.');
        } else {
          ctx.fail('Wrong evidence attached - it had to be the Listing and Dispatch Inspection for order ' + order + '.');
        }
      });

      ctx.root.appendChild(el('div', { 'class': 'ds-wrap' }, [
        el('div', { 'class': 'ds-case' }, [
          el('small', { text: 'eBay case · Item not as described' }),
          el('b', { text: 'Order ' + order })
        ]),
        list,
        el('div', { 'class': 'ds-foot' }, [count, submit])
      ]));
      ctx.status('Attach the Listing and the Dispatch Inspection for this order only.');
    }
  });
})();
