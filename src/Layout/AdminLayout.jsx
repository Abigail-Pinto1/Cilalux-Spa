// src/Pages/Admin/AdminLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, Bell, User, Search, ChevronRight, LogOut } from 'lucide-react';
import Sidebar from '../Products/Admin/PanelStructure/Sidebar';
import AdminNavbar from '../Products/Admin/AdminNavbar';

const AdminLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    const adminInfo = localStorage.getItem('adminInfo');
    const adminToken = localStorage.getItem('adminToken');
    
    if (!adminInfo || !adminToken) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Helper to format breadcrumbs
  const getBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    return paths.map((path, index) => {
      const isLast = index === paths.length - 1;
      const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
      return (
        <div key={path} className="flex items-center text-xs md:text-sm">
          {index > 0 && <ChevronRight size={14} className="mx-2 text-gray-400" />}
          <span className={isLast ? "font-semibold text-gray-800" : "text-gray-400 font-medium"}>
            {label}
          </span>
        </div>
      );
    });
  };

  // Handle window resize for responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 font-sans antialiased">
      
      {/* Sidebar */}
      <Sidebar 
        isOpen={isMobileOpen} 
        setIsOpen={setIsMobileOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Admin Navbar */}
        <AdminNavbar 
          setIsOpen={setIsMobileOpen} 
          sidebarOpen={isMobileOpen}
          isCollapsed={isCollapsed}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50 p-4 md:p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto">
            {/* Breadcrumb - Optional, can be removed if AdminNavbar handles it */}
            <div className="mb-4 md:mb-6 flex items-center text-gray-500 text-sm">
              {getBreadcrumbs()}
            </div>
            
            {/* Page Content Outlet */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;