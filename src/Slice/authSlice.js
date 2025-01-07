import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';



const API_URL = process.env.REACT_APP_API_URL_PRODUCTION;
//REACT_APP_API_URL_LOCAL
//REACT_APP_API_URL_PRODUCTION


// Acción para loguear al usuario
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/api/login`, credentials);
      return response.data.user; // Retorna el usuario completo
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || 'Error al intentar iniciar sesión'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null, // Información del usuario logueado
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null; // Limpiar usuario al cerrar sesión
      state.error = null; // Limpiar errores
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
