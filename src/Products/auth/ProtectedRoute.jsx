import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  // Check both Redux state and localStorage
  const { isAuthenticated, loading } = useSelector(state => state.auth || {});
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  // If still loading auth state, show loading or wait
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }
  
  // Check if user is authenticated
  const isAuth = isAuthenticated || (token && user);
  
  if (!isAuth) {
    // Save the current location to redirect back after login
    return <Navigate to="/store/login" state={{ from: location.pathname }} replace />;
  }
  
  return children;
};

export default ProtectedRoute;