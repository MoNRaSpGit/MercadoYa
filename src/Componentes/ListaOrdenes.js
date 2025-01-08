import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actualizarEstadoPedidoAsync } from "../Slice/pedidoSlice";

const ListaOrdenes = () => {
  const dispatch = useDispatch();
  const pedidos = useSelector((state) => state.pedidos.lista);
  const loading = useSelector((state) => state.pedidos.loading);
  const error = useSelector((state) => state.pedidos.error);

  // Función para calcular el total de productos en una orden
  const calcularTotal = (productos = []) => {
    return productos.reduce((total, producto) => {
      return total + producto.price * producto.quantity;
    }, 0);
  };

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
              <h5>Pedido número {pedido.id}</h5>
              <p>Productos:</p>
              <ul>
                {(pedido.productos || []).map((producto, index) => (
                  <li key={index}>
                    {producto.name} - Cantidad: {producto.quantity} - Precio: ${producto.price}
                  </li>
                ))}
              </ul>
              <p><strong>Total a pagar:</strong> ${calcularTotal(pedido.productos).toFixed(2)}</p>
              <p>
                <strong>Estado:</strong>{" "}
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
