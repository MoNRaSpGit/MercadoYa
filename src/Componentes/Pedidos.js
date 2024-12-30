import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPedidosAsync, actualizarEstadoPedidoAsync } from '../Slice/pedidoSlice';

const Pedidos = () => {
    const dispatch = useDispatch();
    const pedidos = useSelector((state) => state.pedidos.lista);
    const loading = useSelector((state) => state.pedidos.loading);

    useEffect(() => {
        // console.log('Montando el componente Pedidos. Despachando fetchPedidosAsync.');
        dispatch(fetchPedidosAsync());
        return () => {
            // console.log('Desmontando el componente Pedidos.');
        };
    }, [dispatch]);

    // Log para verificar los pedidos que llegan al componente
    //console.log('Soy los pedidos en el comp pedidos:', pedidos);

    const handleCambiarEstado = (pedido) => {
        const nuevosEstados = ['Pendiente', 'Procesando', 'Listo'];
        const estadoActual = pedido.status;
        const indiceActual = nuevosEstados.indexOf(estadoActual);
        const nuevoEstado = nuevosEstados[(indiceActual + 1) % nuevosEstados.length];

        // console.log(`Cambiando estado del pedido ${pedido.id} a ${nuevoEstado}`);
        dispatch(actualizarEstadoPedidoAsync({ id: pedido.id, nuevoEstado }));
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Lista de Pedidos</h2>
            {loading ? (
                <p className="text-center">Cargando pedidos...</p>
            ) : pedidos.length === 0 ? (
                <p className="text-center">No hay pedidos confirmados aún.</p>
            ) : (
                <ul className="list-group">
                    {pedidos.map((pedido) => (
                        <li key={pedido.id} className="list-group-item">
                            <h5>Pedido ID: {pedido.id}</h5>
                            <p>Fecha: {new Date(pedido.created_at).toLocaleString()}</p>
                            <p>Estado:
                                <span
                                    className={`badge ${pedido.status === 'Pendiente' ? 'bg-danger' :
                                        pedido.status === 'Procesando' ? 'bg-warning' :
                                            'bg-success'} ml-2`}
                                >
                                    {pedido.status}
                                </span>
                            </p>
                            <button
                                type="button"
                                onClick={() => handleCambiarEstado(pedido)} // Directamente pasa la función sin event.preventDefault
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

export default Pedidos;
