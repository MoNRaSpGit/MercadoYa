self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  self.registration.showNotification(data.title || "Notificación", {
    body: data.message || "Tienes un mensaje nuevo",
    icon: "/logo192.png", // Cambia el ícono si necesitas
    actions: [
      { action: "open", title: "Abrir aplicación" },
      { action: "dismiss", title: "Descartar" },
    ],
  });
});
