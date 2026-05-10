self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

// A fetch handler is required for the browser to consider the app "installable"
self.addEventListener('fetch', (e) => {
  // Let the browser handle the request normally
  e.respondWith(fetch(e.request).catch(() => new Response("Offline")));
});
