import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Selecciona la URL según el entorno
const API_URL = process.env.REACT_APP_API_URL_PRODUCTION || process.env.REACT_APP_API_URL_LOCAL;

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, thunkAPI) => {
    console.log('Iniciando fetchProducts');
    try {
      const response = await fetch(`${API_URL}/api/products`); // Usar la variable de entorno
      console.log('Respuesta de la API:', response);

      if (!response.ok) {
        throw new Error('Error al obtener los productos');
      }

      const data = await response.json();
      console.log('Datos obtenidos de la API:', data);
      return data;
    } catch (error) {
      console.error('Error en fetchProducts:', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    cart: [],
    loading: false,
    error: null,
  },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      state.cart.push(product);
      console.log('Producto agregado al carrito:', product);
      console.log('Estado actual del carrito:', state.cart);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        console.log('fetchProducts.pending');
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        console.log('fetchProducts.fulfilled:', action.payload);
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        console.log('fetchProducts.rejected:', action.payload);
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addToCart } = productSlice.actions; // Exporta la acción
export default productSlice.reducer;
