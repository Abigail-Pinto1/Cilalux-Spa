// src/Pages/Admin/CompletedTransactions.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders } from '../../../../../Store/Features/orders/orderSlice';
import { CheckCircle2, Calendar, ShieldCheck, Receipt } from 'lucide-react';
import FilterBar from '../../../FilterBar';
import Pagination from '../../../Pagination';

const PAYMENT_LABEL = { momo: 'Mobile Money', card: 'Card', bank_transfer: 'Bank Transfer' };
const ITEMS_PER_PAGE = 10;

const CompletedTransactions = () => {
  const dispatch = useDispatch();
  const { items: orders = [], loading, error } = useSelector((state) => state.orders || {});
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(ITEMS_PER_PAGE);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const completedTransactions = orders.filter((o) => o.isPaid === true);

  const filteredTransactions = completedTransactions.filter((order) => {
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const orderNumber = (order.orderNumber || order._id || '').toLowerCase();
      const customerName = (order.customer?.name || '').toLowerCase();
      const customerEmail = (order.customer?.email || '').toLowerCase();
      
      if (!orderNumber.includes(search) && 
          !customerName.includes(search) && 
          !customerEmail.includes(search)) {
        return false;
      }
    }
    
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

  const totalSettledVolume = filteredTransactions.reduce(
    (acc, o) => acc + Number(o.totalAmount || 0),
    0
  );

  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

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
        <div className="animate-pulse text-gray-500 font-medium text-sm">Auditing settled transactions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settled Transactions</h1>
          <p className="text-sm text-gray-500">Orders with payment successfully verified and collected.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-5 py-2.5 rounded-xl shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider leading-none">Total Settled</p>
                <p className="text-lg font-black leading-none">₵{totalSettledVolume.toLocaleString('en-GH', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-sm font-medium text-gray-700">
            {filteredTransactions.length} of {completedTransactions.length}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 text-sm">
          Sync Error: {error}
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
          if (key === 'date') setDateFilter(value);
          setCurrentPage(1);
        }}
        onClearFilters={clearFilters}
        placeholder="Search by order number or customer..."
      />

      {paginatedTransactions.length > 0 ? (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-gray-700">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-400 font-semibold uppercase tracking-wider text-xs">
                    <th className="py-3.5 px-4">Order / Date</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Items</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4">Payment Method</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {paginatedTransactions.map((order) => {
                    const orderDate = order.paidAt || order.createdAt
                      ? new Date(order.paidAt || order.createdAt).toLocaleDateString('en-GH', {
                          day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })
                      : 'N/A';

                    return (
                      <tr key={order._id} className="hover:bg-gray-50/20 transition-colors">
                        <td className="py-4 px-4">
                          <span className="font-mono text-xs text-indigo-600 block mb-0.5">
                            {order.orderNumber || `#${order._id?.slice(-8).toUpperCase()}`}
                          </span>
                          <div className="flex items-center gap-1 text-[11px] text-gray-400 font-normal">
                            <Calendar size={12} />
                            <span>{orderDate}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-gray-900 font-semibold">{order.customer?.name || 'Guest'}</p>
                          <p className="text-xs text-gray-400 font-normal">{order.customer?.email || 'N/A'}</p>
                        </td>
                        <td className="py-4 px-4 text-gray-500 max-w-xs truncate">
                          {order.items?.[0]?.name || 'Online Store Purchase'}
                          {order.items?.length > 1 && (
                            <span className="text-xs text-indigo-500 font-bold block mt-0.5">
                              +{order.items.length - 1} other item{order.items.length - 1 > 1 ? 's' : ''}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 font-bold text-gray-900 text-base">
                          {order.currency || 'GHS'} {Number(order.totalAmount || 0).toLocaleString('en-GH', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          <span className="bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200/50">
                            {PAYMENT_LABEL[order.payment?.method] || order.payment?.method || 'Unknown'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-100">
                            <CheckCircle2 size={12} className="text-green-600" />
                            Settled
                          </span>
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
          <div className="p-3.5 bg-gray-50 rounded-xl text-gray-400"><Receipt size={24} /></div>
          <div>
            <p className="font-semibold text-gray-800">No Settled Transactions</p>
            <p className="text-xs text-gray-400 mt-0.5">Paid orders will appear here automatically.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompletedTransactions;