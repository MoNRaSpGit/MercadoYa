import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = process.env.REACT_APP_API_URL_LOCAL;

// Thunk para confirmar el pedido y enviarlo al backend
export const confirmarPedidoAsync = createAsyncThunk(
  'pedidos/confirmarPedidoAsync',
  async (pedido, thunkAPI) => {
   // console.log('Iniciando confirmarPedidoAsync con pedido:', pedido);
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
      ///console.log('Pedido registrado con éxito en el backend:', data);
      return { ...pedido, id: data.orderId }; // Devuelve el pedido con el ID generado por el backend
    } catch (error) {
      console.error('Error en confirmarPedidoAsync:', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Thunk para obtener los pedidos desde la base de datos
export const fetchPedidosAsync = createAsyncThunk(
  'pedidos/fetchPedidosAsync',
  async (_, thunkAPI) => {
    //console.log('Iniciando fetchPedidosAsync');
    try {
      const response = await fetch(`${API_URL}/api/orders`);
     // console.log('Respuesta de la API para fetchPedidosAsync:', response);

      if (!response.ok) {
        throw new Error('Error al obtener los pedidos');
      }

      const data = await response.json();
    //  console.log('Pedidos obtenidos desde el backend:', data);
      return data; // Devuelve los pedidos obtenidos
    } catch (error) {
      console.error('Error en fetchPedidosAsync:', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Thunk para actualizar el estado de un pedido en el backend
export const actualizarEstadoPedidoAsync = createAsyncThunk(
  'pedidos/actualizarEstadoPedidoAsync',
  async ({ id, nuevoEstado }, thunkAPI) => {
   // console.log(`Iniciando actualizarEstadoPedidoAsync para el pedido ${id} con estado ${nuevoEstado}`);
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
     // console.log('Estado actualizado en el backend:', data);
      return { id, nuevoEstado }; // Devuelve el ID del pedido y el nuevo estado
    } catch (error) {
     // console.error('Error en actualizarEstadoPedidoAsync:', error.message);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const pedidoSlice = createSlice({
  name: 'pedidos',
  initialState: {
    lista: [], // Lista de pedidos confirmados
    loading: false, // Estado de carga
    error: null, // Manejo de errores
  },
  reducers: {
    cambiarEstadoLocal: (state, action) => {
      const { id, nuevoEstado } = action.payload;
      const pedido = state.lista.find((pedido) => pedido.id === id);
      if (pedido) {
        pedido.status = nuevoEstado;
        //console.log(`Estado del pedido ${id} actualizado localmente a ${nuevoEstado}`);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Para confirmar pedido
      .addCase(confirmarPedidoAsync.pending, (state) => {
       // console.log('confirmarPedidoAsync.pending');
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmarPedidoAsync.fulfilled, (state, action) => {
        //console.log('confirmarPedidoAsync.fulfilled:', action.payload);
        state.loading = false;
        state.lista.push(action.payload);
      })
      .addCase(confirmarPedidoAsync.rejected, (state, action) => {
        //console.log('confirmarPedidoAsync.rejected:', action.payload);
        state.loading = false;
        state.error = action.payload;
      })
      // Para obtener pedidos
      .addCase(fetchPedidosAsync.pending, (state) => {
       // console.log('fetchPedidosAsync.pending');
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPedidosAsync.fulfilled, (state, action) => {
       //// console.log('fetchPedidosAsync.fulfilled:', action.payload);
        state.loading = false;
        state.lista = action.payload; // Actualiza directamente con los pedidos obtenidos
      })
      .addCase(fetchPedidosAsync.rejected, (state, action) => {
        //console.log('fetchPedidosAsync.rejected:', action.payload);
        state.loading = false;
        state.error = action.payload;
      })
      // Para actualizar estado del pedido
      .addCase(actualizarEstadoPedidoAsync.pending, (state) => {
        //console.log('actualizarEstadoPedidoAsync.pending');
        state.loading = true;
        state.error = null;
      })
      .addCase(actualizarEstadoPedidoAsync.fulfilled, (state, action) => {
        //console.log('actualizarEstadoPedidoAsync.fulfilled:', action.payload);
        state.loading = false;
        const { id, nuevoEstado } = action.payload;
        const pedido = state.lista.find((pedido) => pedido.id === id);
        if (pedido) {
          pedido.status = nuevoEstado;
        }
      })
      .addCase(actualizarEstadoPedidoAsync.rejected, (state, action) => {
        //console.log('actualizarEstadoPedidoAsync.rejected:', action.payload);
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { cambiarEstadoLocal } = pedidoSlice.actions;
export default pedidoSlice.reducer;
