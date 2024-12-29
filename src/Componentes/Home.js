import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
      <h1 className="mb-4 text-center">Bienvenido a MercadoYa</h1>
      <p className="text-center mb-4">Tu tienda en línea de confianza.</p>
      <Link to="/products" className="btn btn-primary btn-lg">
        Ingresar
      </Link>
    </div>
  );
};

export default Home;
