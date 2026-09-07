// // src/Pages/Admin/Users.jsx
// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchUsers } from '../../../../../Store/Features/user/userSlice';
// import { 
//   Users as UsersIcon, 
//   Mail, 
//   Phone, 
//   MapPin, 
//   Calendar, 
//   User, 
//   Shield,
//   Search,
//   Filter,
//   ChevronDown,
//   ChevronUp
// } from 'lucide-react';
// import FilterBar from '../../../FilterBar';
// import Pagination from '../../../Pagination';

// const ITEMS_PER_PAGE = 10;

// const Users = () => {
//   const dispatch = useDispatch();
//   const { items: users = [], loading, error } = useSelector((state) => state.users || {});
  
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(ITEMS_PER_PAGE);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [roleFilter, setRoleFilter] = useState('');
//   const [sortField, setSortField] = useState('createdAt');
//   const [sortDirection, setSortDirection] = useState('desc');
//   const [expandedUser, setExpandedUser] = useState(null);

//   useEffect(() => {
//     dispatch(fetchUsers());
//   }, [dispatch]);

//   // Filter users
//   const filteredUsers = users.filter((user) => {
//     if (searchTerm) {
//       const search = searchTerm.toLowerCase();
//       const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
//       const email = (user.email || '').toLowerCase();
//       const phone = (user.phone || '').toLowerCase();
      
//       if (!fullName.includes(search) && 
//           !email.includes(search) && 
//           !phone.includes(search)) {
//         return false;
//       }
//     }
    
//     if (roleFilter && user.role !== roleFilter) {
//       return false;
//     }
    
//     return true;
//   });

//   // Sort users
//   const sortedUsers = [...filteredUsers].sort((a, b) => {
//     let aVal = a[sortField] || '';
//     let bVal = b[sortField] || '';
    
//     if (sortField === 'fullName') {
//       aVal = `${a.firstName || ''} ${a.lastName || ''}`;
//       bVal = `${b.firstName || ''} ${b.lastName || ''}`;
//     }
    
//     if (sortField === 'createdAt') {
//       aVal = new Date(a.createdAt).getTime();
//       bVal = new Date(b.createdAt).getTime();
//     }
    
//     if (typeof aVal === 'string') {
//       aVal = aVal.toLowerCase();
//       bVal = bVal.toLowerCase();
//     }
    
//     if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
//     if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
//     return 0;
//   });

//   const totalItems = sortedUsers.length;
//   const totalPages = Math.ceil(totalItems / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedUsers = sortedUsers.slice(startIndex, startIndex + itemsPerPage);

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const clearFilters = () => {
//     setSearchTerm('');
//     setRoleFilter('');
//     setCurrentPage(1);
//   };

//   const toggleSort = (field) => {
//     if (sortField === field) {
//       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortField(field);
//       setSortDirection('asc');
//     }
//     setCurrentPage(1);
//   };

//   const toggleExpand = (userId) => {
//     setExpandedUser(expandedUser === userId ? null : userId);
//   };

//   const filters = [
//     {
//       key: 'role',
//       label: 'Role',
//       type: 'select',
//       value: roleFilter,
//       options: [
//         { value: 'user', label: 'User' },
//         { value: 'admin', label: 'Admin' }
//       ]
//     }
//   ];

//   const getInitials = (firstName, lastName) => {
//     return `${(firstName || '')[0]}${(lastName || '')[0]}`.toUpperCase() || 'U';
//   };

//   const getRoleBadge = (role) => {
//     const styles = {
//       admin: 'bg-purple-100 text-purple-700 border-purple-200',
//       user: 'bg-blue-100 text-blue-700 border-blue-200',
//     };
//     return (
//       <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[role] || styles.user}`}>
//         <Shield size={12} />
//         {role || 'User'}
//       </span>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-pulse text-gray-500 font-medium text-sm">Loading users...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 flex items-center gap-3 text-sm">
//         <span>Error loading users: {error}</span>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Users & Customers</h1>
//           <p className="text-sm text-gray-500">Manage registered users and their shipping details</p>
//         </div>
//         <div className="flex items-center gap-3">
//           <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-sm font-medium text-gray-700">
//             Total Users: <span className="text-indigo-600 font-bold">{users.length}</span>
//             {filteredUsers.length !== users.length && (
//               <span className="text-gray-400 text-xs ml-1">
//                 (filtered: {filteredUsers.length})
//               </span>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Filter Bar */}
//       <FilterBar
//         searchTerm={searchTerm}
//         onSearchChange={(value) => {
//           setSearchTerm(value);
//           setCurrentPage(1);
//         }}
//         filters={filters}
//         onFilterChange={(key, value) => {
//           if (key === 'role') setRoleFilter(value);
//           setCurrentPage(1);
//         }}
//         onClearFilters={clearFilters}
//         placeholder="Search by name, email or phone..."
//       />

//       {/* Users Table */}
//       {paginatedUsers.length > 0 ? (
//         <>
//           <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full border-collapse text-left text-sm">
//                 <thead>
//                   <tr className="border-b border-gray-100 bg-gray-50/50 text-gray-400 font-semibold uppercase tracking-wider text-xs">
//                     <th className="py-3.5 px-4">User</th>
//                     <th className="py-3.5 px-4 cursor-pointer hover:text-gray-600" onClick={() => toggleSort('email')}>
//                       <div className="flex items-center gap-1">
//                         Email
//                         {sortField === 'email' && (
//                           sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
//                         )}
//                       </div>
//                     </th>
//                     <th className="py-3.5 px-4">Phone</th>
//                     <th className="py-3.5 px-4">Role</th>
//                     <th className="py-3.5 px-4 cursor-pointer hover:text-gray-600" onClick={() => toggleSort('createdAt')}>
//                       <div className="flex items-center gap-1">
//                         Joined
//                         {sortField === 'createdAt' && (
//                           sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
//                         )}
//                       </div>
//                     </th>
//                     <th className="py-3.5 px-4 text-center">Shipping Details</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {paginatedUsers.map((user) => {
//                     const isExpanded = expandedUser === user._id;
//                     const hasShippingAddress = user.address && Object.keys(user.address).length > 0;
                    
//                     return (
//                       <React.Fragment key={user._id}>
//                         <tr className="hover:bg-gray-50/40 transition-colors">
//                           <td className="py-4 px-4">
//                             <div className="flex items-center gap-3">
//                               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
//                                 {getInitials(user.firstName, user.lastName)}
//                               </div>
//                               <div>
//                                 <p className="font-semibold text-gray-900">
//                                   {user.firstName} {user.lastName}
//                                 </p>
//                                 <p className="text-xs text-gray-400">ID: {user._id?.slice(-8).toUpperCase()}</p>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="py-4 px-4">
//                             <div className="flex items-center gap-1.5 text-gray-600">
//                               <Mail size={14} className="text-gray-400" />
//                               <span className="text-sm">{user.email}</span>
//                             </div>
//                           </td>
//                           <td className="py-4 px-4">
//                             <div className="flex items-center gap-1.5 text-gray-600">
//                               <Phone size={14} className="text-gray-400" />
//                               <span className="text-sm">{user.phone || 'N/A'}</span>
//                             </div>
//                           </td>
//                           <td className="py-4 px-4">{getRoleBadge(user.role)}</td>
//                           <td className="py-4 px-4">
//                             <div className="flex items-center gap-1.5 text-gray-500">
//                               <Calendar size={14} className="text-gray-400" />
//                               <span className="text-sm">
//                                 {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GH', {
//                                   day: 'numeric',
//                                   month: 'short',
//                                   year: 'numeric'
//                                 }) : 'N/A'}
//                               </span>
//                             </div>
//                           </td>
//                           <td className="py-4 px-4 text-center">
//                             <button
//                               onClick={() => toggleExpand(user._id)}
//                               className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 mx-auto"
//                             >
//                               {hasShippingAddress ? (
//                                 isExpanded ? 'Hide Address' : 'View Address'
//                               ) : (
//                                 'No Address'
//                               )}
//                               {hasShippingAddress && (
//                                 isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />
//                               )}
//                             </button>
//                           </td>
//                         </tr>
                        
//                         {/* Expanded Shipping Details Row */}
//                         {isExpanded && hasShippingAddress && (
//                           <tr className="bg-gray-50/30">
//                             <td colSpan="6" className="py-4 px-4">
//                               <div className="bg-white rounded-xl border border-gray-200 p-4 max-w-2xl mx-auto">
//                                 <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
//                                   <MapPin size={16} className="text-indigo-500" />
//                                   Shipping Address
//                                 </h4>
//                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
//                                   <div>
//                                     <p className="text-xs text-gray-400">Street Address</p>
//                                     <p className="font-medium text-gray-800">{user.address?.street || 'N/A'}</p>
//                                   </div>
//                                   <div>
//                                     <p className="text-xs text-gray-400">City</p>
//                                     <p className="font-medium text-gray-800">{user.address?.city || 'N/A'}</p>
//                                   </div>
//                                   <div>
//                                     <p className="text-xs text-gray-400">State/Region</p>
//                                     <p className="font-medium text-gray-800">{user.address?.state || 'N/A'}</p>
//                                   </div>
//                                   <div>
//                                     <p className="text-xs text-gray-400">ZIP/Postal Code</p>
//                                     <p className="font-medium text-gray-800">{user.address?.zipCode || 'N/A'}</p>
//                                   </div>
//                                   <div>
//                                     <p className="text-xs text-gray-400">Country</p>
//                                     <p className="font-medium text-gray-800">{user.address?.country || 'N/A'}</p>
//                                   </div>
//                                 </div>
//                               </div>
//                             </td>
//                           </tr>
//                         )}
//                       </React.Fragment>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Pagination */}
//           <Pagination
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={handlePageChange}
//             totalItems={totalItems}
//             itemsPerPage={itemsPerPage}
//           />
//         </>
//       ) : (
//         <div className="text-center py-16 bg-white border border-dashed rounded-2xl text-gray-400 flex flex-col items-center justify-center gap-3">
//           <div className="p-3 bg-gray-50 rounded-xl text-gray-400"><UsersIcon size={24} /></div>
//           <p className="text-sm font-medium">No users found.</p>
//           {(searchTerm || roleFilter) && (
//             <button
//               onClick={clearFilters}
//               className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
//             >
//               Clear filters
//             </button>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Users;


import React from 'react'

const Users = () => {
  return (
    <div>Users</div>
  )
}

export default Users