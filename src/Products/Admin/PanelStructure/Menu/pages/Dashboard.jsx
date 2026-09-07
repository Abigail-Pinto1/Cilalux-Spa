// src/Pages/Admin/Dashboard.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, fetchDashboardStats, updateOrderStatus } from '../../../../../Store/Features/orders/orderSlice';
import { socket } from '../../../../../Store/Auth/utils/socket';
import {
  TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Calendar,
} from 'lucide-react';
import Pagination from '../../../Pagination';

const WORKFLOW_STAGES = ['confirmed', 'preparing', 'packed', 'shipped', 'delivered'];
const ITEMS_PER_PAGE = 8;

const getOrderTotal = (o) => Number(o.totalAmount ?? 0);
const getCustomerLabel = (o) => o.customer?.name || o.shippingAddress ? `${o.shippingAddress?.firstName || ''} ${o.shippingAddress?.lastName || ''}`.trim() : null;
const getCustomerKey = (o) => o.customer?.email || o.user || null;
const getOrderItemsLabel = (o) => (o.items || []).map((i) => `${i.name || i.productName} x${i.quantity ?? 1}`).join(', ');
const nextStage = (status) => {
  const idx = WORKFLOW_STAGES.findIndex((s) => s === String(status).toLowerCase());
  return idx >= 0 && idx < WORKFLOW_STAGES.length - 1 ? WORKFLOW_STAGES[idx + 1] : null;
};

const STATUS_STYLES = {
  pending: 'bg-rose-100 text-rose-800',
  confirmed: 'bg-indigo-100 text-indigo-800',
  preparing: 'bg-orange-100 text-orange-800',
  packed: 'bg-yellow-100 text-yellow-800',
  shipped: 'bg-blue-100 text-blue-800',
  out_for_delivery: 'bg-cyan-100 text-cyan-800',
  delivered: 'bg-emerald-100 text-emerald-800',
};

const StatusPill = ({ status }) => (
  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold inline-block capitalize ${STATUS_STYLES[String(status).toLowerCase()] || 'bg-amber-100 text-amber-800'}`}>
    {status?.replace(/_/g, ' ') || 'Pending'}
  </span>
);

export default function Dashboard() {
  const dispatch = useDispatch();
  const { items = [], stats, loading } = useSelector((state) => state.orders || {});
  const [trackingInputs, setTrackingInputs] = useState({});
  const [updatingId, setUpdatingId] = useState(null);
  const [newOrderBanner, setNewOrderBanner] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    dispatch(fetchAllOrders());
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  // Socket connection for live notifications
  useEffect(() => {
    socket.connect();
    socket.emit('join-admin');

    const handleNewOrder = (payload) => {
      setNewOrderBanner(payload);
      dispatch(fetchAllOrders());
      dispatch(fetchDashboardStats());
      setTimeout(() => setNewOrderBanner(null), 6000);
    };

    socket.on('new-order', handleNewOrder);
    return () => {
      socket.off('new-order', handleNewOrder);
      socket.disconnect();
    };
  }, [dispatch]);

  const computed = useMemo(() => {
    const totalRevenue = items.reduce((sum, o) => sum + getOrderTotal(o), 0);
    const totalOrders = items.length;
    const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;
    const uniqueCustomers = new Set(items.map(getCustomerKey).filter(Boolean)).size;
    return { totalRevenue, totalOrders, avgOrderValue, uniqueCustomers };
  }, [items]);

  const totalRevenue = stats?.totalRevenue ?? computed.totalRevenue;
  const totalOrders = stats?.totalOrders ?? computed.totalOrders;
  const currency = (n) => `₵${Number(n || 0).toLocaleString('en-GH', { minimumFractionDigits: 2 })}`;

  // Pagination for orders
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = items.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const dashboardStats = [
    { title: 'Total Revenue', value: currency(totalRevenue), fallbackText: `Across ${totalOrders} order${totalOrders === 1 ? '' : 's'}`, icon: DollarSign, color: 'bg-green-500' },
    { title: 'Total Orders', value: totalOrders.toLocaleString(), fallbackText: 'All time', icon: ShoppingCart, color: 'bg-blue-500' },
    { title: 'Active Customers', value: computed.uniqueCustomers.toLocaleString(), fallbackText: 'Unique buyers', icon: Users, color: 'bg-purple-500' },
    { title: 'Avg Order Value', value: currency(computed.avgOrderValue), fallbackText: 'Current batch', icon: TrendingUp, color: 'bg-orange-500' },
  ];

  const advanceOrderStatus = async (order) => {
    const target = nextStage(order.status);
    if (!target) return;
    setUpdatingId(order._id);
    try {
      await dispatch(updateOrderStatus({
        orderId: order._id,
        status: target,
        trackingNumber: target === 'shipped' ? trackingInputs[order._id] || '' : undefined,
        description: `Order moved to ${target} from the admin dashboard.`,
      }));
      dispatch(fetchAllOrders());
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-2"></div>
        <div className="text-lg text-gray-500 font-medium">Loading live dashboard metrics...</div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6">
      {newOrderBanner && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 text-sm font-medium flex items-center justify-between animate-pulse">
          🔔 New order received — {newOrderBanner.orderNumber} · {currency(newOrderBanner.totalAmount)}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-xl text-white ${stat.color} shadow-sm shrink-0`}>
                  <Icon size={20} />
                </div>
              </div>
              <div className="pt-3 border-t border-gray-50 text-xs text-gray-400">{stat.fallbackText}</div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-indigo-50 px-2.5 py-1 rounded-full text-indigo-600 font-medium">
              Live Feed · {items.length} total
            </span>
            {items.length > itemsPerPage && (
              <span className="text-xs text-gray-400">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, items.length)} of {items.length}
              </span>
            )}
          </div>
        </div>

        {items.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 text-xs font-semibold uppercase tracking-wider bg-gray-50/50">
                    <th className="p-4">Order</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Items</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {paginatedOrders.map((order) => {
                    const target = nextStage(order.status);
                    return (
                      <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 font-semibold text-gray-900">{order.orderNumber || `#${order._id?.slice(-8).toUpperCase()}`}</td>
                        <td className="p-4">
                          <p className="font-medium text-gray-900">{getCustomerLabel(order) || 'Guest'}</p>
                          <p className="text-xs text-gray-400">{order.shippingAddress?.phone || order.customer?.phone || 'No phone on file'}</p>
                        </td>
                        <td className="p-4 text-xs text-gray-600 max-w-xs">{getOrderItemsLabel(order) || '—'}</td>
                        <td className="p-4 font-bold text-gray-900">{currency(getOrderTotal(order))}</td>
                        <td className="p-4"><StatusPill status={order.status} /></td>
                        <td className="p-4 text-right">
                          {target ? (
                            <div className="flex items-center justify-end gap-2">
                              {target === 'shipped' && (
                                <input
                                  type="text"
                                  placeholder="Tracking Code..."
                                  value={trackingInputs[order._id] || ''}
                                  onChange={(e) => setTrackingInputs((prev) => ({ ...prev, [order._id]: e.target.value }))}
                                  className="w-28 px-2.5 py-1 text-xs border border-gray-200 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                              )}
                              <button
                                disabled={updatingId === order._id}
                                onClick={() => advanceOrderStatus(order)}
                                className="flex items-center justify-center gap-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border border-indigo-100 shadow-sm disabled:opacity-50"
                              >
                                Advance to {target}
                              </button>
                            </div>
                          ) : (
                            <span className="text-emerald-600 text-xs font-medium">Completed 👍</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  totalItems={items.length}
                  itemsPerPage={itemsPerPage}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 border border-dashed rounded-xl text-gray-400 text-sm">No orders yet.</div>
        )}
      </div>
    </div>
  );
}