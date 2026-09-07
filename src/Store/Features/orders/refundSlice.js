import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:7000/api/admin/refund';

// ✅ Async Thunk: Fetch all refund records from the backend
export const fetchAllrefunds = createAsyncThunk(
  'refund/fetchAllrefunds',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data; // Expects an array of refund items
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load refund registry logs");
    }
  }
);

// ✅ Async Thunk: Approve or reject a refund lifecycle request
export const processRefundAction = createAsyncThunk(
  'refund/processRefundAction',
  async ({ refundId, status }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${API_URL}/${refundId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update refund status");
    }
  }
);

const refundSlice = createSlice({
  name: 'refund',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllrefunds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllrefunds.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchAllrefunds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(processRefundAction.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload; // Update live state inside storage container arrays
        }
      });
  },
});

export default refundSlice.reducer;