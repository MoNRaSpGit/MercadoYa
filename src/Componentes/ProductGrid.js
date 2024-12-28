import React from "react";
import "../Css/ProductGrid.css"; // Archivo CSS para personalización (opcional)

// Lista de productos
const products = [
  { id: 1, name: "Pan", price: 1.5, image: "https://via.placeholder.com/150" },
  { id: 2, name: "Leche", price: 2.0, image: "https://via.placeholder.com/150" },
  { id: 3, name: "Huevos", price: 3.0, image: "https://via.placeholder.com/150" },
  { id: 4, name: "Arroz", price: 1.2, image: "https://via.placeholder.com/150" },
  { id: 5, name: "Carne", price: 10.5, image: "https://via.placeholder.com/150" },
  { id: 6, name: "Queso", price: 4.5, image: "https://via.placeholder.com/150" },
  { id: 7, name: "Mantequilla", price: 2.5, image: "https://via.placeholder.com/150" },
  { id: 8, name: "Aceite", price: 5.0, image: "https://via.placeholder.com/150" },
  { id: 9, name: "Azúcar", price: 1.8, image: "https://via.placeholder.com/150" },
  { id: 10, name: "Sal", price: 0.8, image: "https://via.placeholder.com/150" },
  { id: 11, name: "Tomates", price: 2.0, image: "https://via.placeholder.com/150" },
  { id: 12, name: "Papas", price: 3.0, image: "https://via.placeholder.com/150" },
];

const ProductGrid = () => {
  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Productos del Supermercado</h2>
      <div className="row">
        {products.map((product) => (
          <div className="col-md-3 mb-4" key={product.id}>
            <div className="card h-100 shadow-sm">
              <img
                src={product.image}
                className="card-img-top"
                alt={product.name}
                style={{ height: "150px", objectFit: "cover" }}
              />
              <div className="card-body text-center">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">${product.price.toFixed(2)}</p>
                <button className="btn btn-primary">Agregar al Carrito</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
