/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
// MyOrders.jsx - With Back Arrow Navigation
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Truck, 
  HelpCircle, 
  Package, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  CreditCard,
  ArrowLeft,
  ShoppingBag
} from 'lucide-react';
import { fetchOrderHistory, requestReturn } from '../../Store/Features/orders/orderSlice';

const STATUS_MAP = {
  pending: { color: 'bg-amber-100 text-amber-700', icon: Clock, label: 'Pending' },
  confirmed: { color: 'bg-blue-100 text-blue-700', icon: CheckCircle2, label: 'Confirmed' },
  preparing: { color: 'bg-purple-100 text-purple-700', icon: Package, label: 'Preparing' },
  packed: { color: 'bg-indigo-100 text-indigo-700', icon: Package, label: 'Packed' },
  shipped: { color: 'bg-cyan-100 text-cyan-700', icon: Truck, label: 'Shipped' },
  out_for_delivery: { color: 'bg-orange-100 text-orange-700', icon: Truck, label: 'Out for delivery' },
  delivered: { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2, label: 'Delivered' },
  cancelled: { color: 'bg-red-100 text-red-700', icon: AlertCircle, label: 'Cancelled' },
  return_requested: { color: 'bg-rose-100 text-rose-700', icon: HelpCircle, label: 'Return requested' },
};

const PAYMENT_LABEL = { momo: 'Mobile Money', card: 'Card', bank_transfer: 'Bank Transfer' };

const API_ORIGIN = 'http://localhost:7000';
const resolveImageUrl = (url) => {
  if (!url) return '';
  return url.startsWith('http') ? url : `${API_ORIGIN}${url}`;
};

export default function MyOrders() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // Select from Redux store
  const orderHistory = useSelector(state => state.orders?.history) ?? [];
  const loading = useSelector(state => state.orders?.loading) ?? false;
  const user = useSelector(state => state.auth?.user);

  const [returnText, setReturnText] = useState({});
  const [activeReturnBox, setActiveReturnBox] = useState(null);
  const [highlightedOrder, setHighlightedOrder] = useState(null);
  const orderRefs = useRef({});

  // Handle highlighted order from checkout
  useEffect(() => {
    if (location.state?.highlightOrder) {
      setHighlightedOrder(location.state.highlightOrder);
      const timer = setTimeout(() => setHighlightedOrder(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  // Fetch order history when user is authenticated
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchOrderHistory(user.id));
    }
  }, [dispatch, user]);

  // Scroll to highlighted order
  useEffect(() => {
    if (highlightedOrder && orderHistory.length > 0) {
      const ref = orderRefs.current[highlightedOrder];
      if (ref) {
        setTimeout(() => ref.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
      }
    }
  }, [highlightedOrder, orderHistory]);

  const getStatusBadge = (status) => {
    const info = STATUS_MAP[status?.toLowerCase()] || STATUS_MAP.pending;
    const Icon = info.icon;
    return (
      <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${info.color}`}>
        <Icon size={12} />
        {info.label}
      </span>
    );
  };

  const triggerReturnRequest = async (orderId) => {
    const reason = returnText[orderId];
    if (!reason?.trim()) {
      alert('Please provide a reason for the return request.');
      return;
    }
    try {
      const result = await dispatch(requestReturn({ orderId, reason }));
      if (requestReturn.rejected.match(result)) {
        throw new Error(result.payload || 'Return request failed');
      }
      alert('Return request submitted successfully.');
      if (user?.id) dispatch(fetchOrderHistory(user.id));
      setActiveReturnBox(null);
      setReturnText({});
    } catch (error) {
      console.error('Error submitting return request:', error);
      alert(error.message || 'Failed to submit return request. Please try again.');
    }
  };

  // ✅ Navigate back to store home
  const goToStoreHome = () => {
    navigate('/store');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-100 rounded-xl p-5 h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      {/* ✅ Back Button to Store Home */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={goToStoreHome}
            className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Store</span>
          </button>
        </div>
        <span className="text-sm text-gray-500">
          {orderHistory.length} order{orderHistory.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Header with title */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Purchase History</h2>
          {location.state?.fromCheckout && (
            <p className="text-sm text-green-600 mt-1">✅ Your order has been placed successfully!</p>
          )}
        </div>
      </div>

      {orderHistory.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <Package className="mx-auto text-gray-400 mb-3" size={48} />
          <p className="text-gray-600">No orders yet</p>
          <button
            onClick={goToStoreHome}
            className="mt-4 inline-flex items-center gap-2 text-pink-600 font-medium hover:text-pink-700 transition-colors"
          >
            <ShoppingBag size={16} />
            Start Shopping →
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orderHistory.map((order) => {
            const isHighlighted = highlightedOrder === order._id;
            const itemCount = order.items?.reduce((sum, i) => sum + (i.quantity || 1), 0) || 0;

            return (
              <div
                key={order._id}
                ref={el => (orderRefs.current[order._id] = el)}
                className={`bg-white border rounded-xl p-5 shadow-sm space-y-4 transition-all duration-500 ${
                  isHighlighted
                    ? 'border-pink-500 shadow-lg shadow-pink-100 scale-[1.02] ring-2 ring-pink-300'
                    : 'hover:shadow-md border-gray-200'
                }`}
              >
                {isHighlighted && (
                  <div className="bg-pink-50 text-pink-700 text-xs font-semibold px-3 py-1 rounded-full inline-block">
                    🎉 New Order!
                  </div>
                )}

                {/* Header row */}
                <div className="flex flex-wrap justify-between items-start border-b pb-3 gap-2">
                  <div>
                    <p className="text-xs text-gray-400 font-medium">
                      ORDER PLACED: {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GH', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                    </p>
                    <p className="text-sm font-bold text-gray-800 mt-0.5">
                      {order.orderNumber || `#${order._id?.slice(-8).toUpperCase()}`}
                    </p>
                    {order.payment?.method && (
                      <p className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                        <CreditCard size={12} />
                        Paid via {PAYMENT_LABEL[order.payment.method] || order.payment.method}
                        {order.payment.reference && ` · Ref: ${order.payment.reference.slice(0, 14)}${order.payment.reference.length > 14 ? '…' : ''}`}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-bold text-pink-600">
                      {order.currency || 'GHS'} {(order.totalAmount ?? 0).toFixed(2)}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Items */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Items ({itemCount})
                  </p>
                  <div className="space-y-2">
                    {order.items?.length ? order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-3 text-sm">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 bg-pink-50 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center">
                            {item.image ? (
                              <img src={resolveImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <Package className="text-gray-300" size={16} />
                            )}
                          </div>
                          <span className="text-gray-800 font-medium truncate">
                            {item.name || item.productName || 'Product'}
                            <span className="text-gray-400 font-normal ml-1">x{item.quantity || 1}</span>
                          </span>
                        </div>
                        <span className="text-gray-600 font-medium whitespace-nowrap">
                          {order.currency || 'GHS'} {((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                        </span>
                      </div>
                    )) : (
                      <p className="text-sm text-gray-400">No item details available</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                  <a
                    href={`http://localhost:7000/api/orders/${order._id}/download-receipt`}
                    className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border px-3 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText size={14} /> Invoice PDF
                  </a>
                  
                  <a
                    href={`/store/order-tracking/${order._id}`}
                    className="flex items-center gap-1.5 text-xs bg-pink-50 text-pink-600 px-3 py-2 rounded-lg font-semibold hover:bg-pink-100 transition-colors"
                  >
                    <Truck size={14} /> Track Order
                  </a>
                  
                  {order.status === 'delivered' && !order.returnRequest?.isRequested && (
                    <button
                      onClick={() => setActiveReturnBox(activeReturnBox === order._id ? null : order._id)}
                      className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 px-3 py-2 rounded-lg font-semibold hover:bg-rose-100 transition-colors"
                    >
                      <HelpCircle size={14} /> Return Item
                    </button>
                  )}
                </div>

                {activeReturnBox === order._id && (
                  <div className="bg-gray-50 border p-3 rounded-lg space-y-2">
                    <textarea
                      className="w-full border rounded-lg p-2 text-xs focus:ring-1 focus:ring-pink-500 outline-none"
                      rows="2"
                      placeholder="Reason for return request (e.g. wrong size, defective product)..."
                      value={returnText[order._id] || ''}
                      onChange={(e) => setReturnText({ ...returnText, [order._id]: e.target.value })}
                    />
                    <button
                      onClick={() => triggerReturnRequest(order._id)}
                      className="bg-rose-600 text-white text-xs px-4 py-1.5 rounded font-medium hover:bg-rose-700 transition-colors"
                    >
                      Submit Return Request
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}