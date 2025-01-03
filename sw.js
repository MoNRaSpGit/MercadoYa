// Actualización de Service Worker: Versión 2.0
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  self.registration.showNotification(data.title || "Notificación", {
    body: data.message || "Tienes un mensaje nuevo",
    icon: "/logo192.png",
    actions: [
      { action: "open", title: "Abrir aplicación" },
      { action: "dismiss", title: "Descartar" },
    ],
    requireInteraction: true,
    vibrate: [200, 100, 200],
  });
});
