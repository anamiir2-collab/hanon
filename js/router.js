/* js/router.js
 * Minimal hash-based SPA router. Works perfectly on GitHub Pages (no server
 * config required) and integrates with the browser's Back button via the
 * history stack.
 *
 * Routes are registered as functions: route -> fn(params).
 */
(function (global) {
  "use strict";

  var routes = {};
  var currentRoute = null;

  function parseHash() {
    var raw = (location.hash || "#/home").replace(/^#\/?/, "");
    var parts = raw.split("/");
    var name = parts[0] || "home";
    var params = parts.slice(1);
    return { name: name, params: params, raw: raw };
  }

  function go(name, params) {
    var hash = "#/" + name;
    if (params && params.length) hash += "/" + params.join("/");
    if (location.hash === hash) {
      // Same route — manually trigger render.
      dispatch();
    } else {
      location.hash = hash;
    }
  }

  function back() {
    history.back();
  }

  function dispatch() {
    var parsed = parseHash();
    var handler = routes[parsed.name] || routes["home"];
    currentRoute = parsed.name;
    try {
      handler(parsed.params);
    } catch (e) {
      console.error("Route error:", e);
      // Fallback to home.
      if (routes["home"]) routes["home"]([]);
    }
    // Scroll to top on every route change.
    window.scrollTo(0, 0);
  }

  function register(name, fn) { routes[name] = fn; }

  function init() {
    window.addEventListener("hashchange", dispatch);
    // First-load dispatch.
    if (!location.hash) location.hash = "#/home";
    else dispatch();
  }

  var Router = {
    init: init,
    go: go,
    back: back,
    register: register,
    current: function () { return currentRoute; }
  };

  global.Router = Router;
})(window);
