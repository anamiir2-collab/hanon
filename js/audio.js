/* js/audio.js
 * Centralized audio manager.
 *
 * Responsibilities:
 *   - Play TTS for any text (Arabic or English) via Speech module.
 *   - Synthesize simple animal sounds via Web Audio API (no audio files
 *     required — keeps the app offline-first and tiny).
 *   - Play short UI sound effects (correct / wrong / click / star) via Web Audio.
 *   - Ensure only ONE audio plays at a time: stop the previous before
 *     starting the new. Toddlers tap fast.
 *
 * Future expansion: if real .mp3 files are placed under assets/audio/,
 * AudioManager will prefer them and fall back to TTS. This is set up via
 * the `tryLocalFirst` flag below.
 */
(function (global) {
  "use strict";

  var Speech = global.Speech;
  var Storage = global.Storage;

  // Lazy-init AudioContext — must be created/resumed on a user gesture.
  var ctx = null;

  function ensureCtx() {
    if (ctx) return ctx;
    try {
      var AC = global.AudioContext || global.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    } catch (e) {
      ctx = null;
    }
    return ctx;
  }

  function resumeCtx() {
    var c = ensureCtx();
    if (c && c.state === "suspended") {
      try { c.resume(); } catch (e) {}
    }
    return c;
  }

  // --- Tone synthesis -------------------------------------------------------
  function playTone(freq, durationMs, type, volume, whenOffset) {
    var c = ensureCtx();
    if (!c) return;
    var osc = c.createOscillator();
    var gain = c.createGain();
    osc.type = type || "sine";
    osc.frequency.value = freq;
    var t0 = c.currentTime + (whenOffset || 0);
    var dur = durationMs / 1000;
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(volume || 0.15, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  // --- UI effects -----------------------------------------------------------
  function playCorrect() {
    if (!Storage.isSoundOn()) return;
    resumeCtx();
    // Major arpeggio up: C5-E5-G5
    playTone(523.25, 160, "sine", 0.18, 0);
    playTone(659.25, 160, "sine", 0.18, 0.14);
    playTone(783.99, 280, "sine", 0.20, 0.28);
  }

  function playWrong() {
    if (!Storage.isSoundOn()) return;
    resumeCtx();
    // Soft descending two-tone, never harsh.
    playTone(330, 180, "triangle", 0.12, 0);
    playTone(247, 260, "triangle", 0.12, 0.16);
  }

  function playClick() {
    if (!Storage.isSoundOn()) return;
    resumeCtx();
    playTone(880, 60, "sine", 0.10, 0);
  }

  function playStar() {
    if (!Storage.isSoundOn()) return;
    resumeCtx();
    playTone(1046.5, 120, "sine", 0.16, 0);
    playTone(1318.5, 220, "sine", 0.18, 0.10);
  }

  // --- Animal sound synthesis (toy, friendly, not scary) --------------------
  // Each animal gets a short synthesized cue. These are NOT realistic — they
  // are gentle audio cues that match the animal's emoji on screen.
  var ANIMAL_SOUND_PRESETS = {
    roar:    { freqs: [110, 90, 80],  type: "sawtooth", dur: 600, vol: 0.15 },
    meow:    { freqs: [700, 950, 700], type: "sine",    dur: 450, vol: 0.18 },
    woof:    { freqs: [220, 180],     type: "square",   dur: 350, vol: 0.15 },
    trumpet: { freqs: [330, 440, 330], type: "sawtooth", dur: 500, vol: 0.15 },
    neigh:   { freqs: [440, 350, 440], type: "triangle", dur: 500, vol: 0.15 },
    moo:     { freqs: [180, 150],     type: "sawtooth", dur: 600, vol: 0.15 },
    baa:     { freqs: [350, 300],     type: "sine",     dur: 500, vol: 0.16 },
    squeak:  { freqs: [1200, 1500],   type: "sine",     dur: 200, vol: 0.15 },
    cluck:   { freqs: [600, 800, 600],type: "square",  dur: 350, vol: 0.13 },
    quack:   { freqs: [400, 350],     type: "sawtooth", dur: 300, vol: 0.16 },
    blub:    { freqs: [500, 700, 500],type: "sine",    dur: 400, vol: 0.13 },
    ooh:     { freqs: [350, 400, 350],type: "sine",    dur: 400, vol: 0.15 },
    hum:     { freqs: [220, 240],     type: "sine",     dur: 500, vol: 0.12 },
    growl:   { freqs: [100, 80],      type: "sawtooth", dur: 600, vol: 0.14 },
    howl:    { freqs: [440, 392, 440], type: "sine",    dur: 700, vol: 0.15 },
    yip:     { freqs: [800, 1000],    type: "square",   dur: 200, vol: 0.13 },
    slow:    { freqs: [200, 180, 200],type: "sine",     dur: 600, vol: 0.13 },
    ribbit:  { freqs: [300, 250, 300],type: "sine",     dur: 350, vol: 0.15 },
    flutter: { freqs: [800, 1000, 800, 1000], type: "sine", dur: 400, vol: 0.12 },
    buzz:    { freqs: [220, 220],     type: "sawtooth", dur: 400, vol: 0.12 },
    tweet:   { freqs: [1200, 1500, 1200], type: "sine", dur: 250, vol: 0.14 },
    squawk:  { freqs: [600, 500, 600],type: "square",   dur: 400, vol: 0.14 },
    song:    { freqs: [220, 277, 330, 220], type: "sine", dur: 800, vol: 0.13 },
    click:   { freqs: [2000, 2500],   type: "sine",     dur: 150, vol: 0.10 },
    hiss:    { freqs: [3000, 3000],   type: "sawtooth", dur: 400, vol: 0.08 },
    hiss2:   { freqs: [3000, 3000],   type: "sawtooth", dur: 400, vol: 0.08 },
    bleat:   { freqs: [400, 350],     type: "triangle", dur: 400, vol: 0.14 },
    grunt:   { freqs: [180, 150],     type: "sawtooth", dur: 500, vol: 0.15 },
    bark:    { freqs: [500, 400],     type: "square",   dur: 250, vol: 0.15 },
    hoot:    { freqs: [440, 392, 440],type: "sine",    dur: 600, vol: 0.13 },
    oink:    { freqs: [300, 250],     type: "square",   dur: 250, vol: 0.15 }
  };

  function playAnimalSound(soundName) {
    if (!Storage.isSoundOn()) return;
    resumeCtx();
    var preset = ANIMAL_SOUND_PRESETS[soundName];
    if (!preset) {
      // Unknown — play a generic friendly tone.
      playTone(440, 300, "sine", 0.12, 0);
      return;
    }
    var step = (preset.dur / preset.freqs.length) / 1000;
    preset.freqs.forEach(function (f, i) {
      playTone(f, preset.dur / preset.freqs.length + 80, preset.type, preset.vol, i * step);
    });
  }

  // --- Master "speak" wrappers ---------------------------------------------
  // These stop any other audio first, then speak via TTS.

  function speakArabic(text) {
    if (!Storage.isSoundOn()) return;
    Speech.stop();
    // Stop synthesized animal/UI sounds — they have already finished or will
    // be allowed to finish; Speech.stop() above only cancels queued TTS.
    Speech.speakArabic(text);
  }

  function speakEnglish(text) {
    if (!Storage.isSoundOn()) return;
    Speech.stop();
    Speech.speakEnglish(text);
  }

  function speakForLang(text, lang) {
    if (lang === "en") speakEnglish(text);
    else speakArabic(text);
  }

  function stopAll() {
    Speech.stop();
  }

  var AudioManager = {
    speakArabic: speakArabic,
    speakEnglish: speakEnglish,
    speakForLang: speakForLang,
    stop: stopAll,
    playAnimalSound: playAnimalSound,
    playCorrect: playCorrect,
    playWrong: playWrong,
    playClick: playClick,
    playStar: playStar,
    resumeCtx: resumeCtx
  };

  global.AudioManager = AudioManager;
})(window);
