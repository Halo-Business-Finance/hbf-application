import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { LogOut, KeyRound, Home, UserCircle, Settings, FileText, Shield, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { SidebarTrigger } from '@/components/ui/sidebar';

const Navbar = () => {
  const navigate = useNavigate();
  const { authenticated, loading, username, signOut } = useAuth();
  const { isAdmin } = useUserRole();

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
        <SidebarTrigger className="m-0" />
        <span className="text-foreground font-bold text-xl tracking-tight">Halo Business Finance</span>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity px-3 py-2 rounded-md hover:bg-accent">
                  <UserCircle className="w-5 h-5 text-foreground" />
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
                  My Portal
                </DropdownMenuItem>

                {isAdmin() && (
                  <>
                    <DropdownMenuItem 
                      onClick={() => navigate('/admin')}
                      className="cursor-pointer hover:bg-muted"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Admin Dashboard
                    </DropdownMenuItem>

                    <DropdownMenuItem 
                      onClick={() => navigate('/admin/users')}
                      className="cursor-pointer hover:bg-muted"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      User Management
                    </DropdownMenuItem>
                  </>
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