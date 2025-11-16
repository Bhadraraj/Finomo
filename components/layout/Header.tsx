'use client';

import { useState, memo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useAppStore, useThemeStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Bell, MessageSquare, Menu, LogOut, User, Settings, Sun, Moon, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Header = memo(function Header() {
  const { user, logout } = useAuthStore();
  const { isDark, toggleDark } = useThemeStore();
  const { toggleSidebar, isMobile, setIsMobile } = useAppStore();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
    };

    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobile]);

  const handleLogout = useCallback(() => {
    logout();
    router.push('/login');
  }, [logout, router]);

  const toggleMobileSearch = useCallback(() => {
    setShowMobileSearch(!showMobileSearch);
  }, [showMobileSearch]);

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 bg-background border-b border-border">
        <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
          {/* Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="flex-shrink-0 text-foreground hover:bg-accent p-2"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          
          {/* Desktop Search */}
          <div className="relative hidden md:block flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="What do you want to find?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 w-full bg-muted border-none focus:bg-background focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileSearch}
            className="md:hidden flex-shrink-0 text-foreground hover:bg-accent p-2"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleDark}
            className="text-foreground hover:bg-accent transition-colors p-2"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
            )}
          </Button>
          
          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative text-foreground hover:bg-accent p-2"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></span>
          </Button>
          
          {/* Messages - Hide on small screens */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="hidden sm:flex text-foreground hover:bg-accent p-2"
          >
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 sm:space-x-3 p-1 sm:p-2 max-w-[200px]">
                <Avatar className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="text-xs sm:text-sm">
                    {user?.name?.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden sm:block min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize truncate">{user?.role}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 sm:w-56">
              <DropdownMenuLabel className="truncate">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/20" onClick={toggleMobileSearch} />
          <div className="relative bg-background border-b border-border p-4">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileSearch}
                className="flex-shrink-0 p-2"
              >
                <X className="w-4 h-4" />
              </Button>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="What do you want to find?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 w-full bg-muted border-none focus:bg-background focus:ring-2 focus:ring-primary"
                  autoFocus
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default Header;