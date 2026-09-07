import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Features/auth/authSlice.js";
import cartReducer from "./Features/cart/cartSlice.js";
import productReducer from "./Features/product/productSlice.js"
import adminReducer from "./Features/admin/adminSlice.js";
import salesReducer from "./Features/orders/salesSlice.js"
import orderReducer from './Features/orders/orderSlice.js'
import refundReducer from "./Features/orders/refundSlice.js"
import CheckoutReducer from "./Features/check/CheckoutSlice.js"
import bookingReducer from "./Features/bookings/bookingSlice.js";
import userReducer from './Features/user/userSlice';

const store = configureStore({
    reducer: {
        auth : authReducer,
        cart: cartReducer,
        products: productReducer,
        admin: adminReducer, 
        sales:  salesReducer,
        orders: orderReducer,
        refunds: refundReducer,
        checkout: CheckoutReducer,
        bookings: bookingReducer, 
        users: userReducer,
       

        
        
    },

     middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),


});

export default store;