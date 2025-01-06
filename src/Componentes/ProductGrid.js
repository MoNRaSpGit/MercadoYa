import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart, saveProduct, deleteProduct } from "../Slice/productoSlice";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import "../Css/ProductGrid.css";
import Tarjetas from "../Componentes/Tarjetas";
import TarjetasEdit from "../Componentes/TarjetasEdit";

const ProductGrid = () => {
  const dispatch = useDispatch();
  const { items: products, cart, loading, error } = useSelector(
    (state) => state.products
  );

  const [editingProduct, setEditingProduct] = useState(null);
  const [searchText, setSearchText] = useState(""); // Estado para la barra de búsqueda

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleSaveProduct = (product) => {
    dispatch(saveProduct(product)).then((action) => {
      if (action.type === "products/saveProduct/fulfilled") {
        alert(`Producto "${product.name}" actualizado con éxito.`);
        setEditingProduct(null);
      } else {
        alert("Error al actualizar el producto.");
      }
    });
  };

  const handleDeleteProduct = (id) => {
    console.log("ID del producto a eliminar:", id); // Asegúrate de que sea correcto
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      dispatch(deleteProduct(id)).then((action) => {
        if (action.type === "products/deleteProduct/fulfilled") {
          alert("Producto eliminado con éxito.");
        } else {
          alert("Error al eliminar el producto.");
        }
      });
    }
  };
  

  // Filtrar productos por nombre según el texto ingresado en el buscador
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

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
        <input
          type="text"
          className="form-control w-50"
          placeholder="Buscar productos por nombre..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <Link to="/laser-scanner" className="btn btn-secondary">
          Ir a Escáner Láser
        </Link>
        <Link to="/cart" className="btn btn-outline-primary position-relative">
          <FontAwesomeIcon icon={faShoppingCart} size="lg" />
          {cart.length > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {cart.length}
            </span>
          )}
        </Link>
      </div>

      <h2 className="text-center mb-4">Productos del Supermercado</h2>
      <div className="row">
        {filteredProducts.map((product) => (
          <Tarjetas
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
            onEdit={(product) => setEditingProduct(product)}
            onDelete={handleDeleteProduct} // Pasamos la función para eliminar
          />
        ))}
      </div>

      {editingProduct && (
        <TarjetasEdit
          product={editingProduct}
          onChange={(key, value) =>
            setEditingProduct((prev) => ({ ...prev, [key]: value }))
          }
          onCancel={() => setEditingProduct(null)}
          onSave={() => handleSaveProduct(editingProduct)}
        />
      )}
    </div>
  );
};

export default ProductGrid;
