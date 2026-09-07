import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, CheckCircle2, Circle, Truck, Package } from 'lucide-react';
import { fetchOrderById } from '../../Store/Features/orders/orderSlice';

const TIMELINE_STAGES = [
  { key: 'confirmed', label: 'Order Confirmed' },
  { key: 'preparing', label: 'Preparing' },
  { key: 'packed', label: 'Packed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
];

export default function OrderTracking() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentOrder: order, loading } = useSelector(state => state.orders || {});

  useEffect(() => {
    if (id) dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  if (loading || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center">
        <p className="text-gray-500">Loading order...</p>
      </div>
    );
  }

  const currentIndex = TIMELINE_STAGES.findIndex(s => s.key === order.status);
  const isCancelledOrReturn = ['cancelled', 'return_requested', 'refunded'].includes(order.status);

  return (
    <section className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-16 px-6 md:px-16">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-pink-600 mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_4px_30px_rgba(255,182,193,0.25)] p-8">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="text-pink-600" size={22} />
            <h2 className="text-xl font-semibold text-gray-900">Tracking Order {order.orderNumber}</h2>
          </div>
          <p className="text-sm text-gray-500 mb-8">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>

          {isCancelledOrReturn ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 capitalize">
              This order's status is: {order.status.replace('_', ' ')}
            </div>
          ) : (
            <div className="space-y-0">
              {TIMELINE_STAGES.map((stage, idx) => {
                const isDone = idx <= currentIndex;
                const isLast = idx === TIMELINE_STAGES.length - 1;
                return (
                  <div key={stage.key} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      {isDone ? (
                        <CheckCircle2 className="text-emerald-500" size={26} />
                      ) : (
                        <Circle className="text-gray-300" size={26} />
                      )}
                      {!isLast && (
                        <div className={`w-0.5 flex-1 min-h-[32px] ${idx < currentIndex ? 'bg-emerald-400' : 'bg-gray-200'}`} />
                      )}
                    </div>
                    <div className="pb-8">
                      <p className={`font-medium ${isDone ? 'text-gray-900' : 'text-gray-400'}`}>{stage.label}</p>
                      {stage.key === 'shipped' && order.trackingNumber && idx <= currentIndex && (
                        <p className="text-xs text-gray-500 mt-1">
                          Tracking #: <span className="font-medium">{order.trackingNumber}</span>
                          {order.carrier ? ` · ${order.carrier}` : ''}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-pink-100 flex items-center gap-2 text-sm text-gray-600">
            <Package size={16} className="text-pink-500" />
            Shipping to: {order.shippingAddress?.city}, {order.shippingAddress?.country}
          </div>
        </div>
      </div>
    </section>
  );
}