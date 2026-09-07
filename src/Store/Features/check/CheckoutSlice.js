// CheckoutSlice.js
import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'checkoutDraft';

function loadDraft() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
  } catch {
    return null;
  }
}

function persist(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    step: state.step,
    shippingAddress: state.shippingAddress,
    billingAddress: state.billingAddress,
    payment: state.payment,
    shippingMethod: state.shippingMethod,
    orderNotes: state.orderNotes,
  }));
}

const draft = loadDraft();

const defaultState = {
  step: 1,
  shippingAddress: { firstName: '', lastName: '', email: '', phone: '', address: '', apartment: '', city: '', state: '', zipCode: '', country: 'Ghana' },
  billingAddress: { sameAsShipping: true, firstName: '', lastName: '', address: '', apartment: '', city: '', state: '', zipCode: '', country: 'Ghana' },
  payment: { method: 'momo', reference: '', network: '', phone: '' },
  shippingMethod: 'standard',
  orderNotes: '',
  loading: false,
  error: null,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: { ...defaultState, ...draft },   // ✅ rehydrate on load
  reducers: {
    setStep: (state, action) => { state.step = action.payload; persist(state); },
    nextStep: (state) => { state.step += 1; persist(state); },
    prevStep: (state) => { state.step = Math.max(1, state.step - 1); persist(state); },
    updateShippingAddress: (state, action) => { state.shippingAddress = { ...state.shippingAddress, ...action.payload }; persist(state); },
    updateBillingAddress: (state, action) => { state.billingAddress = { ...state.billingAddress, ...action.payload }; persist(state); },
    setBillingSameAsShipping: (state, action) => {
      state.billingAddress.sameAsShipping = action.payload;
      if (action.payload) {
        state.billingAddress = { ...state.billingAddress, ...state.shippingAddress };
      }
      persist(state);
    },
    updatePayment: (state, action) => { state.payment = { ...state.payment, ...action.payload }; persist(state); },
    setShippingMethod: (state, action) => { state.shippingMethod = action.payload; persist(state); },
    setOrderNotes: (state, action) => { state.orderNotes = action.payload; persist(state); },
    setLoading: (state, action) => { state.loading = action.payload; },
    setError: (state, action) => { state.error = action.payload; },
    clearError: (state) => { state.error = null; },
    resetCheckout: (state) => {
      Object.assign(state, defaultState);
      localStorage.removeItem(STORAGE_KEY);   // ✅ clear the draft once order completes
    },
  },
});

export const {
  setStep, nextStep, prevStep, updateShippingAddress, updateBillingAddress,
  setBillingSameAsShipping, updatePayment, setShippingMethod, setOrderNotes,
  setLoading, setError, clearError, resetCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;