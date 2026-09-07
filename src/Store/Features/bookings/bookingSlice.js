// src/Store/Features/bookings/bookingSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../Auth/utils/axiosInstance';
import adminApi from '../../Auth/utils/adminAxiosInstance';

export const checkAvailability = createAsyncThunk('bookings/checkAvailability', async ({ date, time }, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/bookings/availability?date=${date}&time=${time}`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to check availability');
  }
});

export const createBooking = createAsyncThunk('bookings/createBooking', async (bookingData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/bookings', bookingData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create booking');
  }
});

export const fetchMyBookings = createAsyncThunk('bookings/fetchMyBookings', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/bookings/mine');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load bookings');
  }
});

export const fetchAllBookings = createAsyncThunk('bookings/fetchAllBookings', async (_, { rejectWithValue }) => {
  try {
    const { data } = await adminApi.get('/bookings/admin/all');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to load bookings');
  }
});

export const updateBookingStatus = createAsyncThunk('bookings/updateBookingStatus', async ({ bookingId, status, description }, { rejectWithValue }) => {
  try {
    const { data } = await adminApi.put(`/bookings/admin/update-status/${bookingId}`, { status, description });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update booking');
  }
});

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    items: [],
    mine: [],
    loading: false,
    createStatus: 'idle',
    error: null,
    availability: null,
  },
  reducers: {
    resetCreateStatus(state) { state.createStatus = 'idle'; },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAvailability.fulfilled, (state, action) => { state.availability = action.payload.available; })

      .addCase(createBooking.pending, (state) => { state.createStatus = 'loading'; state.error = null; })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.createStatus = 'succeeded';
        state.mine.unshift(action.payload.booking);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.createStatus = 'failed';
        state.error = action.payload;
      })

      .addCase(fetchMyBookings.pending, (state) => { state.loading = true; })
      .addCase(fetchMyBookings.fulfilled, (state, action) => { state.loading = false; state.mine = action.payload.bookings || []; })
      .addCase(fetchMyBookings.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchAllBookings.pending, (state) => { state.loading = true; })
      .addCase(fetchAllBookings.fulfilled, (state, action) => { state.loading = false; state.items = action.payload || []; })
      .addCase(fetchAllBookings.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        const updated = action.payload.booking;
        const idx = state.items.findIndex((b) => b._id === updated._id);
        if (idx !== -1) state.items[idx] = updated;
      });
  },
});

export const { resetCreateStatus, clearError } = bookingSlice.actions;
export default bookingSlice.reducer;