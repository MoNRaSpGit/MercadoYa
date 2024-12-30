import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../Slice/productoSlice';
import pedidoReducer from '../Slice/pedidoSlice'; // Importa el slice de pedidos

const store = configureStore({
  reducer: {
    products: productReducer,
    pedidos: pedidoReducer, // Agrega el slice de pedidos
  },
});

export default store;
