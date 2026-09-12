// src/pages/checkout/ReviewStep.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, MapPin, CreditCard, Smartphone, Landmark } from 'lucide-react';
import { nextStep, prevStep } from '../../Store/Features/check/CheckoutSlice';
import { clearCart } from '../../Store/Features/cart/cartSlice';
import { createOrder } from '../../Store/Features/orders/orderSlice';
import PayPopup from './Paypopup.jsx';
import { SHIPPING_METHODS, TAX_RATE } from './checkoutConstants';
import { useNavigate } from 'react-router-dom';


const API_ORIGIN = 'http://localhost:7000';
const resolveImageUrl = (url) => {
  if (!url) return '';
  return url.startsWith('http') ? url : `${API_ORIGIN}${url}`;
};

const paymentMethodLabel = {
  momo: 'Mobile Money',
  card: 'Debit / Credit Card',
  bank_transfer: 'Bank Transfer',
};

export default function ReviewStep() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isPayPopupOpen, setIsPayPopupOpen] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { shippingAddress = {}, shippingMethod = 'standard', payment = {} } =
    useSelector(state => state.checkout) || {};
  const { cartItems = [], totalAmount = 0 } = useSelector(state => state.cart || {});
  const { isAuthenticated } = useSelector(state => state.auth || {});

  const subtotal = totalAmount;
  const shippingCost = SHIPPING_METHODS[shippingMethod]?.cost ?? 0;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shippingCost + tax;

  const validateOrderData = () => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token || !isAuthenticated) {
      setOrderError('Please login to complete your order.');
      setTimeout(() => {
        navigate('/store/login', { 
          state: { from: { pathname: '/store/checkout' } } 
        });
      }, 2000);
      return false;
    }

    if (!shippingAddress || Object.keys(shippingAddress).length === 0) {
      setOrderError('Shipping address is missing. Please go back and complete your shipping details.');
      return false;
    }
    
    if (!payment || !payment.method) {
      setOrderError('Payment method is missing. Please go back and complete your payment details.');
      return false;
    }

    if (cartItems.length === 0) {
      setOrderError('Your cart is empty. Please add items before checkout.');
      return false;
    }

    return true;
  };

  const handlePayNow = () => {
    setOrderError(null);
    if (!validateOrderData()) {
      return;
    }
    setIsPayPopupOpen(true);
  };

const { user } = useSelector(state => state.auth) || {};
const email = user?.email || JSON.parse(localStorage.getItem('user') || '{}').email;

 // ReviewStep.jsx - Add more logging
const handlePaymentSuccess = async (reference) => {
  setIsProcessing(true);
  setOrderError(null);

  try {
    // ✅ Build order payload with proper structure
    const orderPayload = {
      items: cartItems.map(item => ({
        productId: item.product,
        quantity: item.qty,
        name: item.name,
        price: item.price,
        image: item.image || '',
      })),
      shippingAddress: shippingAddress,
      email: shippingAddress.email || email|| user?.email,
      shippingMethod: shippingMethod,
      shippingCost: shippingCost,
      subtotal: subtotal,
      tax: tax,
      totalAmount: total,
      currency: 'GHS',
      payment: {
        method: payment.method,
        network: payment.network || '',
        phone: payment.phone || '',
        reference: reference,
      },
    };

    console.log('📦 Sending order payload:', orderPayload);

     const result = await dispatch(createOrder(orderPayload));
    console.log('📦 Order creation result:', result);

    // ✅ Check if the order was created successfully
   if (createOrder.fulfilled.match(result)) {
  dispatch(clearCart());
  dispatch(nextStep());
  console.log('✅ Order created successfully');

  const newOrderId = result.payload?.order?._id;
  navigate('/store/my-orders', {
    state: { fromCheckout: true, highlightOrder: newOrderId }
  });
} else {
      // ❌ Handle errors
      const errorMsg = result.payload || 'Failed to finalize your order.';
      console.error('❌ Order creation failed:', errorMsg);
      setOrderError(errorMsg);
      
      // Check if it's an auth issue
      if (typeof errorMsg === 'string' && 
          (errorMsg.includes('session has expired') || 
           errorMsg.includes('No authentication token') ||
           errorMsg.includes('login'))) {
        setTimeout(() => {
          navigate('/store/login', { 
            state: { from: { pathname: '/store/checkout' } } 
          });
        }, 2000);
      }
    }
  } catch (error) {
    console.error('❌ Unexpected error in handlePaymentSuccess:', error);
    setOrderError('An unexpected error occurred. Please try again or contact support.');
  } finally {
    setIsProcessing(false);
  }
};

  const paymentDataForPopup = {
    ...payment,
    amount: total.toFixed(2),
    currency: 'GHS',
  };

  return (
    <>
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_4px_30px_rgba(255,182,193,0.25)] p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Review Your Order</h2>

        {orderError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
            {orderError}
            {orderError.includes('Please login') && (
              <p className="mt-2 text-xs">Redirecting to login...</p>
            )}
          </div>
        )}

        {/* Shipping Address Review */}
        <div className="border border-pink-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={18} className="text-pink-600" />
            <h3 className="font-semibold text-gray-900">Shipping To</h3>
          </div>
          <p className="text-sm text-gray-700">
            {shippingAddress.firstName} {shippingAddress.lastName}
          </p>
          <p className="text-sm text-gray-600">
            {shippingAddress.address}
            {shippingAddress.apartment ? `, ${shippingAddress.apartment}` : ''}
          </p>
          <p className="text-sm text-gray-600">
            {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
          </p>
          <p className="text-sm text-gray-600">{shippingAddress.country}</p>
          <p className="text-sm text-gray-600 mt-2">
            {shippingAddress.email} · {shippingAddress.phone}
          </p>
          <p className="text-sm text-pink-600 font-medium mt-2">
            {SHIPPING_METHODS[shippingMethod]?.name} (${SHIPPING_METHODS[shippingMethod]?.cost.toFixed(2)})
          </p>
        </div>

        {/* Payment Method Review */}
        <div className="border border-pink-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            {payment.method === 'momo' && <Smartphone size={18} className="text-pink-600" />}
            {payment.method === 'card' && <CreditCard size={18} className="text-pink-600" />}
            {payment.method === 'bank_transfer' && <Landmark size={18} className="text-pink-600" />}
            <h3 className="font-semibold text-gray-900">
              {paymentMethodLabel[payment.method] || 'Payment Method'}
            </h3>
          </div>

          {payment.method === 'momo' && (
            <p className="text-sm text-gray-600">{payment.network} · {payment.phone}</p>
          )}
          {payment.method === 'card' && (
            <p className="text-sm text-gray-600">
              {payment.nameOnCard} · Card ending in {payment.cardNumber?.replace(/\s/g, '').slice(-4)}
            </p>
          )}
          {payment.method === 'bank_transfer' && (
            <p className="text-sm text-gray-600">
              {payment.bankName} · Account ending in {String(payment.accountNumber || '').slice(-4)}
            </p>
          )}
        </div>

        {/* Order Items Review */}
        <div className="border border-pink-100 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Items ({cartItems.length})</h3>
          <div className="space-y-3">
            {cartItems.map(item => (
              <div key={item.product} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-pink-50 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center">
                  {item.image ? (
                    <img src={resolveImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-[10px] text-center">No Image</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  ${(item.price * item.qty).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Totals */}
        <div className="border-t border-pink-100 pt-4 space-y-1">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Shipping</span><span>${shippingCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Tax</span><span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold pt-2 border-t border-pink-100">
            <span className="text-gray-900">Total</span>
            <span className="text-pink-600">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => dispatch(prevStep())}
            className="flex items-center gap-2 text-gray-600 hover:text-pink-600 font-medium transition-colors text-sm"
            disabled={isProcessing}
          >
            <ArrowLeft size={18} />
            Back to Payment
          </button>

          <button
            onClick={handlePayNow}
            disabled={isProcessing || cartItems.length === 0}
            className={`bg-gradient-to-r from-pink-500 to-pink-600 text-white px-8 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all ${
              (isProcessing || cartItems.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isProcessing ? 'Processing...' : `Pay Now · $${total.toFixed(2)}`}
          </button>
        </div>
      </div>

      <PayPopup
        isOpen={isPayPopupOpen}
        onClose={() => {
          if (!isProcessing) setIsPayPopupOpen(false);
        }}
        paymentData={paymentDataForPopup}
        userEmail={user?.email} 
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  );
}