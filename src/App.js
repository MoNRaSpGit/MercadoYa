import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import store from '../src/Store/store'; // Importar el store
import { fetchProducts } from './Slice/productoSlice'; // Acción para cargar productos
import { fetchPedidosAsync } from './Slice/pedidoSlice'; // Acción para cargar órdenes
import WebSocketProvider from './Componentes/WebSocketProvider'; // WebSocketProvider para tiempo real
import Login from './Componentes/Login';
import Register from './Componentes/Register';
import Homee from './Componentes/Homee';
import ProductGrid from './Componentes/ProductGrid';
import Cart from './Componentes/Cart';
import Ordenes from './Componentes/Ordenes';

const AppWrapper = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('App: Iniciando aplicación. Cargando productos y órdenes...');
    dispatch(fetchProducts())
      .unwrap()
      .then(() => console.log('App: Productos cargados con éxito'))
      .catch((err) => console.error('App: Error al cargar productos', err));

    dispatch(fetchPedidosAsync())
      .unwrap()
      .then(() => console.log('App: Órdenes cargadas con éxito'))
      .catch((err) => console.error('App: Error al cargar órdenes', err));
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Homee />} />
      <Route path="/products" element={<ProductGrid />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/ordenes" element={<Ordenes />} />
      <Route path="*" element={<div>404 - Página no encontrada</div>} />
    </Routes>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <WebSocketProvider>
        <Router basename="/MercadoYa">
          <AppWrapper />
        </Router>
      </WebSocketProvider>
    </Provider>
  );
};

export default App;
