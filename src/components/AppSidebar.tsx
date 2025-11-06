import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, FileText, Shield, Users, Building2, LayoutDashboard, FolderKanban, FolderOpen, CreditCard, Landmark, Wallet, LogOut } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useUserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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
  const { signOut } = useAuth();
  const { toast } = useToast();
  const currentPath = location.pathname;

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
    <Sidebar collapsible="offcanvas">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={handleLogout}
                  className="hover:bg-destructive/10 hover:text-destructive transition-all duration-200 group cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                  <span>Log Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {isAdmin() && (
                <>
                  <SidebarGroupLabel>Admin</SidebarGroupLabel>
                  {adminItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink to={item.url} end className={getNavCls}>
                          <item.icon className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
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
      </SidebarContent>
    </Sidebar>
  );
}
