// src/Pages/Admin/Orders.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, updateOrderStatus } from '../../../../../Store/Features/orders/orderSlice';
import { Clock, CheckCircle2, AlertCircle, ShoppingBag, Package, Truck } from 'lucide-react';
import FilterBar from '../../../FilterBar';
import Pagination from '../../../Pagination';


const STATUS_OPTIONS = [
  'pending', 'confirmed', 'preparing', 'packed',
  'shipped', 'out_for_delivery', 'delivered', 'cancelled'
];

const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-700',
  confirmed: 'bg-blue-50 text-blue-700',
  preparing: 'bg-purple-50 text-purple-700',
  packed: 'bg-indigo-50 text-indigo-700',
  shipped: 'bg-cyan-50 text-cyan-700',
  out_for_delivery: 'bg-orange-50 text-orange-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-red-50 text-red-700',
  return_requested: 'bg-rose-50 text-rose-700',
};

const ITEMS_PER_PAGE = 10;

const Orders = () => {
  const dispatch = useDispatch();
  const { items: orders = [], loading, error } = useSelector(state => state.orders || {});
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(ITEMS_PER_PAGE);
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const orderNumber = (order.orderNumber || order._id).toLowerCase();
      const customerName = (order.customer?.name || '').toLowerCase();
      const customerEmail = (order.customer?.email || '').toLowerCase();
      
      if (!orderNumber.includes(search) && 
          !customerName.includes(search) && 
          !customerEmail.includes(search)) {
        return false;
      }
    }
    
    // Status filter
    if (statusFilter && order.status !== statusFilter) {
      return false;
    }
    
    // Date filter (last 7 days, last 30 days, etc.)
    if (dateFilter) {
      const orderDate = new Date(order.createdAt);
      const now = new Date();
      const daysDiff = (now - orderDate) / (1000 * 60 * 60 * 24);
      
      if (dateFilter === 'today' && daysDiff > 1) return false;
      if (dateFilter === 'week' && daysDiff > 7) return false;
      if (dateFilter === 'month' && daysDiff > 30) return false;
    }
    
    return true;
  });

  // Paginate
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setDateFilter('');
    setCurrentPage(1);
  };

  const filters = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      value: statusFilter,
      options: STATUS_OPTIONS.map(s => ({ value: s, label: s.replace(/_/g, ' ') }))
    },
    {
      key: 'date',
      label: 'Date',
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
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-gray-500 font-medium text-sm">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Store Orders</h1>
          <p className="text-sm text-gray-500">Manage incoming orders and fulfillment status</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-sm font-medium text-gray-700">
          Total Orders: <span className="text-indigo-600 font-bold">{orders.length}</span>
          {filteredOrders.length !== orders.length && (
            <span className="text-gray-400 text-xs ml-2">
              (filtered: {filteredOrders.length})
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 flex items-center gap-3 text-sm">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Bar */}
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        filters={filters}
        onFilterChange={(key, value) => {
          if (key === 'status') setStatusFilter(value);
          if (key === 'date') setDateFilter(value);
          setCurrentPage(1);
        }}
        onClearFilters={clearFilters}
        placeholder="Search by order number, customer name or email..."
      />

      {orders.length > 0 ? (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-gray-700">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/50 text-gray-400 font-semibold uppercase tracking-wider text-xs">
                    <th className="py-3 px-4">Order ID / Date</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Items</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginatedOrders.map((order) => {
                    const orderDate = order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString('en-GH', { day: 'numeric', month: 'short', year: 'numeric' })
                      : 'N/A';
                    return (
                      <tr key={order._id} className="hover:bg-gray-50/40 transition-colors">
                        <td className="py-4 px-4">
                          <span className="font-mono text-xs font-semibold text-indigo-600 block mb-0.5">
                            {order.orderNumber || `#${order._id?.slice(-8).toUpperCase()}`}
                          </span>
                          <span className="text-xs text-gray-400 font-medium">{orderDate}</span>
                        </td>
                        <td className="py-4 px-4">
                          <p className="font-medium text-gray-900">{order.customer?.name || 'Guest'}</p>
                          <p className="text-xs text-gray-400">{order.customer?.email || 'N/A'}</p>
                        </td>
                        <td className="py-4 px-4 max-w-xs">
                          <div className="space-y-1">
                            {order.items?.length ? order.items.slice(0, 3).map((item, idx) => (
                              <p key={idx} className="text-xs text-gray-600 truncate font-medium">
                                • {item.name || item.productName} <span className="text-gray-400">x{item.quantity || 1}</span>
                              </p>
                            )) : <span className="text-gray-400 text-xs">No items</span>}
                            {order.items?.length > 3 && (
                              <p className="text-xs text-gray-400">+{order.items.length - 3} more</p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 font-bold text-gray-900">
                          {order.currency || 'GHS'} {Number(order.totalAmount || 0).toLocaleString('en-GH', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${STATUS_STYLES[order.status] || STATUS_STYLES.pending}`}>
                            {order.status === 'delivered' ? <CheckCircle2 size={12} /> :
                             order.status === 'shipped' || order.status === 'out_for_delivery' ? <Truck size={12} /> :
                             <Clock size={12} />}
                            {order.status?.replace(/_/g, ' ') || 'pending'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <select
                            value={order.status || 'pending'}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className="text-xs border border-gray-200 rounded-lg p-1.5 bg-white font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all shadow-sm"
                          >
                            {STATUS_OPTIONS.map(s => (
                              <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
        </>
      ) : (
        <div className="text-center py-16 bg-white border border-dashed rounded-2xl text-gray-400 flex flex-col items-center justify-center gap-3">
          <div className="p-3 bg-gray-50 rounded-xl text-gray-400"><ShoppingBag size={24} /></div>
          <p className="text-sm font-medium">No orders found.</p>
          {searchTerm || statusFilter || dateFilter && (
            <button
              onClick={clearFilters}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;