import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { añadirPedido, actualizarEstadoPedido, fetchPedidosAsync } from "../Slice/pedidoSlice"; // IMPORTA fetchPedidosAsync

const SOCKET_URL = "https://mercadoya-3.onrender.com"; // Cambia la URL según tu entorno

// https://mercadoya-3.onrender.com
// http://localhost:3001
 

const WebSocketProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("WebSocketProvider: Conectando al servidor de WebSockets...");
    const socket = io(SOCKET_URL);

    // Evento: Conexión establecida
    socket.on("connect", () => {
      console.log("WebSocket conectado:", socket.id);
    });

    // Evento: Nueva orden creada
    socket.on("new_order", (order) => {
      console.log("WebSocket: Nueva orden recibida:", order);

      // Verificar si la orden tiene productos
      if (!order.productos || order.productos.length === 0) {
        console.warn("Orden incompleta. Forzando recarga de pedidos.");
        dispatch(fetchPedidosAsync()); // Acción para recargar pedidos
      } else {
        dispatch(añadirPedido(order));
      }
    });

    // Evento: Actualización de estado de una orden
    socket.on("order_status_updated", (data) => {
      console.log("WebSocket: Estado de pedido actualizado:", data);
      dispatch(actualizarEstadoPedido(data)); // Acción para actualizar el estado en el store global
      window.dispatchEvent(new Event("real-time-update")); // Dispara el evento personalizado
    });

    // Evento: Desconexión
    socket.on("disconnect", () => {
      console.log("WebSocket desconectado");
    });

    // Cleanup al desmontar
    return () => {
      socket.disconnect();
      console.log("WebSocketProvider: Conexión cerrada.");
    };
  }, [dispatch]);

  return <>{children}</>;
};

export default WebSocketProvider;
