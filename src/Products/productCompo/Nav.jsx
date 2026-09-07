import React from "react";
import { Truck, Phone } from "lucide-react";
import { NavLink } from "react-router-dom";

const Nav = () => {
  return (
    <Nav className="w-full">
      {/* Announcement Bar */}
      <div className="bg-pink-600 text-white text-sm py-2 px-6 flex flex-col md:flex-row items-center justify-between">
        {/* Left Section: Promo */}
        <div className="flex items-center gap-2">
          <Truck size={16} className="text-white" />
          <p className="font-medium">
            Free shipping on orders over $50!
          </p>
        </div>

        {/* Center Section: Contact Info */}
        <div className="flex items-center gap-2 mt-1 md:mt-0">
          <Phone size={14} className="text-white" />
          <a
            href="tel:+233555000111"
            className="hover:underline hover:text-gray-200"
          >
            +233 555 000 111
          </a>
        </div>

        {/* Right Section: Auth Buttons */}
        <div className="flex items-center gap-4 mt-1 md:mt-0">
          <NavLink
            to="/login"
            className="hover:text-gray-200 transition-colors"
          >
            Login
          </NavLink>
          <span>|</span>
          <NavLink
            to="/register"
            className="hover:text-gray-200 transition-colors"
          >
            Register
          </NavLink>
        </div>
      </div>

      {/* Main Navbar */}
       
    </Nav>
  );
};

export default Nav;
