import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts, saveProduct } from "../Slice/productoSlice";
import Tarjetas from "../Componentes/Tarjetas";
import TarjetasEdit from "../Componentes/TarjetasEdit";
import ManualProductModal from "../Componentes/ManualProductModal";
import Ticket from "../Componentes/Ticket";

const LaserScanner = () => {
  const [scannerInput, setScannerInput] = useState("");
  const [scannedProducts, setScannedProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showManualProductModal, setShowManualProductModal] = useState(false);
  const [manualProduct, setManualProduct] = useState({ name: "", price: "" });

  const globalProducts = useSelector((state) => state.products.items);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  /*const handleDeleteProduct = (id) => {
    setScannedProducts((prev) => prev.filter((product) => product.barcode !== id));
  };*/

  const handleScannedBarcode = (barcode) => {
    const existingProduct = globalProducts.find((product) => product.barcode === barcode);
    if (existingProduct) {
      if (!scannedProducts.find((product) => product.barcode === barcode)) {
        setScannedProducts((prev) => [...prev, { ...existingProduct, quantity: 1 }]);
      }
    } else {
      setEditingProduct({
        id: null,
        barcode,
        name: "",
        price: 0,
        description: "",
        image: null,
        quantity: 1,
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleScannedBarcode(scannerInput.trim());
      setScannerInput("");
    } else if (/^\d$/.test(e.key)) {
      setScannerInput((prev) => prev + e.key);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [scannerInput]);

  const handleSaveProduct = (product) => {
    dispatch(saveProduct(product)).then((action) => {
      if (action.type === "products/saveProduct/fulfilled") {
        const updatedProduct = action.payload;
        setScannedProducts((prev) =>
          prev.map((p) =>
            p.barcode === updatedProduct.barcode ? { ...p, ...updatedProduct } : p
          )
        );
        setEditingProduct(null);
      }
    });
  };

  const totalPrice = scannedProducts.reduce(
    (sum, product) => sum + (Number(product.price) || 0) * (product.quantity || 1),
    0
  );

  return (
    <div className="container my-5">
      <h1 className="text-center">Escáner Láser</h1>
      <button className="btn btn-primary mb-3" onClick={() => setShowManualProductModal(true)}>
        Agregar Producto Manualmente
      </button>
      <div className="row mb-4">
        {scannedProducts.map((product) => (
          <Tarjetas
          key={product.barcode}
          product={product}
          showAdminButtons={true} // Asegúrate de que sea `true`
          onEdit={setEditingProduct}
          onDelete={(id) => {
            const updatedProducts = scannedProducts.filter((p) => p.barcode !== id);
            setScannedProducts(updatedProducts);
          }}
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
        <ManualProductModal
          manualProduct={manualProduct}
          setManualProduct={setManualProduct}
          setShowManualProductModal={setShowManualProductModal}
          handleAddManualProduct={() => {}}
        />
      )}
      <Ticket
        scannedProducts={scannedProducts}
        updateQuantity={() => {}}
        handleCancelProduct={() => {}}
        totalPrice={totalPrice}
      />
    </div>
  );
};

export default LaserScanner;
