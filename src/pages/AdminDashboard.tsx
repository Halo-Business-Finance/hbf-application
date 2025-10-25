import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Settings, 
  Shield, 
  Download,
  Eye,
  Database,
  Bell,
  MessageSquare,
  BarChart3,
  CreditCard,
  Building2,
  Plug
} from 'lucide-react';


const AdminDashboard = () => {
  const { authenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !authenticated) {
      navigate('/auth');
      return;
    }
  }, [authenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const adminSections = [
    {
      icon: FileText,
      title: 'All Applications',
      description: 'View, manage, and review all loan applications submitted by users',
      onClick: () => navigate('/admin/applications')
    },
    {
      icon: Users,
      title: 'User Management',
      description: 'Manage user accounts, roles, and permissions across the platform',
      onClick: () => navigate('/admin/users')
    },
    {
      icon: Eye,
      title: 'Application Review',
      description: 'Review pending applications and update their status',
      onClick: () => navigate('/admin/review')
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'View detailed analytics, statistics, and generate reports',
      onClick: () => navigate('/admin/analytics')
    },
    {
      icon: Settings,
      title: 'System Settings',
      description: 'Configure system-wide settings and preferences',
      onClick: () => navigate('/admin/settings')
    },
    {
      icon: Shield,
      title: 'Security & Audit Logs',
      description: 'Monitor security events and view audit logs for compliance',
      onClick: () => navigate('/admin/security')
    },
    {
      icon: Download,
      title: 'Export Data',
      description: 'Export applications, users, and reports in CSV or PDF format',
      onClick: () => navigate('/admin/export')
    },
    {
      icon: Building2,
      title: 'Loan Products',
      description: 'Manage available loan products, types, and their configurations',
      onClick: () => navigate('/admin/products')
    },
    {
      icon: CreditCard,
      title: 'Payment Management',
      description: 'View and manage payment transactions and financial records',
      onClick: () => navigate('/admin/payments')
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Send system notifications and manage alert preferences',
      onClick: () => navigate('/admin/notifications')
    },
    {
      icon: MessageSquare,
      title: 'Support Tickets',
      description: 'Review and respond to user support requests and inquiries',
      onClick: () => navigate('/admin/support')
    },
    {
      icon: Database,
      title: 'Database Management',
      description: 'Monitor database health, backups, and perform maintenance',
      onClick: () => navigate('/admin/database')
    },
    {
      icon: Plug,
      title: 'API Integrations',
      description: 'Manage external API connections, webhooks, and third-party integrations',
      onClick: () => navigate('/admin/integrations')
    }
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage applications, users, and system settings
          </p>
        </div>

        {/* Admin Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminSections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.title}
                className="cursor-pointer"
                onClick={section.onClick}
              >
                <Card className="h-full hover:shadow-md transition-shadow border">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-7 h-7 text-blue-900" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base mb-1">{section.title}</h3>
                        <p className="text-sm text-muted-foreground leading-snug">
                          {section.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;