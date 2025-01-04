import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../Slice/productoSlice";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import "../Css/ProductGrid.css";
import Tarjetas from "../Componentes/Tarjetas"; // Importar el componente Tarjetas

const ProductGrid = () => {
  const dispatch = useDispatch();
  const { items: products, cart, loading, error } = useSelector(
    (state) => state.products
  );

  const handleAddToCart = (product) => {
    console.log("Producto agregado al carrito:", product);
    dispatch(addToCart(product));
  };

  const handleSendNotification = async () => {
    try {
      const response = await fetch(`https://mercadoya-back.onrender.com`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "¡Tu pedido!",
          message: "Tu pedido está listo :D",
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
      console.error("Error al enviar la notificación:", error);
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
      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-success" onClick={handleSendNotification}>
          Enviar Notificación a Todos
        </button>
        <Link to="/frutas-y-verduras" className="btn btn-info">
          Ir a Frutas y Verduras
        </Link>
        <Link to="/cart" className="btn btn-outline-primary position-relative">
          <FontAwesomeIcon icon={faShoppingCart} size="lg" />
          {cart.length > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {cart.length}
            </span>
          )}
        </Link>
        <Link to="/laser-scanner" className="btn btn-secondary">
          Ir a Escáner Láser
        </Link>
      </div>

      <h2 className="text-center mb-4">Productos del Supermercado</h2>
      <div className="row">
        {products.map((product) => (
          <Tarjetas
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart} // Pasamos una función para manejar el carrito
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
