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
  Phone
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome back{userProfile?.first_name ? `, ${userProfile.first_name}` : ''}!
            </h1>
            <p className="text-muted-foreground">
              Manage your loan applications and track your progress
            </p>
          </div>
          <Button onClick={() => navigate('/')} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Application
          </Button>
        </div>

        {/* Quick Stats */}
        {userStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Applications</p>
                  <p className="text-2xl font-bold">{userStats.totalApplications}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div>
                  <p className="text-sm text-muted-foreground">Approved Amount</p>
                  <p className="text-2xl font-bold">${userStats.approvedAmount.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                  <p className="text-2xl font-bold">{userStats.pendingApplications}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold">
                    {userStats.totalApplications > 0 
                      ? Math.round(((userStats.totalApplications - userStats.pendingApplications) / userStats.totalApplications) * 100)
                      : 0}%
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="applications" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="applications">My Applications</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="loans">Existing Loans</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Your Applications
                </CardTitle>
                <CardDescription>
                  Track the status of your loan applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start your first loan application to see it here
                    </p>
                    <Button onClick={() => navigate('/')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Start New Application
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((application) => (
                      <Card key={application.id} className="border-l-4 border-l-primary/20">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{application.business_name}</h3>
                                {getStatusBadge(application.status)}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Application #{application.application_number}
                              </p>
                              <div className="flex flex-wrap gap-4 text-sm">
                                <span>Type: <strong>{application.loan_type}</strong></span>
                                <span>Amount: <strong>${application.amount_requested?.toLocaleString()}</strong></span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Submitted: {new Date(application.created_at).toLocaleDateString()}
                              </p>
                              
                              {/* Progress indicator */}
                              <div className="mt-3">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Application Progress</span>
                                  <span>
                                    {application.status === 'approved' ? '100%' : 
                                     application.status === 'under_review' ? '75%' :
                                     application.status === 'pending' ? '25%' : '0%'}
                                  </span>
                                </div>
                                <Progress 
                                  value={
                                    application.status === 'approved' ? 100 : 
                                    application.status === 'under_review' ? 75 :
                                    application.status === 'pending' ? 25 : 0
                                  } 
                                  className="h-2"
                                />
                              </div>
                            </div>
                             {application.status === 'draft' ? (
                              <Button 
                                variant="default" 
                                size="sm"
                                onClick={() => navigate(`/?loan=${application.loan_type}`)}
                              >
                                Continue Application
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Stay updated with your application progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentActivity.length === 0 ? (
                  <div className="text-center py-8">
                    <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No recent activity</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border">
                        <div className="mt-1">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{activity.title}</h4>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(activity.date).toLocaleDateString()} at {new Date(activity.date).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loans" className="space-y-4">
            <ApplicationsList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BorrowerPortal;