import React from "react";
import { Carousel } from "react-bootstrap";

const CaruselOfertas = ({ products }) => {
  const discountedProducts = products.filter((p) => p.discount);

  if (discountedProducts.length === 0) {
    return null; // Si no hay ofertas, no mostramos nada
  }

  return (
    <div className="my-4 p-2 border border-dark rounded">
      <h3 className="text-center mb-3">Ofertas Especiales</h3>
      <Carousel>
        {discountedProducts.map((product) => (
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
                alt={product.name}
                style={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            <Carousel.Caption>
              <h5>{product.name}</h5>
              {product.price && (
                <p className="bg-dark d-inline-block p-2 rounded">
                  Ahora: <strong>${Number(product.price).toFixed(2)}</strong>
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
