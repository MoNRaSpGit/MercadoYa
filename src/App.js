import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homee from './Componentes/Homee';
import ProductGrid from './Componentes/ProductGrid';
import Cart from './Componentes/Cart';
import Ordenes from './Componentes/Ordenes';
import LaserScanner from './Componentes/CardPaymentForm'; // Importa el escáner como LaserScanner
import Navbar from './Componentes/Navbar'; // Importa la barra de navegación

const App = () => {
  return (
    <Router basename="/MercadoYa">
      <Navbar /> {/* Barra de navegación */}
      <div>
        <Routes>
          {/* Página de Inicio */}
          <Route path="/" element={<Homee />} />

          {/* Listado de Productos */}
          <Route path="/products" element={<ProductGrid />} />

          {/* Escáner */}
          <Route path="/scan" element={<LaserScanner />} />

          {/* Carrito */}
          <Route path="/cart" element={<Cart />} />

          {/* Ordenes */}
          <Route path="/ordenes" element={<Ordenes />} />

          {/* Página 404 */}
          <Route path="*" element={<div>404 - Página no encontrada</div>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
