// CompleteStep.jsx - Enhanced with better navigation
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Package, ListOrdered, Download, Truck, ShoppingBag } from 'lucide-react';
import { resetCheckout } from '../../Store/Features/check/CheckoutSlice';
import { fetchOrderHistory } from '../../Store/Features/orders/orderSlice';

export default function CompleteStep() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [autoRedirect, setAutoRedirect] = useState(true);
  const [navigationAttempted, setNavigationAttempted] = useState(false);
  
  const { shippingAddress = {}, payment = {} } = useSelector(state => state.checkout) || {};
  const currentOrder = useSelector(state => state.orders?.currentOrder);
  const user = useSelector(state => state.auth?.user);
  
  // Get the created order from the state
  useEffect(() => {
    if (currentOrder) {
      setOrder(currentOrder);
      localStorage.setItem('lastOrder', JSON.stringify(currentOrder));
      console.log('📦 Order loaded from Redux:', currentOrder.orderNumber);
    } else {
      const savedOrder = localStorage.getItem('lastOrder');
      if (savedOrder) {
        try {
          const parsed = JSON.parse(savedOrder);
          setOrder(parsed);
          console.log('📦 Order loaded from localStorage:', parsed.orderNumber);
        } catch (e) {
          console.error('Error parsing saved order:', e);
        }
      }
    }
  }, [currentOrder]);

  // ✅ AUTO-REDIRECT: After 5 seconds, go to My Orders
  useEffect(() => {
    if (order && autoRedirect && !isRedirecting && !navigationAttempted) {
      console.log('⏳ Auto-redirect countdown started');
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            console.log('🔄 Auto-redirecting to My Orders');
            goToMyOrders();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [order, autoRedirect, isRedirecting, navigationAttempted]);

  const handleDownloadReceipt = async () => {
    if (!order?._id) return;
    try {
      window.open(`http://localhost:7000/api/orders/${order._id}/download-receipt`, '_blank');
    } catch (error) {
      console.error('Error downloading receipt:', error);
      alert('Failed to download receipt. Please try again.');
    }
  };

  const handleTrackOrder = () => {
    if (!order?._id) return;
    navigate(`/store/track/${order._id}`);
  };

  const goToMyOrders = () => {
    if (isRedirecting || navigationAttempted) return;
    
    console.log('🚀 Navigating to My Orders...');
    setNavigationAttempted(true);
    setIsRedirecting(true);
    setAutoRedirect(false);
    
    // Reset checkout state
    dispatch(resetCheckout());
    
    // Fetch orders before navigating
    if (user?._id) {
      console.log('📥 Fetching order history for user:', user._id);
      dispatch(fetchOrderHistory(user._id));
    }
    
    // Navigate to MyOrders with state
    console.log('📍 Navigating to /store/my-orders with highlight:', order?._id);
    navigate('/store/my-orders', { 
      state: { 
        highlightOrder: order?._id,
        fromCheckout: true 
      },
      replace: true 
    });
  };

  const handleContinueShopping = () => {
    setAutoRedirect(false);
    dispatch(resetCheckout());
    localStorage.removeItem('lastOrder');
    navigate('/store/products');
  };

  // If no order is found, show loading
  if (!order) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_4px_30px_rgba(255,182,193,0.25)] p-8 sm:p-12 text-center max-w-2xl mx-auto lg:col-span-3">
        <div className="flex justify-center mb-6">
          <div className="bg-amber-100 rounded-full p-4">
            <Package className="text-amber-500" size={56} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Your Order</h2>
        <p className="text-gray-600">Your order is being processed. Please wait...</p>
        <button
          onClick={() => navigate('/store')}
          className="mt-6 px-6 py-3 rounded-full font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_4px_30px_rgba(255,182,193,0.25)] p-8 sm:p-12 text-center max-w-2xl mx-auto lg:col-span-3">
      <div className="flex justify-center mb-6">
        <div className="bg-emerald-100 rounded-full p-4">
          <CheckCircle2 className="text-emerald-500" size={56} />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed! 🎉</h2>
      <p className="text-gray-600 mb-6">
        Thank you{shippingAddress.firstName ? `, ${shippingAddress.firstName}` : ''} — your order has
        been placed successfully.
      </p>

      {/* Auto-redirect countdown */}
      {autoRedirect && !isRedirecting && (
        <div className="mb-6 p-3 bg-pink-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Redirecting to <strong>My Orders</strong> in <span className="text-pink-600 font-bold">{countdown}</span> seconds...
          </p>
          <button
            onClick={() => setAutoRedirect(false)}
            className="text-xs text-pink-600 hover:text-pink-700 underline mt-1"
          >
            Stay on this page
          </button>
        </div>
      )}

      {isRedirecting && (
        <div className="mb-6 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-600">
            <span className="animate-spin inline-block mr-2">⟳</span>
            Taking you to My Orders...
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-pink-50 rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Order Reference</p>
          <p className="text-lg font-semibold text-pink-600">
            {order?.orderNumber || 'Processing...'}
          </p>
        </div>

        <div className="bg-emerald-50 rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</p>
          <p className="text-lg font-semibold text-emerald-600 capitalize">
            {order?.status || 'Confirmed'}
          </p>
        </div>

        <div className="bg-amber-50 rounded-xl p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Paid</p>
          <p className="text-lg font-semibold text-amber-600">
            {order?.currency || 'GHS'} {order?.totalAmount?.toFixed(2) || '0.00'}
          </p>
        </div>
      </div>

      <div className="text-left bg-gray-50 rounded-xl p-4 mb-8 space-y-1 text-sm text-gray-600">
        <p className="flex items-center gap-2 font-medium text-gray-800">
          <Package size={16} className="text-pink-500" />
          Delivery Details
        </p>
        <p>
          {shippingAddress.address || order?.shippingAddress?.address}
          {shippingAddress.apartment ? `, ${shippingAddress.apartment}` : ''}
        </p>
        <p>
          {shippingAddress.city || order?.shippingAddress?.city}, {shippingAddress.state || order?.shippingAddress?.state} {shippingAddress.zipCode || order?.shippingAddress?.zipCode}
        </p>
        <p>A confirmation email has been sent to {shippingAddress.email || order?.shippingAddress?.email || 'your email address'}.</p>
        {payment.method === 'bank_transfer' && (
          <p className="text-amber-700 mt-2">
            Your order will be processed once your bank transfer is confirmed.
          </p>
        )}
        {order?.trackingNumber && (
          <p className="text-pink-600 mt-2 flex items-center gap-2">
            <Truck size={16} />
            Tracking Number: <span className="font-medium">{order.trackingNumber}</span>
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        {/* View My Orders - Primary Action */}
        <button
          onClick={goToMyOrders}
          disabled={isRedirecting}
          className={`flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-8 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 ${
            isRedirecting ? 'cursor-not-allowed' : ''
          }`}
        >
          {isRedirecting ? (
            <>
              <span className="animate-spin mr-2">⟳</span>
              Redirecting...
            </>
          ) : (
            <>
              <ListOrdered size={18} />
              View My Orders
            </>
          )}
        </button>

        <button
          onClick={handleDownloadReceipt}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all"
        >
          <Download size={18} />
          Download Receipt
        </button>

        <button
          onClick={handleTrackOrder}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all"
        >
          <Truck size={18} />
          Track Order
        </button>

        <button
          onClick={handleContinueShopping}
          className="px-6 py-3 rounded-full font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ShoppingBag size={18} className="inline mr-2" />
          Continue Shopping
        </button>
      </div>
    </div>
  );
}