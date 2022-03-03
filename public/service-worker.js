const APP_PREFIX = 'budget-tracker-';
const VERSION = 'v1';
const CACHE = APP_PREFIX + VERSION;
const FILES_TO_CACHE = [
    "/",
    "./index.html",
    "./css/styles.css",
    "./js/index.js",
    "./icons/icon-72x72.png",
    "./icons/icon-96x96.png",
    "./icons/icon-128x128.png",
    "./icons/icon-144x144.png",
    "./icons/icon-152x152.png",
    "./icons/icon-384x384.png",
    "./icons/icon-512x512.png",
    "./icons/icon-192x192.png"
]

self.addEventListener('install', function(e) {  // function to save all data in FILES_TO_CACHE to browser cache and useoffline 
    e.waitUntil(
        caches.open(CACHE)
        .then(function(cache) {
            console.log('installing cache ', CACHE)
            return cache.addAll(FILES_TO_CACHE)
        })
    )
});

// Dleted outdated caches
self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(keys) {
            let keepList = keys.filter((key) => {
                return key.indexOf(APP_PREFIX)
            });
            keepList.push(CACHE);

            return Promise.all(
                keys.map(function(key, i) {
                    if(keepList.indexOf(key) === -1) {
                        console.log('deleting cache: ', keys[i]);
                        return caches.delete(keys[i]);
                    }
                })
            )
        })
    )
});

// listins to api url if store in cache
self.addEventListener('fetch', function(e) {
    e.respondWith(
        caches.match(e.request).then(function(request) {
            if(request) {
                console.log('responding with cache: ' + e.request.url);
                return request;
            } else {
                console.log('file is not cached, fetching failed: ' + e.request.url);
                return fetch(e.request);
            }
        })
    )
});