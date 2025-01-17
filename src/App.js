import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import store from "./Store/store"; // Importar el store
import { fetchProducts } from "./Slice/productoSlice"; // Acción para cargar productos
import { fetchPedidosAsync } from "./Slice/pedidoSlice"; // Acción para cargar órdenes
import Login from "./Componentes/Login";
import Register from "./Componentes/Register";
import Homee from "./Componentes/Homee";
import ProductGrid from "./Componentes/ProductGrid";
import Cart from "./Componentes/Cart";
import ListaOrdenes from "./Componentes/ListaOrdenes"; // Reemplazamos por el nuevo componente
import LaserScanner from "./Componentes/CardPaymentForm";
import WebSocketProvider from "./Componentes/WebSocketProvider"; // Importar el WebSocketProvider
import { ToastContainer } from "react-toastify";



const publicVapidKey = "BHbacXlHjFUevRaZ4Y0G58ELSjPHf3jAITfhNoxJEKzMCY8-SGCZQNtkGdOU91ozHDSd9kW8me0k9RhAiSESmRU";

const AppWrapper = () => {
  const API_URL = process.env.REACT_APP_API_URL_PRODUCTION;;
  //REACT_APP_API_URL_PRODUCTION;
  //REACT_APP_API_URL_LOCA
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("App: Iniciando aplicación. Cargando productos y órdenes...");
    dispatch(fetchProducts())
      .unwrap()
      .then(() => console.log("App: Productos cargados con éxito"))
      .catch((err) => console.error("App: Error al cargar productos", err));

    dispatch(fetchPedidosAsync())
      .unwrap()
      .then(() => console.log("App: Órdenes cargadas con éxito"))
      .catch((err) => console.error("App: Error al cargar órdenes", err));

    // Registrar el Service Worker
    const registerServiceWorker = async () => {
      if ("serviceWorker" in navigator) {
        try {
          console.log("Intentando registrar el Service Worker...");
          const registration = await navigator.serviceWorker.register("/MercadoYa/sw.js");

          console.log("Service Worker registrado con éxito:", registration);

          const permission = await Notification.requestPermission();
          if (permission !== "granted") {
            console.warn("Permiso de notificaciones denegado.");
            return;
          }

          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
          });

          await fetch(`${API_URL}/subscribe`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // Incluye cookies y credenciales
            body: JSON.stringify(subscription),
          });

          console.log("Suscripción registrada con éxito:", subscription);
        } catch (error) {
          console.error("Error al registrar el Service Worker o suscripción:", error);
        }
      } else {
        console.warn("El navegador no soporta Service Workers.");
      }
    };


    registerServiceWorker();

    // Escuchar mensajes del Service Worker para reproducir sonido
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data && event.data.type === "playSound") {
        const audio = new Audio("/MercadoYa/notiNueva.mp3");
        audio.play().catch((err) => console.error("Error al reproducir el sonido:", err));
      }
    });
  }, [dispatch]);

  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Homee />} />
      <Route path="/products" element={<ProductGrid />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/ordenes" element={<ListaOrdenes />} /> {/* Cambiado a ListaOrdenes */}
      <Route path="/laser-scanner" element={<LaserScanner />} />
      <Route path="*" element={<div>404 - Página no encontrada</div>} />
    </Routes>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <WebSocketProvider>
        <Router basename="/MercadoYa">
          <AppWrapper />
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover
          />
        </Router>
      </WebSocketProvider>
    </Provider>
  );
};

export default App;
