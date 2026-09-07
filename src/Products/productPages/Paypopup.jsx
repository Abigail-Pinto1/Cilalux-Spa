/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import React, { useState, useEffect, useCallback } from 'react';
import { Lock, ShieldCheck, RefreshCw, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import axios from '../../Store/Auth/utils/axiosInstance';

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY; // set in your .env

function loadPaystackScript() {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    if (window.PaystackPop) return resolve();
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

export default function PayPopup({ isOpen, onClose, paymentData, userEmail, onPaymentSuccess }) {
  const [status, setStatus] = useState('idle'); // idle | processing | verifying | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const amount = paymentData?.amount || '0.00';
  const currency = paymentData?.currency || 'GHS';

  const startPayment = useCallback(async () => {
    setStatus('processing');
    setErrorMsg('');
    try {
      await loadPaystackScript();

      // 1. Ask OUR backend to initialize with Paystack (keeps secret key server-side)
      const { data: initData } = await axios.post('/payment/initialize', {
        email: userEmail,
        amount: Number(amount),
        metadata: { method: paymentData.method },
      });

      // 2. Open Paystack's own secure popup — we never see card/CVV
      const handler = window.PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: userEmail,
        amount: Math.round(Number(amount) * 100),
        currency,
        ref: initData.reference,
        callback: (response) => {
          verifyOnServer(response.reference);
        },
        onClose: () => {
          if (status !== 'success') setStatus('idle');
        },
      });
      handler.openIframe();
    } catch (err) {
      console.error('Payment init error:', err);
      setStatus('error');
      setErrorMsg('Could not start payment. Please try again.');
    }
  }, [amount, currency, userEmail, paymentData, status]);

  const verifyOnServer = async (reference) => {
    setStatus('verifying');
    try {
      // 3. Confirm with OUR backend, which re-checks with Paystack directly
      const { data } = await axios.get(`/payment/verify/${reference}`);
      if (data.success) {
        setStatus('success');
        setTimeout(() => {
          onPaymentSuccess(reference); // pass the verified reference up
          onClose();
        }, 1200);
      } else {
        throw new Error(data.message || 'Verification failed');
      }
    } catch (err) {
      console.error('Verify error:', err);
      setStatus('error');
      setErrorMsg('Payment could not be verified. If you were charged, contact support with your reference.');
    }
  };

  useEffect(() => {
    if (isOpen) startPayment();  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={status === 'idle' || status === 'error' ? onClose : undefined} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl border border-gray-100">
        {(status === 'idle' || status === 'error') && (
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100">
            <X size={20} />
          </button>
        )}

        {(status === 'processing' || status === 'verifying') && (
          <div className="space-y-5 py-4">
            <div className="relative flex justify-center">
              <RefreshCw className="text-pink-500 animate-spin" size={56} />
              <Lock className="absolute text-pink-600 top-5" size={16} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              {status === 'processing' ? 'Waiting for Payment' : 'Confirming Payment'}
            </h3>
            <p className="text-sm text-gray-500">
              {status === 'processing' ? 'Complete the payment in the Paystack window.' : 'Verifying with our server, please wait...'}
            </p>
            <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 pt-2">
              <ShieldCheck size={14} className="text-emerald-500" />
              Handled entirely by Paystack — we never see your card details
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-5 py-4">
            <div className="flex justify-center"><CheckCircle2 className="text-emerald-500" size={60} /></div>
            <h3 className="text-xl font-bold text-gray-900">Payment Verified!</h3>
            <div className="bg-emerald-50 text-emerald-800 rounded-xl py-3 px-4 font-semibold text-lg inline-block">
              Total Paid: {currency} {amount}
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-5 py-4">
            <div className="flex justify-center"><AlertTriangle className="text-red-500" size={56} /></div>
            <h3 className="text-lg font-bold text-gray-900">Payment Failed</h3>
            <p className="text-sm text-gray-500">{errorMsg}</p>
            <button onClick={startPayment} className="bg-pink-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-pink-700">
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}