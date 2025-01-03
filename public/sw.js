self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};

  const title = data.title || "Notificación";
  const options = {
    body: data.message || "Tienes un mensaje nuevo.",
    icon: "/logo192.png", // Ícono de la notificación
    badge: "/badge-icon.png", // Ícono pequeño para la barra de estado
    actions: [
      { action: "open", title: "Abrir aplicación" }, // Acción para abrir la app
      { action: "dismiss", title: "Descartar" }, // Acción para descartar
    ],
    vibrate: [200, 100, 200], // Vibración para llamar la atención
    requireInteraction: true, // Mantiene la notificación hasta que el usuario interactúe
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Manejo de acciones de la notificación
self.addEventListener("notificationclick", (event) => {
  event.notification.close(); // Cierra la notificación

  if (event.action === "open") {
    // Abrir la aplicación
    clients.openWindow("/");
  } else if (event.action === "dismiss") {
    // Solo descarta
    console.log("Notificación descartada.");
  } else {
    // Acción predeterminada
    clients.openWindow("/");
  }
});
