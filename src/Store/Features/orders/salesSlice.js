import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:7000/api/admin/sales';

// Async thunks for API calls [citation:1][citation:9]
export const fetchSales = createAsyncThunk(
  'sales/fetchSales',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_URL, { 
        params: filters,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch sales records");
    }
  }
);

export const fetchSalesStats = createAsyncThunk(
  'sales/fetchSalesStats',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      // console.log("TOKEN:", token);
      const response = await axios.get('http://localhost:7000/api/admin/sales/stats',
      
       {
          headers: {
            Authorization: `Bearer ${token}`, // Pass routeProtect rules
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch stats");
    }
  }
);

export const addSale = createAsyncThunk(
  'sales/addSale',
  async (saleData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, saleData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateSale = createAsyncThunk(
  'sales/updateSale',
  async ({ id, saleData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, saleData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteSale = createAsyncThunk(
  'sales/deleteSale',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const salesSlice = createSlice({
  name: 'sales',
  initialState: {
    items: [],
    stats: {
      total: {},
      monthly: [],
    },
    loading: false,
    error: null,
    filters: {
      startDate: '',
      endDate: '',
      category: '',
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Sales
      .addCase(fetchSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch sales';
      })
      // Fetch Stats
      .addCase(fetchSalesStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload || { total: {}, monthly: [] };
      })
      .addCase(fetchSalesStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch stats';
      })
      // Add Sale
      .addCase(addSale.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      // Update Sale
      .addCase(updateSale.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete Sale
      .addCase(deleteSale.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
      });
  },
});

export const { setFilters, clearError } = salesSlice.actions;
export default salesSlice.reducer;