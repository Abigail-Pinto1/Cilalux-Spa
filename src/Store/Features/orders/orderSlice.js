// src/Store/Features/orders/orderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../Auth/utils/axiosInstance';           // customer-facing requests
import adminApi from '../../Auth/utils/adminAxiosInstance';  // admin-facing requests

// ---- Admin-only thunks: use adminApi ----

export const fetchAllOrders = createAsyncThunk('orders/fetchAllOrders', async (_, { rejectWithValue }) => {
  try {
    const { data } = await adminApi.get('/orders');   // ✅
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to load orders');
  }
});

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status, trackingNumber, carrier, description }, { rejectWithValue }) => {
    try {
      const { data } = await adminApi.put(`/orders/admin/update-status/${orderId}`, { status, trackingNumber, carrier, description }); // ✅
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order status');
    }
  }
);

export const fetchReturnRequests = createAsyncThunk('orders/fetchReturnRequests', async (_, { rejectWithValue }) => {
  try {
    const { data } = await adminApi.get('/orders/admin/return-requests');   // ✅
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load return requests');
  }
});

export const fetchDashboardStats = createAsyncThunk('orders/fetchDashboardStats', async (_, { rejectWithValue }) => {
  try {
    const { data } = await adminApi.get('/orders/orderstats');   // ✅
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load dashboard stats');
  }
});

// ---- Customer-facing thunks: unchanged, still use `api` ----

export const createOrder = createAsyncThunk('orders/createOrder', async (orderData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/orders', orderData);
    return data;
  } catch (err) {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      return rejectWithValue('Your session has expired. Please login again.');
    }
    return rejectWithValue(err.response?.data?.message || 'Failed to create order');
  }
});

export const fetchOrderById = createAsyncThunk('orders/fetchOrderById', async (orderId, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/orders/${orderId}`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load order');
  }
});

export const fetchOrderHistory = createAsyncThunk('orders/fetchOrderHistory', async (userId, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/orders/customer/${userId}`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load order history');
  }
});

export const downloadReceipt = createAsyncThunk('orders/downloadReceipt', async (orderId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/orders/${orderId}/download-receipt`, { responseType: 'blob' });
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to download receipt');
  }
});

export const requestReturn = createAsyncThunk('orders/requestReturn', async ({ orderId, reason, details, items }, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/orders/${orderId}/request-return`, { reason, details, items });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to submit return request');
  }
});

// ---- rest of file (checkAuth, slice definition, extraReducers) — unchanged ----
export const checkAuth = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    currentOrder: null,
    history: [],
    loading: false,
    error: null,
    createStatus: 'idle',
    stats: null,
    isAuthenticated: checkAuth()
  },
  reducers: {
    clearCurrentOrder(state) { state.currentOrder = null; },
    resetCreateStatus(state) { state.createStatus = 'idle'; },
    clearError(state) { state.error = null; },
    setAuthStatus(state) { state.isAuthenticated = checkAuth(); }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAllOrders.fulfilled, (state, action) => { state.loading = false; state.items = action.payload || []; })
      .addCase(fetchAllOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(createOrder.pending, (state) => { state.createStatus = 'loading'; state.error = null; })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.currentOrder = action.payload.order || action.payload;
        if (action.payload.order) state.items.unshift(action.payload.order);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload;
        if (action.payload === 'Your session has expired. Please login again.') state.isAuthenticated = false;
      })

      .addCase(fetchOrderById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchOrderById.fulfilled, (state, action) => { state.loading = false; state.currentOrder = action.payload; })
      .addCase(fetchOrderById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchOrderHistory.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => { state.loading = false; state.history = action.payload.history || action.payload || []; })
      .addCase(fetchOrderHistory.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload.order || action.payload;
        const index = state.items.findIndex((item) => item._id === updatedOrder._id);
        if (index !== -1) state.items[index] = updatedOrder;
        if (state.currentOrder?._id === updatedOrder._id) state.currentOrder = updatedOrder;
        const historyIndex = state.history.findIndex((item) => item._id === updatedOrder._id);
        if (historyIndex !== -1) state.history[historyIndex] = updatedOrder;
      })

      .addCase(requestReturn.fulfilled, (state, action) => {
        const updatedOrder = action.payload.order || action.payload;
        if (state.currentOrder?._id === updatedOrder._id) state.currentOrder = updatedOrder;
        const index = state.items.findIndex((item) => item._id === updatedOrder._id);
        if (index !== -1) state.items[index] = updatedOrder;
      })

      .addCase(fetchReturnRequests.fulfilled, (state, action) => { state.returns = action.payload || []; })

      .addCase(fetchDashboardStats.fulfilled, (state, action) => { state.stats = action.payload; });
  },
});

export const { clearCurrentOrder, resetCreateStatus, clearError, setAuthStatus } = orderSlice.actions;
export default orderSlice.reducer;