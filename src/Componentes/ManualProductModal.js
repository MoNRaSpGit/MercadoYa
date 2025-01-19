import React from "react";

const ManualProductModal = ({
  manualProduct,
  setManualProduct,
  setShowManualProductModal,
  handleAddManualProduct,
}) => (
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
                setManualProduct((prev) => ({ ...prev, name: e.target.value }))
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
);

export default ManualProductModal;
