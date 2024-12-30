import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPedidosAsync, actualizarEstadoPedidoAsync, eliminarPedidoAsync } from '../Slice/pedidoSlice';

const Pedidos = () => {
    const dispatch = useDispatch();
    const pedidos = useSelector((state) => state.pedidos.lista);
    const loading = useSelector((state) => state.pedidos.loading);

    useEffect(() => {
        console.log('Montando el componente Pedidos. Despachando fetchPedidosAsync.');
        dispatch(fetchPedidosAsync());
    }, [dispatch]);

    const handleCambiarEstado = async (pedido) => {
        if (pedido.status === 'Listo') {
            const confirmacion = window.confirm(`El pedido ${pedido.id} ya está listo. ¿Desea eliminarlo?`);
            if (confirmacion) {
                console.log(`Eliminando el pedido ${pedido.id}.`);
                await dispatch(eliminarPedidoAsync(pedido.id));
                console.log('Pedido eliminado. Volviendo a cargar pedidos.');
                dispatch(fetchPedidosAsync()); // Recarga la lista de pedidos
            }
            return;
        }

        const nuevosEstados = ['Pendiente', 'Procesando', 'Listo'];
        const estadoActual = pedido.status;
        const indiceActual = nuevosEstados.indexOf(estadoActual);
        const nuevoEstado = nuevosEstados[(indiceActual + 1) % nuevosEstados.length];

        console.log(`Cambiando estado del pedido ${pedido.id} a ${nuevoEstado}`);
        await dispatch(actualizarEstadoPedidoAsync({ id: pedido.id, nuevoEstado }));
    };

    console.log('Renderizando Pedidos. Estado actual de pedidos:', pedidos);

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
                                onClick={(event) => {
                                    event.stopPropagation();
                                    event.preventDefault();
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

export default Pedidos;
