import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, FileText, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface LoanApplication {
  id: string;
  loan_type: string;
  amount_requested: number;
  application_number: string;
  status: string;
  first_name: string;
  last_name: string;
  business_name: string;
  application_started_date: string;
  application_submitted_date: string;
  created_at: string;
}

const ApplicationsList = () => {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchApplications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('loan_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to load your applications.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const getLoanTypeDisplay = (loanType: string) => {
    const types = {
      refinance: 'Refinance of Property',
      bridge_loan: 'Bridge Loan',
      purchase: 'Purchase of Property',
      franchise: 'Franchise Loan',
      factoring: 'Factoring Loan',
      working_capital: 'Working Capital'
    };
    return types[loanType as keyof typeof types] || loanType;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      submitted: 'bg-blue-100 text-blue-800',
      under_review: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      funded: 'bg-purple-100 text-purple-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                <div className="h-6 bg-muted rounded w-1/2 mb-4"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-12 bg-muted rounded"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Applications Yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't submitted any loan applications. Select a loan type below to get started.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Your Applications</h2>
        <p className="text-muted-foreground">
          Track the status of your loan applications
        </p>
      </div>

      <div className="space-y-4">
        {applications.map((application) => (
          <Card key={application.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {getLoanTypeDisplay(application.loan_type)}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <span>Application #{application.application_number}</span>
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(application.status)}>
                  {application.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Loan Amount</p>
                    <p className="font-semibold">
                      {formatCurrency(application.amount_requested)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Applicant</p>
                    <p className="font-semibold">
                      {application.first_name} {application.last_name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Business</p>
                    <p className="font-semibold">{application.business_name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {application.application_submitted_date ? 'Submitted' : 'Started'}
                    </p>
                    <p className="font-semibold">
                      {format(
                        new Date(application.application_submitted_date || application.application_started_date),
                        'MMM dd, yyyy'
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Last updated: {format(new Date(application.created_at), 'MMM dd, yyyy h:mm a')}
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ApplicationsList;