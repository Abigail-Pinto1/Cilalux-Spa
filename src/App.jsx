import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './Layout/RootLayout';
import ProductLayout from './Layout/ProductLayout';
import AdminLayout from './Layout/AdminLayout';
import ProtectedRoute from './Products/auth/ProtectedRoute';
// import ErrorPage from './Pages/ErrorPage';

// Frontend pages
import Hero from './Components/Hero';
import Appointment from './Pages/Appointment';
import Contact from './Pages/Contact';
import Services from './Pages/Services';
import Skincare from './Services/Skincare';
import Facials from './Services/Facials';
import Haircare from './Services/Haircare';
import Makeup from './Services/Makeup';
import Massage from './Services/Massage';
import Nails from './Services/Nails';
import Waxing from './Services/Waxing';
import Body from './Services/Body';
import ForgotPassword from './Products/auth/ForgotPassword';
import ProductDetail from './Products/OnlineStore/ProductDetail';



// Admin pages
import AdminRegister from './Products/Admin/AdminRegister';
import Dashboard from './Products/Admin/PanelStructure/Menu/pages/Dashboard';
import AdminHero from './Products/Admin/AdminHero';
import AddProduct from './Products/Admin/PanelStructure/Menu/onlineStore/AddProducts';
import EditProduct from './Products/Admin/PanelStructure/Menu/Ecommerce/EditProduct';
import ProductPayment from './Products/Admin/PanelStructure/Menu/Ecommerce/ProductPayment';
import OutOfStock from './Products/Admin/PanelStructure/Menu/Inventory/OutOfStock';
import ProductInventory from './Products/Admin/PanelStructure/Menu/Inventory/ProductInventory';
import Stock from './Products/Admin/PanelStructure/Menu/Inventory/Stock';
import Analytics from './Products/Admin/PanelStructure/Menu/pages/Analytics';
import MessagesDB from './Products/Admin/PanelStructure/Menu/Messages/MessagesDB';
import ResetPassword from './Products/auth/ResetPassword';
import StoreHome from './Products/OnlineStore/StoreHome';
import ProductsPage from './Products/OnlineStore/ProductsPage';
import TrackProducts from './Products/Admin/PanelStructure/Menu/onlineStore/TrackProducts';
import Users from './Products/Admin/PanelStructure/Menu/pages/Users';
import PaymentMethods from './Products/Admin/PanelStructure/Menu/Transactions/PaymentMethods';
import Refund from './Products/Admin/PanelStructure/Menu/Transactions/Refund';
import AdminUpload from './Products/Admin/UploadImg';
import Login from './Products/auth/login';
import Shop from './Products/OnlineStore/ProductGrid';
import ProductList from './Products/ProductGrid/ProductList';
import ProductCard from './Products/ProductGrid/ProductCard';
import FeaturedProducts from './Products/ProductGrid/FeaturedProducts';
import Account from './Products/productPages/Account';
import Products from './Products/ProductGrid/Products';
import Cart from './Products/productPages/Cart';
import Checkout from './Products/productPages/Checkout';
import CheckoutProgress from './Products/productPages/CheckoutProgress';
import ShippingStep from './Products/productPages/ShippingStep';
import AddProducts from './Products/Admin/PanelStructure/Menu/onlineStore/AddProducts';
import CompletedTransactions from './Products/Admin/PanelStructure/Menu/Transactions/CompletedTransactions';
import Payments from './Products/Admin/PanelStructure/Menu/Transactions/Payments';
import Sales from './Products/Admin/PanelStructure/Menu/Transactions/Sales';
import AdminLogin from './Products/Admin/AdminLogin';
import Register from './Products/auth/register';
import MyOrders from './Products/productPages/MyOrders';
import OrderTracking from './Products/productPages/OrderTracking';
import AuthDebug from './AuthCompo/AuthDebug';
import Orders from './Products/Admin/PanelStructure/Menu/Ecommerce/Orders';
import AdminProtectedRoute from './Products/Admin/AdminProtectedRoute';
import AdminLogout from './Products/Admin/AdminLogout';
import MyBookings from './Pages/MyBookings';
import Bookings from './Products/Admin/PanelStructure/Menu/Ecommerce/Bookings';



const router = createBrowserRouter([
  // Public frontend routes
  {
    path: '/',
    element: <RootLayout />,
     
    children: [
      { index: true, element: <Hero /> },
      { path: 'appointment', element: <Appointment /> },
      { path: 'contact', element: <Contact /> },
      { path: 'services', element: <Services /> },
      { path: 'services/skincare', element: <Skincare /> },
      { path: 'services/facials', element: <Facials /> },
      { path: 'services/haircare', element: <Haircare /> },
      { path: 'services/makeup', element: <Makeup /> },
      { path: 'services/massage', element: <Massage /> },
      { path: 'services/nails', element: <Nails /> },
      { path: 'services/waxing', element: <Waxing /> },
      { path: 'services/body', element: <Body /> },
    ],
  },

  // Product pages
  {
    path: '/products',
    element: <ProductLayout />,
    children: [
      { index: true, element: <StoreHome /> },
      {path: 'addproduct', element: <AddProduct/> },
      {path: 'addproducts', element: <AddProducts/> }, 
      {path: 'editproduct', element: <EditProduct/>},
      {path: 'productpayment', element: <ProductPayment/>},
      {path: 'products', element: <Products/>},
      
    ],
  },

  // Admin routes
 {
  path: 'admin',
  element: <AdminLayout />,
  children: [
    // Public admin pages
    
    { path: 'adminregister', element: <AdminRegister /> },
    // { path: 'admin/login', element: <Login /> },
    { path: 'logout', element: <AdminLogout /> },
    { path: 'reset-password/:token', element: <ResetPassword /> },

    // Protected admin pages
{ path: 'adminhero', element: <AdminProtectedRoute><AdminHero /></AdminProtectedRoute> },
{ path: 'dashboard', element: <AdminProtectedRoute><Dashboard /></AdminProtectedRoute> },
{ path: 'add-product', element: <AdminProtectedRoute><AddProducts /></AdminProtectedRoute> },
{ path: 'edit-product', element: <AdminProtectedRoute><EditProduct /></AdminProtectedRoute> },
{ path: 'payment', element: <AdminProtectedRoute><ProductPayment /></AdminProtectedRoute> },
{ path: 'out-of-stock', element: <AdminProtectedRoute><OutOfStock /></AdminProtectedRoute> },
{ path: 'inventory', element: <AdminProtectedRoute><ProductInventory /></AdminProtectedRoute> },
{ path: 'stock', element: <AdminProtectedRoute><Stock /></AdminProtectedRoute> },
{ path: 'analytics', element: <AdminProtectedRoute><Analytics /></AdminProtectedRoute> },
{ path: 'orders', element: <AdminProtectedRoute><Orders /></AdminProtectedRoute> },
{ path: 'messages', element: <AdminProtectedRoute><MessagesDB /></AdminProtectedRoute> },
{ path: 'sales', element: <AdminProtectedRoute><Sales /></AdminProtectedRoute> },
{ path: 'completed', element: <AdminProtectedRoute><CompletedTransactions /></AdminProtectedRoute> },
{ path: 'payments', element: <AdminProtectedRoute><Payments /></AdminProtectedRoute> },
{ path: 'refund', element: <AdminProtectedRoute><Refund /></AdminProtectedRoute> },
{ path: 'payment-methods', element: <AdminProtectedRoute><PaymentMethods /></AdminProtectedRoute>},
{ path: 'users', element: <AdminProtectedRoute><Users /></AdminProtectedRoute> },
{ path: 'bookings', element: <AdminProtectedRoute><Bookings /></AdminProtectedRoute> },
  ]
},
{ path: 'adminregister', element: <AdminRegister /> },


{
  path: '/store',
  element: <ProductLayout />,
  
  children: [
    { index: true, element: <StoreHome /> },
    { path: 'products-page', element: <ProductsPage /> },
    { path: 'product/:id', element: <ProductDetail /> },
    { path: 'category/:category', element: <ProductsPage /> },
    { path: 'track', element: <TrackProducts /> },
    { path: 'refund', element: <Refund /> },
    { path: 'product-grid', element: <Shop /> }, 
    { path: 'pro-list', element: <ProductList /> },
    { path: 'pro-card', element: <ProductCard /> },
    { path: 'featured', element: <FeaturedProducts /> },
    { path: 'account', element: <Account /> },
    { path: 'products', element: <Products /> },
    { path: 'cart', element: <Cart /> },
    { path: 'login', element: <Login /> },
    { path: 'register', element: <Register />},
    { path: 'checkout', element: <ProtectedRoute><Checkout /></ProtectedRoute> },
    { path: 'progress', element: <CheckoutProgress /> },
    { path: 'shipping', element: <ShippingStep /> },
    { path: 'inventory', element: <ProductInventory /> },
    { path: 'my-orders', element: <ProtectedRoute><MyOrders /></ProtectedRoute> },   
    { path: 'order-tracking/:id', element: <OrderTracking/> },
    { path: 'my-bookings', element: <ProtectedRoute><MyBookings /></ProtectedRoute> },
  ],
},

// Dev-only auth debug route (top-level)
{
  path: 'auth-debug',
  // eslint-disable-next-line no-undef
  element: process.env.NODE_ENV === 'development' ? <AuthDebug /> : null,
},



]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;