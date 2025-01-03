import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";


//REACT_APP_API_URL_LOCA
//REACT_APP_API_URL_PRODUCTION

const API_URL = REACT_APP_API_URL_PRODUCTION
const LaserScanner = () => {
  const [scannerInput, setScannerInput] = useState("");
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cajaInicial, setCajaInicial] = useState(1000);

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
      await axios.post(`${API_URL}/api/products`, {
        name: product.name,
        price: product.price,
        barcode: product.barcode,
      });

      setProducts((prevProducts) =>
        prevProducts.filter((p) => p.id !== product.id)
      );

      alert(`Producto "${product.name}" agregado a la base de datos.`);
    } catch (error) {
      console.error("Error al guardar en la base de datos:", error);
      alert("Hubo un error al guardar el producto.");
    }
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
      <p className="text-center text-muted">
        Los productos aparecerán aquí después del escaneo.
      </p>
      <div className="row">
        {products.map((product) => (
          <div className="col-md-3 mb-4" key={product.id}>
            <div className="card h-100">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text text-muted">{product.description}</p>
                <p className="card-text fw-bold">${product.price}</p>
                <p className="card-text text-muted">Código de barras: {product.barcode}</p>
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
    </div>
  );
};

export default LaserScanner;
