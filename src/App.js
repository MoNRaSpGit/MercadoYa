import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Componentes/Home';
import ProductGrid from './Componentes/ProductGrid';
import Cart from './Componentes/Cart';

const App = () => {
  console.log('App montada');

  return (
    <Router basename="/MercadoYa">
      <div>
        <Routes>
          {/* Página de Inicio */}
          <Route path="/" element={<Home />} />

          {/* Listado de Productos */}
          <Route path="/products" element={<ProductGrid />} />

          {/* Carrito */}
          <Route path="/cart" element={<Cart />} />

          {/* Página 404 */}
          <Route path="*" element={<div>404 - Página no encontrada</div>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
