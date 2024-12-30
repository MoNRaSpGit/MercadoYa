import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, addToCart } from '../Slice/productoSlice';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import '../Css/ProductGrid.css';

const ProductGrid = () => {
 

  const dispatch = useDispatch();
  const { items: products, cart, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
   
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAddToCart = (product) => {
    
    dispatch(addToCart(product));
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
      {/* Carrito */}
      <div className="d-flex justify-content-end mb-3">
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
