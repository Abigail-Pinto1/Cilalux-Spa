import React, { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, User, Mail, Phone, Scissors, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { createBooking } from "../Store/Features/bookings/bookingSlice";
import PayPopup from "../Products/productPages/PayPopup"; // reuse the same verified Paystack popup

const SERVICES = {
  massage:  { name: "Massage Therapy",     price: 250 },
  facial:   { name: "Facial & Skincare",   price: 180 },
  hair:     { name: "Hair Styling",        price: 150 },
  nails:    { name: "Manicure & Pedicure", price: 120 },
  makeover: { name: "Luxury Makeover",     price: 400 },
};

const TIME_SLOTS = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];

const DRAFT_KEY = 'bookingDraft';

export default function Appointment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth || {});

  // ✅ Restore draft on mount, if one exists (e.g. returning from login)
  const [step, setStep] = useState(() => {
    const draft = sessionStorage.getItem(DRAFT_KEY);
    return draft ? JSON.parse(draft).step || 1 : 1;
  });
  const [selectedKeys, setSelectedKeys] = useState(() => {
    const draft = sessionStorage.getItem(DRAFT_KEY);
    return draft ? JSON.parse(draft).selectedKeys || [] : [];
  });
  const [date, setDate] = useState(() => {
    const draft = sessionStorage.getItem(DRAFT_KEY);
    return draft ? JSON.parse(draft).date || '' : '';
  });
  const [time, setTime] = useState(() => {
    const draft = sessionStorage.getItem(DRAFT_KEY);
    return draft ? JSON.parse(draft).time || '' : '';
  });
  const [notes, setNotes] = useState(() => {
    const draft = sessionStorage.getItem(DRAFT_KEY);
    return draft ? JSON.parse(draft).notes || '' : '';
  });

  const [isPayPopupOpen, setIsPayPopupOpen] = useState(false);
  const [error, setError] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const selectedServices = selectedKeys.map((key) => ({ key, ...SERVICES[key] }));
  const totalAmount = selectedServices.reduce((sum, s) => sum + s.price, 0);

  const toggleService = (key) => {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const goToStep2 = () => {
    if (selectedKeys.length === 0) return setError("Please select at least one service.");
    setError(null);
    setStep(2);
  };

  const goToStep3 = () => {
    if (!date || !time) return setError("Please select both a date and time.");
    setError(null);

    const token = localStorage.getItem('token');
    if (!token || !isAuthenticated) {
      // ✅ Save exactly where we are before leaving for login
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ step: 3, selectedKeys, date, time, notes }));
      navigate('/store/login', { state: { from: location.pathname } });
      return;
    }
    setStep(3);
  };

  const handlePaymentSuccess = async (reference) => {
    setError(null);
    const payload = {
      services: selectedServices.map(({ key, name, price }) => ({ key, name, price })),
      date, time, notes, totalAmount,
      currency: 'GHS',
      customer: { name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(), email: user?.email, phone: user?.phone },
      payment: { method: 'momo', reference },
    };

    const result = await dispatch(createBooking(payload));
    if (createBooking.fulfilled.match(result)) {
      sessionStorage.removeItem(DRAFT_KEY);   // ✅ clear draft on success
      setConfirmedBooking(result.payload.booking);
      setStep(4);
    } else {
      setError(result.payload || 'Failed to confirm booking after payment.');
    }
  };



 return (
    <section className="relative py-24 bg-gradient-to-b from-rose-50 via-white to-purple-50 overflow-hidden">
      <div className="absolute top-10 left-10 w-48 h-48 bg-rose-200/40 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-200/40 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-6 max-w-2xl">
        <Motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="uppercase text-gray-500 tracking-widest mb-2">Appointment</p>
          <h2 className="text-4xl font-serif font-semibold text-gray-900 mb-4">Book Your Spa &amp; Salon Session</h2>
          <p className="text-gray-500">Select one or more services, pick a time, and confirm with secure payment.</p>
        </Motion.div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 sm:p-10">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">{error}</div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <Motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Scissors size={18} className="text-purple-500" /> Select Service(s)
                </h3>
                <p className="text-xs text-gray-400 -mt-2">Tap to select — you can book multiple services in one appointment.</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {Object.entries(SERVICES).map(([key, s]) => {
                    const isSelected = selectedKeys.includes(key);
                    return (
                      <button
                        key={key}
                        onClick={() => toggleService(key)}
                        className={`text-left p-4 rounded-xl border-2 transition-all relative ${isSelected ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}
                      >
                        {isSelected && (
                          <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-purple-500 text-white text-xs flex items-center justify-center">✓</span>
                        )}
                        <p className="font-medium text-gray-900">{s.name}</p>
                        <p className="text-sm text-gray-500">GHS {s.price.toFixed(2)}</p>
                      </button>
                    );
                  })}
                </div>

                {selectedServices.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3 text-sm flex justify-between items-center">
                    <span className="text-gray-600">{selectedServices.length} service{selectedServices.length > 1 ? 's' : ''} selected</span>
                    <span className="font-semibold text-gray-900">GHS {totalAmount.toFixed(2)}</span>
                  </div>
                )}

                <button onClick={goToStep2} className="w-full bg-pink-600 text-white py-3 rounded-full font-semibold hover:bg-purple-700 transition mt-4">
                  Continue
                </button>
              </Motion.div>
            )}

            {step === 2 && (
              <Motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <button onClick={() => setStep(1)} className="flex items-center gap-1 text-gray-500 hover:text-purple-600 text-sm mb-2">
                  <ArrowLeft size={16} /> Back
                </button>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><Calendar size={18} className="text-purple-500" /> Select Date &amp; Time</h3>
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <div className="grid grid-cols-4 gap-2">
                  {TIME_SLOTS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTime(t)}
                      className={`py-2 rounded-lg text-sm font-medium border-2 transition-all ${time === t ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-600 hover:border-purple-300'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <textarea
                  placeholder="Additional notes or requests..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="3"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <button onClick={goToStep3} className="w-full bg-pink-600 text-white py-3 rounded-full font-semibold hover:bg-purple-700 transition">
                  Continue to Payment
                </button>
              </Motion.div>
            )}

            {step === 3 && (
              <Motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <button onClick={() => setStep(2)} className="flex items-center gap-1 text-gray-500 hover:text-purple-600 text-sm mb-2">
                  <ArrowLeft size={16} /> Back
                </button>
                <h3 className="text-lg font-semibold text-gray-900">Review &amp; Pay</h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  {selectedServices.map((s) => (
                    <div key={s.key} className="flex justify-between">
                      <span className="text-gray-500">{s.name}</span>
                      <span className="font-medium text-gray-900">GHS {s.price.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-medium text-gray-900">{date}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Time</span><span className="font-medium text-gray-900">{time}</span></div>
                  <div className="flex justify-between border-t pt-2 mt-2 text-base"><span className="font-semibold text-gray-900">Total</span><span className="font-bold text-pink-600">GHS {totalAmount.toFixed(2)}</span></div>
                </div>
                <button onClick={() => setIsPayPopupOpen(true)} className="w-full bg-pink-600 text-white py-3 rounded-full font-semibold hover:bg-purple-700 transition">
                  Pay &amp; Confirm Booking
                </button>
              </Motion.div>
            )}

            {step === 4 && confirmedBooking && (
              <Motion.div key="s4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6 space-y-4">
                <CheckCircle2 className="mx-auto text-emerald-500" size={56} />
                <h3 className="text-xl font-bold text-gray-900">Booking Confirmed!</h3>
                <p className="text-gray-600">
                  Your appointment ({confirmedBooking.services?.map(s => s.name).join(', ')}) is set for{' '}
                  <strong>{confirmedBooking.date}</strong> at <strong>{confirmedBooking.time}</strong>.
                </p>
                <button
                  onClick={() => navigate('/store/my-bookings')}
                  className="bg-pink-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-purple-700 transition"
                >
                  View My Bookings
                </button>
              </Motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <PayPopup
        isOpen={isPayPopupOpen}
        onClose={() => setIsPayPopupOpen(false)}
        paymentData={{ method: 'momo', amount: totalAmount.toFixed(2), currency: 'GHS' }}
        userEmail={user?.email}
        onPaymentSuccess={(reference) => {
          setIsPayPopupOpen(false);
          handlePaymentSuccess(reference);
        }}
      />
    </section>
  );
}