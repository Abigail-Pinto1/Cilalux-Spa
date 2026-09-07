import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../Store/Features/auth/authSlice';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Eye, EyeOff, Loader } from 'lucide-react';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated, user } = useSelector(state => state.auth);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(null);
  
  // Get the redirect path from location state
  const from = location.state?.from?.pathname || location.state?.from || '/cart';
  
  console.log('📍 Login page - Redirect target:', from);
  
  // Clear any previous errors
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);
  
  // Redirect if authenticated - check both Redux state and localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    console.log('🔍 Login redirect check:', {
      isAuthenticated,
      hasToken: !!token,
      hasUserData: !!userData,
      from: from
    });
    
    // ✅ Check both Redux state AND localStorage
    if ((isAuthenticated || token) && userData) {
      console.log('✅ User authenticated, redirecting to:', from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);
    
    if (!email || !password) {
      setLoginError('Please enter both email and password');
      return;
    }
    
    console.log('🔐 Attempting login with:', { email });
    
    try {
      const result = await dispatch(loginUser({ email, password }));
      console.log('📦 Login result:', result);
      
      if (loginUser.rejected.match(result)) {
        console.error('❌ Login rejected:', result.payload);
        setLoginError(result.payload || 'Login failed. Please try again.');
      } else if (loginUser.fulfilled.match(result)) {
        console.log('✅ Login successful!');
        // ✅ Navigate immediately after successful login
        const token = localStorage.getItem('token');
        console.log('🔍 Token after login:', token ? '✅ Present' : '❌ Missing');
        // The useEffect will handle redirect
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      setLoginError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to continue shopping</p>
        </div>
        
        {(error || loginError) && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {loginError || error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <Link to="/forgot-password" className="text-pink-600 hover:text-pink-700">
              Forgot password?
            </Link>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader className="animate-spin mr-2" size={20} />
                Logging in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link to="/store/register" className="text-pink-600 font-semibold hover:text-pink-700">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}