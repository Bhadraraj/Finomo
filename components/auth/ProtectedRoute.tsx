'use client';

import { useEffect, useState, memo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, UserRole } from '@/lib/store';
import { GraduationCap } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = memo(function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Clear invalid user data immediately
    const validRoles: UserRole[] = ['admin'];
    if (user && !validRoles.includes(user.role)) {
      useAuthStore.getState().logout();
      router.replace('/login');
      return;
    }

    if (!isAuthenticated || !user) {
      router.replace('/login');
      return;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.replace('/unauthorized');
      return;
    }
  }, [isAuthenticated, user, allowedRoles, router]);

  // Show loading only for a brief moment
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
)
export default ProtectedRoute;