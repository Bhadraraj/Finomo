'use client';

import { useEffect, memo } from 'react'; 
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';
import Header from './Header';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface LayoutProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'teacher' | 'parent')[];
} 
const Layout = memo(function Layout({ children, allowedRoles }: LayoutProps) {
  const { 
    sidebarCollapsed, 
    setSidebarCollapsed, 
    isMobile, 
    setIsMobile,
    mobileMenuOpen,
    setMobileMenuOpen,
    initializeResponsive,
  } = useAppStore();

  // Initialize responsive behavior
  useEffect(() => {
    initializeResponsive();
    
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width < 1024;
      
      setIsMobile(mobile);
      
      // Auto-collapse sidebar on mobile, expand on desktop
      if (mobile) {
        setSidebarCollapsed(true);
        setMobileMenuOpen(false);
      } else {
        setSidebarCollapsed(false);
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initializeResponsive, setIsMobile, setSidebarCollapsed, setMobileMenuOpen]); 
  const getMainContentClasses = () => {
    if (isMobile) {
      return 'ml-0'; // No margin on mobile
    }
    
    return sidebarCollapsed ? 'ml-16' : 'ml-64 xl:ml-72';
  };

  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <div className="min-h-screen bg-background">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main content area */}
        <div className={cn(
          'transition-all duration-300 ease-in-out',
          getMainContentClasses()
        )}>
          {/* Header */}
          <Header />
          
          {/* Main content */}
          <main className={cn(
            'p-4 sm:p-6 min-h-[calc(100vh-4rem)]',
            'transition-all duration-300'
          )}>
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
});

Layout.displayName = 'Layout';

export default Layout;