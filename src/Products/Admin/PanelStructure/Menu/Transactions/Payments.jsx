// src/Pages/Admin/Payments.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders } from '../../../../../Store/Features/orders/orderSlice';
import { CreditCard, Smartphone, Landmark, DollarSign, Calendar, ShieldCheck, RefreshCw, Wallet } from 'lucide-react';
import FilterBar from '../../../FilterBar';
import Pagination from '../../../Pagination';

const METHOD_META = {
  momo: { label: 'Mobile Money (MoMo)', icon: Smartphone, style: 'bg-emerald-50/40 text-emerald-700 border-emerald-100' },
  card: { label: 'Credit / Bank Card', icon: CreditCard, style: 'bg-blue-50/40 text-blue-700 border-blue-100' },
  bank_transfer: { label: 'Bank Transfer', icon: Landmark, style: 'bg-purple-50/40 text-purple-700 border-purple-100' },
};

const ITEMS_PER_PAGE = 10;

const Payments = () => {
  const dispatch = useDispatch();
  const { items: orders = [], loading, error } = useSelector((state) => state.orders || {});
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(ITEMS_PER_PAGE);
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('');

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const paidOrders = orders.filter((o) => o.isPaid === true);

  const filteredOrders = paidOrders.filter((order) => {
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
    
    if (methodFilter && order.payment?.method !== methodFilter) {
      return false;
    }
    
    return true;
  });

  const channelMetrics = paidOrders.reduce(
    (acc, order) => {
      const method = order.payment?.method || 'momo';
      const amount = Number(order.totalAmount || 0);
      if (!acc[method]) acc[method] = { total: 0, count: 0 };
      acc[method].total += amount;
      acc[method].count += 1;
      return acc;
    },
    {}
  );

  const grandTotalReceived = paidOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setMethodFilter('');
    setCurrentPage(1);
  };

  const filters = [
    {
      key: 'method',
      label: 'Payment Method',
      type: 'select',
      value: methodFilter,
      options: [
        { value: 'momo', label: 'Mobile Money' },
        { value: 'card', label: 'Credit Card' },
        { value: 'bank_transfer', label: 'Bank Transfer' }
      ]
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-gray-500 font-medium text-sm">Aggregating payment settlements...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payment Analytics</h1>
        <p className="text-sm text-gray-500">Verified payments received, broken down by channel.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 text-sm">
          System Sync Error: {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Revenue</p>
            <h3 className="text-2xl font-extrabold text-gray-900">₵{grandTotalReceived.toLocaleString('en-GH', { minimumFractionDigits: 2 })}</h3>
            <p className="text-xs text-gray-400 mt-1">{paidOrders.length} verified payments</p>
          </div>
          <div className="bg-indigo-50 p-3.5 rounded-xl text-indigo-600 shadow-sm shrink-0"><DollarSign size={22} /></div>
        </div>

        {Object.entries(METHOD_META).map(([key, meta]) => {
          const Icon = meta.icon;
          const data = channelMetrics[key] || { total: 0, count: 0 };
          return (
            <div key={key} className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{meta.label}</p>
                <h3 className="text-2xl font-extrabold text-gray-900">₵{data.total.toLocaleString('en-GH', { minimumFractionDigits: 2 })}</h3>
                <p className="text-xs text-gray-400 mt-1">{data.count} transaction{data.count !== 1 ? 's' : ''}</p>
              </div>
              <div className="bg-gray-50 p-3.5 rounded-xl text-gray-600 shadow-sm shrink-0"><Icon size={22} /></div>
            </div>
          );
        })}
      </div>

      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        filters={filters}
        onFilterChange={(key, value) => {
          if (key === 'method') setMethodFilter(value);
          setCurrentPage(1);
        }}
        onClearFilters={clearFilters}
        placeholder="Search by order number or customer..."
      />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Payment Log</h3>
          <button onClick={() => dispatch(fetchAllOrders())} className="text-xs text-indigo-600 font-semibold flex items-center gap-1 hover:underline">
            <RefreshCw size={12} /> Refresh
          </button>
        </div>

        {paginatedOrders.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-gray-700">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-400 font-semibold uppercase tracking-wider text-xs">
                    <th className="py-3.5 px-4">Order / Date</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Channel</th>
                    <th className="py-3.5 px-4">Amount</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {paginatedOrders.map((order) => {
                    const meta = METHOD_META[order.payment?.method] || METHOD_META.momo;
                    const Icon = meta.icon;
                    const formattedDate = order.paidAt || order.createdAt
                      ? new Date(order.paidAt || order.createdAt).toLocaleDateString('en-GH', {
                          day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })
                      : 'N/A';

                    return (
                      <tr key={order._id} className="hover:bg-gray-50/30 transition-colors">
                        <td className="py-4 px-4">
                          <span className="font-mono text-xs font-semibold text-indigo-600 block mb-0.5">
                            {order.orderNumber || `#${order._id?.slice(-8).toUpperCase()}`}
                          </span>
                          <div className="flex items-center gap-1 text-[11px] text-gray-400 font-normal">
                            <Calendar size={12} />
                            <span>{formattedDate}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-gray-900 font-semibold">{order.customer?.name || 'Guest'}</p>
                          <p className="text-xs text-gray-400 font-normal">{order.customer?.email || 'N/A'}</p>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border ${meta.style}`}>
                            <Icon size={13} />
                            {meta.label}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-base font-bold text-gray-900">
                          {order.currency || 'GHS'} {Number(order.totalAmount || 0).toLocaleString('en-GH', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-100">
                            <ShieldCheck size={12} />
                            Verified
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
          <div className="text-center py-16 bg-white border border-dashed border-gray-200 rounded-2xl text-gray-400 flex flex-col items-center justify-center gap-2">
            <div className="p-3.5 bg-gray-50 rounded-xl text-gray-400"><Wallet size={24} /></div>
            <div>No payments found.</div>
            {(searchTerm || methodFilter) && (
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
    </div>
  );
};

export default Payments;