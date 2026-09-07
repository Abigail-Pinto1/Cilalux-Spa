/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 🧠 Simulated API login (replace with your real backend API)
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  // eslint-disable-next-line no-unused-vars
  async ({ email, password }, thunkAPI) => {
    try {
      // Mocked API response
      const response = await new Promise((resolve) =>
        setTimeout(() => {
          resolve({
            token: "mocked-jwt-token-12345",
            expiresIn: 3600, // 1 hour in seconds
            user: { name: "Alex Johnson", email },
          });
        }, 1000)
      );
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue("Invalid credentials");
    }
  }
);

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  expiry: null,
  loading: false,
  error: null,
};

// 🔐 Auth slice
const dashboardSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.expiry = null;
      localStorage.clear();
    },
    restoreSession: (state, action) => {
      const { token, user, expiry } = action.payload;
      state.isAuthenticated = true;
      state.user = user;
      state.token = token;
      state.expiry = expiry;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { token, expiresIn, user } = action.payload;
        const expiry = Date.now() + expiresIn * 1000;
        state.loading = false;
        state.isAuthenticated = true;
        state.user = user;
        state.token = token;
        state.expiry = expiry;

        // Persist to localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("expiry", expiry);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, restoreSession } = dashboardSlice.actions;
export default dashboardSlice.reducer;