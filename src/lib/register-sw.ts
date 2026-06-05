// Cache offline désactivé : évite définitivement les écrans noirs dus à une ancienne build.
export function registerServiceWorker() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;

  navigator.serviceWorker
    .getRegistrations?.()
    .then((regs) => regs.forEach((registration) => registration.unregister()))
    .catch(() => {});
}
