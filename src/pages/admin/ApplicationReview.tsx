import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { adminService } from '@/services/adminService';
import { Eye, CheckCircle, XCircle, Clock, Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';

const ApplicationReview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pendingApplications, setPendingApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingApplications();
  }, []);

  const loadPendingApplications = async () => {
    try {
      const data = await adminService.getFilteredApplications({});
      if (data) {
        const pending = data.filter((app: any) => 
          app.status === 'submitted' || app.status === 'under_review'
        );
        setPendingApplications(pending);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
      toast({
        title: "Error",
        description: "Failed to load pending applications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (applicationId: string) => {
    try {
      await adminService.updateApplicationStatus(applicationId, 'approved');
      toast({
        title: "Application Approved",
        description: "The application has been approved successfully"
      });
      loadPendingApplications();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve application",
        variant: "destructive"
      });
    }
  };

  const handleReject = async (applicationId: string) => {
    try {
      await adminService.updateApplicationStatus(applicationId, 'rejected');
      toast({
        title: "Application Rejected",
        description: "The application has been rejected"
      });
      loadPendingApplications();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject application",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Admin Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Application Review</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <Button variant="ghost" onClick={() => navigate('/admin')} className="mb-4">
            ← Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold mb-2">Application Review</h1>
          <p className="text-muted-foreground">Review and approve pending loan applications</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Applications ({pendingApplications.length})</CardTitle>
            <CardDescription>Applications awaiting review and approval</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading applications...</p>
              </div>
            ) : pendingApplications.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No pending applications to review</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingApplications.map((app) => (
                  <Card key={app.id} className="border-l-4 border-l-yellow-400">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">
                              {app.first_name} {app.last_name}
                            </h3>
                            <Badge variant="secondary">
                              <Clock className="w-3 h-3 mr-1" />
                              {app.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {app.business_name} • {app.application_number}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <span>Type: <strong>{app.loan_type}</strong></span>
                            <span>Amount: <strong>${app.amount_requested?.toLocaleString()}</strong></span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Submitted: {new Date(app.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => navigate(`/admin/loans/${app.id}`)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleApprove(app.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleReject(app.id)}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplicationReview;
