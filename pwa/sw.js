const CACHE_NAME = 'roughpaper-v3';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
  '/assets/icons/icon.png',
  '/js/main.js',
  '/js/canvas.js',
  '/js/drawing.js',
  '/js/pages.js',
  '/js/state.js',
  '/js/storage.js',
  '/js/tabs.js',
  '/js/toolbar.js',
  '/js/pwa.js',
  '/pwa/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request).then(fetchRes => {
      return caches.open(CACHE_NAME).then(cache => { cache.put(event.request, fetchRes.clone()); return fetchRes; });
    })).catch(()=> caches.match('/index.html'))
  );
});
