import React from "react";
import { Carousel } from "react-bootstrap";

const CaruselOfertas = ({ products }) => {
  // Seleccionamos un subconjunto aleatorio de productos para el carrusel
  const randomProducts = products.sort(() => 0.5 - Math.random()).slice(0, 5);

  if (randomProducts.length === 0) {
    return null; // Si no hay productos, no mostramos nada
  }

  return (
    <div className="my-4 p-2 border border-dark rounded">
      <h3 className="text-center mb-3">Productos Destacados</h3>
      <Carousel>
        {randomProducts.map((product) => (
          <Carousel.Item key={product.id}>
            <div
              style={{
                height: "300px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f8f8f8",
              }}
            >
              <img
                src={product.image || "https://via.placeholder.com/300"}
                alt={product.name || "Producto"}
                style={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            <Carousel.Caption>
              <h5>{product.name || "Sin nombre"}</h5>
              {product.price && (
                <p className="bg-dark text-light d-inline-block p-2 rounded">
                  Precio: <strong>${Number(product.price).toFixed(2)}</strong>
                </p>
              )}
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default CaruselOfertas;
