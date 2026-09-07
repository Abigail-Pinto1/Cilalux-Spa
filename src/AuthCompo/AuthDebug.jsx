// src/components/AuthDebug.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAuthStatus } from '../Store/Features/auth/authSlice';

export default function AuthDebug() {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading, error } = useSelector(state => state.auth);
  
  useEffect(() => {
    dispatch(setAuthStatus());
  }, [dispatch]);
  
  const tokenFromStorage = localStorage.getItem('token');
  const userFromStorage = localStorage.getItem('user');
  
  return (
    <div style={{ 
      position: 'fixed', 
      bottom: 10, 
      right: 10, 
      background: '#f0f0f0', 
      padding: 12, 
      borderRadius: 8,
      fontSize: 11,
      zIndex: 9999,
      maxWidth: 320,
      border: '1px solid #ccc',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      fontFamily: 'monospace'
    }}>
      <h4 style={{ margin: '0 0 8px 0', fontSize: 13, fontWeight: 'bold' }}>🔐 Auth Status</h4>
      <div>
        <p style={{ margin: '2px 0' }}>
          <strong>Token (Redux):</strong> {token ? '✅' : '❌'}
        </p>
        <p style={{ margin: '2px 0' }}>
          <strong>Token (Storage):</strong> {tokenFromStorage ? '✅' : '❌'}
        </p>
        <p style={{ margin: '2px 0' }}>
          <strong>User:</strong> {user?.email || 'Not logged in'}
        </p>
        <p style={{ margin: '2px 0' }}>
          <strong>Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}
        </p>
        <p style={{ margin: '2px 0' }}>
          <strong>Loading:</strong> {loading ? '⏳' : '❌'}
        </p>
        {error && (
          <p style={{ margin: '2px 0', color: 'red' }}>
            <strong>Error:</strong> {error}
          </p>
        )}
        {tokenFromStorage && (
          <p style={{ 
            margin: '4px 0', 
            wordBreak: 'break-all', 
            fontSize: 9,
            background: '#e8e8e8',
            padding: 4,
            borderRadius: 4
          }}>
            <strong>Token:</strong> {tokenFromStorage.substring(0, 30)}...
          </p>
        )}
        <button 
          onClick={() => {
            console.log('=== AUTH DEBUG ===');
            console.log('localStorage:', {
              token: localStorage.getItem('token'),
              user: localStorage.getItem('user'),
              refreshToken: localStorage.getItem('refreshToken')
            });
            console.log('Redux state:', { user, token, isAuthenticated, loading, error });
          }}
          style={{ marginTop: 6, fontSize: 10, padding: '2px 8px', cursor: 'pointer' }}
        >
          Log Auth Data
        </button>
      </div>
    </div>
  );
}