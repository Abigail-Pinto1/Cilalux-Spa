import React from "react";
import { ShoppingBag, Search, User, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from '../../Store/Features/auth/authSlice';
import Nav from "./Nav";
// import {cart} from '../../Store/cart/cartSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart) || {};
  const cartItems = cart.cartItems || [];
//cart here relies on a fallback to avoid errors if cart state is undefined

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const navLinkClass = "hover:text-pink-600 transition-colors";

  return (
    <>
    <Nav/>
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <NavLink to="/" className="text-2xl font-bold text-gray-800">
          Cilalux<span className="text-pink-600">Spa&Beauty</span>
        </NavLink>

        {/* Search bar */}
        <div className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-1.5 w-1/3">
          <Search className="w-5 h-5 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search products..."
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center space-x-8 font-medium text-gray-700">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/shop" className={navLinkClass}>
            All Products
          </NavLink>
          <NavLink to="/categories" className={navLinkClass}>
            Categories
          </NavLink>
          <NavLink to="/deals" className={navLinkClass}>
            Top Deals
          </NavLink>
          <NavLink to="/services" className={navLinkClass}>
            Services
          </NavLink>
        </nav>

        {/* Icons */}
        <div className="flex items-center space-x-5">
          {userInfo ? (
            <div className="flex items-center space-x-2 cursor-pointer group relative">
              <User className="w-5 h-5 text-gray-700 group-hover:text-pink-600" />
              <span className="text-sm">{userInfo.name}</span>

              {/* Dropdown */}
              <div className="absolute top-8 right-0 bg-white shadow-md rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                <button
                  onClick={() => navigate("/profile")}
                  className="block px-4 py-2 text-gray-700 hover:text-pink-600 w-full text-left"
                >
                  Profile
                </button>
                {userInfo.isAdmin && (
                  <button
                    onClick={() => navigate("/admin/dashboard")}
                    className="block px-4 py-2 text-gray-700 hover:text-pink-600 w-full text-left"
                  >
                    Admin Panel
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-pink-600 w-full text-left"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <NavLink to="/login">
              <User className="w-5 h-5 text-gray-700 cursor-pointer hover:text-pink-600" />
            </NavLink>
          )}

          {/* Cart */}
          <div
            onClick={() => navigate("/cart")}
            className="relative cursor-pointer"
          >
            <ShoppingBag className="w-6 h-6 text-gray-700 hover:text-pink-600" />
            {cartItems?.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs font-bold rounded-full px-1.5">
                {cartItems.length}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden flex justify-center border-t border-gray-100 py-3">
        <nav className="flex space-x-6 text-gray-700 text-sm">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/shop" className={navLinkClass}>
            Shop
          </NavLink>
          <NavLink to="/deals" className={navLinkClass}>
            Deals
          </NavLink>
          <NavLink to="/services" className={navLinkClass}>
            Services
          </NavLink>
        </nav>
      </div>
    </header>
    </>
  );
};

export default Header;
