import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actualizarEstadoPedidoAsync } from "../Slice/pedidoSlice";

const ListaOrdenes = () => {
  const dispatch = useDispatch();
  const pedidos = useSelector((state) => state.pedidos.lista);
  const loading = useSelector((state) => state.pedidos.loading);
  const error = useSelector((state) => state.pedidos.error);
  const [refresh, setRefresh] = useState(false); // Estado para forzar renderización

  // Función para manejar el cambio de estado
  const handleCambiarEstado = async (pedido) => {
    const nuevosEstados = ["Pendiente", "Procesando", "Listo"];
    const idxActual = nuevosEstados.indexOf(pedido.status);
    const nuevoEstado = nuevosEstados[(idxActual + 1) % nuevosEstados.length];

    try {
      console.log(`ListaOrdenes: Cambiando estado del pedido ${pedido.id} a ${nuevoEstado}`);
      await dispatch(actualizarEstadoPedidoAsync({ id: pedido.id, nuevoEstado })).unwrap();
      console.log("ListaOrdenes: Estado actualizado con éxito");
    } catch (error) {
      console.error("ListaOrdenes: Error al actualizar estado", error);
    }
  };

  useEffect(() => {
    // Escuchar actualizaciones en tiempo real
    const handleRealTimeUpdate = () => {
      console.log("ListaOrdenes: Cambio detectado, forzando actualización");
      setRefresh((prev) => !prev); // Cambia el estado para forzar renderizado
    };

    window.addEventListener("real-time-update", handleRealTimeUpdate); // Evento personalizado

    return () => {
      window.removeEventListener("real-time-update", handleRealTimeUpdate);
    };
  }, []);

  useEffect(() => {
    console.log("ListaOrdenes: Pedidos actualizados:", pedidos);
  }, [pedidos]);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Lista de Órdenes</h2>

      {loading ? (
        <p className="text-center">Cargando órdenes...</p>
      ) : error ? (
        <p className="text-center text-danger">Error al cargar órdenes: {error}</p>
      ) : pedidos.length === 0 ? (
        <p className="text-center">No hay órdenes confirmadas aún.</p>
      ) : (
        <ul className="list-group">
          {pedidos.map((pedido) => (
            <li key={pedido.id} className="list-group-item">
              <h5>Orden ID: {pedido.id}</h5>
              <p>Fecha: {new Date(pedido.created_at).toLocaleString()}</p>
              <p>
                Estado:{" "}
                <span
                  style={{
                    padding: "5px 10px",
                    borderRadius: "5px",
                    color: "#fff",
                    backgroundColor:
                      pedido.status === "Pendiente"
                        ? "#d9534f"
                        : pedido.status === "Procesando"
                        ? "#f0ad4e"
                        : "#5cb85c",
                    cursor: "pointer",
                    display: "inline-block",
                  }}
                  onClick={() => handleCambiarEstado(pedido)}
                >
                  {pedido.status}
                </span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListaOrdenes;
