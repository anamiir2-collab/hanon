/* js/storage.js
 * Centralized LocalStorage wrapper. No personal data is ever stored — only
 * app preferences and the child's star count / lesson progress.
 *
 * All keys live under a single namespace: `atallam_w_alab_*` so they can be
 * wiped together if the parent resets progress.
 */
(function (global) {
  "use strict";

  var NS = "atallam_w_alab_";
  var KEYS = {
    language: NS + "language",
    level: NS + "level",
    stars: NS + "stars",
    progress: NS + "progress",        // { lessonId: true, ... }
    settings: NS + "settings",        // { sound:true, music:true, theme:'light' }
    achievements: NS + "achievements", // { id: true, ... }
    timeUsed: NS + "timeUsed"         // ms accumulated
  };

  function read(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // Quota exceeded or storage disabled — silently ignore.
    }
  }

  function remove(key) {
    try { localStorage.removeItem(key); } catch (e) {}
  }

  var Storage = {
    KEYS: KEYS,

    getLanguage: function () { return read(KEYS.language, "ar"); },
    setLanguage: function (lang) { write(KEYS.language, lang); },

    getLevel: function () { return read(KEYS.level, 1); },
    setLevel: function (lvl) { write(KEYS.level, lvl); },

    getStars: function () { return read(KEYS.stars, 0); },
    setStars: function (n) { write(KEYS.stars, n); },
    addStars: function (n) {
      var total = (read(KEYS.stars, 0) || 0) + n;
      write(KEYS.stars, total);
      return total;
    },

    getProgress: function () { return read(KEYS.progress, {}) || {}; },
    markLessonDone: function (lessonId) {
      var p = Storage.getProgress();
      p[lessonId] = true;
      write(KEYS.progress, p);
    },
    isLessonDone: function (lessonId) {
      var p = Storage.getProgress();
      return !!p[lessonId];
    },
    countDone: function () {
      return Object.keys(Storage.getProgress()).length;
    },

    getSettings: function () {
      return read(KEYS.settings, { sound: true, theme: "light" }) ||
             { sound: true, theme: "light" };
    },
    setSettings: function (s) { write(KEYS.settings, s); },
    getTheme: function () { return Storage.getSettings().theme || "light"; },
    setTheme: function (t) {
      var s = Storage.getSettings();
      s.theme = t;
      Storage.setSettings(s);
    },
    isSoundOn: function () {
      var s = Storage.getSettings();
      return s.sound !== false;
    },
    setSound: function (on) {
      var s = Storage.getSettings();
      s.sound = on;
      Storage.setSettings(s);
    },

    getAchievements: function () { return read(KEYS.achievements, {}) || {}; },
    unlockAchievement: function (id) {
      var a = Storage.getAchievements();
      if (a[id]) return false;
      a[id] = true;
      write(KEYS.achievements, a);
      return true;
    },
    countAchievements: function () {
      return Object.keys(Storage.getAchievements()).length;
    },

    addTimeUsed: function (ms) {
      var t = read(KEYS.timeUsed, 0) || 0;
      write(KEYS.timeUsed, t + ms);
    },
    getTimeUsed: function () { return read(KEYS.timeUsed, 0) || 0; },

    resetProgress: function () {
      remove(KEYS.stars);
      remove(KEYS.progress);
      remove(KEYS.achievements);
      remove(KEYS.timeUsed);
    },

    resetAll: function () {
      Object.keys(KEYS).forEach(function (k) {
        remove(KEYS[k]);
      });
    }
  };

  global.Storage = Storage;
})(window);
