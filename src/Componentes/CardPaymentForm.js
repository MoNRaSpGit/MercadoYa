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
    const existingProduct = globalProducts.find(
      (product) => product.barcode === barcode
    );

    if (existingProduct) {
      // Si el producto existe, se añade a los productos escaneados
      const alreadyScanned = scannedProducts.find(
        (product) => product.barcode === barcode
      );

      if (!alreadyScanned) {
        const newProduct = { ...existingProduct, quantity: 1 };
        setScannedProducts((prev) => [...prev, newProduct]);
      }
    } else {
      // Si no existe, crear un producto vacío
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


  const handleSaveProduct = () => {
    const productToSave = {
      ...editingProduct,
      price: editingProduct.price || 0, // Asegura un precio por defecto (0 si no se proporciona)
      image: editingProduct.image || null, // Asegura que sea null si no hay imagen
      description: editingProduct.description || "", // Asegura una cadena vacía si no hay descripción
    };
  
    dispatch(saveProduct(productToSave))
      .then((action) => {
        if (action.type === "products/saveProduct/fulfilled") {
          alert(`Producto "${editingProduct.name}" guardado con éxito.`);
          setEditingProduct(null); // Limpiar el estado de edición
          dispatch(fetchProducts()).then(() => {
            window.location.reload(); // Recargar el componente completo
          });
        } else {
          alert("Error al guardar el producto.");
        }
      });
  };
  


  const handleAddManualProduct = () => {
    if (!manualProduct.name) {
      alert("Por favor, completa el nombre del producto.");
      return;
    }

    const newProduct = {
      barcode: `manual-${Date.now()}`, // Generar un código único
      name: manualProduct.name,
      price: parseFloat(manualProduct.price) || 0, // Precio predeterminado
      description: manualProduct.description || "", // Descripción predeterminada vacía
      image: manualProduct.image || null, // Imagen predeterminada (null)
      quantity: 1,
    };

    setScannedProducts((prev) => [...prev, newProduct]);
    setManualProduct({ name: "", price: "", description: "", image: null });
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
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    value={manualProduct.description}
                    onChange={(e) =>
                      setManualProduct((prev) => ({
                        ...prev,
                        description: e.target.value,
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
                <div className="mb-3">
                  <label className="form-label">Imagen</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) =>
                      setManualProduct((prev) => ({
                        ...prev,
                        image: e.target.files[0] || null,
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
