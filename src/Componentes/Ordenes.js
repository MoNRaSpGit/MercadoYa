import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPedidosAsync,
  actualizarEstadoPedidoAsync,
  eliminarPedidoAsync,
} from '../Slice/pedidoSlice';

const Ordenes = () => {
  const dispatch = useDispatch();
  const pedidos = useSelector((state) => state.pedidos.lista); // Lista de pedidos desde el store
  const loading = useSelector((state) => state.pedidos.loading); // Solo para la carga inicial de pedidos
  const error = useSelector((state) => state.pedidos.error); // Error global de pedidos

  // Carga inicial de pedidos
  useEffect(() => {
    console.log('Ordenes: Montando componente. Dispatch fetchPedidosAsync');
    dispatch(fetchPedidosAsync())
      .unwrap()
      .then(() => console.log('Ordenes: fetchPedidosAsync completado'))
      .catch((err) => console.error('Ordenes: fetchPedidosAsync error', err));
  }, [dispatch]);

  // Función para cambiar el estado de un pedido
  const handleCambiarEstado = async (pedido) => {
    console.log('Ordenes: handleCambiarEstado para pedido', pedido);

    const nuevosEstados = ['Pendiente', 'Procesando', 'Listo'];
    const idxActual = nuevosEstados.indexOf(pedido.status);
    const nuevoEstado = nuevosEstados[(idxActual + 1) % nuevosEstados.length];

    try {
      console.log(`Ordenes: Cambiando estado del pedido ${pedido.id} a ${nuevoEstado}`);
      await dispatch(actualizarEstadoPedidoAsync({ id: pedido.id, nuevoEstado })).unwrap();
      console.log('Ordenes: Estado actualizado con éxito');
    } catch (error) {
      console.error('Ordenes: Error actualizando estado', error);
    }
  };

  // Función para eliminar un pedido
  const handleEliminarPedido = async (pedidoId) => {
    const confirmacion = window.confirm(`¿Está seguro de eliminar el pedido ${pedidoId}?`);
    if (!confirmacion) return;

    try {
      console.log(`Ordenes: Eliminando pedido ${pedidoId}`);
      await dispatch(eliminarPedidoAsync(pedidoId)).unwrap();
      console.log('Ordenes: Pedido eliminado con éxito');
    } catch (error) {
      console.error('Ordenes: Error eliminando pedido', error);
    }
  };

  console.log('Ordenes: Render', { loading, pedidos });

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Lista de Órdenes</h2>

      {loading ? (
        <p className="text-center">Cargando órdenes...</p>
      ) : error ? (
        <p className="text-center text-danger">
          Error al cargar órdenes: {error}
        </p>
      ) : pedidos.length === 0 ? (
        <p className="text-center">No hay órdenes confirmadas aún.</p>
      ) : (
        <ul className="list-group">
          {pedidos.map((pedido) => (
            <li key={pedido.id} className="list-group-item">
              <h5>Orden ID: {pedido.id}</h5>
              <p>Fecha: {new Date(pedido.created_at).toLocaleString()}</p>
              <p>
                Estado:{' '}
                <span
                  style={{
                    padding: '5px 10px',
                    borderRadius: '5px',
                    color: '#fff',
                    backgroundColor:
                      pedido.status === 'Pendiente'
                        ? '#d9534f'
                        : pedido.status === 'Procesando'
                        ? '#f0ad4e'
                        : '#5cb85c',
                    cursor: 'pointer',
                    display: 'inline-block',
                  }}
                  onClick={() => handleCambiarEstado(pedido)} // Cambiar estado al hacer clic
                >
                  {pedido.status}
                </span>
              </p>
              <button
                type="button"
                className="btn btn-danger mt-2"
                onClick={() => handleEliminarPedido(pedido.id)}
              >
                Eliminar Orden
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Ordenes;
