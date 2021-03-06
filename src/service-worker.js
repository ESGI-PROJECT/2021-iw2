console.log('Service worker loaded !');

const cacheVersion = 'v2';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheVersion)
      .then((cache) => {
        return cache.addAll([
          '/',
          '/app.js',
          '/views/news-home.js',
          '/components/Card/news-card.js',
          '/views/news-read.js',
        ]);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request)
            .then((response) => {
              const responseClone = response.clone();
              caches.open(cacheVersion)
                .then((cache) => {
                  cache.put(event.request, responseClone);
                })
              
              return response;
            });
        })
        .catch(() => {
          return caches.match('index.html');
        })
    );
  }
});
