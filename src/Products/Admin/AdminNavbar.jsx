/* eslint-disable no-unused-vars */
// src/Components/Admin/AdminNavbar.jsx
import { Bell, Plus, Search, Menu, X, ChevronDown, Package, LogOut, Calendar } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllOrders } from "../../Store/Features/orders/orderSlice";
import { fetchAllBookings } from "../../Store/Features/bookings/bookingSlice";

export default function AdminNavbar({ setIsOpen, sidebarOpen, isCollapsed }) {
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: orders = [] } = useSelector((state) => state.orders || {});
  const { items: bookings = [] } = useSelector((state) => state.bookings || {});

  const admin = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("adminInfo")) || null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    dispatch(fetchAllOrders());
    dispatch(fetchAllBookings());
  }, [dispatch]);

  const recentActivity = useMemo(() => {
    const orderEvents = orders.map((o) => ({ type: 'order', date: o.createdAt, data: o }));
    const bookingEvents = bookings.map((b) => ({ type: 'booking', date: b.createdAt, data: b }));
    return [...orderEvents, ...bookingEvents]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 8);
  }, [orders, bookings]);

  const pendingCount =
    orders.filter((o) => o.status === "pending" || o.status === "confirmed").length +
    bookings.filter((b) => b.status === "pending" || b.status === "confirmed").length;

  const handleSignOut = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    navigate("/adminregister");
  };

  return (
    <header className="h-16 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 shadow-sm">
      
      {/* Left Section - Menu Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 -ml-2 text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition md:hidden focus:outline-none"
          aria-label="Toggle Navigation Sidebar"
        >
          <Menu size={22} />
        </button>
        
        <div className="hidden sm:block">
          <h1 className="text-lg font-semibold text-gray-800">
            Dashboard
          </h1>
          <p className="text-xs text-gray-500">
            Welcome back, {admin?.username || "Admin"}!
          </p>
        </div>
        <div className="sm:hidden">
          <h1 className="text-base font-semibold text-gray-800">
            Dashboard
          </h1>
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Search - Desktop */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search..."
            className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
          />
        </div>

        {/* Search - Mobile Toggle */}
        {showSearch ? (
          <div className="relative md:hidden">
            <input
              className="w-48 pl-4 pr-10 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Search..."
              autoFocus
            />
            <button
              onClick={() => setShowSearch(false)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowSearch(true)}
            className="md:hidden text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
          >
            <Search size={20} />
          </button>
        )}

        {/* New Button */}
        <button className="hidden sm:flex bg-indigo-600 text-white px-3 py-2 rounded-xl items-center gap-1.5 hover:bg-indigo-700 transition-all text-sm font-medium shadow-sm hover:shadow-md">
          <Plus size={16} />
          <span>New</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors relative"
          >
            <Bell size={20} />
            {pendingCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
              <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-800">Recent Activity</p>
                {pendingCount > 0 && (
                  <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                    {pendingCount} pending
                  </span>
                )}
              </div>

              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => {
                  const isBooking = activity.type === 'booking';
                  const d = activity.data;
                  return (
                    <button
                      key={d._id}
                      onClick={() => {
                        setShowNotifications(false);
                        navigate(isBooking ? "/admin/bookings" : "/admin/orders");
                      }}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors flex items-start gap-2.5"
                    >
                      <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${isBooking ? 'bg-purple-50 text-purple-600' : 'bg-indigo-50 text-indigo-600'}`}>
                        {isBooking ? <Calendar size={14} /> : <Package size={14} />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-800 truncate">
                          {isBooking
                            ? `${d.services?.map(s => s.name).join(', ')} — ${d.customer?.name || 'Guest'}`
                            : `${d.orderNumber || `#${d._id?.slice(-8).toUpperCase()}`} — ${d.customer?.name || 'Guest'}`}
                        </p>
                        <p className="text-xs text-gray-400 capitalize">
                          {d.status?.replace(/_/g, ' ')} · {d.currency || 'GHS'} {Number(d.totalAmount || 0).toFixed(2)}
                        </p>
                      </div>
                    </button>
                  );
                })
              ) : (
                <p className="px-4 py-6 text-sm text-gray-400 text-center">No recent activity</p>
              )}
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="rounded-full w-8 h-8 border-2 border-gray-200 bg-gradient-to-br from-pink-500 to-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
              {admin?.username?.[0]?.toUpperCase() || "A"}
            </div>
            <ChevronDown size={16} className="text-gray-500 hidden sm:block" />
          </button>

          {showUserMenu && (
            <>
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-800 truncate">{admin?.username || "Admin"}</p>
                  <p className="text-xs text-gray-500 truncate">{admin?.email || "No email on file"}</p>
                </div>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  Profile Settings
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  Account Settings
                </button>
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Backdrop for dropdowns */}
      {(showUserMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </header>
  );
}