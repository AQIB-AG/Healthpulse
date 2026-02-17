import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute: React.FC = () => {
  const { token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-text-muted">
        Checking access…
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/hospital/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

