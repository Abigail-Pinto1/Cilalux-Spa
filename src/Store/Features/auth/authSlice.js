import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../Auth/utils/axiosInstance';

// ✅ Use environment variable for API URL
const API_URL = 'http://localhost:7000/api';

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      // Use the axios instance with baseURL
      const response = await axios.post('/auth/register', userData);
      // OR use full URL:
      // const response = await axios.post(`${API_URL}/auth/register`, userData);
      
      const { data } = response;
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        console.log('✅ Token stored from registration');
      }
      
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      console.error('❌ Registration error:', error.response?.data);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('🔐 Attempting login for:', credentials.email);
      
      const response = await axios.post('/auth/login', credentials);
      const { data } = response;
      
      console.log('🔐 Login response received:', data.success ? '✅ Success' : '❌ Failed');
      
      if (!data.token) {
        console.error('❌ No token in login response');
        return rejectWithValue('No token received from server');
      }
      
      localStorage.setItem('token', data.token);
      console.log('✅ Token stored in localStorage');
      
      if (data.refreshToken) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
      
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('✅ User data stored');
      }
      
      return data;
    } catch (error) {
      console.error('❌ Login error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userToken');
      localStorage.removeItem('authToken');
      console.log('✅ User logged out, tokens cleared');
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get user from localStorage
const getUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      // If token is inside user object, extract it
      if (user.token && !localStorage.getItem('token')) {
        localStorage.setItem('token', user.token);
      }
      return user;
    }
    return null;
  } catch (e) {
    console.error('Error parsing user from localStorage:', e);
    return null;
  }
};

const getTokenFromStorage = () => {
  const token = localStorage.getItem('token');
  return token || null;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getUserFromStorage(),
    token: getTokenFromStorage(),
    loading: false,
    error: null,
    success: false,
    isAuthenticated: !!getTokenFromStorage(),
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    setAuthStatus: (state) => {
      const token = localStorage.getItem('token');
      state.isAuthenticated = !!token;
      state.token = token || null;
      if (token) {
        state.user = getUserFromStorage();
      }
    },
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
      if (action.payload) {
        localStorage.setItem('token', action.payload);
      }
    }
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
        state.user = action.payload.user || action.payload;
        state.token = action.payload.token || null;
        state.success = true;
        state.error = null;
        state.isAuthenticated = !!state.token;
        console.log('✅ Registration successful');
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload?.error || 'Registration failed';
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || action.payload;
        state.token = action.payload.token || null;
        state.success = true;
        state.error = null;
        state.isAuthenticated = !!state.token;
        console.log('✅ Login successful');
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload?.error || 'Login failed';
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        console.error('❌ Login rejected:', state.error);
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.success = false;
        state.loading = false;
        console.log('✅ User logged out');
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
      });
  },
});

export const { clearError, clearSuccess, setAuthStatus, setToken } = authSlice.actions;
export default authSlice.reducer;