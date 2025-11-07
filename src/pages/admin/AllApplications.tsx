import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { adminService } from '@/services/adminService';
import { 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  Edit,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Home
} from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';

interface LoanApplication {
  id: string;
  application_number: string;
  first_name: string;
  last_name: string;
  business_name: string;
  loan_type: string;
  amount_requested: number;
  status: string;
  created_at: string;
  years_in_business: number;
}

const AllApplications = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loanTypeFilter, setLoanTypeFilter] = useState('all');

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [applications, searchTerm, statusFilter, loanTypeFilter]);

  const loadApplications = async () => {
    try {
      const data = await adminService.getFilteredApplications({});
      if (data) {
        setApplications(data);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
      toast({
        title: "Error",
        description: "Failed to load applications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    let filtered = applications;

    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.application_number?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    if (loanTypeFilter !== 'all') {
      filtered = filtered.filter(app => app.loan_type === loanTypeFilter);
    }

    setFilteredApplications(filtered);
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const result = await adminService.updateApplicationStatus(applicationId, newStatus);
      if (result) {
        toast({
          title: "Success",
          description: "Application status updated successfully"
        });
        loadApplications();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: 'secondary' as const, icon: Clock, className: '' },
      submitted: { variant: 'default' as const, icon: AlertCircle, className: '' },
      under_review: { variant: 'default' as const, icon: AlertCircle, className: '' },
      approved: { variant: 'default' as const, icon: CheckCircle, className: 'bg-green-100 text-green-800' },
      rejected: { variant: 'destructive' as const, icon: XCircle, className: '' },
      funded: { variant: 'default' as const, icon: CheckCircle, className: 'bg-purple-100 text-purple-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'secondary' as const, icon: Clock, className: '' };
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className={config.className}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
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
              <BreadcrumbPage>All Applications</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <Button variant="ghost" onClick={() => navigate('/admin')} className="mb-4">
            ← Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold mb-2">All Applications</h1>
          <p className="text-muted-foreground">View and manage all loan applications</p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="funded">Funded</SelectItem>
                </SelectContent>
              </Select>
              <Select value={loanTypeFilter} onValueChange={setLoanTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by loan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="refinance">Refinance</SelectItem>
                  <SelectItem value="bridge_loan">Bridge Loan</SelectItem>
                  <SelectItem value="working_capital">Working Capital</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <Card>
          <CardHeader>
            <CardTitle>Applications ({filteredApplications.length})</CardTitle>
            <CardDescription>
              All loan applications submitted by users
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading applications...</p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No applications found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((application) => (
                  <Card key={application.id} className="border-l-4 border-l-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">
                              {application.first_name} {application.last_name}
                            </h3>
                            {getStatusBadge(application.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {application.business_name} • {application.application_number}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <span>Type: <strong>{application.loan_type}</strong></span>
                            <span>Amount: <strong>${application.amount_requested?.toLocaleString()}</strong></span>
                            <span>Years in Business: <strong>{application.years_in_business}</strong></span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Applied: {new Date(application.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => navigate(`/admin/loans/${application.id}`)}>
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Select onValueChange={(value) => updateApplicationStatus(application.id, value)}>
                            <SelectTrigger className="w-[140px]">
                              <div className="flex items-center gap-1">
                                <Edit className="w-4 h-4" />
                                <SelectValue placeholder="Update Status" />
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="submitted">Submitted</SelectItem>
                              <SelectItem value="under_review">Under Review</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                              <SelectItem value="funded">Funded</SelectItem>
                            </SelectContent>
                          </Select>
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

export default AllApplications;
