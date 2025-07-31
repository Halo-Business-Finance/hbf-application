import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { adminService } from '@/services/adminService';
import { 
  ArrowLeft, 
  FileText, 
  User, 
  Building, 
  DollarSign, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin,
  Edit,
  Save,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Download,
  Upload,
  MessageSquare,
  History
} from 'lucide-react';

interface LoanApplication {
  id: string;
  application_number: string;
  first_name: string;
  last_name: string;
  business_name: string;
  business_address: string;
  business_city: string;
  business_state: string;
  business_zip: string;
  phone: string;
  loan_type: string;
  amount_requested: number;
  status: string;
  years_in_business: number;
  created_at: string;
  updated_at: string;
  application_submitted_date: string;
  loan_details: any;
}

interface StatusHistory {
  id: string;
  old_status: string;
  new_status: string;
  notes: string;
  updated_by: string;
  updated_at: string;
}

const AdminLoanDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { authenticated, loading } = useAuth();
  const { toast } = useToast();

  const [application, setApplication] = useState<LoanApplication | null>(null);
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<LoanApplication>>({});
  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [loadingData, setLoadingData] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (!loading && !authenticated) {
      navigate('/auth');
      return;
    }

    if (authenticated && id) {
      loadApplicationDetails();
    }
  }, [authenticated, loading, navigate, id]);

  const loadApplicationDetails = async () => {
    try {
      // In a real app, you'd fetch the specific application
      // For now, we'll simulate this data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockApplication: LoanApplication = {
        id: id!,
        application_number: 'HBF-2024-001-12345',
        first_name: 'John',
        last_name: 'Smith',
        business_name: 'Tech Solutions LLC',
        business_address: '123 Business St',
        business_city: 'New York',
        business_state: 'NY',
        business_zip: '10001',
        phone: '(555) 123-4567',
        loan_type: 'refinance',
        amount_requested: 500000,
        status: 'under_review',
        years_in_business: 5,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-20T14:30:00Z',
        application_submitted_date: '2024-01-15T10:00:00Z',
        loan_details: {
          purpose: 'Expand operations',
          collateral: 'Commercial property',
          credit_score: 720
        }
      };

      const mockHistory: StatusHistory[] = [
        {
          id: '1',
          old_status: 'pending',
          new_status: 'under_review',
          notes: 'Application moved to review stage',
          updated_by: 'admin@halo.com',
          updated_at: '2024-01-20T14:30:00Z'
        },
        {
          id: '2',
          old_status: 'draft',
          new_status: 'pending',
          notes: 'Application submitted by customer',
          updated_by: 'system',
          updated_at: '2024-01-15T10:00:00Z'
        }
      ];

      setApplication(mockApplication);
      setStatusHistory(mockHistory);
      setEditData(mockApplication);
      setNewStatus(mockApplication.status);
    } catch (error) {
      console.error('Error loading application details:', error);
      toast({
        title: "Error",
        description: "Failed to load application details",
        variant: "destructive"
      });
    } finally {
      setLoadingData(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!application || !newStatus) return;

    setUpdatingStatus(true);
    try {
      const result = await adminService.updateApplicationStatus(
        application.id, 
        newStatus, 
        statusNotes
      );
      
      if (result) {
        toast({
          title: "Success",
          description: "Application status updated successfully"
        });
        
        // Reload application details
        await loadApplicationDetails();
        setStatusNotes('');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive"
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!application || !editData) return;

    try {
      // In a real app, you'd call an update API
      toast({
        title: "Success",
        description: "Application details updated successfully"
      });
      
      setApplication({ ...application, ...editData });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: "Error",
        description: "Failed to update application details",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, icon: Clock, className: '' },
      under_review: { variant: 'default' as const, icon: AlertCircle, className: '' },
      approved: { variant: 'default' as const, icon: CheckCircle, className: 'bg-green-100 text-green-800' },
      rejected: { variant: 'destructive' as const, icon: XCircle, className: '' }
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

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center p-6">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Application Not Found</h3>
            <p className="text-muted-foreground mb-4">
              The requested application could not be found.
            </p>
            <Button onClick={() => navigate('/admin')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/admin')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Application Details</h1>
              <p className="text-muted-foreground">{application.application_number}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(application.status)}
            <Button 
              variant={isEditing ? "destructive" : "outline"}
              onClick={() => {
                if (isEditing) {
                  setIsEditing(false);
                  setEditData(application);
                } else {
                  setIsEditing(true);
                }
              }}
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </>
              )}
            </Button>
            {isEditing && (
              <Button onClick={handleSaveEdit}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="details" className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">Application Details</TabsTrigger>
            <TabsTrigger value="status">Status Management</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name">First Name</Label>
                      {isEditing ? (
                        <Input
                          id="first_name"
                          value={editData.first_name || ''}
                          onChange={(e) => setEditData({...editData, first_name: e.target.value})}
                        />
                      ) : (
                        <p className="text-sm font-medium mt-1">{application.first_name}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="last_name">Last Name</Label>
                      {isEditing ? (
                        <Input
                          id="last_name"
                          value={editData.last_name || ''}
                          onChange={(e) => setEditData({...editData, last_name: e.target.value})}
                        />
                      ) : (
                        <p className="text-sm font-medium mt-1">{application.last_name}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </Label>
                    {isEditing ? (
                      <Input
                        value={editData.phone || ''}
                        onChange={(e) => setEditData({...editData, phone: e.target.value})}
                      />
                    ) : (
                      <p className="text-sm font-medium mt-1">{application.phone}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Business Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Business Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="business_name">Business Name</Label>
                    {isEditing ? (
                      <Input
                        id="business_name"
                        value={editData.business_name || ''}
                        onChange={(e) => setEditData({...editData, business_name: e.target.value})}
                      />
                    ) : (
                      <p className="text-sm font-medium mt-1">{application.business_name}</p>
                    )}
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Business Address
                    </Label>
                    {isEditing ? (
                      <div className="space-y-2">
                        <Input
                          placeholder="Street Address"
                          value={editData.business_address || ''}
                          onChange={(e) => setEditData({...editData, business_address: e.target.value})}
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <Input
                            placeholder="City"
                            value={editData.business_city || ''}
                            onChange={(e) => setEditData({...editData, business_city: e.target.value})}
                          />
                          <Input
                            placeholder="State"
                            value={editData.business_state || ''}
                            onChange={(e) => setEditData({...editData, business_state: e.target.value})}
                          />
                          <Input
                            placeholder="ZIP"
                            value={editData.business_zip || ''}
                            onChange={(e) => setEditData({...editData, business_zip: e.target.value})}
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm font-medium mt-1">
                        {application.business_address}<br />
                        {application.business_city}, {application.business_state} {application.business_zip}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Years in Business</Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editData.years_in_business || ''}
                        onChange={(e) => setEditData({...editData, years_in_business: parseInt(e.target.value) || 0})}
                      />
                    ) : (
                      <p className="text-sm font-medium mt-1">{application.years_in_business} years</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Loan Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Loan Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Loan Type</Label>
                    {isEditing ? (
                      <Select
                        value={editData.loan_type}
                        onValueChange={(value) => setEditData({...editData, loan_type: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="refinance">Refinance</SelectItem>
                          <SelectItem value="bridge">Bridge Loan</SelectItem>
                          <SelectItem value="purchase">Purchase</SelectItem>
                          <SelectItem value="working_capital">Working Capital</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm font-medium mt-1 capitalize">{application.loan_type}</p>
                    )}
                  </div>
                  <div>
                    <Label>Amount Requested</Label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editData.amount_requested || ''}
                        onChange={(e) => setEditData({...editData, amount_requested: parseFloat(e.target.value) || 0})}
                      />
                    ) : (
                      <p className="text-sm font-medium mt-1">${application.amount_requested?.toLocaleString()}</p>
                    )}
                  </div>
                  {application.loan_details && (
                    <div>
                      <Label>Additional Details</Label>
                      <div className="mt-1 space-y-2">
                        {application.loan_details.purpose && (
                          <p className="text-sm"><strong>Purpose:</strong> {application.loan_details.purpose}</p>
                        )}
                        {application.loan_details.collateral && (
                          <p className="text-sm"><strong>Collateral:</strong> {application.loan_details.collateral}</p>
                        )}
                        {application.loan_details.credit_score && (
                          <p className="text-sm"><strong>Credit Score:</strong> {application.loan_details.credit_score}</p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Application Created</Label>
                    <p className="text-sm font-medium mt-1">
                      {new Date(application.created_at).toLocaleDateString()} at {new Date(application.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <div>
                    <Label>Last Updated</Label>
                    <p className="text-sm font-medium mt-1">
                      {new Date(application.updated_at).toLocaleDateString()} at {new Date(application.updated_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <div>
                    <Label>Submitted Date</Label>
                    <p className="text-sm font-medium mt-1">
                      {new Date(application.application_submitted_date).toLocaleDateString()} at {new Date(application.application_submitted_date).toLocaleTimeString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="status" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="w-5 h-5" />
                  Update Application Status
                </CardTitle>
                <CardDescription>
                  Change the status of this application and add notes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">New Status</Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any notes about this status change..."
                    value={statusNotes}
                    onChange={(e) => setStatusNotes(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleStatusUpdate}
                  disabled={updatingStatus || newStatus === application.status}
                >
                  {updatingStatus ? 'Updating...' : 'Update Status'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Documents
                </CardTitle>
                <CardDescription>
                  Manage application documents and attachments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Document Management</h3>
                  <p className="text-muted-foreground mb-4">
                    Document upload and management features will be available soon
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Document
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download All
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Status History
                </CardTitle>
                <CardDescription>
                  Track all status changes and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statusHistory.map((history, index) => (
                    <div key={history.id} className="flex items-start gap-3 p-3 rounded-lg border">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusBadge(history.old_status)}
                          <span className="text-muted-foreground">→</span>
                          {getStatusBadge(history.new_status)}
                        </div>
                        <p className="text-sm text-muted-foreground">{history.notes}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Updated by {history.updated_by} on {new Date(history.updated_at).toLocaleDateString()} at {new Date(history.updated_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminLoanDetail;