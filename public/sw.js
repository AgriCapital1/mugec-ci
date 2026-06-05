// ANZRBO Service Worker — neutralisation définitive.
// Un ancien cache pouvait resservir une page de build noire/obsolète en preview ou en production.
// Ce fichier reste volontairement présent pour que les anciens navigateurs reçoivent la mise à jour,
// suppriment tous les caches du site, puis désinscrivent le service worker.

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      await Promise.all(clients.map((client) => client.navigate(client.url)));
    })(),
  );
});

self.addEventListener("fetch", () => {
  // Ne rien intercepter : toujours laisser le réseau / Vercel servir la dernière version.
});
