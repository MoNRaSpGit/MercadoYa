import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Selecciona la URL según el entorno
//process.env.REACT_APP_API_URL_PRODUCTION
//process.env.REACT_APP_API_URL_LOCAL
const API_URL = process.env.REACT_APP_API_URL_PRODUCTION;

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, thunkAPI) => {

    try {
      const response = await fetch(`${API_URL}/api/products`); // Usar la variable de entorno


      if (!response.ok) {
        throw new Error('Error al obtener los productos');
      }

      const data = await response.json();

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

    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log('Cargando productos...');
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        console.log('Productos cargados exitosamente:', action.payload);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        console.error('Error al cargar los productos:', action.payload);
      });
  },
});

export const { addToCart } = productSlice.actions; // Exporta la acción
export default productSlice.reducer;
