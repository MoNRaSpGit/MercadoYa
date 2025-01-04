import React from "react";
import "../Css/Tarjetas.css"; // Archivo CSS para estilos personalizados

const Tarjetas = ({ product, onEdit, onAddToCart }) => {
  return (
    <div className="col-md-3 mb-4">
      <div className="card h-100 shadow-sm">
        <div className="image-container">
          <img
            src={product.image || "https://via.placeholder.com/150"}
            className="card-img-top"
            alt={product.name || "Producto nuevo"}
          />
        </div>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{product.name || "Nuevo Producto"}</h5>
          <p className="card-text">
            {product.description || "Descripción pendiente."}
          </p>
          <p className="card-text fw-bold">
            ${product.price ? parseFloat(product.price).toFixed(2) : "0.00"}
          </p>
          {onEdit && (
            <button
              className="btn btn-primary mt-auto"
              onClick={() => onEdit(product)}
            >
              Editar
            </button>
          )}
          {onAddToCart && (
            <button
              className="btn btn-success mt-auto"
              onClick={() => onAddToCart(product)}
            >
              Agregar al Carrito
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tarjetas;
