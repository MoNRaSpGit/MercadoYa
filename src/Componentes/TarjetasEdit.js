import React from "react";

const TarjetasEdit = ({ product, onChange, onCancel, onSave }) => {
  return (
    <div className="modal show d-block">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {product.id ? "Editar Producto" : "Agregar Producto"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onCancel}
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                value={product.name}
                onChange={(e) => onChange("name", e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Precio</label>
              <input
                type="number"
                className="form-control"
                value={product.price}
                onChange={(e) => onChange("price", parseFloat(e.target.value))}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <textarea
                className="form-control"
                value={product.description}
                onChange={(e) => onChange("description", e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Imagen</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => {
                  const file = e.target.files[0];
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    onChange("image", reader.result);
                  };
                  if (file) {
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onCancel}>
              Cancelar
            </button>
            <button className="btn btn-success" onClick={onSave}>
              {product.id ? "Guardar Cambios" : "Guardar en la BDD"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TarjetasEdit;
