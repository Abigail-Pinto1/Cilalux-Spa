/* eslint-disable react-hooks/rules-of-hooks */
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../Store/Features/auth/authSlice.js';
// import { logoutUser } from '../../features/auth/authSlice.js';

// Inside StoreLayout component
const { user } = useSelector(state => state.auth);
const dispatch = useDispatch();

const handleLogout = () => {
  dispatch(logout());
};

// Replace the user button in header with:
{user ? (
  <div className="relative group">
    <button className="flex items-center space-x-2 text-gray-700 hover:text-pink-600 p-2">
      <user size={20} />
      <span className="hidden sm:block text-sm font-medium">
        {user.firstName}
      </span>
    </button>
    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
      <div className="px-4 py-2 border-b border-gray-100">
        <p className="text-sm font-medium text-gray-800">{user.firstName} {user.lastName}</p>
        <p className="text-xs text-gray-500">{user.email}</p>
      </div>
      <Link to="/store/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
        My Profile
      </Link>
      <Link to="/store/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
        My Orders
      </Link>
      <button
        onClick={handleLogout}
        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
      >
        Sign Out
      </button>
    </div>
  </div>
) : (
  <Link to="/store/login" className="text-gray-700 hover:text-pink-600 p-2">
    <User size={20}/>
</Link>
)}