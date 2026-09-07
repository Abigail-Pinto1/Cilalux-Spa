import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-pink-600 font-semibold underline underline-offset-4"
      : "text-gray-700 hover:text-pink-600 transition";

  return (
    <div className="navbar bg-white/90 backdrop-blur-md shadow-md fixed top-0 left-0 w-full z-50">
      <div className="navbar-start">
        <NavLink
          to="/"
          className="text-2xl font-bold text-pink-600 tracking-wide italic"
        >
          Cilalux <span className="text-gray-800">Spa&Salon</span>
        </NavLink>
      </div>

      {/* Center Menu (Desktop Only) */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 italic space-x-4">
          <li>
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
          </li>
         
          <li>
            <NavLink to="/services" className={navLinkClass}>
              Services
            </NavLink>
          </li>
          <li>
              <NavLink to="/contact" className={navLinkClass} >
                Contact
              </NavLink>
            </li>
          <li>
            <NavLink to="/store" className={navLinkClass}>
              Store
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Appointment Button (Desktop) */}
      <div className="navbar-end hidden lg:flex">
       <NavLink
  to="/appointment"
  className={navLinkClass}
  onClick={() => setMenuOpen(false)}
>
  <button className="bg-pink-600 text-white px-5 py-2 rounded-full hover:bg-pink-700 transition">
    Book Appointment
  </button>
</NavLink>

      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden navbar-end">
        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md lg:hidden">
          <ul className="flex flex-col items-center py-4 space-y-3 italic">
            <li>
              <NavLink to="/" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                Home
              </NavLink>
            </li>
            
            <li>
              <NavLink to="/services" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                Services
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                Contact
              </NavLink>
            </li>
            <li>
              <NavLink to="/store" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                Store
              </NavLink>
            </li>
            <li>

             <NavLink
  to="/appointment"
  className={navLinkClass}
  onClick={() => setMenuOpen(false)}
>
  <button className="bg-pink-600 text-white px-5 py-2 rounded-full hover:bg-pink-700 transition">
    Book Appointment
  </button>
</NavLink>

            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
