import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  console.log('ProtectedRoute render:', { 
    isAuthenticated, 
    isLoading, 
    hasUser: !!user, 
    hasSession: !!session,
    pathname: location.pathname 
  });

  useEffect(() => {
    console.log('ProtectedRoute useEffect:', { isLoading, isAuthenticated, pathname: location.pathname });
    
    if (!isLoading && !isAuthenticated && location.pathname !== '/signin') {
      console.log('Redirecting to sign-in page');
      navigate('/signin', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location.pathname]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
