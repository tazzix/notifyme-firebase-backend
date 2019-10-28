'use strict';

console.log('... Service Worker File Running ...');

const cacheName = 'notifymepwa-v1';
const staticAssets = [
'/',
'/images/icon-192x192.png',
'/css/reset.min.css',
'/css/style.css',
'/css/softkey.css',
'/js/index.js'
];

self.addEventListener('install', async function () {
    const cache = await caches.open(cacheName);
    cache.addAll(staticAssets);
});

// Activate event
// Be sure to call self.clients.claim()
self.addEventListener('activate', function(event) {
  // `claim()` sets this worker as the active worker for all clients that
  // match the workers scope and triggers an `oncontrollerchange` event for
  // the clients.
  return self.clients.claim();
});
/*
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  return cachedResponse || fetch(request);
}

async function networkFirst(request) {
  const dynamicCache = await caches.open('news-dynamic');
  try {
    const networkResponse = await fetch(request);
    dynamicCache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (err) {
    const cachedResponse = await dynamicCache.match(request);
    return cachedResponse || await caches.match('./fallback.json');
  }
}
*/

// Listner for Push Notification
self.addEventListener('push', function (event) {
  console.log('Received a push message', event);

  var notification = event.data.json().notification
  console.log(notification)
  var title = notification.title || 'Yay a message.';
  var body = notification.body || 'We have received a push message.';
  var click_action = notification.click_action;
  var icon = '/images/icon-192x192.png';
  // var tag = 'simple-push-demo-notification-tag';

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: icon,
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
        redirectUrl : click_action
      },
      timeout : 1000
      // tag: tag
    })
  );
});

// on Notification Click do whatever you want...
self.addEventListener('notificationclick', function(event) {
  var url = event.notification.data.redirectUrl;
  console.log('On notification click: ', event.notification);
  // Android doesn’t close the notification when you click on it
  // See: http://crbug.com/463146
  event.notification.close();
  event.waitUntil(
          clients.matchAll({includeUncontrolled: true, type: 'window'}).then( windowClients => {
          for (var i = 0; i < windowClients.length; i++) {
              var client = windowClients[i];
              if (client.url === url && 'focus' in client) {
                  return client.focus();
              }
          }
          if (clients.openWindow) {
              return clients.openWindow(url);
          }
      })
  );
}); 