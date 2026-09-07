// src/pages/checkout/Checkout.jsx
import React, { useEffect } from 'react';
import { useSelector} from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import ShippingStep from './ShippingStep.jsx';
import PaymentStep from './PaymentStep.jsx';
import ReviewStep from './ReviewStep.jsx';
import CompleteStep from './CompleteStep.jsx';
import CheckoutProgress from './CheckoutProgress.jsx';
import { SHIPPING_METHODS, TAX_RATE, resolveImageUrl } from './checkoutConstants';


// const API_ORIGIN = 'http://localhost:7000';
// const resolveImageUrl = (url) => {
//   if (!url) return '';
//   return url.startsWith('http') ? url : `${API_ORIGIN}${url}`;
// };

// export const SHIPPING_METHODS = {
//   standard: { name: 'Standard Shipping', cost: 4.99, days: '5-7 business days' },
//   express: { name: 'Express Shipping', cost: 9.99, days: '2-3 business days' },
//   overnight: { name: 'Overnight Shipping', cost: 19.99, days: '1 business day' },
// };
// export const TAX_RATE = 0.08;

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const checkoutState = useSelector(state => state.checkout);
  const { step = 1, shippingMethod = 'standard' } = checkoutState || {};
  const { cartItems = [] } = useSelector(state => state.cart || {});
  const { isAuthenticated } = useSelector(state => state.auth || {});
  
  // ✅ Verify authentication - if not authenticated, redirect to login
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    const isAuth = isAuthenticated || (token && userData);
    
    console.log('🔍 Checkout Auth Check:', {
      token: token ? '✅ Present' : '❌ Missing',
      userData: userData ? '✅ Present' : '❌ Missing',
      isAuthenticated: isAuthenticated,
      isAuth: isAuth,
      step: step
    });
    
    // Only redirect if not on complete step
    if (!isAuth && step !== 4) {
      console.log('🔒 Not authenticated, redirecting to login');
      navigate('/store/login', {
        state: { from: location.pathname },
        replace: false
      });
    }
  }, [isAuthenticated, navigate, location.pathname, step]);

  // ✅ Check if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && step !== 4) {
      console.log('🛒 Cart is empty, redirecting to cart');
      navigate('/store/cart');
    }
  }, [cartItems.length, step, navigate]);

  // ✅ Log step changes
  useEffect(() => {
    console.log('📍 Checkout step changed to:', step);
  }, [step]);

  const renderStep = () => {
    switch (step) {
      case 1:
        return <ShippingStep />;
      case 2:
        return <PaymentStep />;
      case 3:
        return <ReviewStep />;
      case 4:
        return <CompleteStep />;
      default:
        return <ShippingStep />;
    }
  };
  
  // Check if authenticated (after loading)
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  const isAuth = isAuthenticated || (token && userData);

  if (!isAuth && step !== 4) {
    // This should not happen as we redirect above, but just in case
    return null;
  }

  // Empty cart check
  if (cartItems.length === 0 && step !== 4) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center px-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to your cart before checkout.</p>
          <button
            onClick={() => navigate('/store/products')}
            className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <section className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {step !== 4 && (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-pink-600 mb-4 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </button>
        )}
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your purchase with confidence</p>
        </div>
        
        <CheckoutProgress currentStep={step} />
        
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {renderStep()}
          </div>
          
          {step !== 4 && (
            <div className="lg:col-span-1">
              <OrderSummary shippingMethod={shippingMethod} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const OrderSummary = ({ shippingMethod }) => {
  const { cartItems = [], totalAmount = 0 } = useSelector(state => state.cart || {});
  
  const subtotal = totalAmount;
  const shippingCost = SHIPPING_METHODS[shippingMethod]?.cost ?? 0;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shippingCost + tax;
  
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_4px_30px_rgba(255,182,193,0.25)] p-6 sticky top-24">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
      
      <div className="space-y-4 mb-6">
        {cartItems.map(item => (
          <div key={item.product} className="flex items-center space-x-3">
            <div className="w-16 h-16 bg-pink-50 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
              {item.image ? (
                <img
                  src={resolveImageUrl(item.image)}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400 text-xs text-center">No Image</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
              <p className="text-sm text-gray-600">Qty: {item.qty}</p>
            </div>
            <div className="text-sm font-semibold text-gray-900">
              ${(item.price * item.qty).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      
      <div className="space-y-2 border-t border-pink-100 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="text-gray-900">
            {SHIPPING_METHODS[shippingMethod]
              ? `$${SHIPPING_METHODS[shippingMethod].cost.toFixed(2)}`
              : 'Calculated'}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span className="text-gray-900">${tax.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-lg font-semibold border-t border-pink-100 pt-2">
          <span className="text-gray-900">Total</span>
          <span className="text-pink-600">${total.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-pink-100">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <ShieldCheck className="text-pink-500" size={20} />
          <span>Secure checkout</span>
        </div>
      </div>
    </div>
  );
};