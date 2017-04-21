this.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('v2').then(function (cache) {
      return cache.addAll([
        '/',
        '/index.html',
        // '/offline.html',
        '/bundle.js',
        '/style.css',
        '/normalize.css',
        '/manifest.json',
        '/favicon.ico',
        // 'https://use.fontawesome.com/1d66001ffc.js'
      ]);
    })
  );
});

// to serve cashed files 

this.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    }).catch(error => (
      console.log("this is error ", error)
    ))
  );
});


// to show offline.html on http request

// self.addEventListener('fetch', function (event) {
//   // Only fall back for HTML documents.
//   var request = event.request;
//   // && request.headers.get('accept').includes('text/html')
//   if (request.method === 'GET') {
//     // `fetch()` will use the cache when possible, to this examples
//     // depends on cache-busting URL parameter to avoid the cache.
//     event.respondWith(
//       fetch(request).catch(function (error) {
//         // `fetch()` throws an exception when the server is unreachable but not
//         // for valid HTTP responses, even `4xx` or `5xx` range.
//         return caches.open('offline').then(function (cache) {
//           return cache.match('offline.html');
//         });
//       })
//     );
//   }
//   // Any other handlers come here. Without calls to `event.respondWith()` the
//   // request will be handled without the ServiceWorker.
// });
