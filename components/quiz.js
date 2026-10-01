/* components/quiz.js
 * Quiz / games hub + game player.
 *
 * Routes:
 *   #/games           — show list of games
 *   #/games/:gameId   — play a specific game
 *
 * Each game generates 10 randomized questions (see js/games.js). After each
 * answer, gentle feedback is shown and the next question appears. Score is
 * tracked and stars are awarded for correct answers.
 */
(function (global) {
  "use strict";

  var I18n = global.I18n;
  var Router = global.Router;
  var AudioManager = global.AudioManager;
  var Progress = global.Progress;
  var Games = global.Games;
  var DATA = global.AT_DATA || {};
  // NOTE: do NOT capture `global.App` here — app.js loads AFTER quiz.js,
  // so global.App is undefined at script-load time. Access via global.App
  // inside event handlers instead.

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function renderHub(container) {
    var games = DATA.games || [];
    var lang = I18n.getLang();

    var cardsHtml = games.map(function (g) {
      var label = (lang === "ar") ? g.ar : g.en;
      return '' +
        '<button class="game-card" data-game="' + g.id + '" style="--card-color:' + g.color + '" aria-label="' + label + '">' +
          '<div class="game-icon" aria-hidden="true">' + g.icon + '</div>' +
          '<div class="game-label">' + label + '</div>' +
          '<div class="game-cta">' + I18n.t("startGame") + '</div>' +
        '</button>';
    }).join("");

    container.innerHTML =
      '<div class="lesson-screen">' +
        '<header class="lesson-header">' +
          '<button class="btn-icon back-btn" data-action="back" aria-label="' + I18n.t("back") + '">' +
            '<span aria-hidden="true">‹</span>' +
          '</button>' +
          '<h2 class="lesson-title">' + I18n.t("pickGame") + '</h2>' +
        '</header>' +
        '<main class="games-grid">' + cardsHtml + '</main>' +
      '</div>';

    var grid = container.querySelector(".games-grid");
    grid.addEventListener("click", function (e) {
      var card = e.target.closest(".game-card");
      if (!card) return;
      AudioManager.playClick();
      Router.go("games", [card.getAttribute("data-game")]);
    });

    var backBtn = container.querySelector('[data-action="back"]');
    if (backBtn) backBtn.addEventListener("click", function () {
      AudioManager.playClick();
      Router.go("home");
    });
  }

  function renderGame(container, gameId) {
    var games = DATA.games || [];
    var game = games.filter(function (g) { return g.id === gameId; })[0];
    if (!game) { renderHub(container); return; }

    var lang = I18n.getLang();
    var questions = Games.generate(game.type, 10);
    var currentIdx = 0;
    var score = 0;

    function renderQuestion(i) {
      if (i >= questions.length) {
        renderFinish();
        return;
      }
      var q = questions[i];
      currentIdx = i;

      var optionsHtml = q.options.map(function (opt, idx) {
        var extra = "";
        if (opt.emoji) extra = '<span class="opt-emoji">' + opt.emoji + '</span>';
        if (opt.swatch) extra = '<span class="opt-swatch" style="background:' + opt.swatch + '"></span>';
        return '' +
          '<button class="quiz-option" data-idx="' + idx + '">' +
            extra +
            '<span class="opt-label">' + (opt.label || "") + '</span>' +
          '</button>';
      }).join("");

      // Prompt
      var promptText = I18n.t(q.promptKey);
      if (q.promptArg) promptText += " " + q.promptArg + "؟";
      else if (q.promptKey === "howMany") promptText = I18n.t("howMany") + "؟";
      else if (q.promptKey === "whichLetter") promptText = I18n.t("whichLetter");
      else if (q.promptKey === "whatColor") promptText = I18n.t("whatColor") + "؟";
      else if (q.promptKey === "whoSound") promptText = I18n.t("whoSound");
      else promptText = promptText + (q.promptArg ? " " + q.promptArg + "؟" : "؟");

      // Prompt visual
      var visualHtml = "";
      if (q.emoji) {
        // For "howMany" the prompt shows N items.
        if (q.type === "pickNumber" && q.count) {
          var itemsHtml = "";
          for (var k = 0; k < q.count; k++) {
            itemsHtml += '<span class="count-dot" style="animation-delay:' + (k * 60) + 'ms">' + q.emoji + '</span>';
          }
          visualHtml = '<div class="count-row quiz-count-row">' + itemsHtml + '</div>';
        } else {
          visualHtml = '<div class="lesson-emoji quiz-emoji">' + q.emoji + '</div>';
        }
      } else if (q.swatch) {
        visualHtml = '<div class="color-orb quiz-orb" style="background:' + q.swatch + '"></div>';
      } else if (q.type === "pickAnimalBySound") {
        visualHtml = '<button class="replay-sound" data-action="replay">🔊 ' + I18n.t("listen") + '</button>';
      }

      var progressDots = questions.map(function (_, idx) {
        return '<span class="progress-dot' + (idx === currentIdx ? " active" : "") + '"></span>';
      }).join("");

      container.innerHTML =
        '<div class="lesson-screen quiz-screen">' +
          '<header class="lesson-header quiz-header">' +
            '<button class="btn-icon back-btn" data-action="back" aria-label="' + I18n.t("back") + '">' +
              '<span aria-hidden="true">‹</span>' +
            '</button>' +
            '<div class="progress-dots" aria-hidden="true">' + progressDots + '</div>' +
            '<div class="score-badge">' + I18n.t("score") + ': <strong>' + score + '</strong></div>' +
          '</header>' +
          '<main class="quiz-main">' +
            '<h2 class="quiz-prompt">' + promptText + '</h2>' +
            visualHtml +
            '<div class="quiz-options" id="quiz-options">' + optionsHtml + '</div>' +
          '</main>' +
        '</div>';

      // Auto-play sound or speak the prompt.
      if (q.playSoundOnPrompt) {
        setTimeout(function () { AudioManager.playAnimalSound(q.playSoundOnPrompt); }, 300);
      } else if (q.speakOnPrompt) {
        setTimeout(function () { AudioManager.speakForLang(q.speakOnPrompt, lang); }, 300);
      }

      // Wire options.
      var optionsContainer = container.querySelector("#quiz-options");
      optionsContainer.addEventListener("click", function (e) {
        var btn = e.target.closest(".quiz-option");
        if (!btn) return;
        var idx = parseInt(btn.getAttribute("data-idx"), 10);
        var opt = q.options[idx];
        if (!opt) return;

        // Disable all options to prevent double-tap.
        var allBtns = Array.prototype.slice.call(optionsContainer.querySelectorAll(".quiz-option"));
        allBtns.forEach(function (b) { b.disabled = true; });

        if (opt.correct) {
          btn.classList.add("correct");
          try {
            AudioManager.playCorrect();
            global.App.showFeedback("correct", pickRandom(DATA.praise || ["برافو!"]));
            score += 1;
            Progress.onCorrect();
            global.App.updateStars();
          } catch (e) {
            console.error("Quiz correct-answer handler error:", e);
          }
          // Update the score badge in place.
          var sb = container.querySelector(".score-badge strong");
          if (sb) sb.textContent = score;
          setTimeout(function () { renderQuestion(currentIdx + 1); }, 1100);
        } else {
          btn.classList.add("wrong");
          // Highlight the correct option.
          allBtns.forEach(function (b, ix) {
            if (q.options[ix].correct) b.classList.add("reveal-correct");
          });
          try {
            AudioManager.playWrong();
            global.App.showFeedback("wrong", pickRandom(DATA.retry || ["جرب تاني"]));
          } catch (e) {
            console.error("Quiz wrong-answer handler error:", e);
          }
          // No point deduction. Move on after a slightly longer pause.
          setTimeout(function () { renderQuestion(currentIdx + 1); }, 1500);
        }
      });

      var replayBtn = container.querySelector('[data-action="replay"]');
      if (replayBtn) replayBtn.addEventListener("click", function () {
        AudioManager.playAnimalSound(q.playSoundOnPrompt);
      });

      var backBtn = container.querySelector('[data-action="back"]');
      if (backBtn) backBtn.addEventListener("click", function () {
        AudioManager.playClick();
        Router.go("games");
      });
    }

    function renderFinish() {
      var msg = (score >= 8)
        ? (lang === "ar" ? "أحسنت! نتيجة رائعة" : "Great job!")
        : (lang === "ar" ? "شاطر! كنت بطل" : "Good job!");
      container.innerHTML =
        '<div class="lesson-screen finish-screen">' +
          '<header class="lesson-header">' +
            '<button class="btn-icon back-btn" data-action="back" aria-label="' + I18n.t("back") + '">' +
              '<span aria-hidden="true">‹</span>' +
            '</button>' +
          '</header>' +
          '<main class="finish-main">' +
            '<div class="finish-emoji">🎉</div>' +
            '<h2 class="finish-title">' + msg + '</h2>' +
            '<div class="finish-score">' +
              '<span>' + I18n.t("score") + '</span>' +
              '<strong>' + score + ' / ' + questions.length + '</strong>' +
            '</div>' +
            '<div class="finish-stars">⭐ ⭐ ⭐</div>' +
          '</main>' +
          '<footer class="finish-actions">' +
            '<button class="btn-primary" data-action="replay">' + I18n.t("startGame") + '</button>' +
            '<button class="btn-secondary" data-action="hub">' + I18n.t("back") + '</button>' +
          '</footer>' +
        '</div>';

      // Big celebration.
      AudioManager.playStar();
      var replayBtn = container.querySelector('[data-action="replay"]');
      if (replayBtn) replayBtn.addEventListener("click", function () {
        AudioManager.playClick();
        renderGame(container, gameId);
      });
      var hubBtn = container.querySelector('[data-action="hub"]');
      if (hubBtn) hubBtn.addEventListener("click", function () {
        AudioManager.playClick();
        Router.go("games");
      });
      var backBtn = container.querySelector('[data-action="back"]');
      if (backBtn) backBtn.addEventListener("click", function () {
        AudioManager.playClick();
        Router.go("games");
      });
    }

    renderQuestion(0);
  }

  function renderInto(container, gameId) {
    if (!gameId) renderHub(container);
    else renderGame(container, gameId);
  }

  global.Components = global.Components || {};
  global.Components.Quiz = { renderInto: renderInto };
})(window);
