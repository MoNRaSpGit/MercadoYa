import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { añadirPedido, actualizarEstadoPedido } from "../Slice/pedidoSlice";

const SOCKET_URL = "http://localhost:3001"; // Cambia la URL según tu entorno

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
      dispatch(añadirPedido(order)); // Acción para agregar la orden al store global
    });

    // Evento: Actualización de estado de una orden
    socket.on("order_status_updated", (data) => {
      console.log("WebSocket: Estado de pedido actualizado:", data);
      dispatch(actualizarEstadoPedido(data)); // Acción para actualizar el estado en el store global
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
