/* Frame Margin — levels 1-5.
   Reply kinds: b = firm + polite (best), g = gives money away, w = weak / dodges, t = contains a hidden trigger word.
   Option format: [kind, text, dollarsGiven] */
(function () {
  'use strict';
  var FM = window.FM;
  FM.LEVELS = (FM.LEVELS || []).concat([

    /* ---------- 1 ---------- */
    {
      name: 'The Lowballer', user: 'bargain_bill_77', fb: 212, color: '#c2410c',
      item: 'Tortoise Round 49-20-145', art: { shape: 'round', frame: '#6b3f1d', lens: '#8ecae6' },
      tasks: [{ after: 1, id: 'robber' }],
      rounds: [
        { m: ["I paid $100 but I just saw frames like these for $70. Refund me $30 and we're square."],
          o: [['b', "Thanks for reaching out. The price was shown before checkout, so I can't adjust a completed sale."],
              ['g', "I can send $12.00 back as a goodwill partial refund.", 12],
              ['w', "Hmm, let me think about it and get back to you sometime."],
              ['t', "Those $70 ones are cheap knockoffs, not the same thing."]] },
        { m: ["Come on. Everybody on eBay does partial refunds. $25 and I'll leave 5 stars."],
          o: [['b', "I appreciate the offer, but I don't trade refunds for feedback - that's against eBay policy."],
              ['g', "OK, $10.00 back and we call it even.", 10],
              ['w', "I guess maybe? I'm not really sure what I'm allowed to do."],
              ['t', "Obviously not. You agreed to the price when you paid."]] },
        { m: ["Last chance: $20 back or I return them and you eat the shipping."],
          o: [['b', "You're welcome to use the 30-day return if they aren't right. Otherwise they ship today, fully tracked."],
              ['g', "Alright - $15.00 refund so you keep them.", 15],
              ['w', "Please don't return them... please?"],
              ['t', "Returns are your problem, not mine."]] }
      ],
      close: "Ugh. Fine. Ship them."
    },

    /* ---------- 2 ---------- */
    {
      name: 'Bridge-Width Fit', user: 'narrow_nose_nina', fb: 87, color: '#7c3aed',
      item: 'Matte Black Square 51-18-140', art: { shape: 'square', frame: '#1f2430', lens: '#a7c7e7' },
      tasks: [{ after: 2, id: 'printer' }],
      rounds: [
        { m: ["Your listing says 18 mm bridge. My current pair is 17 and fits perfect. These WILL slide down. Why didn't you warn me?"],
          o: [['b', "The 18 mm bridge is in the title, specs and photo 4. I'm glad to re-measure before I ship so you can decide."],
              ['g', "Sorry about that - I'll refund $9.00 for the fit issue.", 9],
              ['w', "Bridges are kind of hard to explain, honestly."],
              ['t', "Obviously 18 is not 17. It's in the listing."]] },
        { m: ["Re-measure then. And if it's 18.5 I want $20 off. Calipers, not a ruler."],
          o: [['b', "Measured with calipers just now: 18.0 mm, matching the listing. Photo sent to this thread."],
              ['g', "It's about 18 - but I'll take $10.00 off to be safe.", 10],
              ['w', "I don't have calipers handy, I'll assume it's fine."],
              ['t', "Calm down, it's one millimetre."]] },
        { m: ["My optician charges $15 to adjust nose pads. You should cover that since the fit is your fault."],
          o: [['b', "The frame matches its listed size, so I can't cover adjustments - but returns are open for 30 days if it doesn't fit."],
              ['g', "Fair enough, I'll send the $15.00 for the adjustment.", 15],
              ['w', "Maybe the optician will do it free if you ask nicely?"],
              ['t', "How your nose fits is your problem."]] }
      ],
      close: "Fine, I'll try them. But I'm measuring the second they arrive."
    },

    /* ---------- 3 ---------- */
    {
      name: 'Hinge Photo Requests', user: 'hinge_hawk', fb: 431, color: '#0f766e',
      item: 'Gold Aviator 58-14-140', art: { shape: 'aviator', frame: '#b8860b', lens: '#9ad1c0' },
      tasks: [{ after: 1, id: 'lens' }],
      rounds: [
        { m: ["Before you ship I want 12 close-ups of BOTH hinges. Open, closed, and from underneath. Your photos hide them."],
          o: [['b', "Happy to help: photos 5 and 6 already show both hinges, and I'll add two fresh close-ups to this thread now."],
              ['g', "I can't do 12 photos, but I'll knock $8.00 off instead.", 8],
              ['w', "That's a lot of photos... I'm pretty busy today."],
              ['t', "The hinges are obviously fine, look at the listing."]] },
        { m: ["I see a shadow on the left hinge in your new photo. That's a crack. Admit it."],
          o: [['b', "That's the screw slot under the light. Here's the same hinge from a second angle - clean, tight, no crack."],
              ['g', "It might be something - I'll refund $12.00 just in case.", 12],
              ['w', "I don't see anything, but I'm no expert."],
              ['t', "It's a shadow. Calm down."]] },
        { m: ["I don't trust it. Send a VIDEO of you flexing the hinge 20 times, or cancel my order and pay me for my wasted time."],
          o: [['b', "I've sent a short clip of both hinges opening smoothly. If you'd still rather cancel, I'll process it - no extra fees either way."],
              ['g', "No video, but here's $14.00 for your time.", 14],
              ['w', "Twenty times seems excessive, doesn't it?"],
              ['t', "Your wasted time is your problem."]] }
      ],
      close: "...the video looks OK. Ship it. Carefully."
    },

    /* ---------- 4 ---------- */
    {
      name: 'Pickup & Bundle Demands', user: 'bundle_bandit_bo', fb: 56, color: '#be185d',
      item: 'Crystal Cat-Eye 52-17-142', art: { shape: 'cat', frame: '#c98aa8', lens: '#f1c6d9' },
      tasks: [{ after: 2, id: 'dispute' }],
      rounds: [
        { m: ["I'm 20 minutes away. I'll pick up tonight, so refund the shipping AND take 15% off for saving you the trip."],
          o: [['b', "Thanks, but this listing is ship-only. It's packed and goes out tracked today, as shown at checkout."],
              ['g', "No pickup, but I'll refund $10.00 of shipping anyway.", 10],
              ['w', "Um, I'm not sure where I'd even meet you."],
              ['t', "Pickup isn't offered. Obviously."]] },
        { m: ["Then bundle: add the brown pair from your other listing for $40 total. You'd still make money."],
          o: [['b', "I can send a combined-shipping offer on the brown pair at its listed price - I can't discount it below that."],
              ['g', "I'll take $12.00 off this order if you buy both.", 12],
              ['w', "Maybe. I'd have to check if I still have that one."],
              ['t', "$40 is a cheap offer and you know it."]] },
        { m: ["At least throw in a free hard case and cleaning kit. Other sellers do. Or I cancel both."],
          o: [['b', "This order already includes the soft pouch shown in the photos. A hard case is listed separately if you'd like to add one."],
              ['g', "OK - I'll add a hard case on me (that costs me $9.00).", 9],
              ['w', "I wish I could, cases are just so expensive lately."],
              ['t', "What other sellers do is your problem to chase."]] }
      ],
      close: "No pickup, no bundle, no case. Fine. Just ship it."
    },

    /* ---------- 5 ---------- */
    {
      name: 'The Scratch Bluff', user: 'scuffed_steve', fb: 19, color: '#b45309',
      item: 'Navy Rectangle 54-17-145', art: { shape: 'square', frame: '#1e3a8a', lens: '#93c5fd' },
      tasks: [{ after: 2, id: 'scratch' }],
      rounds: [
        { m: ["These arrived SCRATCHED. Deep gouge on the right temple. I want $40 back or I open a case."],
          o: [['b', "I'm sorry to hear that. Please send a clear photo of the mark so I can compare it with my dispatch photos."],
              ['g', "So sorry! Here's $15.00 back for the scratch.", 15],
              ['w', "Oh no. Are you sure it isn't just a smudge?"],
              ['t', "That scratch claim sounds fake to me."]] },
        { m: ["I'm not sending photos, I shouldn't have to prove anything. $30 and I drop it."],
          o: [['b', "I understand. eBay asks for a photo on condition claims - once I have it, I can sort this out quickly."],
              ['g', "No photo needed - $14.00 partial refund sent.", 14],
              ['w', "Well... I guess I can't make you send one."],
              ['t', "No photo? Then obviously there's no scratch."]] },
        { m: ["Here's a pic. See that line? (attachment: blurry, 40 px wide)"],
          o: [['b', "Thanks. My timestamped dispatch photos show that temple clean, and this image is too blurry to match. A sharper one, please?"],
              ['g', "I can sort of see it... $12.00 refund sent.", 12],
              ['w', "It's hard to tell. Could be anything, really."],
              ['t', "That photo is a cheap trick."]] },
        { m: ["Forget photos. $20 or I return them 'not as described' and you pay shipping both ways."],
          o: [['b', "If you return them, I'll inspect against my dispatch photos and refund per eBay policy. Otherwise, enjoy the frames."],
              ['g', "Let's not do returns - $13.00 back.", 13],
              ['w', "Please don't open a return, it hurts my account."],
              ['t', "Go ahead. Return shipping is your problem."]] }
      ],
      close: "...never mind. Might have been a hair on the lens."
    }
  ]);
})();
