import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:7000/api/products";

/*
|--------------------------------------------------------------------------
| Helper: extract useful backend error
|--------------------------------------------------------------------------
*/
const getErrorMessage = (error, fallback) => {
  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    (typeof error.response?.data === "string"
      ? error.response.data
      : null) ||
    error.message ||
    fallback
  );
};

/*
|--------------------------------------------------------------------------
| GET ALL PRODUCTS
| GET /api/products
|--------------------------------------------------------------------------
*/
export const fetchProduct = createAsyncThunk(
  "products/fetchProduct",
  async (filters = {}, { rejectWithValue }) => {
    try {
      console.log("📦 Fetching products with filters:", filters);

      const response = await axios.get(API_URL, {
        params: filters,
      });

      console.log("✅ Products API response:", response.data);

      /*
       * Supports either:
       *
       * { products: [...] }
       *
       * OR
       *
       * [...]
       */
      return response.data;
    } catch (error) {
      console.error(
        "❌ Fetch products error:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch products")
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| GET SINGLE PRODUCT
| GET /api/products/:id
|--------------------------------------------------------------------------
*/
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (productId, { rejectWithValue }) => {
    try {
      console.log("🔍 Fetching product:", productId);

      const response = await axios.get(`${API_URL}/${productId}`);

      console.log("✅ Product response:", response.data);

      /*
       * Supports:
       * { product: {...} }
       * OR
       * {...}
       */
      return response.data.product || response.data;
    } catch (error) {
      console.error(
        "❌ Fetch product by ID error:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        getErrorMessage(error, "Failed to fetch product")
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| ADD PRODUCT
| POST /api/products
|--------------------------------------------------------------------------
*/
export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const adminInfo = JSON.parse(
        localStorage.getItem("adminInfo") || "null"
      );

      const token =
        adminInfo?.token ||
        localStorage.getItem("token") ||
        localStorage.getItem("userToken");

      if (!token) {
        return rejectWithValue(
          "Authentication required. Please login as administrator."
        );
      }

      const response = await axios.post(API_URL, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response.data.product || response.data;
    } catch (error) {
      console.error(
        "❌ Add product error:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        getErrorMessage(error, "Failed to add product")
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| UPLOAD PRODUCT IMAGE
|--------------------------------------------------------------------------
*/
export const handleImageUpload = createAsyncThunk(
  "products/handleImageUpload",
  async (formData, { rejectWithValue }) => {
    try {
      const adminInfo = JSON.parse(
        localStorage.getItem("adminInfo") || "null"
      );

      const token =
        adminInfo?.token ||
        localStorage.getItem("token") ||
        localStorage.getItem("userToken");

      if (!token) {
        return rejectWithValue(
          "Authentication required. Please login as administrator."
        );
      }

      const response = await axios.post(
        `${API_URL}/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "❌ Product image upload error:",
        error.response?.data || error.message
      );

      return rejectWithValue(
        getErrorMessage(error, "Failed to upload product image")
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| INITIAL STATE
|--------------------------------------------------------------------------
*/
const initialState = {
  items: [],
  currentProduct: null,

  loading: false,

  /*
   * idle | loading | succeeded | failed
   */
  status: "idle",

  error: null,
};

/*
|--------------------------------------------------------------------------
| SLICE
|--------------------------------------------------------------------------
*/
const productSlice = createSlice({
  name: "products",

  initialState,

  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },

    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /*
      |--------------------------------------------------------------------------
      | FETCH ALL PRODUCTS
      |--------------------------------------------------------------------------
      */

      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";

        const payload = action.payload;

        if (Array.isArray(payload)) {
          state.items = payload;
        } else if (Array.isArray(payload?.products)) {
          state.items = payload.products;
        } else {
          state.items = [];
        }

        console.log("✅ Redux products:", state.items);
      })

      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";

        state.error =
          action.payload || "Failed to fetch products";

        state.items = [];
      })

      /*
      |--------------------------------------------------------------------------
      | FETCH SINGLE PRODUCT
      |--------------------------------------------------------------------------
      */

      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })

      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.currentProduct = null;

        state.error =
          action.payload || "Failed to fetch product";
      })

      /*
      |--------------------------------------------------------------------------
      | ADD PRODUCT
      |--------------------------------------------------------------------------
      */

      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;

        const product = action.payload;

        if (product) {
          state.items.unshift(product);
        }
      })

      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload || "Failed to add product";
      })

      /*
      |--------------------------------------------------------------------------
      | IMAGE UPLOAD
      |--------------------------------------------------------------------------
      */

      .addCase(handleImageUpload.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(handleImageUpload.fulfilled, (state, action) => {
        state.loading = false;

        if (!state.currentProduct) {
          state.currentProduct = {};
        }

        if (!state.currentProduct.images) {
          state.currentProduct.images = [];
        }

        if (action.payload?.imageUrl) {
          state.currentProduct.images.push({
            url: action.payload.imageUrl,
            alt: action.payload.alt || "",
          });
        }
      })

      .addCase(handleImageUpload.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload || "Failed to upload product image";
      });
  },
});

export const {
  clearCurrentProduct,
  clearError,
} = productSlice.actions;

export default productSlice.reducer;