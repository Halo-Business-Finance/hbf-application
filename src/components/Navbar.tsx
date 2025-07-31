import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { LogOut, KeyRound, Home, User, Settings, FileText, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { authenticated, loading, username, signOut } = useAuth();

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
      <nav className="h-[70px] px-5 shadow-lg flex w-full justify-between items-center bg-slate-900 text-white">
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
    <nav className="h-[70px] px-5 shadow-lg flex w-full justify-between items-center bg-slate-900 text-white">
      {/* Logo */}
      <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">H</span>
          </div>
          <span className="text-white font-bold text-xl">Halo Business Finance</span>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex items-center space-x-6">
        {!authenticated ? (
          <Button 
            size="lg" 
            onClick={() => navigate('/auth')}
            className="bg-primary hover:bg-primary/90"
          >
            Login
          </Button>
        ) : (
          <div className="flex items-center space-x-4">
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/')}
              className="border-white text-white hover:bg-white hover:text-slate-900"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
                  <span className="text-white font-medium">
                    {username || 'User'}
                  </span>
                  <Avatar className="h-11 w-11 border-2 border-white/20">
                    <AvatarImage 
                      src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" 
                      alt="User Avatar" 
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent 
                align="end" 
                className="w-56 bg-background border shadow-lg z-50 backdrop-blur-sm"
              >
                <DropdownMenuItem 
                  onClick={() => navigate('/portal')}
                  className="cursor-pointer hover:bg-muted"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  My Portal
                </DropdownMenuItem>

                <DropdownMenuItem 
                  onClick={() => navigate('/admin')}
                  className="cursor-pointer hover:bg-muted"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Admin Dashboard
                </DropdownMenuItem>
                
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