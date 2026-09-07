// checkoutConstants.js
export const SHIPPING_METHODS = {
  standard: { name: 'Standard Shipping', cost: 4.99, days: '5-7 business days' },
  express: { name: 'Express Shipping', cost: 9.99, days: '2-3 business days' },
  overnight: { name: 'Overnight Shipping', cost: 19.99, days: '1 business day' },
};

export const TAX_RATE = 0.08;

export const API_ORIGIN = 'http://localhost:7000';

export const resolveImageUrl = (url) => {
  if (!url) return '';
  return url.startsWith('http') ? url : `${API_ORIGIN}${url}`;
};