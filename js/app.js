/* js/app.js
 * Main app controller. Owns:
 *   - app state (current route, current view)
 *   - language initialization
 *   - theme application
 *   - top chrome (header with stars + parent button)
 *   - splash screen
 *   - service worker registration
 *   - routing registration (delegates to components)
 *
 * All view rendering is delegated to components/*.js — app.js just hands
 * them the root container and coordinates cross-cutting concerns.
 */
(function (global) {
  "use strict";

  var Storage = global.Storage;
  var I18n = global.I18n;
  var Router = global.Router;
  var AudioManager = global.AudioManager;
  var Progress = global.Progress;
  var Parent = global.Parent;

  var APP_ROOT_ID = "app-root";
  var appRoot = null;
  var sessionStart = Date.now();

  // --- Splash control ------------------------------------------------------
  function hideSplash() {
    var splash = document.getElementById("splash");
    if (!splash) return;
    splash.classList.add("hide");
    setTimeout(function () {
      if (splash.parentNode) splash.parentNode.removeChild(splash);
    }, 450);
  }

  // --- Top chrome (header bar) ---------------------------------------------
  function renderChrome() {
    var chrome = document.getElementById("chrome");
    if (!chrome) return;
    var stars = Progress.getStars();
    chrome.innerHTML =
      '<button class="btn-icon parent-btn" data-action="parent" aria-label="' + I18n.t("parent") + '">' +
        '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">' +
          '<circle cx="12" cy="8" r="4" fill="currentColor"/>' +
          '<path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="currentColor"/>' +
        '</svg>' +
      '</button>' +
      '<div class="stars-badge" title="' + I18n.t("stars") + '">' +
        '<span aria-hidden="true">⭐</span> ' +
        '<strong id="chrome-stars">' + stars + '</strong>' +
      '</div>';
    var parentBtn = chrome.querySelector('[data-action="parent"]');
    if (parentBtn) parentBtn.addEventListener("click", onParentClick);
  }

  function refreshChrome() {
    renderChrome();
  }

  function onParentClick() {
    AudioManager.playClick();
    // Show parent gate modal.
    showParentGate();
  }

  function showParentGate() {
    var overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");

    var q = Parent.makeGateQuestion();
    var inputId = "gate-input";

    overlay.innerHTML =
      '<div class="modal-card">' +
        '<h3>' + I18n.t("parentGate") + '</h3>' +
        '<div class="gate-question">' +
          '<span>' + q.a + '</span>' +
          '<span class="gate-op">' + q.op + '</span>' +
          '<span>' + q.b + '</span>' +
          '<span class="gate-eq">=</span>' +
          '<input type="number" id="' + inputId + '" inputmode="numeric" autocomplete="off" />' +
        '</div>' +
        '<div class="modal-actions">' +
          '<button class="btn-ghost" data-action="cancel">' + I18n.t("close") + '</button>' +
          '<button class="btn-primary" data-action="enter">✓</button>' +
        '</div>' +
        '<p class="gate-error" id="gate-error"></p>' +
      '</div>';

    document.body.appendChild(overlay);
    var input = overlay.querySelector("#" + inputId);
    setTimeout(function () { if (input) input.focus(); }, 100);

    function close() {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }
    function submit() {
      var val = input.value;
      if (Parent.checkGate(q, val)) {
        close();
        Router.go("parent");
      } else {
        var err = overlay.querySelector("#gate-error");
        if (err) err.textContent = I18n.t("parentWrong");
        input.value = "";
        input.focus();
      }
    }
    overlay.querySelector('[data-action="cancel"]').addEventListener("click", close);
    overlay.querySelector('[data-action="enter"]').addEventListener("click", submit);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") submit();
      if (e.key === "Escape") close();
    });
  }

  // --- Theme ----------------------------------------------------------------
  function applyTheme() {
    var theme = Storage.getTheme();
    document.documentElement.setAttribute("data-theme", theme);
  }

  // --- Achievement toast ----------------------------------------------------
  function showAchievementToast(detail) {
    var achList = Progress.listAchievements();
    var ach = achList.filter(function (a) { return a.id === detail.id; })[0];
    if (!ach) return;
    var toast = document.createElement("div");
    toast.className = "toast toast-achievement";
    toast.innerHTML =
      '<div class="toast-icon">' + ach.icon + '</div>' +
      '<div class="toast-body">' +
        '<strong>' + I18n.t("achievements") + '</strong>' +
        '<span>' + I18n.t(ach.labelKey) + '</span>' +
      '</div>';
    document.body.appendChild(toast);
    AudioManager.playStar();
    setTimeout(function () { toast.classList.add("show"); }, 10);
    setTimeout(function () {
      toast.classList.remove("show");
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 400);
    }, 2800);
  }

  // --- Praise / retry toast (used by games) --------------------------------
  function showFeedback(kind, text) {
    var toast = document.createElement("div");
    toast.className = "toast toast-feedback " + (kind === "correct" ? "correct" : "wrong");
    toast.innerHTML =
      '<div class="toast-icon">' + (kind === "correct" ? "🎉" : "🌱") + '</div>' +
      '<div class="toast-body"><strong>' + text + '</strong></div>';
    document.body.appendChild(toast);
    setTimeout(function () { toast.classList.add("show"); }, 10);
    setTimeout(function () {
      toast.classList.remove("show");
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 400);
    }, 1400);
  }

  // --- Session time accounting ---------------------------------------------
  function flushSessionTime() {
    var elapsed = Date.now() - sessionStart;
    Storage.addTimeUsed(elapsed);
    sessionStart = Date.now();
  }
  // Flush every 30s and on visibilitychange.
  setInterval(flushSessionTime, 30000);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") flushSessionTime();
  });
  window.addEventListener("beforeunload", flushSessionTime);

  // --- Star update events --------------------------------------------------
  document.addEventListener("at:achievement", function (e) {
    showAchievementToast(e.detail);
  });

  // --- Service worker registration -----------------------------------------
  function registerSW() {
    if (!("serviceWorker" in navigator)) return;
    // Use relative path so it works on GitHub Pages subpaths.
    navigator.serviceWorker.register("./sw.js").catch(function () {
      // Silent — offline support degrades gracefully.
    });
  }

  // --- Public App object ---------------------------------------------------
  var App = {
    init: function () {
      appRoot = document.getElementById(APP_ROOT_ID);

      // Apply language + theme from storage before first paint.
      I18n.setLang(Storage.getLanguage());
      applyTheme();
      Progress.init();

      renderChrome();

      // Register routes with the router. Each route is a function that
      // receives the root container and renders into it.
      Router.register("home", function () {
        global.Components.Home.renderInto(appRoot);
      });
      Router.register("numbers", function (params) {
        var lang = (params && params[0]) || "ar";
        global.Components.Lesson.renderInto(appRoot, {
          type: "numbers",
          lang: lang,
          data: (lang === "en") ? global.AT_DATA.englishNumbers : global.AT_DATA.arabicNumbers
        });
      });
      Router.register("arabic-letters", function () {
        global.Components.Lesson.renderInto(appRoot, {
          type: "letters",
          lang: "ar",
          data: global.AT_DATA.arabicLetters
        });
      });
      Router.register("english-letters", function () {
        global.Components.Lesson.renderInto(appRoot, {
          type: "letters",
          lang: "en",
          data: global.AT_DATA.englishLetters
        });
      });
      Router.register("animals", function () {
        global.Components.Lesson.renderInto(appRoot, {
          type: "animals",
          lang: I18n.getLang(),
          data: global.AT_DATA.animals
        });
      });
      Router.register("colors", function () {
        global.Components.Lesson.renderInto(appRoot, {
          type: "colors",
          lang: I18n.getLang(),
          data: global.AT_DATA.colors
        });
      });
      Router.register("shapes", function () {
        global.Components.Lesson.renderInto(appRoot, {
          type: "shapes",
          lang: I18n.getLang(),
          data: global.AT_DATA.shapes
        });
      });
      Router.register("words", function () {
        global.Components.Lesson.renderInto(appRoot, {
          type: "words",
          lang: I18n.getLang(),
          data: global.AT_DATA.words
        });
      });
      Router.register("games", function (params) {
        global.Components.Quiz.renderInto(appRoot, params && params[0]);
      });
      Router.register("progress", function () {
        global.Components.Progress.renderInto(appRoot);
      });
      Router.register("parent", function () {
        Parent.renderInto(appRoot);
      });

      Router.init();
      registerSW();

      // Hide splash once first paint is done.
      setTimeout(hideSplash, 600);
    },

    refreshChrome: refreshChrome,
    applyTheme: applyTheme,
    showFeedback: showFeedback,
    showAchievementToast: showAchievementToast,
    updateStars: function () {
      var el = document.getElementById("chrome-stars");
      if (el) el.textContent = Progress.getStars();
    }
  };

  // Kick off as soon as DOM is ready.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", App.init);
  } else {
    App.init();
  }

  global.App = App;
})(window);
