import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
 

export const fetchAdminStats = createAsyncThunk('admin/fetchStats', async (_, thunkAPI) => {
  try {
    const { data } = await axios.get('/api/admin/stats');
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const fetchRecentOrders = createAsyncThunk(
  'admin/fetchRecentOrders',
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get('/api/admin/recent-orders');
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    stats: null,
    recentOrders: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchRecentOrders.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchRecentOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.recentOrders = action.payload;
      })
      .addCase(fetchRecentOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});





export default adminSlice.reducer;
