/* components/progress.js
 * "My Achievements" page. Shows total stars, lessons completed, and the
 * achievement grid (locked / unlocked).
 */
(function (global) {
  "use strict";

  var I18n = global.I18n;
  var Router = global.Router;
  var Progress = global.Progress;
  var Storage = global.Storage;
  var AudioManager = global.AudioManager;

  function renderInto(container) {
    var stars = Progress.getStars();
    var done = Progress.countDone();
    var achList = Progress.listAchievements();
    var totalAch = achList.length;
    var unlocked = achList.filter(function (a) { return a.unlocked; }).length;

    var cardsHtml = achList.map(function (a) {
      var label = I18n.t(a.labelKey);
      return '' +
        '<div class="ach-card' + (a.unlocked ? " unlocked" : " locked") + '">' +
          '<div class="ach-icon">' + (a.unlocked ? a.icon : "🔒") + '</div>' +
          '<div class="ach-label">' + label + '</div>' +
        '</div>';
    }).join("");

    container.innerHTML =
      '<div class="lesson-screen">' +
        '<header class="lesson-header">' +
          '<button class="btn-icon back-btn" data-action="back" aria-label="' + I18n.t("back") + '">' +
            '<span aria-hidden="true">‹</span>' +
          '</button>' +
          '<h2 class="lesson-title">' + I18n.t("sec_progress") + '</h2>' +
        '</header>' +
        '<main class="progress-main">' +
          '<section class="progress-hero">' +
            '<div class="big-star">⭐</div>' +
            '<div class="big-stars-count">' + stars + '</div>' +
            '<div class="big-stars-label">' + I18n.t("stars") + '</div>' +
          '</section>' +
          '<section class="progress-stats">' +
            '<div class="progress-stat">' +
              '<strong>' + done + '</strong>' +
              '<span>' + I18n.t("lessonsDone") + '</span>' +
            '</div>' +
            '<div class="progress-stat">' +
              '<strong>' + unlocked + ' / ' + totalAch + '</strong>' +
              '<span>' + I18n.t("achievements") + '</span>' +
            '</div>' +
          '</section>' +
          '<section class="ach-grid">' + cardsHtml + '</section>' +
        '</main>' +
      '</div>';

    var backBtn = container.querySelector('[data-action="back"]');
    if (backBtn) backBtn.addEventListener("click", function () {
      AudioManager.playClick();
      Router.go("home");
    });
  }

  global.Components = global.Components || {};
  global.Components.Progress = { renderInto: renderInto };
})(window);
