import { configureStore } from '@reduxjs/toolkit';
import productSlice from '../Slice/productoSlice';

const store = configureStore({
  reducer: {
    products: productSlice,
  },
});

export default store;
