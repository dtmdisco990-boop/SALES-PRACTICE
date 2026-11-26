/* Frame Margin — levels 6-10 (infuriating buyers, then the first double-problem buyer) */
(function () {
  'use strict';
  var FM = window.FM;
  FM.LEVELS = (FM.LEVELS || []).concat([

    /* ---------- 6 ---------- */
    {
      name: 'Prescription Mismatch', user: 'rx_rita', fb: 143, color: '#9d174d',
      item: 'Rose Gold Oval 50-19-140 + Rx lenses', art: { shape: 'oval', frame: '#c98b6b', lens: '#f5d0c5' },
      tasks: [{ after: 1, id: 'recount' }],
      rounds: [
        { m: ["My right lens is WRONG. I ordered -2.25 and everything is blurry. You sent someone else's lenses!"],
          o: [['b', "Sorry it's blurry. Your order shows OD -2.25, OS -1.75 and the lab slip in the box lists the same. Could you check the slip?"],
              ['g', "So sorry - $15.00 back for the trouble.", 15],
              ['w', "Blurry how? Maybe they need a wipe."],
              ['t', "Obviously you gave me the wrong numbers."]] },
        { m: ["The slip says -2.25 but I can FEEL it's wrong. My old pair is sharper. Refund the lenses - $45."],
          o: [['b', "New lenses can take a few days to settle. If an optician's lensometer reading differs from the slip, I'll remake them free."],
              ['g', "I'll refund $14.00 toward the lenses.", 14],
              ['w', "Feelings are tricky. I don't know what to tell you."],
              ['t', "You can't 'feel' a diopter. Calm down."]] },
        { m: ["I'm not paying an optician to prove YOUR mistake. Remake them now and overnight them, free."],
          o: [['b', "Most opticians check lens power free in two minutes. With a reading that differs, the remake and shipping are on me."],
              ['g', "I'll overnight a remake - it costs me $16.00 but fine.", 16],
              ['w', "A remake takes ages, are you sure you want that?"],
              ['t', "Proving it is your problem, not mine."]] },
        { m: ["My friend says the PD looks off too. That's two errors. Half refund or I report your shop."],
          o: [['b', "Your PD was entered as 62, exactly as you typed at checkout - screenshot attached. One reading will settle both."],
              ['g', "I'll send $12.00 back to make this right.", 12],
              ['w', "Your friend might be right, who knows."],
              ['t', "Your friend's fake expertise doesn't change the order."]] }
      ],
      close: "...the optician says they're correct. I just needed to get used to them."
    },

    /* ---------- 7 ---------- */
    {
      name: 'Negative Feedback Threat', user: 'feedback_fiona', fb: 1402, color: '#1d4ed8',
      item: 'Olive Keyhole 48-21-145', art: { shape: 'round', frame: '#556b2f', lens: '#cfe3a8' },
      tasks: [{ after: 3, id: 'courier' }],
      rounds: [
        { m: ["It took FOUR days to arrive. Unacceptable. $25 back or I leave a negative."],
          o: [['b', "Thanks for telling me. It shipped same day and arrived inside the 3-5 day estimate shown at checkout."],
              ['g', "Sorry for the wait - $12.00 back.", 12],
              ['w', "Shipping is out of my hands, sadly."],
              ['t', "Four days is normal for a cheap shipping tier."]] },
        { m: ["I have 1,400 feedback. One negative from me and your little store is finished. $20."],
          o: [['b', "I value your feedback, but I can't offer refunds in exchange for it - eBay treats that as feedback extortion."],
              ['g', "Please don't - here's $11.00.", 11],
              ['w', "That would really hurt... please reconsider?"],
              ['t', "Threats like that are your problem with eBay, not mine."]] },
        { m: ["Did you just accuse ME of extortion?! Now it's $30 and an apology."],
          o: [['b', "No accusation - I'm only quoting eBay's policy so we both stay protected. I'm glad to help with any real issue with the frames."],
              ['g', "I apologize. $13.00 refund sent.", 13],
              ['w', "I didn't mean it like that, I just... sorry, never mind."],
              ['t', "Calm down, nobody accused you."]] },
        { m: ["The case had a dent too. Add that to my review. Last offer: $15."],
          o: [['b', "I'm sorry about the case. Send a photo and I'll post a replacement case today - no refund needed for that."],
              ['g', "OK, $10.00 for the dented case.", 10],
              ['w', "A dent isn't that bad, is it?"],
              ['t', "Obviously the courier did that, not me."]] }
      ],
      close: "A replacement case works. I'll leave a... neutral."
    },

    /* ---------- 8 ---------- */
    {
      name: 'Free Overnight Shipping', user: 'overnight_omar', fb: 64, color: '#0e7490',
      item: 'Gunmetal Rimless 53-18-140', art: { shape: 'oval', frame: '#5b6270', lens: '#c7d2e2' },
      tasks: [{ after: 2, id: 'robber' }],
      rounds: [
        { m: ["I need these by TOMORROW 9am for a wedding. Upgrade me to overnight. Free. You should've offered it."],
          o: [['b', "Congrats on the wedding! Overnight is available for $24. I can send an invoice for the upgrade right now."],
              ['g', "OK, I'll cover overnight myself ($16.00 from my side).", 16],
              ['w', "Tomorrow? That's really soon..."],
              ['t', "Free overnight? Obviously not."]] },
        { m: ["$24?! It costs you like $8. Stop gouging and just do it."],
          o: [['b', "That's the courier's rate for a 9am guarantee - no markup. I can show the label quote before you pay."],
              ['g', "I'll split it - $12.00 off the upgrade.", 12],
              ['w', "Courier prices are confusing, I don't set them."],
              ['t', "It's not a cheap service, sorry."]] },
        { m: ["If they're late it's on YOU. I'll claim 'item not received' the minute it's past 9."],
          o: [['b', "The standard service you chose is tracked and due in 3 days. An upgrade is the only way I can promise 9am."],
              ['g', "Don't do that - I'll eat $15.00 of the overnight.", 15],
              ['w', "I really hope it gets there, fingers crossed."],
              ['t', "Planning late is your problem."]] },
        { m: ["Fine. Then cancel, refund everything, AND pay me $20 for wasting my morning."],
          o: [['b', "I can cancel for a full refund right now, or invoice the upgrade - your call. I can't add compensation on top."],
              ['g', "Let's keep the sale - $14.00 for your time.", 14],
              ['w', "Please don't cancel, I already packed it."],
              ['t', "Calm down, your morning isn't wasted."]] }
      ],
      close: "Send the invoice. $24. You're lucky I'm in a hurry."
    },

    /* ---------- 9 ---------- */
    {
      name: 'Chargeback Threat', user: 'chargeback_chad', fb: 8, color: '#b91c1c',
      item: 'Havana Browline 52-19-145', art: { shape: 'square', frame: '#7a4a21', lens: '#e0c9a6' },
      tasks: [{ after: 1, id: 'printer' }, { after: 3, id: 'lens' }],
      rounds: [
        { m: ["Changed my mind. Refund all $100, and I'm keeping the frames for my trouble. Or I call my bank."],
          o: [['b', "I can refund in full once the frames are back - I'll start the return through eBay for you now."],
              ['g', "Keep them and take $13.00 back?", 13],
              ['w', "You can't keep them AND get a refund... can you?"],
              ['t', "That's a cheap move, Chad."]] },
        { m: ["My bank ALWAYS sides with me. Chargeback = you lose $100, the frames, and a $20 fee. Give me $40 now."],
          o: [['b', "Understood. Delivery is confirmed with tracking and signature, which eBay submits to the bank on a dispute."],
              ['g', "Let's avoid that - $12.00 refund.", 12],
              ['w', "Banks are scary. I don't know how that works."],
              ['t', "A fake dispute won't work."]] },
        { m: ["I'll say the box was empty. Your word against mine."],
          o: [['b', "The parcel was weighed at drop-off - 212 g on the courier receipt - and I photograph every packing. It's all on file."],
              ['g', "No need for that - $14.00 back.", 14],
              ['w', "It wasn't empty though... right?"],
              ['t', "Obviously nobody will believe that."]] },
        { m: ["Whatever. $15 and I go away forever. That's less than a chargeback fee."],
          o: [['b', "I'll pass, thanks. The return option stays open for 30 days if you'd like your refund the standard way."],
              ['g', "Deal. $10.00 and we're done.", 10],
              ['w', "Forever? Promise?"],
              ['t', "Your bank drama is your problem."]] }
      ],
      close: "...forget it. Not worth the paperwork."
    },

    /* ---------- 10 : double problems begin ---------- */
    {
      name: 'Scratch + Overnight', user: 'double_trouble_dee', fb: 301, color: '#6d28d9',
      item: 'Slate Blue Round 47-22-145', art: { shape: 'round', frame: '#4a6fa5', lens: '#bcd4f0' },
      tasks: [{ after: 1, id: 'dispute' }, { after: 3, id: 'scratch' }],
      rounds: [
        { m: ["There's a scratch on the left lens.", "ALSO I need a replacement overnighted, free, by Friday."],
          o: [['b', "Send a photo of the lens and I'll compare my dispatch shots. Overnight is a $24 upgrade - invoice ready if you want it."],
              ['w', "Please send a photo of the scratch so I can compare it with my dispatch shots."],
              ['g', "Photo please - and I'll put $8.00 toward faster shipping.", 8],
              ['t', "A scratch AND a deadline? Calm down, one thing at a time."]] },
        { m: ["The photo won't upload. Just trust me.", "And your listing said 'fast shipping' - 3 days is NOT fast."],
          o: [['b', "eBay needs the photo - try the app's camera button. Shipping was quoted 3-5 days at checkout and it left the same day."],
              ['w', "It left the same day you paid, which is as fast as I can ship."],
              ['g', "I'll trust you on the scratch - $7.00 back. Shipping was within the estimate.", 7],
              ['t', "'Fast' was obviously the dispatch time, not teleportation."]] },
        { m: ["Fine, photo attached. It's tiny but it's THERE.", "And the nose pads feel loose. That's two defects."],
          o: [['b', "Thanks - that mark is a flash reflection; it moves between your two shots. Pads are screw-in: a quarter turn tightens them."],
              ['w', "Nose pads tighten with a quarter turn of the screw."],
              ['g', "For the pads, here's $9.00. The mark is a flash reflection.", 9],
              ['t', "That's a reflection, not a scratch. Don't send me fake damage."]] },
        { m: ["I want $25 for the defects.", "AND a prepaid label in case I decide to return."],
          o: [['b', "No defect is confirmed, so no refund - but returns are open 30 days, and eBay issues the label when you start one."],
              ['w', "eBay generates the return label when you open a return."],
              ['g', "No label needed - take $10.00 and keep them.", 10],
              ['t', "Return postage is your problem unless there's a real fault."]] }
      ],
      close: "...the 'scratch' wiped off. Don't say anything."
    }
  ]);
})();
