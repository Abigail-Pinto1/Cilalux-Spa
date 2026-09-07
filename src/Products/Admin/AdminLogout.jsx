
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const AdminLogout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/admin'); // redirect back to auth page
  };

  return (
    <div className="bg-gray-900 text-white h-screen w-64 flex flex-col p-4">
      {/* User Info */}
      <div className="flex flex-col items-center mb-8">
        <img
          src="/avatar.png"
          alt="Admin Avatar"
          className="w-16 h-16 rounded-full mb-2"
        />
        <span className="text-lg font-semibold">
          {JSON.parse(localStorage.getItem('userInfo'))?.username || 'Admin'}
        </span>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 space-y-3">
        <button className="w-full text-left py-2 px-3 hover:bg-gray-800 rounded">Dashboard</button>
        <button className="w-full text-left py-2 px-3 hover:bg-gray-800 rounded">Analytics</button>
        <button className="w-full text-left py-2 px-3 hover:bg-gray-800 rounded">Users</button>
        <button className="w-full text-left py-2 px-3 hover:bg-gray-800 rounded">Inventory</button>
        <button className="w-full text-left py-2 px-3 hover:bg-gray-800 rounded">Transactions</button>
        <button className="w-full text-left py-2 px-3 hover:bg-gray-800 rounded">Settings</button>
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 py-2 px-3 mt-auto bg-red-600 hover:bg-red-700 rounded-lg"
      >
        <LogOut size={18} /> Logout
      </button>
    </div>
  );
};

export default AdminLogout;
