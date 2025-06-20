
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  userType?: 'employee' | 'recruiter';
}

const ProtectedRoute = ({ children, userType }: ProtectedRouteProps) => {
  // Add error boundary for auth context
  let user, loading;
  
  try {
    const authContext = useAuth();
    user = authContext.user;
    loading = authContext.loading;
  } catch (error) {
    console.error('❌ ProtectedRoute: Auth context not available:', error);
    // If auth context is not available, redirect to auth page
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check if user type matches if specified
  if (userType && user.user_metadata?.user_type !== userType) {
    const redirectPath = user.user_metadata?.user_type === 'employee' ? '/employee/home' : '/recruiter/home';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
