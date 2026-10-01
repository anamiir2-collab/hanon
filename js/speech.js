/* js/speech.js
 * Web Speech API wrapper. Provides:
 *   - speakArabic(text)
 *   - speakEnglish(text)
 *   - speak(text, lang)  — generic
 *   - isSupported()
 *   - stop()
 *
 * The AudioManager (audio.js) layer prefers local audio files when present
 * and falls back to Speech.speak() — so this module is the TTS backend.
 */
(function (global) {
  "use strict";

  var synth = global.speechSynthesis;
  var voices = [];
  var voicesLoaded = false;

  function loadVoices() {
    if (!synth) return;
    voices = synth.getVoices() || [];
    voicesLoaded = voices.length > 0;
  }

  if (synth) {
    loadVoices();
    // Voices load asynchronously on some browsers.
    if (typeof synth.onvoiceschanged !== "undefined") {
      synth.onvoiceschanged = loadVoices;
    }
    // Poll once after a tick as a fallback.
    setTimeout(loadVoices, 250);
  }

  function pickVoice(lang) {
    if (!voices.length) return null;
    var wantPrefix = (lang === "en") ? "en" : "ar";
    // Try exact match first (ar-EG, en-US), then prefix match.
    var exact = voices.filter(function (v) {
      return v.lang && v.lang.toLowerCase().indexOf(wantPrefix) === 0;
    });
    if (exact.length) {
      // Prefer specific locales for better TTS quality.
      var preferred = (lang === "en")
        ? exact.filter(function (v) { return v.lang.toLowerCase().indexOf("en-us") === 0; })
        : exact.filter(function (v) { return v.lang.toLowerCase().indexOf("ar-eg") === 0 || v.lang.toLowerCase().indexOf("ar-sa") === 0; });
      return (preferred[0] || exact[0]);
    }
    return null;
  }

  function speak(text, lang) {
    if (!synth || !text) return false;
    // Cancel any in-flight utterance so rapid taps don't queue up.
    try { synth.cancel(); } catch (e) {}

    var u = new SpeechSynthesisUtterance(text);
    u.lang = (lang === "en") ? "en-US" : "ar-EG";
    var v = pickVoice(lang);
    if (v) u.voice = v;
    u.rate = (lang === "en") ? 0.85 : 0.85;
    u.pitch = 1.15;     // slightly higher pitch = friendlier for kids
    u.volume = 1.0;
    try {
      synth.speak(u);
      return true;
    } catch (e) {
      return false;
    }
  }

  var Speech = {
    isSupported: function () { return !!synth; },
    speakArabic: function (text) { return speak(text, "ar"); },
    speakEnglish: function (text) { return speak(text, "en"); },
    speak: speak,
    stop: function () {
      if (synth) {
        try { synth.cancel(); } catch (e) {}
      }
    }
  };

  global.Speech = Speech;
})(window);
