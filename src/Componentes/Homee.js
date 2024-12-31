import React from 'react';

const Homee = () => {
  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100 text-center">
      <h1 className="display-4">¡Bienvenidos a MercadoYa!</h1>
      <p className="lead mt-3">
        Tu plataforma ideal para gestionar productos, pedidos y mucho más.
      </p>
      <p>
        Navega por nuestra plataforma utilizando el menú superior para explorar los productos, escanear códigos de barras o gestionar tus órdenes.
      </p>
      <button className="btn btn-primary btn-lg mt-4">
        ¡Comienza ahora!
      </button>
    </div>
  );
};

export default Homee;
