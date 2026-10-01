/* components/home.js
 * Home screen with large cards for each section.
 * Cards are generated from a static section list so adding a new section
 * is a one-line change.
 */
(function (global) {
  "use strict";

  var I18n = global.I18n;
  var Router = global.Router;
  var AudioManager = global.AudioManager;

  var SECTIONS = [
    { id: "numbers",         route: "numbers/ar",        icon: "🔢", color: "#FFB74D", labelKey: "sec_numbers",   sub: "1 2 3" },
    { id: "arabic-letters",   route: "arabic-letters",    icon: "أ",   color: "#81C784", labelKey: "sec_ar_letters", sub: "ا ب ت" },
    { id: "english-letters",  route: "english-letters",   icon: "A",   color: "#64B5F6", labelKey: "sec_en_letters", sub: "A B C" },
    { id: "animals",          route: "animals",           icon: "🐾", color: "#4DB6AC", labelKey: "sec_animals",   sub: "Lion" },
    { id: "colors",           route: "colors",            icon: "🎨", color: "#BA68C8", labelKey: "sec_colors",     sub: "Red" },
    { id: "shapes",           route: "shapes",            icon: "🔷", color: "#FFD54F", labelKey: "sec_shapes",     sub: "Star" },
    { id: "words",            route: "words",              icon: "💬", color: "#F06292", labelKey: "sec_words",      sub: "Mama" },
    { id: "games",            route: "games",              icon: "🧩", color: "#A1887F", labelKey: "sec_games",      sub: "Play" },
    { id: "progress",         route: "progress",           icon: "🏆", color: "#7986CB", labelKey: "sec_progress",   sub: "★" }
  ];

  var Home = {
    renderInto: function (container) {
      var lang = I18n.getLang();

      var cardsHtml = SECTIONS.map(function (s) {
        var label = I18n.t(s.labelKey);
        var subLabel = (lang === "ar") ? "" : "";
        return '' +
          '<button class="home-card" data-route="' + s.route + '" style="--card-color:' + s.color + '" aria-label="' + label + '">' +
            '<div class="home-card-icon" aria-hidden="true">' + s.icon + '</div>' +
            '<div class="home-card-label">' +
              '<span class="home-card-title">' + label + '</span>' +
              '<span class="home-card-sub">' + s.sub + '</span>' +
            '</div>' +
          '</button>';
      }).join("");

      var html =
        '<div class="home-screen">' +
          '<header class="home-hero">' +
            '<h1 class="app-title">' + I18n.t("appName") + '</h1>' +
            '<p class="app-tagline">' + I18n.t("appTagline") + '</p>' +
            '<div class="welcome-bubble">' + I18n.t("welcome") + '</div>' +
          '</header>' +
          '<main class="home-grid">' + cardsHtml + '</main>' +
        '</div>';

      container.innerHTML = html;

      // Event delegation — single listener for all card taps.
      container.querySelector(".home-grid").addEventListener("click", function (e) {
        var card = e.target.closest(".home-card");
        if (!card) return;
        AudioManager.playClick();
        var route = card.getAttribute("data-route");
        Router.go(route.split("/")[0], route.split("/").slice(1));
      });
    }
  };

  global.Components = global.Components || {};
  global.Components.Home = Home;
})(window);
