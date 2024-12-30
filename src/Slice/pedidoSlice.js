import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

//const API_URL = process.env.REACT_APP_API_URL_LOCAL;
const API_URL = process.env.REACT_APP_API_URL_PRODUCTION



// Thunk para confirmar el pedido y enviarlo al backend
export const confirmarPedidoAsync = createAsyncThunk(
  'pedidos/confirmarPedidoAsync',
  async (pedido, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido),
      });

      if (!response.ok) {
        throw new Error('Error al registrar el pedido');
      }

      const data = await response.json();
      return { ...pedido, id: data.orderId };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Thunk para obtener los pedidos desde la base de datos
export const fetchPedidosAsync = createAsyncThunk(
  'pedidos/fetchPedidosAsync',
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/api/orders`);

      if (!response.ok) {
        throw new Error('Error al obtener los pedidos');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Thunk para actualizar el estado de un pedido en el backend
export const actualizarEstadoPedidoAsync = createAsyncThunk(
  'pedidos/actualizarEstadoPedidoAsync',
  async ({ id, nuevoEstado }, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nuevoEstado }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado del pedido');
      }

      const data = await response.json();
      return { id, nuevoEstado };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Thunk para eliminar un pedido en el backend
export const eliminarPedidoAsync = createAsyncThunk(
  'pedidos/eliminarPedidoAsync',
  async (id, thunkAPI) => {
    try {
      const response = await fetch(`${API_URL}/api/orders/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el pedido');
      }

      return id; // Devuelve el ID del pedido eliminado
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const pedidoSlice = createSlice({
    name: 'pedidos',
    initialState: {
      lista: [],
      loading: false,
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      // 1. CONFIRMAR PEDIDO
      builder
        .addCase(confirmarPedidoAsync.pending, (state) => {
          console.log('confirmarPedidoAsync.pending');
          state.loading = true;
          state.error = null;
        })
        .addCase(confirmarPedidoAsync.fulfilled, (state, action) => {
          console.log('confirmarPedidoAsync.fulfilled:', action.payload);
          state.loading = false;
          state.lista.push(action.payload);
        })
        .addCase(confirmarPedidoAsync.rejected, (state, action) => {
          console.log('confirmarPedidoAsync.rejected:', action.payload);
          state.loading = false;
          state.error = action.payload;
        })
  
      // 2. OBTENER PEDIDOS
        .addCase(fetchPedidosAsync.pending, (state) => {
          console.log('fetchPedidosAsync.pending');
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchPedidosAsync.fulfilled, (state, action) => {
          console.log('fetchPedidosAsync.fulfilled:', action.payload);
          state.loading = false;
          state.lista = action.payload;
        })
        .addCase(fetchPedidosAsync.rejected, (state, action) => {
          console.log('fetchPedidosAsync.rejected:', action.payload);
          state.loading = false;
          state.error = action.payload;
        })
  
      // 3. ACTUALIZAR ESTADO
        .addCase(actualizarEstadoPedidoAsync.pending, (state) => {
          console.log('actualizarEstadoPedidoAsync.pending');
          state.loading = true;
          state.error = null;
        })
        .addCase(actualizarEstadoPedidoAsync.fulfilled, (state, action) => {
          console.log('actualizarEstadoPedidoAsync.fulfilled:', action.payload);
          state.loading = false;
          const { id, nuevoEstado } = action.payload;
          const pedido = state.lista.find((p) => p.id === id);
          if (pedido) {
            pedido.status = nuevoEstado;
          }
        })
        .addCase(actualizarEstadoPedidoAsync.rejected, (state, action) => {
          console.log('actualizarEstadoPedidoAsync.rejected:', action.payload);
          state.loading = false;
          state.error = action.payload;
        })
  
      // 4. ELIMINAR PEDIDO
        .addCase(eliminarPedidoAsync.pending, (state) => {
          console.log('eliminarPedidoAsync.pending');
          state.loading = true;
          state.error = null;
        })
        .addCase(eliminarPedidoAsync.fulfilled, (state, action) => {
          console.log('eliminarPedidoAsync.fulfilled:', action.payload);
          state.loading = false;
          state.lista = state.lista.filter((pedido) => pedido.id !== action.payload);
        })
        .addCase(eliminarPedidoAsync.rejected, (state, action) => {
          console.log('eliminarPedidoAsync.rejected:', action.payload);
          state.loading = false;
          state.error = action.payload;
        });
    },
  });
//export const { cambiarEstadoLocal } = pedidoSlice.actions;
export default pedidoSlice.reducer;
