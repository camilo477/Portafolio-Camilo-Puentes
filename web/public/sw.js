// Retire the Hub worker previously registered on this origin.
// New portfolio visitors do not register a service worker.
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter((name) => name.startsWith('camiska-hub-static-'))
          .map((name) => caches.delete(name)),
      );
      await self.registration.unregister();
    })(),
  );
});
