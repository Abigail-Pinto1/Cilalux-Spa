import { createSlice } from '@reduxjs/toolkit';

const saved = JSON.parse(localStorage.getItem('cart')) || {};

const initialState = {
  cartItems: saved.cartItems || [],
  shippingAddress: saved.shippingAddress || {},
  totalQuantity: saved.totalQuantity || 0,
  totalAmount: saved.totalAmount || 0,
};

// ── helpers ──────────────────────────────────────────────────────────────────

function recalculate(state) {
  state.totalQuantity = state.cartItems.reduce((sum, x) => sum + x.qty, 0);
  state.totalAmount   = state.cartItems.reduce((sum, x) => sum + x.price * x.qty, 0);
}

function persist(state) {
  localStorage.setItem('cart', JSON.stringify({
    cartItems:       state.cartItems,
    shippingAddress: state.shippingAddress,
    totalQuantity:   state.totalQuantity,
    totalAmount:     state.totalAmount,
  }));
}

// ── slice ────────────────────────────────────────────────────────────────────

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // payload: { product, name, image, price, qty }
    addToCart: (state, action) => {
      const incoming = action.payload;
      const existing = state.cartItems.find(x => x.product === incoming.product);

      if (existing) {
        existing.qty += incoming.qty ?? 1;   // increment qty if already in cart
      } else {
        state.cartItems.push({ ...incoming, qty: incoming.qty ?? 1 });
      }

      recalculate(state);
      persist(state);
    },

    // payload: product id string
    removeItem: (state, action) => {
      state.cartItems = state.cartItems.filter(x => x.product !== action.payload);
      recalculate(state);
      persist(state);
    },

    // payload: { product, qty }
    updateQty: (state, action) => {
      const { product, qty } = action.payload;
      const item = state.cartItems.find(x => x.product === product);
      if (item) {
        item.qty = Math.max(1, qty);
      }
      recalculate(state);
      persist(state);
    },

    // payload: shippingAddress object
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      persist(state);
    },

    clearCart: (state) => {
      state.cartItems     = [];
      state.totalQuantity = 0;
      state.totalAmount   = 0;
      persist(state);
    },
  },
});

export const {
  addToCart,
  removeItem,
  updateQty,
  saveShippingAddress,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;