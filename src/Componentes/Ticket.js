import React from "react";

const Ticket = ({ scannedProducts, updateQuantity, handleCancelProduct, totalPrice }) => (
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
                onChange={(e) => updateQuantity(product.barcode, Number(e.target.value))}
              />
            </td>
            <td>${((Number(product.price) || 0) * (product.quantity || 1)).toFixed(2)}</td>
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
      <strong>Total a Pagar:</strong>
      <span className="ms-2">${totalPrice.toFixed(2)}</span>
    </div>
  </div>
);

export default Ticket;
