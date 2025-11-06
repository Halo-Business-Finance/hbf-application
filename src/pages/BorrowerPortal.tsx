import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  DollarSign,
  User,
  Mail,
  Phone,
  Building
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
  const [searchParams] = useSearchParams();

  const [applications, setApplications] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [userProfile, setUserProfile] = useState<{ 
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    phone: string | null;
    business_name: string | null;
  } | null>(null);
  
  // Get active tab from URL or default to 'account'
  const activeTab = searchParams.get('tab') || 'account';

  useEffect(() => {
    if (!loading && !authenticated) {
      navigate('/');
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
          .select('first_name, last_name, phone, business_name')
          .eq('id', user.id)
          .single();
        
        if (profileData) {
          setUserProfile({
            ...profileData,
            email: user.email || null
          });
        } else {
          // If no profile exists, use user email
          setUserProfile({
            first_name: null,
            last_name: null,
            email: user.email || null,
            phone: null,
            business_name: null
          });
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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <Tabs value={activeTab} onValueChange={(value) => navigate(`/portal?tab=${value}`)} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="account">My Account</TabsTrigger>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="loans">Loans</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">My Account</h2>
              <p className="text-muted-foreground">Manage your account information and preferences</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input 
                      value={userProfile?.first_name || ''} 
                      readOnly 
                      className="bg-muted/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input 
                      value={userProfile?.last_name || ''} 
                      readOnly 
                      className="bg-muted/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                    <Input 
                      value={userProfile?.email || user?.email || ''} 
                      readOnly 
                      className="bg-muted/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone
                    </Label>
                    <Input 
                      value={userProfile?.phone || 'Not provided'} 
                      readOnly 
                      className="bg-muted/50"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Business Information
                  </CardTitle>
                  <CardDescription>Your business details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Business Name</Label>
                    <Input 
                      value={userProfile?.business_name || 'Not provided'} 
                      readOnly 
                      className="bg-muted/50"
                    />
                  </div>
                  <div className="pt-4">
                    <Button variant="outline" className="w-full" onClick={() => toast({
                      title: "Coming Soon",
                      description: "Profile editing feature will be available soon."
                    })}>
                      Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/change-password')}
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/my-documents')}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  My Documents
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast({
                    title: "Coming Soon",
                    description: "Notification preferences will be available soon."
                  })}
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Notification Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Your Applications</h2>
                <p className="text-muted-foreground mt-1">
                  {applications.length} application{applications.length !== 1 ? 's' : ''} in total
                </p>
              </div>
            </div>
            
            <ApplicationsList />
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Recent Activity</h2>
              <p className="text-muted-foreground">Track your recent application activities</p>
            </div>

            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <Card key={activity.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="mt-1">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-semibold mb-1">{activity.title}</h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                {activity.description}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(activity.date).toLocaleDateString('en-US', {
                                  month: 'long',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                            {activity.status && (
                              <div>
                                {getStatusBadge(activity.status)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">No Recent Activity</h3>
                    <p className="text-sm text-muted-foreground">
                      Your recent application activities will appear here
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="loans" className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Loans</h2>
              <p className="text-muted-foreground">View your loan details and history</p>
            </div>

            {userStats && (
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userStats.totalApplications}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Approved Amount</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${userStats.approvedAmount.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userStats.pendingApplications}</div>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="space-y-4">
              {applications.length > 0 ? (
                applications.map((app) => (
                  <Card key={app.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{app.business_name}</CardTitle>
                          <CardDescription className="mt-1">
                            {app.loan_type.replace('_', ' ').toUpperCase()} • {app.application_number}
                          </CardDescription>
                        </div>
                        {getStatusBadge(app.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Amount Requested</p>
                          <p className="text-xl font-semibold">
                            ${app.amount_requested.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Application Date</p>
                          <p className="text-xl font-semibold">
                            {new Date(app.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">No Loans Yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Start your first loan application to see it here
                    </p>
                    <Button onClick={() => navigate('/')}>
                      <Plus className="w-4 h-4 mr-2" />
                      New Application
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BorrowerPortal;