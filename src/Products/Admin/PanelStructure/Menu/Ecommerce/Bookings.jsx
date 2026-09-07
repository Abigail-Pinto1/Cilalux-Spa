// src/Pages/Admin/Bookings.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllBookings, updateBookingStatus } from '../../../../../Store/Features/bookings/bookingSlice';
import { Calendar, Clock, CheckCircle2, XCircle, Hourglass, AlertCircle, CalendarX } from 'lucide-react';
import FilterBar from '../../../FilterBar';
import Pagination from '../../../Pagination';


const STATUS_OPTIONS = ['pending', 'confirmed', 'completed', 'cancelled'];
const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-700',
  confirmed: 'bg-blue-50 text-blue-700',
  completed: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-red-50 text-red-700',
};

const ITEMS_PER_PAGE = 10;

const Bookings = () => {
  const dispatch = useDispatch();
  const { items: bookings = [], loading, error } = useSelector((state) => state.bookings || {});
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(ITEMS_PER_PAGE);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    dispatch(fetchAllBookings());
  }, [dispatch]);

  const handleStatusChange = (bookingId, newStatus) => {
    dispatch(updateBookingStatus({ bookingId, status: newStatus }));
  };

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const customerName = (booking.customer?.name || '').toLowerCase();
      const customerEmail = (booking.customer?.email || '').toLowerCase();
      const serviceNames = booking.services?.map(s => s.name.toLowerCase()).join(' ') || '';
      
      if (!customerName.includes(search) && 
          !customerEmail.includes(search) && 
          !serviceNames.includes(search)) {
        return false;
      }
    }
    
    if (statusFilter && booking.status !== statusFilter) {
      return false;
    }
    
    if (dateFilter) {
      const bookingDate = new Date(booking.createdAt);
      const now = new Date();
      const daysDiff = (now - bookingDate) / (1000 * 60 * 60 * 24);
      
      if (dateFilter === 'today' && daysDiff > 1) return false;
      if (dateFilter === 'week' && daysDiff > 7) return false;
      if (dateFilter === 'month' && daysDiff > 30) return false;
    }
    
    return true;
  });

  const totalItems = filteredBookings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

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
      options: STATUS_OPTIONS.map(s => ({ value: s, label: s }))
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
        <div className="animate-pulse text-gray-500 font-medium text-sm">Loading bookings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointment Bookings</h1>
          <p className="text-sm text-gray-500">Manage customer appointments and confirmations</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-sm font-medium text-gray-700">
          Total Bookings: <span className="text-indigo-600 font-bold">{bookings.length}</span>
          {filteredBookings.length !== bookings.length && (
            <span className="text-gray-400 text-xs ml-2">
              (filtered: {filteredBookings.length})
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 flex items-center gap-3 text-sm">
          <AlertCircle size={18} /> <span>{error}</span>
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
          if (key === 'date') setDateFilter(value);
          setCurrentPage(1);
        }}
        onClearFilters={clearFilters}
        placeholder="Search by customer name, email or service..."
      />

      {bookings.length > 0 ? (
        <>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-gray-700">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/50 text-gray-400 font-semibold uppercase tracking-wider text-xs">
                    <th className="py-3 px-4">Date / Time</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Services</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginatedBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50/40 transition-colors">
                      <td className="py-4 px-4">
                        <p className="flex items-center gap-1 font-medium text-gray-900">
                          <Calendar size={12} /> {booking.date}
                        </p>
                        <p className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                          <Clock size={12} /> {booking.time}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-medium text-gray-900">{booking.customer?.name || 'Guest'}</p>
                        <p className="text-xs text-gray-400">{booking.customer?.email || 'N/A'}</p>
                      </td>
                      <td className="py-4 px-4 max-w-xs">
                        <div className="space-y-1">
                          {booking.services?.slice(0, 2).map((s, idx) => (
                            <p key={idx} className="text-xs text-gray-600 truncate font-medium">• {s.name}</p>
                          ))}
                          {booking.services?.length > 2 && (
                            <p className="text-xs text-gray-400">+{booking.services.length - 2} more</p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 font-bold text-gray-900">
                        {booking.currency || 'GHS'} {Number(booking.totalAmount || 0).toLocaleString('en-GH', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${STATUS_STYLES[booking.status] || STATUS_STYLES.pending}`}>
                          {booking.status === 'completed' ? <CheckCircle2 size={12} /> :
                           booking.status === 'cancelled' ? <XCircle size={12} /> :
                           <Hourglass size={12} />}
                          {booking.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <select
                          value={booking.status || 'pending'}
                          onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                          className="text-xs border border-gray-200 rounded-lg p-1.5 bg-white font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all shadow-sm"
                        >
                          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
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
        <div className="text-center py-16 bg-white border border-dashed rounded-2xl text-gray-400 flex flex-col items-center justify-center gap-3">
          <div className="p-3 bg-gray-50 rounded-xl text-gray-400"><CalendarX size={24} /></div>
          <p className="text-sm font-medium">No bookings found.</p>
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

export default Bookings;