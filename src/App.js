import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductGrid from './Componentes/ProductGrid';
import Cart from './Componentes/Cart';

const App = () => {
  console.log('App montada');

  return (
    <Router basename="/MercadoYa">
      <div>
        <Routes>
          <Route path="/" element={<ProductGrid />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="*" element={<div>404 - Página no encontrada</div>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
