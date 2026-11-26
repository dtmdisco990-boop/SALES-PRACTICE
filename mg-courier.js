/* Side-task 7 — Courier Pickup Cutoff
   Scan the 2 eligible "due today" parcels in earliest-cutoff order (0.9s scanner cooldown,
   skip tomorrow / hold parcels), then "Manifest pickup" */
(function () {
  'use strict';
  var FM = window.FM, U = FM.util, el = U.el;
  var COOLDOWN_MS = 900;

  function clock(mins) {
    var h = Math.floor(mins / 60) % 24, m = mins % 60;
    return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
  }

  FM.mg.register('courier', {
    title: 'Courier Pickup Cutoff',
    COOLDOWN_MS: COOLDOWN_MS,
    time: function (d) { return U.lerp(20, 9, d); },
    timeout: 'Too slow - the courier van left without today\'s parcels.',
    brief: function () {
      return '<p>The courier is at the door. Get today\'s parcels on the van:</p>' +
        '<ol class="mg-steps"><li>Scan the due-today parcel with the earliest cutoff</li><li>Wait 0.9s for the scanner</li><li>Scan the other due-today parcel</li><li>Manifest pickup</li></ol>' +
        '<p>Only <b>2 parcels</b> are eligible. Skip anything marked <b>TOMORROW</b> or <b>HOLD</b>. Scanning a wrong parcel, or the two in the wrong order, fails the pickup.</p>';
    },
    build: function (ctx) {
      var now = 13 * 60 + U.randInt(5, 45);
      var cutA = now + U.randInt(12, 30), cutB = cutA + U.randInt(8, 40);
      var extra = ctx.tutorial ? 2 : 2 + Math.round(ctx.d * 2), i;
      var parcels = [
        { order: U.orderId(), status: 'today', cut: cutA, ok: true },
        { order: U.orderId(), status: 'today', cut: cutB, ok: true },
        { order: U.orderId(), status: 'tomorrow', cut: now + U.randInt(-180, -60) },
        { order: U.orderId(), status: 'hold', cut: now + U.randInt(4, 10) }      // tempting: earliest clock time, but on HOLD
      ];
      for (i = 2; i < extra; i++) {
        parcels.push(i % 2 === 0
          ? { order: U.orderId(), status: 'tomorrow', cut: cutA + U.randInt(-6, 6) }
          : { order: U.orderId(), status: 'hold', cut: cutB + U.randInt(-5, 5) });
      }
      parcels = U.shuffle(parcels);

      var st = ctx.state = { parcels: parcels, scanned: 0, readyAt: 0, cooldownMs: COOLDOWN_MS };
      st.order = parcels.map(function (p, idx) { return { p: p, idx: idx }; })
        .filter(function (o) { return o.p.ok; })
        .sort(function (a, b) { return a.p.cut - b.p.cut; })
        .map(function (o) { return o.idx; });                           // row indexes to scan, in order

      var TAGS = { today: 'DUE TODAY', tomorrow: 'TOMORROW', hold: 'HOLD' };
      var scanLabel = el('b', { text: 'READY' }), bar = el('i');
      var scanner = el('div', { 'class': 'cr-scanner' }, [el('span', { text: 'SCANNER' }), el('div', { 'class': 'cr-cool' }, bar), scanLabel]);
      var list = el('div', { 'class': 'cr-list' }), count = el('span', { text: '0 / 2 scanned' });
      var manifest = el('button', { type: 'button', 'class': 'btn btn-primary', text: 'Manifest pickup' });
      var coolTimer = 0, rows = [];

      function shake(node) {
        node.classList.remove('wrong');
        void node.offsetWidth;
        node.classList.add('wrong');
      }

      function startCooldown() {
        st.readyAt = performance.now() + COOLDOWN_MS;
        scanner.classList.remove('cool');
        void scanner.offsetWidth;
        scanner.classList.add('cool');
        scanLabel.textContent = 'COOLING';
        clearTimeout(coolTimer);
        coolTimer = setTimeout(function () {
          scanner.classList.remove('cool');
          scanLabel.textContent = 'READY';
        }, COOLDOWN_MS);
      }

      function scan(i) {
        var p = parcels[i], row = rows[i], earliest;
        if (!ctx.live()) return;
        if (performance.now() < st.readyAt) { shake(scanner); ctx.penalty(2, 'Scanner still cooling down - misread'); return; }
        if (p.scanned) { ctx.status('That parcel is already scanned.'); return; }
        if (!p.ok) {
          shake(row);
          ctx.fail(p.status === 'hold' ? 'You scanned a HOLD parcel onto the van.' : 'You scanned a parcel that is not due until tomorrow.');
          return;
        }
        earliest = parcels.filter(function (q) { return q.ok && !q.scanned; }).sort(function (a, b) { return a.cut - b.cut; })[0];
        if (p !== earliest) {
          shake(row);
          ctx.fail('Scanned out of order - the ' + clock(earliest.cut) + ' cutoff had to go first.');
          return;
        }
        p.scanned = true;
        st.scanned++;
        row.classList.add('scanned');
        row.classList.add('beam');
        row.querySelector('.cr-scan').textContent = 'SCANNED ' + st.scanned;
        count.textContent = st.scanned + ' / 2 scanned';
        FM.audio.play('beep');
        startCooldown();
        ctx.status(st.scanned < 2 ? 'Scanned. Wait for the scanner, then the next cutoff.' : 'Both scanned. Manifest the pickup.', 'good');
      }

      parcels.forEach(function (p, idx) {
        var row = el('button', { type: 'button', 'class': 'cr-parcel', 'data-i': idx, 'data-status': p.status }, [
          el('i', { 'class': 'cr-box' }),
          el('b', { text: p.order }),
          el('span', { 'class': 'cr-tag ' + p.status, text: TAGS[p.status] }),
          el('span', { 'class': 'cr-cut', text: 'Cutoff ' + clock(p.cut) }),
          el('em', { 'class': 'cr-scan', text: 'SCANNED' })
        ]);
        row.addEventListener('click', function () { scan(idx); });
        rows.push(row);
        list.appendChild(row);
      });

      manifest.addEventListener('click', function () {
        if (!ctx.live()) return;
        if (st.scanned < 2) { shake(manifest); ctx.penalty(2, 'Scan both due-today parcels before manifesting'); return; }
        FM.audio.play('stamp');
        ctx.win('Both parcels manifested before cutoff.');
      });

      ctx.onCleanup(function () { clearTimeout(coolTimer); });
      ctx.root.appendChild(el('div', { 'class': 'cr-wrap' }, [
        el('div', { 'class': 'cr-top' }, [el('div', { 'class': 'cr-clock', text: 'Time now ' + clock(now) + '  ·  courier at the door' }), scanner]),
        list,
        el('div', { 'class': 'cr-foot' }, [count, manifest])
      ]));
      ctx.status('Earliest due-today cutoff first.');
    }
  });
})();
