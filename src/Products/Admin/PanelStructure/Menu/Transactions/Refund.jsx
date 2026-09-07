// src/Pages/Admin/Refund.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReturnRequests, updateOrderStatus } from '../../../../../Store/Features/orders/orderSlice';
import { AlertCircle, RotateCcw, ShieldAlert, CheckCircle2, Calendar, Ban } from 'lucide-react';
import FilterBar from '../../../FilterBar';
import Pagination from '../../../Pagination';

const ITEMS_PER_PAGE = 10;

const Refund = () => {
  const dispatch = useDispatch();
  const { returns: refunds = [], loading, error } = useSelector((state) => state.orders || {});
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(ITEMS_PER_PAGE);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    dispatch(fetchReturnRequests());
  }, [dispatch]);

  const handleApprove = (order) => {
    dispatch(updateOrderStatus({
      orderId: order._id,
      status: 'cancelled',
      description: `Return approved — refund issued for ${order.returnRequest?.reason || 'customer request'}`,
    })).then(() => dispatch(fetchReturnRequests()));
  };

  const handleReject = (order) => {
    dispatch(updateOrderStatus({
      orderId: order._id,
      status: order.status,
      description: `Return request rejected: ${order.returnRequest?.reason || 'no reason given'}`,
    })).then(() => dispatch(fetchReturnRequests()));
  };

  const filteredRefunds = refunds.filter((order) => {
    const rr = order.returnRequest || {};
    
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const orderNumber = (order.orderNumber || order._id || '').toLowerCase();
      const customerName = (order.customer?.name || '').toLowerCase();
      const reason = (rr.reason || '').toLowerCase();
      
      if (!orderNumber.includes(search) && 
          !customerName.includes(search) && 
          !reason.includes(search)) {
        return false;
      }
    }
    
    if (statusFilter) {
      const isResolved = order.status === 'cancelled' || rr.status === 'Approved' || rr.status === 'Rejected';
      if (statusFilter === 'pending' && isResolved) return false;
      if (statusFilter === 'resolved' && !isResolved) return false;
    }
    
    return true;
  });

  const totalItems = filteredRefunds.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRefunds = filteredRefunds.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setCurrentPage(1);
  };

  const pendingCount = refunds.filter((r) => r.returnRequest?.status === 'Pending').length;

  const filters = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      value: statusFilter,
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'resolved', label: 'Resolved' }
      ]
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-gray-500 font-medium text-sm">Loading return requests...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Return &amp; Refund Requests</h1>
          <p className="text-sm text-gray-500">Review return claims submitted by customers on delivered orders.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-sm font-medium text-gray-700">
          Pending: <span className="text-red-500 font-bold">{pendingCount}</span>
          {filteredRefunds.length !== refunds.length && (
            <span className="text-gray-400 text-xs ml-1">
              (filtered: {filteredRefunds.length})
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

      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        filters={filters}
        onFilterChange={(key, value) => {
          if (key === 'status') setStatusFilter(value);
          setCurrentPage(1);
        }}
        onClearFilters={clearFilters}
        placeholder="Search by order number, customer or reason..."
      />

      {paginatedRefunds.length > 0 ? (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-gray-700">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-400 font-semibold uppercase tracking-wider text-xs">
                    <th className="py-3.5 px-4">Order / Date</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Reason</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {paginatedRefunds.map((order) => {
                    const rr = order.returnRequest || {};
                    const requestDate = rr.createdAt
                      ? new Date(rr.createdAt).toLocaleDateString('en-GH', { day: 'numeric', month: 'short', year: 'numeric' })
                      : 'N/A';
                    const isResolved = order.status === 'cancelled' || rr.status === 'Approved' || rr.status === 'Rejected';

                    return (
                      <tr key={order._id} className="hover:bg-gray-50/20 transition-colors">
                        <td className="py-4 px-4">
                          <span className="font-mono text-xs font-semibold text-red-600 block mb-0.5">
                            {order.orderNumber || `#${order._id?.slice(-8).toUpperCase()}`}
                          </span>
                          <div className="flex items-center gap-1 text-[11px] text-gray-400 font-normal">
                            <Calendar size={11} />
                            <span>{requestDate}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-gray-900 font-semibold">{order.customer?.name || 'Guest'}</p>
                          <p className="text-xs text-gray-400 font-normal">{order.customer?.email || 'N/A'}</p>
                        </td>
                        <td className="py-4 px-4 max-w-xs">
                          <p className="text-xs text-gray-600 line-clamp-2 font-normal italic">
                            "{rr.reason || 'No reason provided'}"
                          </p>
                        </td>
                        <td className="py-4 px-4 font-bold text-gray-900">
                          {order.currency || 'GHS'} {Number(order.totalAmount || 0).toLocaleString('en-GH', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            order.status === 'cancelled'
                              ? 'bg-green-50 text-green-700 border border-green-100'
                              : 'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}>
                            {order.status === 'cancelled' ? <CheckCircle2 size={12} /> : <RotateCcw size={12} />}
                            {order.status === 'cancelled' ? 'Refunded' : 'Pending'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          {isResolved ? (
                            <span className="text-xs text-gray-400">Resolved</span>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleApprove(order)}
                                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(order)}
                                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-600 hover:text-white transition-all border border-red-100"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
        </>
      ) : (
        <div className="text-center py-16 bg-white border border-dashed border-gray-200 rounded-2xl text-gray-400 flex flex-col items-center justify-center gap-2 shadow-sm">
          <div className="p-3.5 bg-gray-50 rounded-xl text-gray-400"><ShieldAlert size={24} /></div>
          <div>
            <p className="font-semibold text-gray-800">No Return Requests</p>
            <p className="text-xs text-gray-400 mt-0.5">Customer return claims will appear here automatically.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Refund;