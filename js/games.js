/* js/games.js
 * Quiz question generators. Each generator returns a question object:
 *
 *   {
 *     type: "pickAnimal",
 *     promptKey: "whereIs",          // i18n key
 *     promptArg: "قطة",              // optional dynamic arg
 *     emoji: "🐱",                  // optional prompt visual
 *     speakOnPrompt: "قطة",         // optional TTS when the question appears
 *     options: [
 *       { id, label, emoji, correct: true },
 *       ...
 *     ]
 *   }
 *
 * Questions are randomized so the same game has variety across sessions.
 */
(function (global) {
  "use strict";

  var DATA = global.AT_DATA || {};

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function pick(arr, n) {
    return shuffle(arr).slice(0, n);
  }

  // --- Game 1: Pick the animal ---------------------------------------------
  // "أين القطة؟" — show 3 animal emojis, child taps the right one.
  function genPickAnimal() {
    var correct = pick(DATA.animals, 1)[0];
    var distractors = DATA.animals.filter(function (a) { return a.id !== correct.id; });
    var options = pick(distractors, 2).concat([correct]);
    options = shuffle(options.map(function (a) {
      return {
        id: a.id,
        label: (global.I18n.getLang() === "ar") ? a.ar : a.en,
        emoji: a.emoji,
        correct: a.id === correct.id
      };
    }));
    var lang = global.I18n.getLang();
    return {
      type: "pickAnimal",
      promptKey: "whereIs",
      promptArg: (lang === "ar") ? correct.ar : correct.en,
      emoji: null,
      speakOnPrompt: (lang === "ar") ? correct.ar : correct.en,
      options: options
    };
  }

  // --- Game 2: Pick the number ---------------------------------------------
  // Show N items, ask "how many?"
  function genPickNumber() {
    var lang = global.I18n.getLang();
    var pool = (lang === "ar") ? DATA.arabicNumbers : DATA.englishNumbers;
    // Limit to numbers 1–10 for ages 2–4 (level 1/2), expand for older.
    var level = global.Storage.getLevel();
    var maxN = (level >= 3) ? 20 : 10;
    var usable = pool.filter(function (n) { return n.value <= maxN; });
    var correct = pick(usable, 1)[0];
    var distractors = usable.filter(function (n) {
      return n.value !== correct.value && Math.abs(n.value - correct.value) <= 3;
    });
    var options = pick(distractors, 2).concat([correct]);
    options = shuffle(options.map(function (n) {
      return {
        id: n.id,
        label: (lang === "ar") ? n.digit : String(n.value),
        emoji: null,
        correct: n.value === correct.value,
        countVisual: correct.value   // we render N dots under the prompt
      };
    }));
    var word = (lang === "ar") ? correct.word : correct.word;
    return {
      type: "pickNumber",
      promptKey: "howMany",
      promptArg: null,
      emoji: correct.emoji,
      count: correct.value,
      speakOnPrompt: word,
      options: options
    };
  }

  // --- Game 3: Pick the letter ---------------------------------------------
  // Show an object (emoji), ask "which letter does it start with?"
  function genPickLetter() {
    var lang = global.I18n.getLang();
    var pool = (lang === "ar") ? DATA.arabicLetters : DATA.englishLetters;
    var correct = pick(pool, 1)[0];
    var distractors = pool.filter(function (l) { return l.id !== correct.id; });
    var options = pick(distractors, 2).concat([correct]);
    options = shuffle(options.map(function (l) {
      return {
        id: l.id,
        label: l.letter,
        emoji: null,
        correct: l.id === correct.id
      };
    }));
    return {
      type: "pickLetter",
      promptKey: "whichLetter",
      promptArg: null,
      emoji: correct.emoji,
      speakOnPrompt: correct.letter,
      options: options
    };
  }

  // --- Game 4: Pick the color ----------------------------------------------
  // Show a colored ball, ask "what color is the ball?"
  function genPickColor() {
    var lang = global.I18n.getLang();
    var correct = pick(DATA.colors, 1)[0];
    var distractors = DATA.colors.filter(function (c) { return c.id !== correct.id; });
    var options = pick(distractors, 2).concat([correct]);
    options = shuffle(options.map(function (c) {
      return {
        id: c.id,
        label: (lang === "ar") ? c.ar : c.en,
        emoji: null,
        swatch: c.hex,
        correct: c.id === correct.id
      };
    }));
    return {
      type: "pickColor",
      promptKey: "whatColor",
      promptArg: null,
      swatch: correct.hex,
      speakOnPrompt: (lang === "ar") ? correct.ar : correct.en,
      options: options
    };
  }

  // --- Game 5: Pick animal by sound ----------------------------------------
  // Play an animal sound, ask "whose sound is this?"
  function genPickAnimalBySound() {
    var lang = global.I18n.getLang();
    var correct = pick(DATA.animals, 1)[0];
    var distractors = DATA.animals.filter(function (a) { return a.id !== correct.id; });
    var options = pick(distractors, 2).concat([correct]);
    options = shuffle(options.map(function (a) {
      return {
        id: a.id,
        label: (lang === "ar") ? a.ar : a.en,
        emoji: a.emoji,
        correct: a.id === correct.id
      };
    }));
    return {
      type: "pickAnimalBySound",
      promptKey: "whoSound",
      promptArg: null,
      emoji: null,
      playSoundOnPrompt: correct.sound,    // audio manager synthesizes this
      speakOnPrompt: null,
      options: options,
      correctId: correct.id                  // used to also speak the name after correct answer
    };
  }

  var GENERATORS = {
    pickAnimal: genPickAnimal,
    pickNumber: genPickNumber,
    pickLetter: genPickLetter,
    pickColor: genPickColor,
    pickAnimalBySound: genPickAnimalBySound
  };

  function generate(type, count) {
    var gen = GENERATORS[type];
    if (!gen) return [];
    var out = [];
    var seen = {};
    var attempts = 0;
    while (out.length < count && attempts < count * 5) {
      var q = gen();
      // De-dupe by promptArg+type to keep variety high.
      var key = q.type + "|" + (q.promptArg || "") + "|" + (q.swatch || "") + "|" + (q.speakOnPrompt || "");
      if (!seen[key]) {
        seen[key] = true;
        out.push(q);
      }
      attempts++;
    }
    // Pad if not enough unique questions (very small pools).
    while (out.length < count) {
      out.push(gen());
    }
    return out;
  }

  global.Games = {
    generate: generate,
    GENERATORS: GENERATORS
  };
})(window);
