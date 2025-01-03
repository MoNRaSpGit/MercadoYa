import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = "https://mercadoya-back.onrender.com";

const LaserScanner = () => {
  const [scannerInput, setScannerInput] = useState("");
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cajaInicial, setCajaInicial] = useState(1000);
  const [editingProduct, setEditingProduct] = useState(null);

  const getStoredProduct = (barcode) => {
    const storedProducts = JSON.parse(localStorage.getItem("products")) || {};
    return storedProducts[barcode] || null;
  };

  const saveProductToLocal = (product) => {
    const storedProducts = JSON.parse(localStorage.getItem("products")) || {};
    storedProducts[product.barcode] = product;
    localStorage.setItem("products", JSON.stringify(storedProducts));
  };

  const addProduct = (barcode) => {
    const storedProduct = getStoredProduct(barcode);

    if (storedProduct) {
      setProducts((prevProducts) => [...prevProducts, storedProduct]);
      setTotalPrice((prevTotal) => prevTotal + storedProduct.price);
    } else {
      setEditingProduct({
        id: barcode,
        barcode: barcode,
        name: "",
        price: 0,
        description: "",
        image: null,
      });
    }
  };

  const handleSaveEdit = () => {
    saveProductToLocal(editingProduct);
    setProducts((prevProducts) => [...prevProducts, editingProduct]);
    setTotalPrice((prevTotal) => prevTotal + editingProduct.price);
    setEditingProduct(null);
  };

  const handleKeyDown = (e) => {
    const char = e.key;

    if (char === "Enter") {
      const barcode = scannerInput.trim();
      console.log("Código escaneado:", barcode);
      addProduct(barcode);
      setScannerInput("");
    } else {
      setScannerInput((prev) => prev + char);
    }
  };

  const handlePay = () => {
    setCajaInicial((prevCaja) => prevCaja + totalPrice);
    setProducts([]);
    setTotalPrice(0);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [scannerInput]);

  return (
    <div className="container my-5">
      <h1 className="text-center">Hola, Steven</h1>
      <h2 className="text-center mb-4">Caja inicial: ${cajaInicial.toFixed(2)}</h2>
      <h3 className="text-center mb-4">Total acumulado: ${totalPrice.toFixed(2)}</h3>
      <div className="row">
        {products.map((product) => (
          <div className="col-md-3 mb-4" key={product.id}>
            <div className="card h-100">
              <img
                src={product.image ? URL.createObjectURL(product.image) : "https://via.placeholder.com/150"}
                className="card-img-top"
                alt={product.name}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text text-muted">{product.description}</p>
                <p className="card-text fw-bold">${product.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-5">
        <button
          className="btn btn-primary btn-lg"
          onClick={handlePay}
          disabled={products.length === 0}
        >
          Pagar
        </button>
      </div>

      {editingProduct && (
        <div className="modal show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Producto</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditingProduct(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Precio</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct((prev) => ({
                        ...prev,
                        price: parseFloat(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    value={editingProduct.description}
                    onChange={(e) =>
                      setEditingProduct((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancelar
                </button>
                <button className="btn btn-primary" onClick={handleSaveEdit}>
                  Guardar Producto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaserScanner;
