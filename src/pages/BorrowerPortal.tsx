import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { loanApplicationService } from '@/services/loanApplicationService';
import ApplicationsList from '@/components/ApplicationsList';
import { supabase } from '@/integrations/supabase/client';
import { 
  FileText, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  DollarSign,
  Calendar,
  User,
  Building,
  Phone,
  Shield,
  Home,
  CreditCard,
  Bell,
  HelpCircle,
  Settings,
  Upload,
  MessageSquare
} from 'lucide-react';

interface UserStats {
  totalApplications: number;
  approvedAmount: number;
  pendingApplications: number;
  lastApplicationDate: string | null;
}

interface RecentActivity {
  id: string;
  type: 'application_submitted' | 'status_updated' | 'document_uploaded';
  title: string;
  description: string;
  date: string;
  status?: string;
}

const BorrowerPortal = () => {
  const { authenticated, loading, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [applications, setApplications] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [userProfile, setUserProfile] = useState<{ first_name: string | null } | null>(null);

  useEffect(() => {
    if (!loading && !authenticated) {
      navigate('/auth');
      return;
    }

    if (authenticated) {
      loadPortalData();
    }
  }, [authenticated, loading, navigate]);

  const loadPortalData = async () => {
    try {
      // Fetch user profile
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('id', user.id)
          .single();
        
        if (profileData) {
          setUserProfile(profileData);
        }
      }
      
      // In a real app, you'd fetch user-specific applications
      // For now, we'll simulate this data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Mock data - in real app, fetch from Supabase
      const mockApplications = [
        {
          id: '1',
          application_number: 'HBF-2024-001-12345',
          loan_type: 'refinance',
          amount_requested: 500000,
          status: 'approved',
          created_at: '2024-01-15T10:00:00Z',
          business_name: 'Tech Solutions LLC'
        },
        {
          id: '2',
          application_number: 'HBF-2024-002-12346',
          loan_type: 'bridge',
          amount_requested: 250000,
          status: 'under_review',
          created_at: '2024-01-20T14:30:00Z',
          business_name: 'Real Estate Ventures'
        }
      ];

      const stats: UserStats = {
        totalApplications: mockApplications.length,
        approvedAmount: mockApplications
          .filter(app => app.status === 'approved')
          .reduce((sum, app) => sum + app.amount_requested, 0),
        pendingApplications: mockApplications.filter(app => 
          app.status === 'pending' || app.status === 'under_review'
        ).length,
        lastApplicationDate: mockApplications[0]?.created_at || null
      };

      const activities: RecentActivity[] = [
        {
          id: '1',
          type: 'application_submitted',
          title: 'Bridge Loan Application Submitted',
          description: 'Application HBF-2024-002-12346 has been submitted for review',
          date: '2024-01-20T14:30:00Z'
        },
        {
          id: '2',
          type: 'status_updated',
          title: 'Refinance Application Approved',
          description: 'Your refinance application has been approved for $500,000',
          date: '2024-01-18T09:15:00Z',
          status: 'approved'
        }
      ];

      setApplications(mockApplications);
      setUserStats(stats);
      setRecentActivity(activities);
    } catch (error) {
      console.error('Error loading portal data:', error);
      toast({
        title: "Error",
        description: "Failed to load portal data",
        variant: "destructive"
      });
    } finally {
      setLoadingData(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, icon: Clock, color: 'text-yellow-600', className: '' },
      under_review: { variant: 'default' as const, icon: AlertCircle, color: 'text-blue-600', className: '' },
      approved: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600', className: 'bg-green-100 text-green-800' },
      rejected: { variant: 'destructive' as const, icon: XCircle, color: 'text-red-600', className: '' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'secondary' as const, icon: Clock, color: 'text-gray-600', className: '' };
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'application_submitted':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'status_updated':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'document_uploaded':
        return <FileText className="w-4 h-4 text-purple-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your portal...</p>
        </div>
      </div>
    );
  }

  const accountSections = [
    {
      icon: FileText,
      title: 'My Applications',
      description: 'Track, view, and manage your loan applications',
      onClick: () => navigate('/portal?tab=applications')
    },
    {
      icon: Shield,
      title: 'Login & Security',
      description: 'Edit login credentials, password, and security settings',
      onClick: () => navigate('/portal?tab=security')
    },
    {
      icon: User,
      title: 'Profile Settings',
      description: 'Manage your personal information and business details',
      onClick: () => navigate('/portal?tab=profile')
    },
    {
      icon: Home,
      title: 'Business Information',
      description: 'Update business address, type, and registration details',
      onClick: () => navigate('/portal?tab=business')
    },
    {
      icon: CreditCard,
      title: 'Payment Methods',
      description: 'View transactions and manage payment settings',
      onClick: () => navigate('/portal?tab=payments')
    },
    {
      icon: Upload,
      title: 'Documents',
      description: 'Upload, view, and manage your application documents',
      onClick: () => navigate('/portal?tab=documents')
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Manage notification preferences and alert settings',
      onClick: () => navigate('/portal?tab=notifications')
    },
    {
      icon: TrendingUp,
      title: 'Loan Status',
      description: 'View current status and history of all your loans',
      onClick: () => navigate('/portal?tab=status')
    },
    {
      icon: Settings,
      title: 'Account Settings',
      description: 'Manage account preferences and general settings',
      onClick: () => navigate('/portal?tab=settings')
    },
    {
      icon: MessageSquare,
      title: 'Messages',
      description: 'View or respond to messages from our team',
      onClick: () => navigate('/portal?tab=messages')
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      description: 'Browse help articles, FAQs, or contact our support team',
      onClick: () => navigate('/portal?tab=support')
    },
    {
      icon: DollarSign,
      title: 'Funded Loans',
      description: 'View details of your approved and funded loans',
      onClick: () => navigate('/portal?tab=funded')
    }
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">
            Your Account
          </h1>
        </div>

        {/* Account Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accountSections.map((section) => {
            const Icon = section.icon;
            return (
              <Card 
                key={section.title}
                className="cursor-pointer hover:shadow-md transition-shadow border"
                onClick={section.onClick}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-7 h-7 text-primary" />
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
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BorrowerPortal;