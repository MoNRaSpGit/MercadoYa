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
  const [imageFile, setImageFile] = useState(null);

  const generateRandomProductName = () => {
    const productNames = [
      "Manzana Roja",
      "Pan Integral",
      "Leche Descremada",
      "Cereal Fitness",
      "Jugo de Naranja",
      "Galletas de Chocolate",
      "Arroz Premium",
      "Aceite de Oliva Extra Virgen",
    ];
    return productNames[Math.floor(Math.random() * productNames.length)];
  };

  const generateRandomPrice = () => {
    return parseFloat((Math.random() * 50 + 1).toFixed(2));
  };

  const addProduct = (barcode) => {
    const newProduct = {
      id: barcode,
      barcode: barcode,
      name: generateRandomProductName(),
      price: generateRandomPrice(),
      description: "Producto de alta calidad.",
      image: null,
    };
    setProducts((prevProducts) => [...prevProducts, newProduct]);
    setTotalPrice((prevTotal) => prevTotal + newProduct.price);
  };

  const handlePay = () => {
    setCajaInicial((prevCaja) => prevCaja + totalPrice);
    setProducts([]);
    setTotalPrice(0);
  };

  const saveToDatabase = async (product) => {
    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", product.price);
      formData.append("barcode", product.barcode);
      if (product.image) {
        formData.append("image", product.image);
      }

      await axios.post(`${API_URL}/api/products`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(`Producto "${product.name}" agregado a la base de datos.`);
    } catch (error) {
      console.error("Error al guardar en la base de datos:", error);
      alert("Hubo un error al guardar el producto.");
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  const handleSaveEdit = () => {
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === editingProduct.id ? editingProduct : p
      )
    );
    setEditingProduct(null);
    setImageFile(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setEditingProduct((prev) => ({ ...prev, image: file }));
  };

  useEffect(() => {
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
                <button
                  className="btn btn-primary mb-2"
                  onClick={() => handleEditProduct(product)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-success mt-auto"
                  onClick={() => saveToDatabase(product)}
                >
                  Agregar a la BDD
                </button>
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
                  <label className="form-label">Imagen</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleImageChange}
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
                  Guardar Cambios
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
