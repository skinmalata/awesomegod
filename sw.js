/* ==========================================================================
   Awesome God Ministries — Site Service Worker (root)
   Makes the site installable and keeps it working offline.
   ========================================================================== */
"use strict";

var CACHE = "agm-site-v1";
var CORE = [
  "index.html",
  "css/style.css",
  "js/main.js",
  "logo.png",
  "manifest.webmanifest",
  "app/index.html",
  "app/icons/icon-192.png",
  "app/icons/icon-512.png",
  "app/icons/maskable-512.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(CACHE)
      .then(function (cache) {
        return cache.addAll(CORE);
      })
      .then(function () {
        return self.skipWaiting();
      })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (key) {
              return key !== CACHE;
            })
            .map(function (key) {
              return caches.delete(key);
            })
        );
      })
      .then(function () {
        return self.clients.claim();
      })
  );
});

self.addEventListener("fetch", function (event) {
  var request = event.request;
  if (request.method !== "GET") return;

  var url = new URL(request.url);
  if (url.origin !== location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(function (response) {
          var copy = response.clone();
          caches.open(CACHE).then(function (cache) {
            cache.put("index.html", copy);
          });
          return response;
        })
        .catch(function () {
          return caches.match("index.html");
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(function (cached) {
      if (cached) return cached;
      return fetch(request).then(function (response) {
        var copy = response.clone();
        caches.open(CACHE).then(function (cache) {
          cache.put(request, copy);
        });
        return response;
      });
    })
  );
});