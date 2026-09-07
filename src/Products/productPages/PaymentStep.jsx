import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CreditCard, Smartphone, Landmark, Lock, ArrowLeft } from 'lucide-react';
import { updatePayment, nextStep, prevStep } from '../../Store/Features/check/CheckoutSlice';

// This step only COLLECTS payment details and moves to Review.
// The actual "charge" simulation (PayPopup) lives in ReviewStep, triggered
// by the "Pay Now" button there -- matching: Review -> Click Pay -> gateway.
export default function PaymentStep() {
  const dispatch = useDispatch();
  const payment = useSelector(state => state.checkout?.payment) || {};

  const [paymentMethod, setPaymentMethod] = useState(payment.method || 'momo');
  const [network, setNetwork] = useState(payment.network || 'MTN');
  const [phone, setPhone] = useState(payment.phone || '');

  const [cardForm, setCardForm] = useState({
    cardNumber: payment.cardNumber || '',
    expiryDate: payment.expiryDate || '',
    cvv: payment.cvv || '',
    nameOnCard: payment.nameOnCard || '',
    saveCard: payment.saveCard || false,
  });

  const [bankForm, setBankForm] = useState({
    accountName: payment.accountName || '',
    bankName: payment.bankName || '',
    accountNumber: payment.accountNumber || '',
  });

  const [errors, setErrors] = useState({});

  const paymentMethods = [
    { id: 'momo', title: 'Mobile Money', icon: Smartphone },
    { id: 'card', title: 'Debit / Credit Card', icon: CreditCard },
    { id: 'bank_transfer', title: 'Bank Transfer', icon: Landmark },
  ];

  const handleCardChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCardForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setBankForm(prev => ({ ...prev, [name]: value }));
  };

  const formatCardNumber = (value) =>
    value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const validate = () => {
    const nextErrors = {};

    if (paymentMethod === 'momo') {
      if (!phone.trim()) {
        nextErrors.phone = 'Phone number is required';
      } else if (!/^\d{9,10}$/.test(phone.replace(/\s/g, ''))) {
        nextErrors.phone = 'Enter a valid mobile money number';
      }
    }

    if (paymentMethod === 'card') {
      if (!cardForm.nameOnCard.trim()) nextErrors.nameOnCard = 'Name on card is required';
      if (cardForm.cardNumber.replace(/\s/g, '').length !== 16) nextErrors.cardNumber = 'Enter a valid 16-digit card number';
      if (!/^\d{2}\/\d{2}$/.test(cardForm.expiryDate)) nextErrors.expiryDate = 'Use MM/YY format';
      if (!/^\d{3,4}$/.test(cardForm.cvv)) nextErrors.cvv = 'Enter a valid CVV';
    }

    if (paymentMethod === 'bank_transfer') {
      if (!bankForm.accountName.trim()) nextErrors.accountName = 'Account name is required';
      if (!bankForm.bankName.trim()) nextErrors.bankName = 'Bank name is required';
      if (!/^\d{6,20}$/.test(bankForm.accountNumber.replace(/\s/g, ''))) nextErrors.accountNumber = 'Enter a valid account number';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleContinue = (e) => {
    e.preventDefault();
    if (!validate()) return;

    let payload;
    if (paymentMethod === 'momo') {
      payload = { method: 'momo', network, phone };
    } else if (paymentMethod === 'card') {
      payload = { method: 'card', ...cardForm };
    } else {
      payload = { method: 'bank_transfer', ...bankForm };
    }

    dispatch(updatePayment(payload));
    dispatch(nextStep()); // -> Review
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_4px_30px_rgba(255,182,193,0.25)] p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-6">
        <CreditCard className="text-pink-600" size={22} />
        <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
      </div>

      {/* Payment Method Selector Tabs */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          return (
            <button
              key={method.id}
              type="button"
              onClick={() => { setPaymentMethod(method.id); setErrors({}); }}
              className={`flex flex-col items-center gap-2 py-3 rounded-xl border-2 transition-all text-sm font-medium ${
                paymentMethod === method.id
                  ? 'bg-pink-50 text-pink-600 border-pink-500'
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <Icon size={20} />
              {method.title}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleContinue} className="space-y-5">

        {/* Mobile Money Interface */}
        {paymentMethod === 'momo' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Network</label>
              <select
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="MTN">MTN Mobile Money</option>
                <option value="Telecel">Telecel Cash</option>
                <option value="AirtelTigo">AirtelTigo Money</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                placeholder="0541234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  errors.phone ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
          </div>
        )}

        {/* Credit/Debit Card Interface */}
        {paymentMethod === 'card' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name on Card</label>
              <input
                type="text"
                name="nameOnCard"
                value={cardForm.nameOnCard}
                onChange={handleCardChange}
                placeholder="Full name as shown on card"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  errors.nameOnCard ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {errors.nameOnCard && <p className="text-red-500 text-xs mt-1">{errors.nameOnCard}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={cardForm.cardNumber}
                onChange={(e) => setCardForm(prev => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }))}
                placeholder="1234 5678 9012 3456"
                inputMode="numeric"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  errors.cardNumber ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={cardForm.expiryDate}
                  onChange={(e) => setCardForm(prev => ({ ...prev, expiryDate: formatExpiry(e.target.value) }))}
                  placeholder="MM/YY"
                  inputMode="numeric"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                    errors.expiryDate ? 'border-red-400' : 'border-gray-300'
                  }`}
                />
                {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={cardForm.cvv}
                  onChange={(e) => setCardForm(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                  placeholder="123"
                  inputMode="numeric"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                    errors.cvv ? 'border-red-400' : 'border-gray-300'
                  }`}
                />
                {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                name="saveCard"
                checked={cardForm.saveCard}
                onChange={handleCardChange}
                className="rounded text-pink-600 focus:ring-pink-500"
              />
              Save this card for future purchases
            </label>
          </div>
        )}

        {/* Bank Transfer Interface */}
        {paymentMethod === 'bank_transfer' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
              <input
                type="text"
                name="accountName"
                value={bankForm.accountName}
                onChange={handleBankChange}
                placeholder="Name on the bank account"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  errors.accountName ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {errors.accountName && <p className="text-red-500 text-xs mt-1">{errors.accountName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
              <input
                type="text"
                name="bankName"
                value={bankForm.bankName}
                onChange={handleBankChange}
                placeholder="e.g. GCB Bank"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  errors.bankName ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {errors.bankName && <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
              <input
                type="text"
                name="accountNumber"
                value={bankForm.accountNumber}
                onChange={(e) => setBankForm(prev => ({ ...prev, accountNumber: e.target.value.replace(/\D/g, '') }))}
                placeholder="Account number"
                inputMode="numeric"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  errors.accountNumber ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {errors.accountNumber && <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-gray-500 bg-pink-50 rounded-lg p-3">
          <Lock size={14} className="text-pink-500 flex-shrink-0" />
          Your payment information is encrypted and secure.
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => dispatch(prevStep())}
            className="flex items-center gap-2 text-gray-600 hover:text-pink-600 font-medium transition-colors text-sm"
          >
            <ArrowLeft size={18} />
            Back to Shipping
          </button>

          <button
            type="submit"
            className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-8 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all"
          >
            Continue to Review
          </button>
        </div>
      </form>
    </div>
  );
}