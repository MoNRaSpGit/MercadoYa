import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import "../Css/Tarjetas.css";

const Tarjetas = ({ product, onEdit, onAddToCart, onDelete, showAdminButtons }) => {
  const [quantity, setQuantity] = useState(0); // Estado para manejar la cantidad del producto

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (quantity === 0) {
      setQuantity(1); // Inicializa la cantidad al agregar
      onAddToCart(product); // Ejecuta la acción de agregar al carrito
    }
  };

  const originalPrice = Number(product.price ?? 0);

  return (
    <div className="col-md-4 mb-4">
      <div className="custom-card">
        {/* Contenedor de la imagen */}
        <div className="custom-image-container">
          <img
            src={product.image || "https://via.placeholder.com/150"}
            className="custom-card-image"
            alt={product.name || "Producto"}
          />
        </div>

        {/* Contenido de la tarjeta */}
        <div className="custom-card-body">
          <h5 className="custom-card-title">{product.name || "Sin nombre"}</h5>
          <p className="custom-card-description">
            {product.description || "Descripción pendiente."}
          </p>
          <p className="custom-card-price">
            ${originalPrice.toFixed(2)}
          </p>

          {/* Botones */}
          <div className="custom-card-buttons">
            {showAdminButtons && (
              <>
                <button
                  className="custom-button primary"
                  onClick={() => onEdit(product)}
                >
                  Editar
                </button>
                <button
                  className="custom-button danger"
                  onClick={() => onDelete(product.id)}
                >
                  Eliminar
                </button>
              </>
            )}
            {quantity === 0 ? (
              <button
                className="custom-button agregar"
                onClick={handleAddToCart}
              >
                <FontAwesomeIcon icon={faShoppingCart} className="me-1" />
                Agregar
              </button>
            ) : (
              <div className="quantity-controls">
                <button
                  className="custom-button decrement"
                  onClick={handleDecrement}
                >
                  -
                </button>
                <span className="quantity-display">{quantity}</span>
                <button
                  className="custom-button increment"
                  onClick={handleIncrement}
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tarjetas;
