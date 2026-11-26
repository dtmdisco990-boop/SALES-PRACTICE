/* Frame Margin — levels 11-15 (double-problem buyers, then the final boss) */
(function () {
  'use strict';
  var FM = window.FM;
  FM.LEVELS = (FM.LEVELS || []).concat([

    /* ---------- 11 ---------- */
    {
      name: 'Wrong Rx + Bad Review', user: 'rx_and_rage_rob', fb: 977, color: '#a21caf',
      item: 'Burgundy Square 52-18-140 + Rx lenses', art: { shape: 'square', frame: '#7b1e3a', lens: '#e7b8c6' },
      tasks: [{ after: 1, id: 'recount' }, { after: 2, id: 'courier' }],
      rounds: [
        { m: ["Left lens is the wrong prescription.", "I'm already typing your negative review."],
          o: [['b', "Your slip reads OS -3.00 as ordered. A free optician reading settles it - and I'll fix any real error before feedback matters."],
              ['w', "Your lab slip reads OS -3.00, exactly as ordered."],
              ['g', "Hold the review - $7.00 back while we check the lens.", 7],
              ['t', "Typing reviews won't fix it. Calm down."]] },
        { m: ["I don't have time for an optician.", "And your packaging was a plain bag. I want compensation."],
          o: [['b', "The reading takes two minutes at any optical counter. The padded mailer and hard case match photo 7 of the listing."],
              ['w', "The mailer and case are the ones shown in photo 7."],
              ['g', "$6.00 for the packaging disappointment. The lens check is quick.", 6],
              ['t', "The packaging isn't cheap, it's standard."]] },
        { m: ["Optician says it's -3.00 but the AXIS is off by 2 degrees!", "So refund 50% and I'll make the review a neutral."],
          o: [['b', "2 degrees is inside the standard tolerance for that lens, so it's correct. And I can't link refunds to feedback - eBay rule."],
              ['w', "A 2 degree axis difference is inside the allowed tolerance."],
              ['g', "For the axis worry, $9.00 back. No feedback deals though.", 9],
              ['t', "Tolerance exists. Obviously it's fine."]] },
        { m: ["Then remake them anyway, free.", "And put in writing that you'll pay if my eyes get worse."],
          o: [['b', "The lenses meet spec, so no remake - but the 30-day return is open. I can't give medical guarantees; your optician can advise."],
              ['w', "They meet spec, so I can't remake them for free."],
              ['g', "No remake, but $8.00 toward a second opinion.", 8],
              ['t', "Your eyes are your problem - see a doctor."]] }
      ],
      close: "Whatever. They're fine. I'm not leaving feedback at all."
    },

    /* ---------- 12 ---------- */
    {
      name: 'Lowball + Chargeback', user: 'lowball_larry_llc', fb: 33, color: '#b45309',
      item: 'Titanium Pilot 56-16-145', art: { shape: 'aviator', frame: '#8d99ae', lens: '#cfd8e3' },
      tasks: [{ after: 1, id: 'robber' }, { after: 3, id: 'printer' }],
      rounds: [
        { m: ["Saw these for $79 on another site. Refund $21.", "If not, I dispute the whole charge with my card."],
          o: [['b', "I can't price-match after a sale. A card dispute goes to eBay with the tracking and delivery proof I've already filed."],
              ['w', "I don't price-match completed sales, sorry."],
              ['g', "I'll do $6.00 as goodwill. Disputes get the tracking proof.", 6],
              ['t', "That $79 site sells fake ones."]] },
        { m: ["My card company refunds first, asks later.", "And I'll keep the frames while they 'investigate'. $15 now saves you that."],
          o: [['b', "They can - and eBay then answers with signature proof. If you'd like your money back properly, the return window is open."],
              ['w', "The return window is open if you want a refund."],
              ['g', "OK - $7.00 now and no dispute.", 7],
              ['t', "That's a cheap threat."]] },
        { m: ["The screws were loose. That's damage.", "So now it's 'not as described' AND a dispute."],
          o: [['b', "Loose screws are a 30-second fix; the kit is in the case. Dispatch photos show them seated, and they'd go into any claim."],
              ['w', "There's a mini screwdriver in the case for that."],
              ['g', "Sorry about the screws - $5.00 back.", 5],
              ['t', "Loose screws are obviously not 'damage'."]] },
        { m: ["$10. Final. Ten dollars to make me disappear.", "Or I do the dispute AND the return AND a report."],
          o: [['b', "No thanks. Every option you listed runs through eBay, and my records are ready for all three. Enjoy the frames."],
              ['w', "I'd really rather you didn't do all that..."],
              ['g', "Fine. $7.50 and we're finished.", 7.5],
              ['t', "Do what you like, it's your problem."]] }
      ],
      close: "...you're no fun. Keeping them."
    },

    /* ---------- 13 ---------- */
    {
      name: 'Fit + Freight', user: 'fit_and_freight_fay', fb: 518, color: '#0f766e',
      item: 'Pearl White Hex 50-20-140', art: { shape: 'hex', frame: '#d9d4c7', lens: '#e8f1f5' },
      tasks: [{ after: 2, id: 'lens' }, { after: 3, id: 'dispute' }],
      rounds: [
        { m: ["They pinch my nose. The bridge is NOT 20 mm.", "I want a prepaid return label AND $10 for my time."],
          o: [['b', "Calipers read 20.0 mm, photo attached. Returns for fit are buyer-paid per the listing, and I can't add time compensation."],
              ['w', "I measured again - it's 20.0 mm, photo attached."],
              ['g', "It measures 20.0 - but here's $5.00 toward the label.", 5],
              ['t', "It's 20 mm. Obviously."]] },
        { m: ["Then your calipers are wrong.", "And the temple arms are 138, not 140. I measured with a ruler."],
          o: [['b', "The calipers are zero-checked in the photo. Temples are measured along the curve - that gives 140; a straight ruler reads short."],
              ['w', "Temple length is measured along the curve, so a ruler reads short."],
              ['g', "Could be tolerance - $4.00 for the 2 mm.", 4],
              ['t', "A ruler? Calm down and measure properly."]] },
        { m: ["I'm returning them 'not as described' so YOU pay postage.", "And don't you dare charge a restocking fee."],
          o: [['b', "I'll accept the return. With matching measurements on file, eBay decides the reason. No restocking fee - I never charge one."],
              ['w', "I don't charge restocking fees."],
              ['g', "Skip the return - $5.50 and keep them?", 5.5],
              ['t', "A false return reason is a cheap trick."]] },
        { m: ["Ugh. If I keep them, you pay my optician to widen the bridge.", "And send free replacement nose pads."],
          o: [['b', "Acetate bridges can't be widened, so I won't fund that. There are no pads to replace - it's a moulded bridge, as pictured."],
              ['w', "This frame has a moulded bridge, so there are no pads to send."],
              ['g', "I'll send $5.00 for the optician visit.", 5],
              ['t', "Optician bills are your problem."]] }
      ],
      close: "...they stopped pinching after a day. Don't tell anyone."
    },

    /* ---------- 14 ---------- */
    {
      name: 'Counterfeit Claim + eBay Report', user: 'authentic_or_else_al', fb: 2210, color: '#1e40af',
      item: 'Onyx Clubround 51-21-145', art: { shape: 'round', frame: '#111318', lens: '#b7c3d0' },
      tasks: [{ after: 1, id: 'scratch' }, { after: 2, id: 'recount' }, { after: 3, id: 'courier' }],
      rounds: [
        { m: ["These are FAKE. The logo font is wrong.", "Refund me in full AND I keep them as evidence."],
          o: [['b', "They're genuine - the serial on the left temple matches the maker's card in the box. Full refunds need the item back via eBay."],
              ['w', "The serial on the temple matches the card in the box."],
              ['g', "They're genuine. I'll add $3.00 for the worry.", 3],
              ['t', "They're not fake."]] },
        { m: ["Serial numbers can be copied.", "I've already reported you to eBay for counterfeits. Pay $30 and I withdraw it."],
          o: [['b', "My supplier invoice is on file with eBay's authenticity team. I can't pay to have a report withdrawn - that's against policy."],
              ['w', "eBay already has my supplier invoice on file."],
              ['g', "$3.50 if it helps close this out.", 3.5],
              ['t', "Obviously they're real, I have the invoice."]] },
        { m: ["The case smells like a factory. Genuine ones don't.", "And the lenses have no etching. Explain THAT."],
          o: [['b', "New cases off-gas for a few days - it fades. The etching is on the right lens, upper corner; tilt it under a lamp."],
              ['w', "The etching is on the right lens, upper corner."],
              ['g', "For the smell, $2.50 back. The etching is top right.", 2.5],
              ['t', "A smell isn't proof. Calm down."]] },
        { m: ["I'm taking these to a boutique for authentication. You pay the $25 fee.", "And when they fail I want DOUBLE my money."],
          o: [['b', "You're welcome to authenticate them. I don't cover third-party fees, and eBay's guarantee caps refunds at what you paid."],
              ['w', "I don't cover third-party authentication fees."],
              ['g', "I'll put $3.60 toward the fee.", 3.6],
              ['t', "Double money? That's a cheap shot."]] }
      ],
      close: "...the boutique says they're real. This conversation never happened."
    },

    /* ---------- 15 : FINAL BOSS ---------- */
    {
      name: 'FINAL BOSS: The Apex Disputer', user: 'apex_disputer_9000', fb: 9999, color: '#7f1d1d',
      item: 'Limited Gold Hex 50-21-145', art: { shape: 'hex', frame: '#c9a227', lens: '#f3e3a1' },
      tasks: [{ after: 2, id: 'robber' }, { after: 4, id: 'courier' }],
      rounds: [
        { m: ["Scratched, wrong Rx, AND late. Triple failure.", "$60 back in the next 60 seconds or I bury this store in reviews."],
          o: [['b', "Dispatch photos, the lab slip and tracking are all on file. Send your evidence via eBay and I'll act on anything confirmed."],
              ['w', "It wasn't late - tracking shows day 3 of 3-5."],
              ['g', "As a gesture, here's $0.01 back.", 0.01],
              ['t', "Triple failure? Calm down."]] },
        { m: ["My lawyer is cc'd.", "Overnight a replacement at your cost, then we talk."],
          o: [['b', "Understood. All contact stays in eBay Messages. A replacement follows a confirmed fault; overnight is a $24 buyer upgrade."],
              ['w', "Overnight shipping is a $24 upgrade."],
              ['g', "I'll chip in $1.00 toward shipping.", 1],
              ['t', "A lawyer for glasses is obviously overkill."]] },
        { m: ["I'm filing a chargeback AND an eBay case right now.", "Unless you send $45. Clock's ticking."],
          o: [['b', "That's your right. Signature proof, the weight receipt and packing photos go to both. I can't pay to stop a claim."],
              ['w', "Please don't file both, that's not fair."],
              ['g', "$0.50 now to pause this?", 0.5],
              ['t', "Your bank games are your problem."]] },
        { m: ["These are counterfeit and I have 'proof'.", "And your photos were edited. I'm reporting fraud."],
          o: [['b', "They're genuine: serial, maker's card and supplier invoice are with eBay. The photos are unedited originals with metadata."],
              ['w', "The photos are unedited originals."],
              ['g', "I'll refund $2.00 for the doubt.", 2],
              ['t', "They are not fake and the photos are real."]] },
        { m: ["FINE. Last offer. One cent. A $0.01 refund and I close everything.", "Take it or I escalate all of it."],
          o: [['b', "I appreciate the offer, but no. Returns are open for 30 days through eBay. Thank you for your order."],
              ['w', "One cent? I... let me think."],
              ['g', "One cent? Deal - $0.01 sent.", 0.01],
              ['t', "A one-cent demand is cheap, even for you."]] }
      ],
      close: "...Respect. Nobody has ever refused the penny. Keeping the frames. 5 stars."
    }
  ]);
})();
