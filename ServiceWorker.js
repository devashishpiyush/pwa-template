const staticCacheName = "static-cache-001";
const dynamicCacheName = "dynamic-cache-001";
const assets = [
    "/",
    "/index.html",
    "/assets/css/style.css",
    "/assets/img/icons/transparent/icon-trans-72.png",
    "/assets/img/icons/transparent/icon-trans-96.png",
    "/assets/img/icons/transparent/icon-trans-128.png",
    "/assets/img/icons/transparent/icon-trans-144.png",
    "/assets/img/icons/transparent/icon-trans-152.png",
    "/assets/img/icons/transparent/icon-trans-180.png",
    "/assets/img/icons/transparent/icon-trans-192.png",
    "/assets/img/icons/transparent/icon-trans-196.png",
    "/assets/img/icons/transparent/icon-trans-384.png",
    "/assets/img/icons/transparent/icon-trans-512.png",
    "/assets/img/icons/white/icon-white-72.png",
    "/assets/img/icons/white/icon-white-96.png",
    "/assets/img/icons/white/icon-white-128.png",
    "/assets/img/icons/white/icon-white-144.png",
    "/assets/img/icons/white/icon-white-152.png",
    "/assets/img/icons/white/icon-white-180.png",
    "/assets/img/icons/white/icon-white-192.png",
    "/assets/img/icons/white/icon-white-196.png",
    "/assets/img/icons/white/icon-white-384.png",
    "/assets/img/icons/white/icon-white-512.png",
    "/assets/js/app.js",
    "/pages/error/fallback.html"
];

// limit cache size
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(key => {
            if(key.length > size) {
                cache.delete(key[0]).then(limitCacheSize(name, size));
            }
        })
    })
}

// Install Event
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(staticCacheName).then((cache) => {
            cache.addAll(assets);
        })
    );
});

// Activate Event
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                .map(key => caches.delete(key))
            )
        })
    );
});

// Fetch Event
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((cacheResponse) => {
            return cacheResponse || fetch(event.request).then((fetchResponse) => {
                return caches.open(dynamicCacheName).then((cache) => {
                    cache.put(event.request.url, fetchResponse.clone());
                    limitCacheSize(dynamicCacheName, 15);
                    return fetchResponse;
                })
            })
        }).catch(() => {
            return caches.match("/pages/error/fallback.html");
        })
    );
});