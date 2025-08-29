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
import { LogOut, KeyRound, Home, UserCircle, Settings, FileText, Shield, Users, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authenticated, loading, username, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  
  const isMarketingPage = location.pathname === '/';

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
      <nav className="h-[70px] px-5 shadow-lg flex w-full justify-between items-center bg-background border-b">
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
    <nav className="h-[70px] px-5 shadow-lg flex w-full justify-between items-center bg-background border-b">
      {/* Logo */}
      <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
        <span className="text-foreground font-bold text-xl">Halo Business Finance</span>
      </div>

      {/* Navigation Items */}
      <div className="flex items-center space-x-6">
        {isMarketingPage && (
          <nav className="hidden md:flex items-center space-x-8">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  Company <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => navigate('/about')}>About Us</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/team')}>Our Team</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/contact')}>Contact</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  SBA Loans <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => navigate('/application?id=1')}>SBA 7(a) Loans</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/application?id=2')}>SBA 504 Loans</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/application?id=12')}>SBA Express</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  USDA Loans <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => navigate('/application?id=3')}>USDA B&I Loans</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  Commercial Loans <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => navigate('/application?id=5')}>Conventional Loans</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/application?id=9')}>Term Loans</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/application?id=4')}>Bridge Loans</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  Equipment Financing <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => navigate('/application?id=6')}>Equipment Loans</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/application?id=7')}>Working Capital</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/application?id=8')}>Line of Credit</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        )}
        
        {!authenticated ? (
          <div className="flex items-center space-x-4">
            {isMarketingPage && (
              <Button 
                variant="outline"
                onClick={() => navigate('/application')}
              >
                Get Started
              </Button>
            )}
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="bg-primary hover:bg-primary/90"
            >
              {isMarketingPage ? 'Sign In' : 'Login'}
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/application')}
              className="hover:bg-secondary/80 transition-colors"
            >
              <Home className="w-4 h-4 mr-2" />
              Application
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
                  <span className="text-foreground font-medium">
                    {username || 'User'}
                  </span>
                  <UserCircle className="w-6 h-6 text-foreground" />
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