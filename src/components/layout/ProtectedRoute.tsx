import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

import { useAuthStore } from '@/stores/authStore';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Subscribe to the single boolean (rerender-derived-state) rather than the
  // whole store object so unrelated updates (accessToken value) don't re-render
  // every protected page.
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  return <>{children}</>;
}
