import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import store from '../src/Store/store'; // Importar el store
import { fetchProducts } from './Slice/productoSlice'; // Acción para cargar productos
import Login from './Componentes/Login'; // Componente de Login
import Homee from './Componentes/Homee';
import ProductGrid from './Componentes/ProductGrid';
import Cart from './Componentes/Cart';
import Ordenes from './Componentes/Ordenes';
import LaserScanner from './Componentes/CardPaymentForm';
import Register from './Componentes/Register'; // Nuevo componente de registro

const AppWrapper = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Cargar productos al iniciar la aplicación
    console.log('Cargando productos desde App...');
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Login />} /> {/* Página de Login */}
      <Route path="/register" element={<Register />} /> {/* Página de Registro */}
      <Route path="/home" element={<Homee />} />
      <Route path="/products" element={<ProductGrid />} />
      <Route path="/scan" element={<LaserScanner />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/ordenes" element={<Ordenes />} />
      <Route path="*" element={<div>404 - Página no encontrada</div>} />
    </Routes>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <Router basename="/MercadoYa">
        <AppWrapper />
      </Router>
    </Provider>
  );
};

export default App;
