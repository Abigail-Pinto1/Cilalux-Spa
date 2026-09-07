// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchAllOrders, updateOrderStatus } from '../../Store/Features/orders/orderSlice';
// import { Clock, CheckCircle2, AlertCircle, ShoppingBag, Lock, Package, Truck } from 'lucide-react';

// const STATUS_OPTIONS = [
//   'pending', 'confirmed', 'preparing', 'packed',
//   'shipped', 'out_for_delivery', 'delivered', 'cancelled'
// ];

// const STATUS_STYLES = {
//   pending: 'bg-amber-50 text-amber-700',
//   confirmed: 'bg-blue-50 text-blue-700',
//   preparing: 'bg-purple-50 text-purple-700',
//   packed: 'bg-indigo-50 text-indigo-700',
//   shipped: 'bg-cyan-50 text-cyan-700',
//   out_for_delivery: 'bg-orange-50 text-orange-700',
//   delivered: 'bg-green-50 text-green-700',
//   cancelled: 'bg-red-50 text-red-700',
//   return_requested: 'bg-rose-50 text-rose-700',
// };

// const Orders = () => {
//   const dispatch = useDispatch();
//   const { isAuthenticated, loading: authLoading, user } = useSelector(state => state.auth || {});
//   const { items: orders = [], loading, error } = useSelector(state => state.orders || {});

//   const isAdmin = user?.isAdmin || user?.role === 'admin';

//   useEffect(() => {
//     if (isAuthenticated && isAdmin) {
//       dispatch(fetchAllOrders());
//     }
//   }, [dispatch, isAuthenticated, isAdmin]);

//   const handleStatusChange = (orderId, newStatus) => {
//     dispatch(updateOrderStatus({ orderId, status: newStatus }));
//   };

//   if (authLoading || loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-pulse text-gray-500 font-medium text-sm">
//           Loading orders...
//         </div>
//       </div>
//     );
//   }

//   if (!isAuthenticated || !isAdmin) {
//     return (
//       <div className="text-center py-16 bg-white border border-dashed rounded-2xl text-gray-400 flex flex-col items-center justify-center gap-3 max-w-md mx-auto my-12">
//         <div className="p-3 bg-red-50 text-red-500 rounded-xl"><Lock size={24} /></div>
//         <h2 className="text-base font-semibold text-gray-800">Admin Access Required</h2>
//         <p className="text-xs text-gray-500 px-6">You must be logged in as an administrator to view store orders.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Store Orders</h1>
//           <p className="text-sm text-gray-500">Manage incoming orders and fulfillment status</p>
//         </div>
//         <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-sm font-medium text-gray-700">
//           Total Orders: <span className="text-indigo-600 font-bold">{orders.length}</span>
//         </div>
//       </div>

//       {error && (
//         <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 flex items-center gap-3 text-sm">
//           <AlertCircle size={18} />
//           <span>{error}</span>
//         </div>
//       )}

//       {orders.length > 0 ? (
//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse text-left text-sm text-gray-700">
//               <thead>
//                 <tr className="border-b border-gray-50 bg-gray-50/50 text-gray-400 font-semibold uppercase tracking-wider text-xs">
//                   <th className="py-3 px-4">Order ID / Date</th>
//                   <th className="py-3 px-4">Customer</th>
//                   <th className="py-3 px-4">Items</th>
//                   <th className="py-3 px-4">Total</th>
//                   <th className="py-3 px-4">Status</th>
//                   <th className="py-3 px-4 text-center">Update Status</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-50">
//                 {orders.map((order) => {
//                   const orderDate = order.createdAt
//                     ? new Date(order.createdAt).toLocaleDateString('en-GH', { day: 'numeric', month: 'short', year: 'numeric' })
//                     : 'N/A';
//                   return (
//                     <tr key={order._id} className="hover:bg-gray-50/40 transition-colors">
//                       <td className="py-4 px-4">
//                         <span className="font-mono text-xs font-semibold text-indigo-600 block mb-0.5">
//                           {order.orderNumber || `#${order._id?.slice(-8).toUpperCase()}`}
//                         </span>
//                         <span className="text-xs text-gray-400 font-medium">{orderDate}</span>
//                       </td>
//                       <td className="py-4 px-4">
//                         <p className="font-medium text-gray-900">{order.customer?.name || 'Guest'}</p>
//                         <p className="text-xs text-gray-400">{order.customer?.email || 'N/A'}</p>
//                       </td>
//                       <td className="py-4 px-4 max-w-xs">
//                         <div className="space-y-1">
//                           {order.items?.length ? order.items.map((item, idx) => (
//                             <p key={idx} className="text-xs text-gray-600 truncate font-medium">
//                               • {item.name || item.productName} <span className="text-gray-400">x{item.quantity || 1}</span>
//                             </p>
//                           )) : <span className="text-gray-400 text-xs">No items</span>}
//                         </div>
//                       </td>
//                       <td className="py-4 px-4 font-bold text-gray-900">
//                         {order.currency || 'GHS'} {Number(order.totalAmount || 0).toLocaleString('en-GH', { minimumFractionDigits: 2 })}
//                       </td>
//                       <td className="py-4 px-4">
//                         <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${STATUS_STYLES[order.status] || STATUS_STYLES.pending}`}>
//                           {order.status === 'delivered' ? <CheckCircle2 size={12} /> :
//                            order.status === 'shipped' || order.status === 'out_for_delivery' ? <Truck size={12} /> :
//                            <Clock size={12} />}
//                           {order.status?.replace(/_/g, ' ') || 'pending'}
//                         </span>
//                       </td>
//                       <td className="py-4 px-4 text-center">
//                         <select
//                           value={order.status || 'pending'}
//                           onChange={(e) => handleStatusChange(order._id, e.target.value)}
//                           className="text-xs border border-gray-200 rounded-lg p-1.5 bg-white font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all shadow-sm"
//                         >
//                           {STATUS_OPTIONS.map(s => (
//                             <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
//                           ))}
//                         </select>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       ) : (
//         <div className="text-center py-16 bg-white border border-dashed rounded-2xl text-gray-400 flex flex-col items-center justify-center gap-3">
//           <div className="p-3 bg-gray-50 rounded-xl text-gray-400"><ShoppingBag size={24} /></div>
//           <p className="text-sm font-medium">No orders yet.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Orders;