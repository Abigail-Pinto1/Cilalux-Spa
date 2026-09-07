/* eslint-disable no-undef */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:7000/api/user';

// Async thunks for authentication
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:7000/api/user/register", userData);
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('🔐 Attempting login for:', credentials.email);
      
      // ✅ Make sure this URL is correct
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      const { data } = response;
      
      console.log('🔐 Login response received:', data);
      
      if (!data.token) {
        console.error('❌ No token in login response');
        return rejectWithValue('No token received from server');
      }
      
      // Store token in localStorage
      localStorage.setItem('token', data.token);
      console.log('✅ Token stored in localStorage');
      
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('✅ User data stored');
      }
      
      // ✅ Store the token in the state
      return data;
    } catch (error) {
      console.error('❌ Login error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem('user');
      return null;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    await axios.post('/api/logout'); // adjust API if needed
    return true;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Logout failed');
  }
});

// Check for existing user on page load
const user = JSON.parse(localStorage.getItem('user'));

const userSlice = createSlice({
  name: 'auth',
  initialState: {
    user: user || null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.success = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Registration failed';
        state.user = null;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Login failed';
        state.user = null;
      })
      // Logout
       builder
    .addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    });
  },
});

export const { clearError, clearSuccess } = userSlice.actions;
export default userSlice.reducer;