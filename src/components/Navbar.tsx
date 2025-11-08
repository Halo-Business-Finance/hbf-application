import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { LogOut, KeyRound, Home, UserCircle, Settings, FileText, Shield, Users, HelpCircle, Bell, Calculator, BellRing } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { LoanCalculatorDialog } from '@/components/LoanCalculatorDialog';
import { userNotificationService, Notification } from '@/services/userNotificationService';
import { formatDistanceToNow } from 'date-fns';

const Navbar = () => {
  const navigate = useNavigate();
  const { authenticated, loading, username, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const [notificationCount, setNotificationCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState<Notification[]>([]);
  const [calculatorOpen, setCalculatorOpen] = useState(false);

  useEffect(() => {
    if (authenticated) {
      loadNotifications();

      // Subscribe to real-time notifications
      const unsubscribe = userNotificationService.subscribeToNotifications(() => {
        loadNotifications();
      });

      return unsubscribe;
    }
  }, [authenticated]);

  const loadNotifications = async () => {
    try {
      const count = await userNotificationService.getUnreadCount();
      setNotificationCount(count);

      const notifications = await userNotificationService.getUserNotifications(5);
      setRecentNotifications(notifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await userNotificationService.markAsRead(notification.id);
      loadNotifications();
    }
    if (notification.action_url) {
      navigate(notification.action_url);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <nav className="h-16 px-6 border-b bg-white flex w-full justify-between items-center">
        <div className="flex items-center">
          <div className="w-20 h-10 bg-muted animate-pulse rounded" />
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-20 h-8 bg-muted animate-pulse rounded" />
        </div>
      </nav>
    );
  }

  return (
    <nav className="h-16 px-2 sm:px-4 lg:px-6 border-b bg-white flex w-full items-center sticky top-0 z-50 relative">
      {/* Left: Sidebar Trigger */}
      <div className="flex items-center">
        <SidebarTrigger className="m-0 text-blue-900" />
      </div>

      {/* Center: Logo */}
      <div className="flex-1 flex justify-center cursor-pointer px-4" onClick={handleLogoClick}>
        <span className="text-blue-900 font-bold text-lg sm:text-xl lg:text-2xl tracking-tight truncate">
          <span className="hidden sm:inline">Halo Business Finance</span>
          <span className="sm:hidden">HBF</span>
        </span>
      </div>

      {/* Right: Navigation Items */}
      <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
        {authenticated && (
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Notifications Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-blue-900 hover:bg-accent relative"
                >
                  <Bell className="w-5 h-5" />
                  {notificationCount > 0 && (
                    <Badge 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-600"
                    >
                      {notificationCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent 
                align="end" 
                className="w-80 bg-popover border shadow-lg z-50"
              >
                <div className="px-4 py-3 border-b">
                  <h3 className="font-semibold text-blue-900">Notifications</h3>
                  <p className="text-xs text-muted-foreground">
                    {notificationCount > 0 
                      ? `You have ${notificationCount} unread notification${notificationCount > 1 ? 's' : ''}`
                      : 'No unread notifications'
                    }
                  </p>
                </div>
                
                <div className="max-h-[400px] overflow-y-auto">
                  {recentNotifications.length === 0 ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                      No notifications yet
                    </div>
                  ) : (
                    recentNotifications.map((notification) => (
                      <DropdownMenuItem 
                        key={notification.id}
                        className={`cursor-pointer hover:bg-muted py-3 px-4 border-b ${
                          !notification.read ? 'bg-accent/50' : ''
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex flex-col gap-1 w-full">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-muted-foreground">{notification.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </div>
                
                <div className="px-4 py-2 border-t">
                  <Button 
                    variant="ghost" 
                    className="w-full text-xs"
                    onClick={() => navigate('/notifications')}
                  >
                    View All Notifications
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Loan Calculator Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCalculatorOpen(true)}
              className="text-blue-900 hover:bg-accent"
              title="Loan Calculator"
            >
              <Calculator className="w-5 h-5" />
            </Button>

            {/* Loan Calculator Dialog */}
            <LoanCalculatorDialog 
              open={calculatorOpen} 
              onOpenChange={setCalculatorOpen} 
            />

            {/* Help Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/support')}
              className="text-blue-900 hover:bg-accent"
            >
              <HelpCircle className="w-5 h-5" />
            </Button>
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity px-3 py-2 rounded-md hover:bg-accent">
                  <UserCircle className="w-5 h-5 text-blue-900" />
                </div>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent 
                align="end" 
                className="w-56 bg-popover border shadow-lg z-50"
              >
                <DropdownMenuItem 
                  onClick={() => navigate('/my-account?tab=account')}
                  className="cursor-pointer hover:bg-muted"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  My Account
                </DropdownMenuItem>

                <DropdownMenuItem 
                  onClick={() => navigate('/notification-preferences')}
                  className="cursor-pointer hover:bg-muted"
                >
                  <BellRing className="w-4 h-4 mr-2" />
                  Notification Preferences
                </DropdownMenuItem>

                {isAdmin() && (
                    <DropdownMenuItem 
                      onClick={() => navigate('/admin')}
                      className="cursor-pointer hover:bg-muted"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Admin Dashboard
                    </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  onClick={() => navigate('/change-password')}
                  className="cursor-pointer hover:bg-muted"
                >
                  <KeyRound className="w-4 h-4 mr-2" />
                  Change Password
                </DropdownMenuItem>
                
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="cursor-pointer hover:bg-muted text-destructive focus:text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;