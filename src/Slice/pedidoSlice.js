import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = process.env.REACT_APP_API_URL_PRODUCTION;
//REACT_APP_API_URL_LOCAL
//REACT_APP_API_URL_PRODUCTION

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
    lista: [], // Lista de pedidos
    error: null, // Estado para manejar errores
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // CONFIRMAR PEDIDO
      .addCase(confirmarPedidoAsync.fulfilled, (state, action) => {
        console.log('Pedido confirmado:', action.payload);
        const existe = state.lista.some((pedido) => pedido.id === action.payload.id);
        if (!existe) {
          state.lista.push(action.payload); // Solo agrega si no existe
        }
      })
      .addCase(confirmarPedidoAsync.rejected, (state, action) => {
        console.error('Error al confirmar pedido:', action.payload);
        state.error = action.payload;
      })

      // OBTENER PEDIDOS
      .addCase(fetchPedidosAsync.fulfilled, (state, action) => {
        console.log('Pedidos obtenidos:', action.payload);
        state.lista = action.payload; // Actualiza la lista de pedidos
      })
      .addCase(fetchPedidosAsync.rejected, (state, action) => {
        console.error('Error al obtener pedidos:', action.payload);
        state.error = action.payload;
      })

      // ACTUALIZAR ESTADO
      .addCase(actualizarEstadoPedidoAsync.fulfilled, (state, action) => {
        console.log('Estado de pedido actualizado:', action.payload);
        const { id, nuevoEstado } = action.payload;
        const pedido = state.lista.find((p) => p.id === id);
        if (pedido) {
          pedido.status = nuevoEstado; // Actualiza el estado del pedido
        }
      })
      .addCase(actualizarEstadoPedidoAsync.rejected, (state, action) => {
        console.error('Error al actualizar estado del pedido:', action.payload);
        state.error = action.payload;
      })

      // ELIMINAR PEDIDO
      .addCase(eliminarPedidoAsync.fulfilled, (state, action) => {
        console.log('Pedido eliminado:', action.payload);
        state.lista = state.lista.filter((pedido) => pedido.id !== action.payload); // Elimina el pedido de la lista
      })
      .addCase(eliminarPedidoAsync.rejected, (state, action) => {
        console.error('Error al eliminar pedido:', action.payload);
        state.error = action.payload;
      });
  },
});

export default pedidoSlice.reducer;
