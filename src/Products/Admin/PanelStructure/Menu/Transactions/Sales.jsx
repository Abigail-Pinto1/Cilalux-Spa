// src/Pages/Admin/Sales.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders } from '../../../../../Store/Features/orders/orderSlice';
import {
  CheckCircle2, User, Mail, DollarSign, Calendar, Search, Layers, AlertCircle
} from 'lucide-react';
import FilterBar from '../../../FilterBar';
import Pagination from '../../../Pagination';

const ITEMS_PER_PAGE = 10;

export default function Sales() {
  const dispatch = useDispatch();
  const { items: orders = [], loading, error } = useSelector((state) => state.orders || {});
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    dispatch(fetchAllOrders());
    const livePollInterval = setInterval(() => dispatch(fetchAllOrders()), 10000);
    return () => clearInterval(livePollInterval);
  }, [dispatch]);

  const paidOrders = orders.filter((o) => o.isPaid === true);

  // Apply filters
  const filteredSales = paidOrders.filter((order) => {
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const orderNumber = (order.orderNumber || '').toLowerCase();
      const customerName = (order.customer?.name || '').toLowerCase();
      const customerEmail = (order.customer?.email || '').toLowerCase();
      
      if (!orderNumber.includes(term) && 
          !customerName.includes(term) && 
          !customerEmail.includes(term)) {
        return false;
      }
    }
    
    // Date filter
    if (dateFilter) {
      const orderDate = new Date(order.paidAt || order.createdAt);
      const now = new Date();
      const daysDiff = (now - orderDate) / (1000 * 60 * 60 * 24);
      
      if (dateFilter === 'today' && daysDiff > 1) return false;
      if (dateFilter === 'week' && daysDiff > 7) return false;
      if (dateFilter === 'month' && daysDiff > 30) return false;
    }
    
    return true;
  });

  // Calculate totals
  const totalRevenue = filteredSales.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
  
  // Pagination
  const totalItems = filteredSales.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSales = filteredSales.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDateFilter('');
    setCurrentPage(1);
  };

  const filters = [
    {
      key: 'date',
      label: 'Date Range',
      type: 'select',
      value: dateFilter,
      options: [
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'Last 7 Days' },
        { value: 'month', label: 'Last 30 Days' }
      ]
    }
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <p className="text-indigo-600 font-semibold animate-pulse text-lg">Loading sales data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-800">
      {error && (
        <div className="max-w-7xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">Error: {error}</p>
        </div>
      )}

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Store Sales</h1>
          <p className="text-slate-500 mt-1">Verified, paid orders from your store.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-sm font-medium text-gray-700">
            {filteredSales.length} of {paidOrders.length} sales
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Gross Earnings</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">₵{totalRevenue.toLocaleString('en-GH', { minimumFractionDigits: 2 })}</h3>
            <p className="text-xs text-slate-400 mt-1">{filteredSales.length} orders</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg"><DollarSign className="w-6 h-6" /></div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Orders</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{filteredSales.length} orders</h3>
            <p className="text-xs text-slate-400 mt-1">Paid transactions</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><CheckCircle2 className="w-6 h-6" /></div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Database Connection</p>
            <h3 className="text-sm font-medium text-emerald-600 mt-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Synced to MongoDB
            </h3>
            <p className="text-xs text-slate-400 mt-1">Live data feed</p>
          </div>
          <div className="p-3 bg-slate-50 text-slate-600 rounded-lg"><Layers className="w-6 h-6" /></div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="max-w-7xl mx-auto mb-6">
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value);
            setCurrentPage(1);
          }}
          filters={filters}
          onFilterChange={(key, value) => {
            if (key === 'date') setDateFilter(value);
            setCurrentPage(1);
          }}
          onClearFilters={clearFilters}
          placeholder="Search by order number, customer name or email..."
        />
      </div>

      {/* Sales Table */}
      <div className="max-w-7xl mx-auto bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-4 px-6">Order</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Timestamp</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {paginatedSales.length > 0 ? (
                paginatedSales.map((order) => {
                  const date = order.paidAt || order.createdAt;
                  return (
                    <tr key={order._id} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="py-4 px-6 font-mono text-xs font-medium text-indigo-600">
                        {order.orderNumber || `#${order._id?.slice(-8).toUpperCase()}`}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            {order.customer?.name || 'Guest'}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            {order.customer?.email || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-500">
                        <div className="flex flex-col">
                          <span className="flex items-center gap-1 text-xs font-medium text-slate-700">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {date ? new Date(date).toLocaleDateString('en-GH', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                          </span>
                          <span className="text-xs text-slate-400 mt-0.5">
                            {date ? new Date(date).toLocaleTimeString('en-GH', { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Paid
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-semibold text-slate-900 text-base">
                        {order.currency || 'GHS'} {Number(order.totalAmount || 0).toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <p>No sales records found matching your query.</p>
                      {(searchTerm || dateFilter) && (
                        <button
                          onClick={clearFilters}
                          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {paginatedSales.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}