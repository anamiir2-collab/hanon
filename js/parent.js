/* js/parent.js
 * Parent area logic — gated behind a simple math question so the toddler
 * can't accidentally enter. No passwords, no personal data.
 */
(function (global) {
  "use strict";

  var Storage = global.Storage;
  var I18n = global.I18n;

  // Generate a random arithmetic question suitable for an adult.
  function makeGateQuestion() {
    var a = 2 + Math.floor(Math.random() * 6);   // 2..7
    var b = 2 + Math.floor(Math.random() * 6);   // 2..7
    // Sometimes use subtraction for variety.
    var useMinus = Math.random() < 0.3;
    if (useMinus && a < b) { var t = a; a = b; b = t; }
    return {
      a: a,
      b: b,
      op: useMinus ? "−" : "+",
      answer: useMinus ? (a - b) : (a + b)
    };
  }

  var Parent = {
    makeGateQuestion: makeGateQuestion,
    checkGate: function (q, val) {
      return Number(val) === q.answer;
    },

    // Render the parent area inside `container` element.
    renderInto: function (container) {
      var lang = I18n.getLang();
      var settings = Storage.getSettings();
      var stars = Storage.getStars();
      var done = Storage.countDone();
      var ach = Storage.countAchievements();
      var timeMs = Storage.getTimeUsed();
      var minutes = Math.floor(timeMs / 60000);
      var seconds = Math.floor((timeMs % 60000) / 1000);
      var timeStr = minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);

      var level = Storage.getLevel();
      var levelOptions = [1, 2, 3, 4].map(function (n) {
        var sel = (n === level) ? "selected" : "";
        return '<option value="' + n + '" ' + sel + '>' + I18n.t("level_" + n) + '</option>';
      }).join("");

      var soundChecked = Storage.isSoundOn() ? "checked" : "";
      var themeIsDark = (settings.theme === "dark");
      var darkChecked = themeIsDark ? "checked" : "";
      var lightChecked = !themeIsDark ? "checked" : "";
      var langAr = (lang === "ar") ? "checked" : "";
      var langEn = (lang === "en") ? "checked" : "";

      var html = '' +
        '<div class="parent-screen">' +
          '<header class="parent-header">' +
            '<button class="btn-icon back-btn" data-action="back" aria-label="' + I18n.t("back") + '">' +
              '<span aria-hidden="true">‹</span>' +
            '</button>' +
            '<h2>' + I18n.t("parent") + '</h2>' +
          '</header>' +

          '<section class="parent-stats">' +
            '<div class="stat-row"><span>' + I18n.t("stars") + '</span><strong>' + stars + ' ⭐</strong></div>' +
            '<div class="stat-row"><span>' + I18n.t("lessonsDone") + '</span><strong>' + done + '</strong></div>' +
            '<div class="stat-row"><span>' + I18n.t("achievements") + '</span><strong>' + ach + '</strong></div>' +
            '<div class="stat-row"><span>' + I18n.t("timeUsed") + '</span><strong>' + timeStr + '</strong></div>' +
          '</section>' +

          '<section class="parent-section">' +
            '<h3>' + I18n.t("childLevel") + '</h3>' +
            '<select id="parent-level" class="parent-select">' + levelOptions + '</select>' +
          '</section>' +

          '<section class="parent-section">' +
            '<h3>' + I18n.t("soundOn") + '</h3>' +
            '<label class="switch">' +
              '<input type="checkbox" id="parent-sound" ' + soundChecked + '>' +
              '<span class="slider"></span>' +
            '</label>' +
          '</section>' +

          '<section class="parent-section">' +
            '<h3>' + I18n.t("language") + '</h3>' +
            '<div class="radio-row">' +
              '<label><input type="radio" name="lang" value="ar" ' + langAr + '> العربية</label>' +
              '<label><input type="radio" name="lang" value="en" ' + langEn + '> English</label>' +
            '</div>' +
          '</section>' +

          '<section class="parent-section">' +
            '<h3>' + I18n.t("theme") + '</h3>' +
            '<div class="radio-row">' +
              '<label><input type="radio" name="theme" value="light" ' + lightChecked + '> ' + I18n.t("lightMode") + '</label>' +
              '<label><input type="radio" name="theme" value="dark" ' + darkChecked + '> ' + I18n.t("darkMode") + '</label>' +
            '</div>' +
          '</section>' +

          '<section class="parent-section danger">' +
            '<button class="btn-danger" id="parent-reset">' + I18n.t("resetProgress") + '</button>' +
          '</section>' +

          '<p class="parent-note">🔒 ' +
            (lang === "ar"
              ? "لا يتم جمع أي بيانات شخصية. كل البيانات محفوظة محليًا على جهازك فقط."
              : "No personal data is collected. Everything is stored locally on this device only.") +
          '</p>' +
        '</div>';

      container.innerHTML = html;

      // Wire up controls.
      var backBtn = container.querySelector(".back-btn");
      if (backBtn) backBtn.addEventListener("click", function () {
        global.Router.go("home");
      });

      var levelSel = container.querySelector("#parent-level");
      if (levelSel) levelSel.addEventListener("change", function (e) {
        Storage.setLevel(parseInt(e.target.value, 10));
      });

      var soundCb = container.querySelector("#parent-sound");
      if (soundCb) soundCb.addEventListener("change", function (e) {
        Storage.setSound(e.target.checked);
      });

      var langRadios = Array.prototype.slice.call(container.querySelectorAll('input[name="lang"]'));
      langRadios.forEach(function (r) {
        r.addEventListener("change", function (e) {
          var newLang = e.target.value;
          Storage.setLanguage(newLang);
          I18n.setLang(newLang);
          global.App.refreshChrome();
          Parent.renderInto(container);   // re-render in new language
        });
      });

      var themeRadios = Array.prototype.slice.call(container.querySelectorAll('input[name="theme"]'));
      themeRadios.forEach(function (r) {
        r.addEventListener("change", function (e) {
          var newTheme = e.target.value;
          Storage.setTheme(newTheme);
          global.App.applyTheme();
        });
      });

      var resetBtn = container.querySelector("#parent-reset");
      if (resetBtn) resetBtn.addEventListener("click", function () {
        if (window.confirm(I18n.t("confirmReset"))) {
          global.Progress.reset();
          Parent.renderInto(container);
          global.App.refreshChrome();
        }
      });
    }
  };

  global.Parent = Parent;
})(window);
