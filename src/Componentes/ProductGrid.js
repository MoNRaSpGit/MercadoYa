import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../Slice/productoSlice';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import '../Css/ProductGrid.css';

const ProductGrid = () => {

 //REACT_APP_API_URL_LOCAL=http://localhost:3001
 //REACT_APP_API_URL_PRODUCTION=https://mercadoya-back.onrender.com

 const API_URL = process.env.REACT_APP_API_URL_PRODUCTION;


  const dispatch = useDispatch();
  const { items: products, cart, loading, error } = useSelector((state) => state.products);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleSendNotification = async () => {
    try {
      const response = await fetch(`${API_URL}/send-notification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "¡Nueva Oferta!",
          message: "Descubre nuestras últimas ofertas en el supermercado",
        }),
      });

      if (response.ok) {
        console.log("Notificación enviada con éxito");
        alert("Notificación enviada a todos los usuarios");
      } else {
        console.error("Error al enviar la notificación");
        alert("Hubo un error al enviar la notificación");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) {
    return <div className="text-center">Cargando productos...</div>;
  }

  if (error) {
    return <div className="text-center text-danger">Error: {error}</div>;
  }

  if (products.length === 0) {
    return <div className="text-center">No hay productos disponibles.</div>;
  }

  return (
    <div className="container mt-4">
      {/* Botón para enviar notificaciones */}
      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-success" onClick={handleSendNotification}>
          Enviar Notificación a Todos
        </button>
        <Link to="/cart" className="btn btn-outline-primary position-relative">
          <FontAwesomeIcon icon={faShoppingCart} size="lg" />
          {cart.length > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {cart.length}
            </span>
          )}
        </Link>
      </div>

      {/* Productos */}
      <h2 className="text-center mb-4">Productos del Supermercado</h2>
      <div className="row">
        {products.map((product) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={product.id}>
            <div className="card h-100 shadow-sm">
              <img
                src={product.image}
                className="card-img-top"
                alt={product.name}
                style={{ height: '150px', objectFit: 'cover' }}
              />
              <div className="card-body text-center">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">${parseFloat(product.price).toFixed(2)}</p>
                <button
                  className="btn btn-primary"
                  onClick={() => handleAddToCart(product)}
                >
                  Agregar al Carrito
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
