'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { useEffect, memo } from 'react';
import { useThemeStore } from '@/lib/store';
import { applyTheme } from '@/lib/themes';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true
});

const RootLayout = memo(function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, isDark } = useThemeStore();

  useEffect(() => {
    // Apply theme on mount and when theme changes
    if (typeof window !== 'undefined') {
      applyTheme(theme, isDark);
    }
  }, [theme, isDark]);

  useEffect(() => {
    // Apply theme immediately on client-side hydration
    if (typeof window !== 'undefined') {
      applyTheme(theme, isDark);
    }
  }, []);

  return (
    <html lang="en" className={isDark ? 'dark' : ''}>
      <head>
        <title>Finomo</title>
        <meta name="description" content="Comprehensive school management system for administrators, teachers, and parents" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
});

export default RootLayout;