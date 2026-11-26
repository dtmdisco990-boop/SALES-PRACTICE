/* Frame Margin — tutorial: listing photo, bagging, a tough negotiation, a store emergency */
(function () {
  'use strict';
  var FM = window.FM;

  FM.tutorial = {
    stage: 'idle',
    run: async function () {
      var T = FM.tutorial, cfg = FM.TUTORIAL, coach = FM.ui.coach, r;
      FM.ui.showScreen('game');

      /* 1 + 2: the listing photo, then bagging */
      T.stage = 'photo';
      await FM.prechat.run(cfg, {
        onStep: function (step) {
          if (step === 'table') {
            return coach.say('Welcome to the store. Every order starts on the photo table. Press "Take Photo" to shoot the listing photo - you will see the flash and hear the shutter.', 'Got it');
          }
          if (step === 'photo') {
            T.stage = 'bag';
            return coach.say('Good shot. That photo is your proof of condition if a buyer argues later. Next, the glasses go into a protective shipping bag.', 'Bag them');
          }
          if (step === 'bagged') {
            return coach.say('Bagged, sealed and labelled. Now the hard part: the buyer has messaged you on eBay.', 'Open messages');
          }
          return null;
        }
      });

      /* 3: surviving a tough customer (repeats until the sale is saved) */
      T.stage = 'chat';
      for (;;) {
        r = await FM.chat.run(cfg, {
          noTasks: true,
          onRound: function (i) {
            if (i === 0) {
              return coach.say('You were paid $100.00 and the frames cost $66.00, so your margin starts at 34%. Every refund pushes it toward the margin floor - fall below the floor and you lose the level.', 'Next')
                .then(function () {
                  return coach.say('The green bar is the buyer\'s patience; the blue bar is your reply timer. Click a reply or press 1-4. Firm and polite wins. Dodging costs patience. Giving money away costs margin.', 'Let me reply');
                });
            }
            return coach.say('One more thing: some words make buyers explode, and the game never warns you which. Anything dismissive - like "calm down" - does massive patience damage. Read before you click.', 'Got it');
          }
        });
        if (r.win) break;
        await coach.say('That lost the sale. ' + r.text + ' In a real level you would retry the same level - let\'s run this chat again.', 'Try again');
        FM.chat.prepare(cfg);
      }

      /* 4: a store emergency (repeats until handled) */
      T.stage = 'emergency';
      await coach.say('Sale saved. Last lesson: store emergencies interrupt you mid-chat, and failing one loses the level. Here comes a robber - move with the arrow keys, WASD or the D-pad.', 'Bring it on');
      for (;;) {
        r = await FM.mg.run('robber', { d: 0, tutorial: true });
        if (r.success) break;
        await coach.say('They got away. Watch which aisle they take, then step into their path before they reach the exit door.', 'Try again');
      }

      T.stage = 'done';
      await coach.say('That is the whole job: photo, bag, argue, survive. Each level raises the margin floor and shrinks your reply timer. Good luck.', 'Start the game');
      T.stage = 'idle';
    }
  };
})();
