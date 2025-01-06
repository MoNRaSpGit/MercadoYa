import React from "react";
import "../Css/Tarjetas.css";

const Tarjetas = ({ product, onEdit, onAddToCart, onDelete }) => {
  return (
    <div className="col-md-3 mb-4">
      <div className="card h-100 shadow-sm">
        <div className="image-container">
          <img
            src={product.image || "https://via.placeholder.com/150"}
            className="card-img-top"
            alt={product.name || "Producto"}
          />
        </div>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{product.name || "Sin nombre"}</h5>
          <p className="card-text">{product.description || "Descripción pendiente."}</p>
          <p className="card-text fw-bold">${product.price || "0.00"}</p>
          <button
            className="btn btn-primary mt-auto"
            onClick={() => onEdit(product)}
          >
            Editar
          </button>
          <button
            className="btn btn-danger mt-2"
            onClick={() => onDelete(product.id)}
          >
            Eliminar
          </button>
          <button
            className="btn btn-success mt-2"
            onClick={() => onAddToCart(product)}
          >
            Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tarjetas;
