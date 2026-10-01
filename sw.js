/* sw.js — Service Worker for أتعلم وألعب
 *
 * Strategy:
 *   - Pre-cache core app shell on install (HTML, CSS, JS, data, icons).
 *   - Cache-first for same-origin static assets.
 *   - Network-first (falling back to cache) for the main HTML document, so
 *     updates are picked up when online but the app still works offline.
 *   - Cache dynamic data requests minimally — only same-origin GETs.
 *
 * Relative paths are used everywhere so the SW works whether the app is
 * served from a domain root or from a GitHub Pages subpath.
 */
var CACHE_VERSION = "atallam-v2";
var CORE_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./manifest.json",

  "./js/storage.js",
  "./js/i18n.js",
  "./js/speech.js",
  "./js/audio.js",
  "./js/progress.js",
  "./js/router.js",
  "./js/games.js",
  "./js/parent.js",
  "./js/app.js",

  "./components/home.js",
  "./components/lesson.js",
  "./components/quiz.js",
  "./components/progress.js",

  "./data/arabic-letters.js",
  "./data/english-letters.js",
  "./data/arabic-numbers.js",
  "./data/english-numbers.js",
  "./data/animals.js",
  "./data/colors.js",
  "./data/shapes.js",
  "./data/words.js",
  "./data/games.js",

  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/maskable-512.png",
  "./assets/icons/favicon-32.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function (cache) {
      // Use addAll with care: if any single fetch fails, the whole install
      // fails. We use individual puts so a missing optional asset doesn't
      // break the SW.
      return Promise.all(
        CORE_ASSETS.map(function (url) {
          return cache.add(url).catch(function () {
            // Ignore individual asset failure — app can still work.
          });
        })
      );
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE_VERSION; })
            .map(function (k) { return caches.delete(k); })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

// Allow the page to trigger SW update on reload.
self.addEventListener("message", function (event) {
  if (event.data === "skipWaiting") self.skipWaiting();
});

self.addEventListener("fetch", function (event) {
  var req = event.request;

  // Only handle GET requests from same-origin.
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Network-first for HTML navigation requests.
  if (req.mode === "navigate" || (req.headers.get("accept") || "").indexOf("text/html") !== -1) {
    event.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE_VERSION).then(function (cache) {
          cache.put("./index.html", copy).catch(function () {});
        });
        return res;
      }).catch(function () {
        return caches.match("./index.html").then(function (cached) {
          return cached || caches.match("./");
        });
      })
    );
    return;
  }

  // Cache-first for everything else.
  event.respondWith(
    caches.match(req).then(function (cached) {
      if (cached) return cached;
      return fetch(req).then(function (res) {
        // Only cache successful, same-type responses.
        if (!res || res.status !== 200 || res.type === "opaque") return res;
        var copy = res.clone();
        caches.open(CACHE_VERSION).then(function (cache) {
          cache.put(req, copy).catch(function () {});
        });
        return res;
      }).catch(function () {
        // Offline and not cached — fail silently.
      });
    })
  );
});
