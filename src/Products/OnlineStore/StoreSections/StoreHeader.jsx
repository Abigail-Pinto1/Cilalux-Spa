// src/components/StoreHeader.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Search, 
  User, 
  ShoppingBag, 
  HelpCircle, 
  Menu, 
  X,
  ChevronDown,
  LogOut, // ✅ Import LogOut icon
  Settings,
  Package,
  Heart,
  Phone
} from 'lucide-react';
import { logoutUser } from '../../../Store/Features/auth/authSlice'; // ✅ Fixed import path

export default function StoreHeader() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { cartItems = [] } = useSelector(state => state.cart || {});
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const cartCount = cartItems.reduce((total, item) => total + (item.qty || 0), 0);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/store/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/store/login');
  };

  const handleCartClick = () => {
    navigate('/store/cart');
    setIsMobileMenuOpen(false);
  };

  const handleHelpClick = () => {
    navigate('/store/help');
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* ✅ Sticky Header */}
      <header 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white shadow-lg' 
            : 'bg-gradient-to-r from-orange-500 to-pink-500'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <span className={`text-2xl font-bold ${isScrolled ? 'text-orange-600' : 'text-white'}`}>
                CILALUX®
              </span>
            </Link>

            {/* Search Bar - Desktop */}
            <form 
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-2xl mx-4"
            >
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, brands and categories"
                  className={`w-full px-4 py-2.5 rounded-full border-2 focus:outline-none transition-colors ${
                    isScrolled
                      ? 'border-gray-300 focus:border-orange-500 bg-white text-gray-800'
                      : 'border-white/30 bg-white/20 backdrop-blur-md text-white placeholder-white/70 focus:border-white'
                  }`}
                />
                <button
                  type="submit"
                  className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full font-semibold transition-colors ${
                    isScrolled
                      ? 'bg-orange-500 text-white hover:bg-orange-600'
                      : 'bg-white text-orange-500 hover:bg-orange-50'
                  }`}
                >
                  <Search size={18} className="inline mr-1" />
                  Search
                </button>
              </div>
            </form>

            {/* Right Navigation */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Help - Desktop */}
              <button
                onClick={handleHelpClick}
                className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                  isScrolled
                    ? 'text-gray-700 hover:bg-gray-100'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <HelpCircle size={20} />
                <span className="text-sm font-medium">Help</span>
              </button>

              {/* Account */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    isScrolled
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <User size={20} />
                  <span className="hidden md:inline text-sm font-medium">
                    {isAuthenticated ? user?.firstName || 'Account' : 'Account'}
                  </span>
                  <ChevronDown size={16} className="hidden md:block" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-semibold text-gray-800">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        <Link
                          to="/store/my-orders"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Package size={18} />
                          <span className="text-sm">My Orders</span>
                        </Link>
                        <Link
                          to="/store/wishlist"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Heart size={18} />
                          <span className="text-sm">Wishlist</span>
                        </Link>
                        <Link
                          to="/store/settings"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings size={18} />
                          <span className="text-sm">Settings</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-600 w-full transition-colors border-t border-gray-100 mt-1"
                        >
                          <LogOut size={18} /> {/* ✅ Use LogOut icon */}
                          <span className="text-sm font-medium">Logout</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/store/login"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User size={18} />
                          <span className="text-sm font-medium">Sign In</span>
                        </Link>
                        <Link
                          to="/store/register"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <span className="text-sm">Create Account</span>
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Cart */}
              <button
                onClick={handleCartClick}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                  isScrolled
                    ? 'text-gray-700 hover:bg-gray-100'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <ShoppingBag size={20} />
                <span className="hidden md:inline text-sm font-medium">Cart</span>
                {cartCount > 0 && (
                  <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${
                    isScrolled ? 'bg-orange-500 text-white' : 'bg-white text-orange-500'
                  }`}>
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`md:hidden p-2 rounded-lg transition-colors ${
                  isScrolled
                    ? 'text-gray-700 hover:bg-gray-100'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          ref={mobileMenuRef}
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 pb-4 space-y-3 border-t border-white/10">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="flex gap-2 pt-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className={`flex-1 px-4 py-2 rounded-full border-2 focus:outline-none ${
                  isScrolled
                    ? 'border-gray-300 focus:border-orange-500 bg-white text-gray-800'
                    : 'border-white/30 bg-white/20 backdrop-blur-md text-white placeholder-white/70 focus:border-white'
                }`}
              />
              <button
                type="submit"
                className={`px-4 py-2 rounded-full font-semibold transition-colors ${
                  isScrolled
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-white text-orange-500 hover:bg-orange-50'
                }`}
              >
                <Search size={18} />
              </button>
            </form>

            {/* Mobile Nav Links */}
            <div className="flex flex-col gap-1">
              <button
                onClick={handleHelpClick}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg w-full text-left ${
                  isScrolled
                    ? 'text-gray-700 hover:bg-gray-100'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <HelpCircle size={18} />
                <span>Help</span>
              </button>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/store/my-orders"
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg ${
                      isScrolled
                        ? 'text-gray-700 hover:bg-gray-100'
                        : 'text-white hover:bg-white/10'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Package size={18} />
                    <span>My Orders</span>
                  </Link>
                  <Link
                    to="/store/wishlist"
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg ${
                      isScrolled
                        ? 'text-gray-700 hover:bg-gray-100'
                        : 'text-white hover:bg-white/10'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Heart size={18} />
                    <span>Wishlist</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg w-full text-left ${
                      isScrolled
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-red-200 hover:bg-white/10'
                    }`}
                  >
                    <LogOut size={18} /> {/* ✅ Use LogOut icon */}
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/store/login"
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg ${
                      isScrolled
                        ? 'text-gray-700 hover:bg-gray-100'
                        : 'text-white hover:bg-white/10'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User size={18} />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    to="/store/register"
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg ${
                      isScrolled
                        ? 'text-gray-700 hover:bg-gray-100'
                        : 'text-white hover:bg-white/10'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>Create Account</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}