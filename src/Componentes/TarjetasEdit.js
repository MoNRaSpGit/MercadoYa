import React from "react";
import "../Css/TarjetasEdit.css";

const TarjetasEdit = ({ product, onChange, onCancel, onSave }) => {
  return (
    <div className="custom-modal">
      <div className="custom-modal-dialog">
        <div className="custom-modal-content">
          <div className="custom-modal-header">
            <h5 className="custom-modal-title">
              {product.id ? "Editar Producto" : "Agregar Producto"}
            </h5>
            <button
              type="button"
              className="custom-button close"
              onClick={onCancel}
            >
              X
            </button>
          </div>
          <div className="custom-modal-body">
            <div className="custom-form-group">
              <label>Nombre</label>
              <input
                type="text"
                className="custom-input"
                value={product.name}
                onChange={(e) => onChange("name", e.target.value)}
              />
            </div>
            <div className="custom-form-group">
              <label>Precio</label>
              <input
                type="number"
                className="custom-input"
                value={product.price}
                onChange={(e) => onChange("price", parseFloat(e.target.value))}
              />
            </div>
            <div className="custom-form-group">
              <label>Descripción</label>
              <textarea
                className="custom-input"
                value={product.description}
                onChange={(e) => onChange("description", e.target.value)}
              />
            </div>
            <div className="custom-form-group">
              <label>Imagen</label>
              <input
                type="file"
                className="custom-input"
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
          <div className="custom-modal-footer">
            <button
              className="custom-button secondary"
              onClick={onCancel}
            >
              Cancelar
            </button>
            <button
              className="custom-button success"
              onClick={onSave}
            >
              {product.id ? "Guardar Cambios" : "Guardar en la BDD"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TarjetasEdit;
