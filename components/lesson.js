/* components/lesson.js
 * Generic lesson viewer. Renders any of the 7 content types:
 *   numbers, letters, animals, colors, shapes, words
 *
 * Each lesson is data-driven: the same template renders cards from the
 * dataset, and tapping a card opens a detail view with TTS playback.
 *
 * Layout per detail view:
 *   [Back]                       [Progress dot dot dot]
 *   [Big visual]
 *   [Primary text]
 *   [Secondary text (translation)]
 *   [Listen button]  [Animal sound button — animals only]
 *   [Previous]  [Next]
 */
(function (global) {
  "use strict";

  var I18n = global.I18n;
  var Router = global.Router;
  var AudioManager = global.AudioManager;
  var Progress = global.Progress;
  var Storage = global.Storage;

  // --- Helpers --------------------------------------------------------------
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function shapeSvg(svgInner, color) {
    return '<svg viewBox="0 0 100 100" class="shape-svg" aria-hidden="true">' +
      '<g fill="' + (color || "#7E57C2") + '" stroke="#fff" stroke-width="3">' + svgInner + '</g>' +
    '</svg>';
  }

  // Render the "big visual" depending on the lesson type + item.
  function renderVisual(opts, item) {
    switch (opts.type) {
      case "numbers":
        // Big digit + N dots.
        var dots = "";
        var count = Math.min(item.value, 20);
        for (var i = 0; i < count; i++) {
          dots += '<span class="count-dot" style="animation-delay:' + (i * 60) + 'ms">' + item.emoji + '</span>';
        }
        return '' +
          '<div class="lesson-digit">' + item.digit + '</div>' +
          '<div class="count-row">' + dots + '</div>';

      case "letters":
        // Big letter + emoji representing the associated word.
        return '' +
          '<div class="lesson-letter">' + item.letter + '</div>' +
          '<div class="lesson-emoji">' + item.emoji + '</div>';

      case "animals":
        return '<div class="lesson-emoji animal-emoji">' + item.emoji + '</div>';

      case "colors":
        // Large color circle.
        var textColor = (item.id === "white") ? "#212121" : "#fff";
        return '' +
          '<div class="color-orb" style="background:' + item.hex + ';color:' + textColor + '"></div>';

      case "shapes":
        return '<div class="lesson-shape-wrap">' + shapeSvg(item.svg, "#7E57C2") + '</div>';

      case "words":
        return '<div class="lesson-emoji">' + item.emoji + '</div>';

      default:
        return "";
    }
  }

  // Render primary + secondary labels for the detail view.
  function renderLabels(opts, item, lang) {
    var primary = "";
    var secondary = "";
    switch (opts.type) {
      case "numbers":
        primary = (lang === "ar") ? item.word : item.word;
        secondary = (lang === "ar") ? item.wordEn : item.wordAr;
        break;
      case "letters":
        if (lang === "ar") {
          primary = item.word;          // Arabic word
          secondary = item.wordEn;      // English translation
        } else {
          primary = item.word;
          secondary = item.wordAr;
        }
        break;
      case "animals":
        primary = (lang === "ar") ? item.ar : item.en;
        secondary = (lang === "ar") ? item.en : item.ar;
        break;
      case "colors":
        primary = (lang === "ar") ? item.ar : item.en;
        secondary = (lang === "ar") ? item.en : item.ar;
        break;
      case "shapes":
        primary = (lang === "ar") ? item.ar : item.en;
        secondary = (lang === "ar") ? item.en : item.ar;
        break;
      case "words":
        primary = (lang === "ar") ? item.ar : item.en;
        secondary = (lang === "ar") ? item.en : item.ar;
        break;
    }
    return { primary: primary, secondary: secondary };
  }

  // Speak the item — primary language first, then optional translation.
  function speakItem(opts, item, lang) {
    var labels = renderLabels(opts, item, lang);
    // For letters/numbers we also want to pronounce the letter/digit.
    if (opts.type === "letters") {
      AudioManager.speakForLang(item.letter, lang);
      // Then say the word after a short delay.
      setTimeout(function () {
        AudioManager.speakForLang(labels.primary, lang);
      }, 900);
      return;
    }
    if (opts.type === "numbers") {
      AudioManager.speakForLang(item.digit, lang);
      setTimeout(function () {
        AudioManager.speakForLang(labels.primary, lang);
      }, 800);
      return;
    }
    AudioManager.speakForLang(labels.primary, lang);
  }

  // --- Main render ---------------------------------------------------------
  function renderInto(container, opts) {
    var lang = opts.lang || I18n.getLang();
    var data = opts.data;
    var currentIndex = 0;

    // NOTE: we deliberately do NOT call I18n.setLang() here. Changing the
    // UI language just because the user opened the English-letters section
    // would force-switch their whole app to English. Instead, we keep the
    // user's chosen UI language and only use `lang` for content + TTS.

    function renderItem(i) {
      currentIndex = (i + data.length) % data.length;
      var item = data[currentIndex];
      var visualHtml = renderVisual(opts, item);
      var labels = renderLabels(opts, item, lang);
      var showAnimalSound = (opts.type === "animals");
      var backHref = "#/home";

      // Progress dots
      var dotsHtml = data.map(function (_, idx) {
        return '<span class="progress-dot' + (idx === currentIndex ? " active" : "") + '"></span>';
      }).join("");

      container.innerHTML =
        '<div class="lesson-screen">' +
          '<header class="lesson-header">' +
            '<button class="btn-icon back-btn" data-action="back" aria-label="' + I18n.t("back") + '">' +
              '<span aria-hidden="true">‹</span>' +
            '</button>' +
            '<div class="progress-dots" aria-hidden="true">' + dotsHtml + '</div>' +
          '</header>' +
          '<main class="lesson-main" id="lesson-main">' +
            visualHtml +
            '<div class="lesson-labels">' +
              (labels.primary   ? '<div class="lesson-primary">' + labels.primary + '</div>' : '') +
              (labels.secondary ? '<div class="lesson-secondary">' + labels.secondary + '</div>' : '') +
            '</div>' +
          '</main>' +
          '<footer class="lesson-actions">' +
            (showAnimalSound
              ? '<button class="btn-secondary" data-action="animal-sound">' + I18n.t("animalSound") + '</button>'
              : '') +
            '<button class="btn-primary" data-action="listen">' + I18n.t("listen") + '</button>' +
          '</footer>' +
          '<nav class="lesson-nav">' +
            '<button class="btn-nav prev" data-action="prev" aria-label="' + I18n.t("previous") + '">' +
              '<span aria-hidden="true">‹</span> ' + I18n.t("previous") +
            '</button>' +
            '<button class="btn-nav next" data-action="next" aria-label="' + I18n.t("next") + '">' +
              I18n.t("next") + ' <span aria-hidden="true">›</span>' +
            '</button>' +
          '</nav>' +
        '</div>';

      // Animate the main visual in.
      var main = container.querySelector("#lesson-main");
      if (main) main.classList.add("enter");

      // Wire up buttons.
      var backBtn = container.querySelector('[data-action="back"]');
      if (backBtn) backBtn.addEventListener("click", function () {
        AudioManager.playClick();
        Router.go("home");
      });

      var listenBtn = container.querySelector('[data-action="listen"]');
      if (listenBtn) listenBtn.addEventListener("click", function () {
        listenBtn.classList.add("pulse");
        setTimeout(function () { listenBtn.classList.remove("pulse"); }, 350);
        speakItem(opts, item, lang);
      });

      var animalBtn = container.querySelector('[data-action="animal-sound"]');
      if (animalBtn) animalBtn.addEventListener("click", function () {
        animalBtn.classList.add("pulse");
        setTimeout(function () { animalBtn.classList.remove("pulse"); }, 350);
        AudioManager.playAnimalSound(item.sound);
      });

      var prevBtn = container.querySelector('[data-action="prev"]');
      if (prevBtn) prevBtn.addEventListener("click", function () {
        AudioManager.playClick();
        Progress.markLessonDone(item.id);
        recordLearned(opts);
        renderItem(currentIndex - 1);
      });

      var nextBtn = container.querySelector('[data-action="next"]');
      if (nextBtn) nextBtn.addEventListener("click", function () {
        AudioManager.playClick();
        Progress.markLessonDone(item.id);
        recordLearned(opts);
        renderItem(currentIndex + 1);
      });

      // Auto-speak when the item appears — helps non-readers learn by ear.
      // Small delay so the visual paints first.
      setTimeout(function () {
        speakItem(opts, item, lang);
      }, 250);
    }

    // Record learning for achievements — only the first time per item.
    function recordLearned(opts) {
      switch (opts.type) {
        case "letters":  Progress.onLetterLearned(); break;
        case "numbers":  Progress.onNumberLearned(); break;
        case "animals": Progress.onAnimalLearned();  break;
      }
    }

    renderItem(0);
  }

  global.Components = global.Components || {};
  global.Components.Lesson = { renderInto: renderInto };
})(window);
