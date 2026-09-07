// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Clock, CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-react';
// import { fetchAllOrders, updateOrderStatus } from '../../../../../Store/Features/orders/orderSlice';

// const Orders = () => {
//   const dispatch = useDispatch();
//   const ordersState = useSelector((state) => state.orders);
// const orders = ordersState?.items || [];
// const loading = ordersState?.loading || false;
// const error = ordersState?.error || null;

//   // ✅ Automatically trigger the action thunk when screen mounts
//   useEffect(() => {
//     dispatch(fetchAllOrders());
//   }, [dispatch]);

//   const handleStatusChange = (orderId, newStatus) => {
//     dispatch(updateOrderStatus({ orderId, status: newStatus }));
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-pulse text-gray-400 font-medium text-sm">Fetching live order documents...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 animate-fade-in">
//       {/* Dynamic Screen Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Store Orders</h1>
//           <p className="text-sm text-gray-500">Manage real-time incoming product checkouts and salon processing orders</p>
//         </div>
//         <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-sm font-medium text-gray-700">
//           Total Orders: <span className="text-indigo-600 font-bold">{orders.length}</span>
//         </div>
//       </div>

//       {error && (
//         <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 flex items-center gap-3 text-sm">
//           <AlertCircle size={18} />
//           <span>Sync Error: {error}</span>
//         </div>
//       )}

//       {orders.length > 0 ? (
//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse text-left text-sm text-gray-700">
//               <thead>
//                 <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-400 font-semibold uppercase tracking-wider text-xs">
//                   <th className="py-3.5 px-4">Order ID / Date</th>
//                   <th className="py-3.5 px-4">Customer Details</th>
//                   <th className="py-3.5 px-4">Items Ordered</th>
//                   <th className="py-3.5 px-4">Total Price</th>
//                   <th className="py-3.5 px-4">Fulfillment Status</th>
//                   <th className="py-3.5 px-4 text-center">Fulfillment Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {orders.map((order) => {
//                   const dateString = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GH', {
//                     day: 'numeric', month: 'short', year: 'numeric'
//                   }) : "N/A";

//                   return (
//                     <tr key={order._id} className="hover:bg-gray-50/30 transition-colors">
//                       <td className="py-4 px-4">
//                         <span className="font-mono text-xs font-semibold text-indigo-600 block mb-0.5">
//                           #{order._id?.slice(-8).toUpperCase()}
//                         </span>
//                         <span className="text-xs text-gray-400 font-medium">{dateString}</span>
//                       </td>
//                       <td className="py-4 px-4">
//                         <p className="font-medium text-gray-900">{order.customer?.name || "Guest"}</p>
//                         <p className="text-xs text-gray-400">{order.customer?.email || "N/A"}</p>
//                       </td>
//                       <td className="py-4 px-4">
//                         <div className="space-y-1">
//                           {order.products?.map((item, idx) => (
//                             <p key={idx} className="text-xs text-gray-600 font-medium">
//                               • {item.productName} <span className="text-gray-400 font-normal">x{item.quantity}</span>
//                             </p>
//                           )) || <span className="text-gray-400 text-xs">Store Products</span>}
//                         </div>
//                       </td>
//                       <td className="py-4 px-4 font-bold text-gray-900">
//                         ₵{Number(order.totalAmount || 0).toLocaleString('en-GH', { minimumFractionDigits: 2 })}
//                       </td>
//                       <td className="py-4 px-4">
//                         <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
//                           order.status === 'completed' ? 'bg-green-50 text-green-700' :
//                           order.status === 'processing' ? 'bg-blue-50 text-blue-700' :
//                           order.status === 'cancelled' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
//                         }`}>
//                           <Clock size={12} />
//                           {order.status || 'pending'}
//                         </span>
//                       </td>
//                       <td className="py-4 px-4 text-center">
//                         <select
//                           value={order.status || 'pending'}
//                           onChange={(e) => handleStatusChange(order._id, e.target.value)}
//                           className="text-xs border border-gray-200 rounded-lg p-1.5 bg-white font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all shadow-sm"
//                         >
//                           <option value="pending">Mark Pending</option>
//                           <option value="processing">Mark Processing</option>
//                           <option value="completed">Mark Completed</option>
//                           <option value="cancelled">Cancel Order</option>
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
//         <div className="text-center py-16 bg-white border border-dashed rounded-2xl text-gray-400 flex flex-col items-center justify-center gap-2 shadow-sm">
//           <div className="p-3 bg-gray-50 rounded-xl text-gray-400"><ShoppingBag size={24} /></div>
//           <p className="text-sm font-medium">No sales orders found matching database collection queries.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllOrdersDetails;