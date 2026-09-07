import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeItem } from '../../Store/Features/cart/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Trash2 } from 'lucide-react';

const API_ORIGIN = 'http://localhost:7000';
const resolveImageUrl = (url) => {
  if (!url) return '';
  return url.startsWith('http') ? url : `${API_ORIGIN}${url}`;
};

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // ✅ Get all state at the top level (not inside functions)
  const { cartItems = [], totalAmount = 0 } = useSelector(state => state.cart || {});
  const { isAuthenticated } = useSelector(state => state.auth || {});

  const subtotal = totalAmount.toFixed(2);

  // ✅ Now handleCheckout uses the state variables from the top level
  const handleCheckout = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    console.log('🔍 Cart Checkout Auth Check:', {
      token: token ? '✅ Present' : '❌ Missing',
      userData: userData ? '✅ Present' : '❌ Missing',
      isAuthenticated: isAuthenticated
    });
    
    // Check if user is authenticated
    if (!token || !userData || !isAuthenticated) {
      console.log('🔒 Not authenticated, redirecting to login');
      navigate('/store/login', {
        state: { from: '/store/checkout' },
        replace: false
      });
    } else {
      console.log('✅ Authenticated, proceeding to checkout');
      navigate('/store/checkout');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-pink-600 mb-6 transition-colors"
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="flex items-center gap-2 mb-8">
        <ShoppingBag className="text-pink-600" size={28} />
        <h2 className="text-3xl font-bold text-gray-900">Shopping Cart</h2>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl p-12 text-center">
          <ShoppingBag className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-600 mb-4">Your cart is empty.</p>
          <Link
            to="/store"
            className="inline-block bg-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors"
          >
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div
                key={item.product}
                className="flex items-center gap-4 bg-white rounded-2xl shadow-sm border border-gray-200 p-4"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center">
                  {item.image ? (
                    <img
                      src={resolveImageUrl(item.image)}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-xs text-center">No Image</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <Link
                    to={`/store/product/${item.product}`}
                    className="font-semibold text-gray-900 hover:text-pink-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-gray-600 mt-1">
                    ${item.price} x {item.qty} ={' '}
                    <span className="font-semibold text-gray-900">
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </p>
                </div>

                <button
                  onClick={() => dispatch(removeItem(item.product))}
                  className="flex items-center gap-1 text-red-500 hover:text-red-600 text-sm font-medium transition-colors"
                >
                  <Trash2 size={16} />
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-fit sticky top-24">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Subtotal</span>
              <span className="text-gray-900 font-medium">${subtotal}</span>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Shipping and tax calculated at checkout.
            </p>
            <button
              onClick={handleCheckout}
              className="w-full bg-pink-600 text-white py-3 rounded-lg font-medium hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;