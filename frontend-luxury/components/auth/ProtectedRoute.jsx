'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function ProtectedRoute({ 
  children, 
  requiredRole = null,
  fallback = null 
}) {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuth();

  useEffect(() => {
    // Don't redirect during initial load
    if (isLoading) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Check role requirements
    if (requiredRole && user?.role !== requiredRole) {
      // Redirect based on user role
      switch (user?.role) {
        case 'admin':
          router.push('/admin');
          break;
        case 'coordinator':
          router.push('/coordinator');
          break;
        case 'student':
        default:
          router.push('/dashboard');
          break;
      }
      return;
    }
  }, [isAuthenticated, user, isLoading, requiredRole, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-chrome-600 border-t-accent-primary rounded-full animate-spin mx-auto"></div>
          <p className="text-chrome-300">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Show fallback if not authenticated
  if (!isAuthenticated) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="text-center space-y-4">
          <p className="text-chrome-300">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Show fallback if role doesn't match
  if (requiredRole && user?.role !== requiredRole) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="text-center space-y-4">
          <p className="text-chrome-300">Redirecting...</p>
        </div>
      </div>
    );
  }

  return children;
}

// Role-specific protected route components
export function StudentRoute({ children }) {
  return (
    <ProtectedRoute requiredRole="student">
      {children}
    </ProtectedRoute>
  );
}

export function CoordinatorRoute({ children }) {
  return (
    <ProtectedRoute requiredRole="coordinator">
      {children}
    </ProtectedRoute>
  );
}

export function AdminRoute({ children }) {
  return (
    <ProtectedRoute requiredRole="admin">
      {children}
    </ProtectedRoute>
  );
}