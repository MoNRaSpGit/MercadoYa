import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import "../Css/Tarjetas.css";

const Tarjetas = ({ product, onEdit, onAddToCart, onDelete, showAdminButtons }) => {
  // 1. Verificar si el producto tiene descuento
  const hasDiscount = product.discount && product.discount > 0;

  // 2. Calcular precios
  const originalPrice = Number(product.price ?? 0);
  const discountedPrice = hasDiscount
    ? (originalPrice * (1 - product.discount / 100)).toFixed(2)
    : originalPrice.toFixed(2);

  return (
    <div className="col-md-4 mb-4">
      <div className="card card-product h-100 shadow border-0 position-relative">
        
        {/* Contenedor de imagen con badge de descuento */}
        <div className="image-container position-relative">
          {hasDiscount && (
            <div className="discount-badge">-{product.discount}%</div>
          )}
          <img
            src={product.image || "https://via.placeholder.com/150"}
            className="card-img-top"
            alt={product.name || "Producto"}
          />
        </div>

        {/* Contenido de la tarjeta */}
        <div className="card-body d-flex flex-column">
          <h5 className="card-title text-truncate">{product.name || "Sin nombre"}</h5>
          <p className="card-text text-muted small">
            {product.description || "Descripción pendiente."}
          </p>

          {/* Mostrar precios */}
          <p className="card-text">
            {hasDiscount ? (
              <>
                <span className="text-muted text-decoration-line-through me-2">
                  ${originalPrice.toFixed(2)}
                </span>
                <span className="text-success fw-bold">
                  ${discountedPrice}
                </span>
              </>
            ) : (
              <span className="text-success fw-bold">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </p>

          {/* Botones */}
          <div className="mt-auto d-flex gap-2">
            {showAdminButtons && (
              <>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => onEdit(product)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => onDelete(product.id)}
                >
                  Eliminar
                </button>
              </>
            )}
            <button
              className="btn btn-sm btn-agregar"
              onClick={() => onAddToCart(product)}
            >
              <FontAwesomeIcon icon={faShoppingCart} className="me-1" />
              Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tarjetas;
