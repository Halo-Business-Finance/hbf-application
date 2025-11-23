import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, FileText, Shield, Users, Building2, LayoutDashboard, FolderKanban, FolderOpen, CreditCard, Landmark, Wallet, LogOut, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { useUserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const items = [
  { title: 'My Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Loan Applications', url: '/loan-applications', icon: FileText },
  { title: 'Existing Loans', url: '/existing-loans', icon: Wallet },
  { title: 'Document Storage', url: '/document-storage', icon: FolderOpen },
  { title: 'Credit Reports', url: '/credit-reports', icon: CreditCard },
  { title: 'Bank Accounts', url: '/bank-accounts', icon: Landmark },
];

const adminItems = [
  { title: 'Admin Dashboard', url: '/admin', icon: LayoutDashboard },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin } = useUserRole();
  const { signOut, user } = useAuth();
  const { toast } = useToast();
  const { open, toggleSidebar } = useSidebar();
  const currentPath = location.pathname;
  const [firstName, setFirstName] = useState<string>('');

  useEffect(() => {
    const fetchUserName = async () => {
      if (!user) return;
      
      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('id', user.id)
          .maybeSingle();
        
        if (profileData?.first_name) {
          setFirstName(profileData.first_name);
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    };

    fetchUserName();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
      navigate('/');
    } catch (error: any) {
      console.error('Error logging out:', error);
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive"
      });
    }
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    `${isActive 
      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
      : 'hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground'} transition-all duration-200 group`;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="flex flex-col">
        <div className="flex-1">
          <SidebarGroup className="mt-4">
            {open && (
              <div className="px-2 py-3 mb-2 pt-8">
                <h2 className="text-sm font-medium text-sidebar-foreground/70">
                  Dashboard
                </h2>
              </div>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={toggleSidebar} tooltip="Toggle Menu">
                    <Menu className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
            {open && <SidebarGroupLabel>Navigation</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <NavLink to={item.url} end className={getNavCls}>
                        <item.icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                {isAdmin() && (
                  <>
                    {open && <SidebarGroupLabel className="mt-4">Admin</SidebarGroupLabel>}
                    {adminItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild tooltip={item.title}>
                          <NavLink to={item.url} end className={getNavCls}>
                            <item.icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                            <span>{item.title}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
        
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={handleLogout}
                  tooltip="Log Out"
                  className="hover:bg-destructive/10 hover:text-destructive transition-all duration-200 group cursor-pointer"
                >
                  <LogOut className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                  <span>Log Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
