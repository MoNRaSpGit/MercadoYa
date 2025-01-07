import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actualizarEstadoPedidoAsync } from '../Slice/pedidoSlice';

const ListaOrdenes = () => {
  const dispatch = useDispatch();

  // Obtener el estado global de pedidos desde Redux
  const pedidos = useSelector((state) => [...state.pedidos.lista]); // Crear una nueva referencia para asegurar la actualización
  const loading = useSelector((state) => state.pedidos.loading);
  const error = useSelector((state) => state.pedidos.error);

  // Función para manejar el cambio de estado
  const handleCambiarEstado = async (pedido) => {
    const nuevosEstados = ['Pendiente', 'Procesando', 'Listo'];
    const idxActual = nuevosEstados.indexOf(pedido.status);
    const nuevoEstado = nuevosEstados[(idxActual + 1) % nuevosEstados.length];

    try {
      console.log(`Cambiando estado del pedido ${pedido.id} a ${nuevoEstado}`);
      await dispatch(actualizarEstadoPedidoAsync({ id: pedido.id, nuevoEstado })).unwrap();
      console.log(`Estado del pedido ${pedido.id} actualizado a ${nuevoEstado}`);
    } catch (error) {
      console.error('Error al actualizar el estado del pedido:', error);
    }
  };

  // Log para verificar los pedidos cada vez que se actualicen
  useEffect(() => {
    console.log('Pedidos detectados en ListaOrdenes:', pedidos);
  }, [pedidos]);

  // Renderización del componente
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListaOrdenes;
