/* js/progress.js
 * Stars + achievements + session-time accounting.
 *
 * Achievements are unlocked by lesson/quiz activity and saved to Storage.
 * The progress page (components/progress.js) reads from this module.
 */
(function (global) {
  "use strict";

  var Storage = global.Storage;

  // Achievement catalog — drives both unlock logic and the progress page UI.
  var ACHIEVEMENTS = [
    { id: "firstLesson",     key: "ach_firstLesson",   icon: "🎓", threshold: "first-lesson" },
    { id: "fiveCorrect",     key: "ach_fiveCorrect",   icon: "⭐", threshold: 5, type: "correct" },
    { id: "fiveLetters",     key: "ach_fiveLetters",   icon: "🔤", threshold: 5, type: "letters" },
    { id: "tenNumbers",      key: "ach_tenNumbers",    icon: "🔢", threshold: 10, type: "numbers" },
    { id: "tenAnimals",      key: "ach_tenAnimals",    icon: "🐾", threshold: 10, type: "animals" },
    { id: "finishLetters",   key: "ach_finishLetters", icon: "🏆", threshold: 28, type: "letters" },
    { id: "stars50",         key: "ach_stars50",        icon: "✨", threshold: 50, type: "stars" }
  ];

  // In-memory counters for the current session. These also persist via
  // Storage so achievements survive app close/reopen.
  var counters = {
    correct: 0,
    letters: 0,
    numbers: 0,
    animals: 0,
    stars: 0
  };

  function loadCounters() {
    // counters.stars is always read fresh from Storage so it survives reset.
    counters.stars = Storage.getStars();
  }

  function unlock(id) {
    if (Storage.unlockAchievement(id)) {
      // Toast handled by app.js
      var ev = new CustomEvent("at:achievement", { detail: { id: id } });
      document.dispatchEvent(ev);
      return true;
    }
    return false;
  }

  function checkType(type) {
    ACHIEVEMENTS.forEach(function (a) {
      if (a.type !== type) return;
      if (counters[type] >= a.threshold) unlock(a.id);
    });
  }

  var Progress = {
    init: function () { loadCounters(); },

    getStars: function () { return Storage.getStars(); },
    getCounters: function () { return counters; },

    addStar: function () {
      var total = Storage.addStars(1);
      counters.stars = total;
      checkType("stars");
      return total;
    },
    addStars: function (n) {
      var total = Storage.addStars(n);
      counters.stars = total;
      checkType("stars");
      return total;
    },

    onCorrect: function () {
      counters.correct += 1;
      checkType("correct");
      Progress.addStar();
    },

    onLetterLearned: function () {
      counters.letters = (counters.letters || 0) + 1;
      checkType("letters");
    },
    onNumberLearned: function () {
      counters.numbers = (counters.numbers || 0) + 1;
      checkType("numbers");
    },
    onAnimalLearned: function () {
      counters.animals = (counters.animals || 0) + 1;
      checkType("animals");
    },

    onFirstLesson: function () {
      unlock("firstLesson");
    },

    isLessonDone: function (id) { return Storage.isLessonDone(id); },
    markLessonDone: function (id) {
      Storage.markLessonDone(id);
      Progress.onFirstLesson();
    },

    countDone: function () { return Storage.countDone(); },
    countAchievements: function () { return Storage.countAchievements(); },
    listAchievements: function () {
      var unlocked = Storage.getAchievements();
      return ACHIEVEMENTS.map(function (a) {
        return {
          id: a.id,
          icon: a.icon,
          labelKey: a.key,
          unlocked: !!unlocked[a.id]
        };
      });
    },

    reset: function () {
      Storage.resetProgress();
      counters = { correct: 0, letters: 0, numbers: 0, animals: 0, stars: 0 };
    }
  };

  global.Progress = Progress;
})(window);
