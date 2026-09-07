import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, Clock, Scissors, CheckCircle2, XCircle, Hourglass, ArrowLeft } from 'lucide-react';
import { fetchMyBookings } from '../Store/Features/bookings/bookingSlice';
import { useNavigate } from 'react-router-dom';

const STATUS_MAP = {
  pending:   { color: 'bg-amber-100 text-amber-700', icon: Hourglass, label: 'Pending' },
  confirmed: { color: 'bg-blue-100 text-blue-700', icon: CheckCircle2, label: 'Confirmed' },
  completed: { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2, label: 'Completed' },
  cancelled: { color: 'bg-red-100 text-red-700', icon: XCircle, label: 'Cancelled' },
};

export default function MyBookings() {
  const dispatch = useDispatch();
  const bookings = useSelector((state) => state.bookings?.mine) ?? [];
  const loading = useSelector((state) => state.bookings?.loading) ?? false;
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const getStatusBadge = (status) => {
    const info = STATUS_MAP[status] || STATUS_MAP.pending;
    const Icon = info.icon;
    return (
      <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${info.color}`}>
        <Icon size={12} /> {info.label}
      </span>
    );
  };

  // ✅ Navigate back to store home
  const goToStoreHome = () => {
    navigate('/appointment');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          {[1, 2].map(i => <div key={i} className="bg-gray-100 rounded-xl h-28"></div>)}
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
            <span className="text-sm font-medium">Back to Appointment</span>
          </button>
        </div>
        
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">My Appointments</h2>

        <span className="text-sm text-gray-500">{bookings.length} booking{bookings.length !== 1 ? 's' : ''}</span>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <Calendar className="mx-auto text-gray-400 mb-3" size={48} />
          <p className="text-gray-600">No appointments booked yet</p>
          <a href="/appointment" className="mt-4 inline-block text-pink-600 font-medium hover:text-pink-700">
            Book an Appointment →
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex flex-wrap justify-between items-start border-b pb-3 gap-2">
                <div>
                  <p className="text-xs text-gray-400 font-medium">
                    BOOKED: {new Date(booking.createdAt).toLocaleDateString('en-GH', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <p className="flex items-center gap-1 text-sm font-semibold text-gray-800 mt-1">
                    <Calendar size={14} /> {booking.date}
                    <Clock size={14} className="ml-2" /> {booking.time}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-bold text-pink-600">
                    {booking.currency || 'GHS'} {(booking.totalAmount ?? 0).toFixed(2)}
                  </span>
                  {getStatusBadge(booking.status)}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                  <Scissors size={12} /> Services
                </p>
                <div className="space-y-1">
                  {booking.services?.map((s, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-800">{s.name}</span>
                      <span className="text-gray-500">{booking.currency || 'GHS'} {s.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {booking.notes && (
                <p className="text-xs text-gray-500 italic border-t pt-2">"{booking.notes}"</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}