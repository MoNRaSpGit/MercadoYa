import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts, saveProduct } from "../Slice/productoSlice";
import Tarjetas from "../Componentes/Tarjetas";
import TarjetasEdit from "../Componentes/TarjetasEdit";
import "bootstrap/dist/css/bootstrap.min.css";

const LaserScanner = () => {
  const [scannerInput, setScannerInput] = useState("");
  const [scannedProducts, setScannedProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showManualProductModal, setShowManualProductModal] = useState(false);
  const [manualProduct, setManualProduct] = useState({ name: "", price: "" });

  const globalProducts = useSelector((state) => state.products.items);
  const dispatch = useDispatch();

  useEffect(() => {
    // Cargar los productos desde la base de datos al montar el componente
    dispatch(fetchProducts()).then(() => {
      console.log("Productos disponibles al cargar:", globalProducts);
    });
  }, [dispatch]);

  const handleScannedBarcode = (barcode) => {
    console.log("Código de barras escaneado:", barcode);

    const existingProduct = globalProducts.find(
      (product) => product.barcode === barcode
    );

    if (existingProduct) {
      console.log("Producto encontrado:", existingProduct);

      const alreadyScanned = scannedProducts.find(
        (product) => product.barcode === barcode
      );

      if (!alreadyScanned) {
        const newProduct = { ...existingProduct, quantity: 1 };
        setScannedProducts((prev) => [...prev, newProduct]);
      } else {
        console.log("Producto ya escaneado:", existingProduct.name);
      }
    } else {
      console.log("Producto no encontrado. Preparando para agregar nuevo producto.");
      const emptyProduct = {
        id: null,
        barcode,
        name: "",
        price: 0,
        description: "",
        image: null,
        quantity: 1,
      };
      setEditingProduct(emptyProduct);
    }
  };

  const handleSaveProduct = (product) => {
    dispatch(saveProduct(product)).then((action) => {
      if (action.type === "products/saveProduct/fulfilled") {
        alert(
          product.id
            ? `Producto "${product.name}" actualizado con éxito.`
            : `Producto "${product.name}" creado con éxito.`
        );
        setEditingProduct(null);
        // Refrescar los productos globales inmediatamente después de guardar
        dispatch(fetchProducts()).then(() => {
          console.log("Productos actualizados después de guardar:", globalProducts);
        });
      } else {
        alert("Hubo un error al guardar el producto.");
      }
    });
  };

  const handleAddManualProduct = () => {
    if (!manualProduct.name || !manualProduct.price) {
      alert("Por favor, completa el nombre y el precio del producto.");
      return;
    }

    const newProduct = {
      barcode: `manual-${Date.now()}`,
      name: manualProduct.name,
      price: parseFloat(manualProduct.price),
      quantity: 1,
    };

    setScannedProducts((prev) => [...prev, newProduct]);
    setManualProduct({ name: "", price: "" });
    setShowManualProductModal(false);
  };

  const handleKeyDown = (e) => {
    const char = e.key;

    if (char === "Enter") {
      const barcode = scannerInput.trim();
      handleScannedBarcode(barcode);
      setScannerInput(""); // Limpiar el input
    } else {
      setScannerInput((prev) => prev + char);
    }
  };

  const updateQuantity = (barcode, newQuantity) => {
    setScannedProducts((prev) =>
      prev.map((p) =>
        p.barcode === barcode ? { ...p, quantity: newQuantity } : p
      )
    );
  };

  const handleCancelProduct = (barcode) => {
    setScannedProducts((prev) =>
      prev.filter((product) => product.barcode !== barcode)
    );
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [scannerInput]);

  const totalPrice = scannedProducts.reduce(
    (sum, product) =>
      sum + (Number(product.price) || 0) * (product.quantity || 1),
    0
  );

  return (
    <div className="container my-5">
      <h1 className="text-center">Escáner Láser</h1>

      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowManualProductModal(true)}
      >
        Agregar Producto Manualmente
      </button>

      <div className="row mb-4">
        {scannedProducts.map((product) => (
          <Tarjetas
            key={product.barcode}
            product={product}
            onEdit={(product) => setEditingProduct(product)}
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

      {showManualProductModal && (
        <div className="modal show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Agregar Producto Manual</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowManualProductModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    value={manualProduct.name}
                    onChange={(e) =>
                      setManualProduct((prev) => ({
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
                    value={manualProduct.price}
                    onChange={(e) =>
                      setManualProduct((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowManualProductModal(false)}
                >
                  Cancelar
                </button>
                <button className="btn btn-success" onClick={handleAddManualProduct}>
                  Agregar al Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="ticket">
        <h3>Ticket de Supermercado</h3>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio/Unidad</th>
              <th>Cantidad</th>
              <th>Total</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {scannedProducts.map((product) => (
              <tr key={product.barcode}>
                <td>{product.name || "Producto sin nombre"}</td>
                <td>${(Number(product.price) || 0).toFixed(2)}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={product.quantity}
                    className="form-control"
                    onChange={(e) =>
                      updateQuantity(product.barcode, Number(e.target.value))
                    }
                  />
                </td>
                <td>
                  ${(
                    (Number(product.price) || 0) * (product.quantity || 1)
                  ).toFixed(2)}
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleCancelProduct(product.barcode)}
                  >
                    Cancelar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="total d-flex justify-content-end">
          <strong>Total a Pagar:</strong>{" "}
          <span className="ms-2">${totalPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default LaserScanner;
