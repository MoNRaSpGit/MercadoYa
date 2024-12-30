import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPedidosAsync,
  actualizarEstadoPedidoAsync,
  eliminarPedidoAsync,
} from '../Slice/pedidoSlice';

const Ordenes = () => {
  const dispatch = useDispatch();
  const pedidos = useSelector((state) => state.pedidos.lista);
  const loading = useSelector((state) => state.pedidos.loading);

  // Carga inicial
  useEffect(() => {
    console.log('Ordenes: Montando componente. Dispatch fetchPedidosAsync');
    dispatch(fetchPedidosAsync())
      .unwrap()
      .then(() => console.log('Ordenes: fetchPedidosAsync completado'))
      .catch((err) => console.error('Ordenes: fetchPedidosAsync error', err));
  }, [dispatch]);

  // Cambiar estado o eliminar
  const handleCambiarEstado = async (pedido) => {
    console.log('Ordenes: handleCambiarEstado para pedido', pedido);

    // Si está "Listo", preguntar confirmación para eliminar
    if (pedido.status === 'Listo') {
      const confirmacion = window.confirm(`El pedido ${pedido.id} está listo. ¿Desea eliminarlo?`);
      if (confirmacion) {
        try {
            await dispatch(eliminarPedidoAsync(pedido.id)).unwrap();
            console.log('Ordenes: Pedido eliminado con éxito');
          } catch (error) {
            console.error('Ordenes: Error eliminando pedido', error);
          }
      }
      return;
    }

    // Caso normal: cambiar estado
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

  console.log('Ordenes: Render', { loading, pedidos });

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Lista de Ordenes</h2>
      {loading ? (
        <p className="text-center">Cargando ordenes...</p>
      ) : pedidos.length === 0 ? (
        <p className="text-center">No hay ordenes confirmadas aún.</p>
      ) : (
        <ul className="list-group">
          {pedidos.map((pedido) => (
            <li key={pedido.id} className="list-group-item">
              <h5>Orden ID: {pedido.id}</h5>
              <p>Fecha: {new Date(pedido.created_at).toLocaleString()}</p>
              <p>
                Estado:{' '}
                <span
                  className={`badge ${
                    pedido.status === 'Pendiente'
                      ? 'bg-danger'
                      : pedido.status === 'Procesando'
                      ? 'bg-warning'
                      : 'bg-success'
                  } ml-2`}
                >
                  {pedido.status}
                </span>
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCambiarEstado(pedido);
                }}
                className="btn btn-primary mt-2"
              >
                Cambiar Estado
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Ordenes;
