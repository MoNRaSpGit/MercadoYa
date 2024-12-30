import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
//import { confirmarPedido } from '../Slice/pedidoSlice';
import { useNavigate } from 'react-router-dom';
import { confirmarPedidoAsync } from '../Slice/pedidoSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.pedidos.loading);


  const { cart } = useSelector((state) => state.products);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cashGiven, setCashGiven] = useState('');
  const [change, setChange] = useState(0);

  // Calcula el total del carrito
  const total = cart.reduce((acc, product) => acc + parseFloat(product.price), 0);


  const handleConfirmarCompra = () => {
    if (cart.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    const nuevoPedido = {
      userId: 1, // Cambia esto por el ID real del usuario autenticado
      products: cart.map((producto) => ({
        id: producto.id,
        quantity: 1, // Cambia según sea necesario
        price: producto.price,
      })),
    };

    //console.log('Despachando confirmarPedidoAsync con:', nuevoPedido);
    dispatch(confirmarPedidoAsync(nuevoPedido));
  };

  const handlePaymentChange = (event) => {
    const method = event.target.value;
    setPaymentMethod(method);
    setCashGiven('');
    setChange(0); // Reinicia valores si se cambia el método de pago
  };

  const handleCashChange = (event) => {
    const value = parseFloat(event.target.value) || 0;
    setCashGiven(value);
    setChange(value - total);
  };

  if (cart.length === 0) {
    return (
      <div className="text-center mt-4">
        <p>Tu carrito está vacío.</p>
        <Link to="/" className="btn btn-primary">
          Volver a la Lista de Productos
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Carrito de Compras</h2>

      {/* Productos en el carrito */}
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((product, index) => (
              <tr key={index}>
                <td>{product.name}</td>
                <td>${parseFloat(product.price).toFixed(2)}</td>
                <td>1</td>
                <td>${parseFloat(product.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total */}
      <div className="text-end mt-3">
        <h4>Total: ${total.toFixed(2)}</h4>
      </div>

      {/* Selección del método de pago */}
      <div className="mt-4">
        <h5>Método de Pago</h5>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="paymentMethod"
            id="transfer"
            value="transfer"
            onChange={handlePaymentChange}
          />
          <label className="form-check-label" htmlFor="transfer">
            Transferencia
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="paymentMethod"
            id="cash"
            value="cash"
            onChange={handlePaymentChange}
          />
          <label className="form-check-label" htmlFor="cash">
            Efectivo
          </label>
        </div>
      </div>

      {/* Detalles del Método de Pago */}
      <div className="mt-4">
        {paymentMethod === 'transfer' && (
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Datos para Transferencia</h5>
              <p className="card-text">Tarjeta Prex</p>
              <p className="card-text">Número de Cuenta: 123456</p>
              <p className="card-text">Propietario: Juan José</p>
            </div>
          </div>
        )}

        {paymentMethod === 'cash' && (
          <div className="mt-4">
            <label htmlFor="cashGiven" className="form-label">
              Ingrese el monto entregado:
            </label>
            <input
              type="number"
              className="form-control"
              id="cashGiven"
              value={cashGiven}
              onChange={handleCashChange}
              placeholder="Monto entregado"
            />
            {cashGiven > 0 && (
              <div className="mt-3">
                <h5>
                  {change >= 0
                    ? `Su cambio será de $${change.toFixed(2)}`
                    : `Falta $${Math.abs(change).toFixed(2)} para completar el total`}
                </h5>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Botones de Confirmación y Volver */}
      <div className="text-center mt-4">
      <button
        onClick={handleConfirmarCompra}
        className="btn btn-success"
        disabled={loading}
      >
        {loading ? 'Confirmando...' : 'Confirmar Compra'}
      </button>
      <button onClick={() => navigate('/pedidos')} className="btn btn-primary mt-3">
        Ver Pedidos
      </button>
        <Link to="/" className="btn btn-secondary btn-lg">
          Volver a la Lista de Productos
        </Link>
      </div>
    </div>
  );
};

export default Cart;
