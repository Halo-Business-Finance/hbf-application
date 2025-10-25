import { useState } from 'react';
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
import { LogOut, KeyRound, Home, UserCircle, Settings, FileText, Shield, Users, HelpCircle, Bell, Calculator } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { SidebarTrigger } from '@/components/ui/sidebar';

const Navbar = () => {
  const navigate = useNavigate();
  const { authenticated, loading, username, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const [notificationCount] = useState(3); // Mock notification count

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <nav className="h-16 px-6 border-b bg-card flex w-full justify-between items-center">
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
    <nav className="h-16 px-6 border-b bg-card flex w-full justify-between items-center sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      {/* Left: Sidebar Trigger + Logo */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={handleLogoClick}>
        <SidebarTrigger className="m-0 text-blue-900" />
        <span className="text-blue-900 font-bold text-xl tracking-tight">Halo Business Finance</span>
      </div>

      {/* Navigation Items */}
      <div className="flex items-center space-x-6">
        {!authenticated ? (
          <Button 
            size="lg" 
            onClick={() => navigate('/auth')}
            className="shadow-sm"
          >
            Login
          </Button>
        ) : (
          <div className="flex items-center space-x-4">
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
                  <p className="text-xs text-muted-foreground">You have {notificationCount} unread notifications</p>
                </div>
                
                <div className="max-h-[400px] overflow-y-auto">
                  <DropdownMenuItem 
                    className="cursor-pointer hover:bg-muted py-3 px-4 border-b"
                  >
                    <div className="flex flex-col gap-1 w-full">
                      <p className="text-sm font-medium">Application Approved</p>
                      <p className="text-xs text-muted-foreground">Your SBA loan application has been approved</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    className="cursor-pointer hover:bg-muted py-3 px-4 border-b"
                  >
                    <div className="flex flex-col gap-1 w-full">
                      <p className="text-sm font-medium">Document Required</p>
                      <p className="text-xs text-muted-foreground">Please upload additional tax documents</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    className="cursor-pointer hover:bg-muted py-3 px-4 border-b"
                  >
                    <div className="flex flex-col gap-1 w-full">
                      <p className="text-sm font-medium">Status Update</p>
                      <p className="text-xs text-muted-foreground">Your application is under review</p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </DropdownMenuItem>
                </div>
                
                <div className="px-4 py-2 border-t">
                  <Button 
                    variant="ghost" 
                    className="w-full text-xs"
                    onClick={() => navigate('/portal?tab=notifications')}
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
              onClick={() => navigate('/calculator')}
              className="text-blue-900 hover:bg-accent"
              title="Loan Calculator"
            >
              <Calculator className="w-5 h-5" />
            </Button>

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
                  onClick={() => navigate('/portal')}
                  className="cursor-pointer hover:bg-muted"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  My Account
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