import { ReactNode } from 'react';
import Navbar from './Navbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { BottomNav } from '@/components/BottomNav';
import { Breadcrumbs } from '@/components/Breadcrumbs';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-background flex flex-col">
        <Navbar />
        <div className="flex flex-1 w-full overflow-hidden">
          <AppSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Breadcrumbs />
            <main className="flex-1 overflow-auto px-4 sm:px-6 lg:px-8 pt-2 sm:pt-3 pb-20 md:pb-8">{children}</main>
          </div>
        </div>
        <BottomNav />
      </div>
    </SidebarProvider>
  );
};

export default Layout;