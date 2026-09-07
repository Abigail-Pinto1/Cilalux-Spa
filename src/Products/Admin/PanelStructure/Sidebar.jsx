/* eslint-disable no-unused-vars */
// src/Components/Admin/Sidebar.jsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  ChevronRight, 
  Coins, 
  Check, 
  ChevronDown, 
  LogOut, 
  Store, 
  LayoutDashboard, 
  ShoppingBag, 
  ShoppingCart, 
  Truck, 
  Edit, 
  Layers, 
  Plus, 
  Package, 
  BarChart2, 
  Receipt, 
  DollarSign, 
  Undo2, 
  CreditCard, 
  Users, 
  MessageSquare, 
  Settings,
  Boxes,
  Library
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Menu items configuration
const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { 
    name: "Store Layout", 
    icon: Store, 
    submenu: [
      { name: "Add Product", icon: Plus, path: "/admin/add-product" },
      { name: "Edit Product", icon: Edit, path: "/admin/edit-product" },
      { name: "Store Analytics", icon: BarChart2, path: "/admin/analytics" },
    ]
  },
  { 
    name: "E-commerce", 
    icon: ShoppingBag, 
    submenu: [
      { name: "Products", icon: ShoppingCart, path: "/admin/inventory" },
      { name: "Orders", icon: Truck, path: "/admin/orders" },
      { name: "Sales Analytics", icon: BarChart2, path: "/admin/sales" },
      { name: "Bookings", icon: Layers, path: "/admin/bookings" },
    ]
  },
  { 
    name: "Transactions", 
    icon: CreditCard, 
    submenu: [
      { name: "Completed", icon: Receipt, path: "/admin/completed" },
      { name: "Payments", icon: DollarSign, path: "/admin/payments" },
      { name: "Refunds", icon: Undo2, path: "/admin/refund" },
    ]
  }, 
  { 
    name: "Inventory", 
    icon: Layers, 
    submenu: [
      { name: "Stock", icon: Coins, path: "/admin/stock" },
      { name: "Out of Stock", icon: Check, path: "/admin/out-of-stock" },
      { name: "Analytics", icon: BarChart2, path: "/admin/analytics" },
    ]
  },
  { name: "Users & Clients", icon: Users, path: "/admin/users" },
  { name: "System Messages", icon: MessageSquare, path: "/admin/messages" },
  { name: "Settings", icon: Settings, path: "/admin/settings" },
];

export default function Sidebar({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) {
  const [openDropdowns, setOpenDropdowns] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => path ? location.pathname === path : false;

  const toggleDropdown = (menuName) => {
    setOpenDropdowns(prev => ({ ...prev, [menuName]: !prev[menuName] }));
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    navigate("/admin/adminregister");
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Panel */}
      <motion.aside
        className={`fixed md:sticky top-0 left-0 h-screen z-50 bg-white border-r border-gray-100 flex flex-col shadow-xl md:shadow-none transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        } ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 min-h-[64px]">
          {!isCollapsed && (
            <Link to="/admin/dashboard" className="text-xl font-bold bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent">
              Cilalux Console
            </Link>
          )}
          {isCollapsed && (
            <Link to="/admin/dashboard" className="text-xl font-bold text-indigo-600">
              C
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl p-1.5 border border-gray-100 hidden md:block transition-all"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-1">
          {menuItems.map((item) => {
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isDropdownOpen = openDropdowns[item.name];
            const isParentActive = hasSubmenu && item.submenu.some(sub => isActive(sub.path));

            if (hasSubmenu) {
              return (
                <div key={item.name} className="w-full">
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl font-medium text-sm transition-all focus:outline-none ${
                      isParentActive 
                        ? "bg-pink-50/60 text-pink-600" 
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon size={18} className={isParentActive ? "text-pink-600" : "text-gray-400"} />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left">{item.name}</span>
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
                      </>
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {isDropdownOpen && !isCollapsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="pl-9 mt-1 space-y-1 overflow-hidden"
                      >
                        {item.submenu.map((sub) => {
                          const subActive = isActive(sub.path);
                          return (
                            <Link
                              key={sub.path}
                              to={sub.path}
                              onClick={() => setIsOpen(false)}
                              className={`flex items-center gap-3 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                                subActive
                                  ? "text-pink-600 bg-pink-50/40 font-semibold"
                                  : "text-gray-400 hover:text-gray-700 hover:bg-gray-50/50"
                              }`}
                            >
                              <sub.icon size={14} />
                              <span>{sub.name}</span>
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all ${
                  isActive(item.path)
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <item.icon size={18} className={isActive(item.path) ? "text-white" : "text-gray-400"} />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer - Logout */}
        <div className="p-3 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-all group"
          >
            <LogOut size={18} className="text-red-400 group-hover:text-red-500 transition-colors" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
}