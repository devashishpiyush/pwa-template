const CACHE_NAME = "version-02";
const urlsToCache = ["index.html", "error.html"];

const self = this;

// Install
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    )
});

// Listen
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then(() => {
            return fetch(event.request).catch(() => {
                caches.match("error.html");
            })
        })
    )
});

// Activation
self.addEventListener("activate", (event) => {
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME);

    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if(!cacheWhitelist.includes(cacheName)) {
                    return caches.delete(cacheName);
                }
            })
        ))
    )
});