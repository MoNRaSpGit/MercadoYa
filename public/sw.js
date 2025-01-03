import notiSound from "../src/son/notiNueva.mp3"; // Importa el archivo de sonido


self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  
  // Mostrar la notificación
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

  // Reproducir sonido al recibir la notificación
  const audio = new Audio(notiSound); // Ruta relativa del sonido
  audio.play().catch((err) => console.error('Error reproduciendo el sonido:', err));
});



