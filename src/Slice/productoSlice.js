import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = process.env.REACT_APP_API_URL_PRODUCTION;
console.log("soy la direcion de production   -->" , API_URL)


export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/api/products`);

      if (!response.ok) {
        throw new Error("Error al obtener los productos");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error en fetchProducts:", error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);




export const saveProduct = createAsyncThunk(
  "products/saveProduct",
  async (product, thunkAPI) => {
    try {
      const isEditing = !!product.id;
      const endpoint = isEditing
        ? `${API_URL}/api/products/${product.id}`
        : `${API_URL}/api/products`;

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error("Error al guardar el producto");
      }

      const data = await response.json();

      return {
        ...product,
        id: isEditing ? product.id : data.productId,
        ...data,
      };
    } catch (error) {
      console.error("Error en saveProduct:", error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el producto");
      }

      return id;
    } catch (error) {
      console.error("Error en deleteProduct:", error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    cart: [],
    loading: false,
    error: null,
  },
  reducers: {
    addToCart: (state, action) => {
      state.cart.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(saveProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload; // Actualiza el producto existente
        } else {
          state.items.push(action.payload); // Agrega un nuevo producto
        }
      })      
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        console.error("Error al eliminar el producto:", action.payload);
      });
  },
});


export const { addToCart } = productSlice.actions;
export default productSlice.reducer;
