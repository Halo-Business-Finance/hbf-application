import { NavLink, useLocation } from 'react-router-dom';
import { Home, FileText, Shield, Users, Building2, LayoutDashboard, FolderKanban, FolderOpen, CreditCard, Landmark, Wallet } from 'lucide-react';
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

const items = [
  { title: 'My Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Loan Applications', url: '/portal?tab=applications', icon: FileText },
  { title: 'Existing Loans', url: '/existing-loans', icon: Wallet },
  { title: 'My Documents', url: '/documents', icon: FolderOpen },
  { title: 'Credit Reports', url: '/credit-reports', icon: CreditCard },
  { title: 'Bank Accounts', url: '/bank-accounts', icon: Landmark },
];

const adminItems = [
  { title: 'Admin Dashboard', url: '/admin', icon: LayoutDashboard },
];

export function AppSidebar() {
  const location = useLocation();
  const { isAdmin } = useUserRole();
  const currentPath = location.pathname;

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : 'hover:bg-sidebar-accent/60';

  return (
    <Sidebar collapsible="offcanvas" className="top-16 md:top-16">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {isAdmin() && (
                <>
                  <SidebarGroupLabel>Admin</SidebarGroupLabel>
                  {adminItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink to={item.url} end className={getNavCls}>
                          <item.icon className="mr-2 h-4 w-4" />
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
