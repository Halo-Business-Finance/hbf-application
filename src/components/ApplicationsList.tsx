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
      <div>
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
      <div>
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
    <div>
      <div className="mb-6 flex items-start gap-3">
        <FileText className="w-6 h-6 text-foreground mt-1" />
        <div>
          <h2 className="text-2xl font-bold mb-1">Your Applications</h2>
          <p className="text-muted-foreground">
            Track the status of your loan applications
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {applications.map((application) => {
          const isApproved = application.status === 'approved';
          const progress = isApproved ? 100 : application.status === 'under_review' ? 50 : 25;
          
          return (
            <Card key={application.id} className="hover:shadow-md transition-shadow border-l-4" style={{ borderLeftColor: isApproved ? '#22c55e' : '#94a3b8' }}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {application.business_name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Application #{application.application_number}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-foreground">
                        <span className="font-semibold">Type:</span> {getLoanTypeDisplay(application.loan_type)}
                      </span>
                      <span className="text-foreground">
                        <span className="font-semibold">Amount:</span> {formatCurrency(application.amount_requested)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Submitted: {format(
                        new Date(application.application_submitted_date || application.application_started_date),
                        'M/d/yyyy'
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isApproved && (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        ✓ APPROVED
                      </Badge>
                    )}
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Application Progress</span>
                    <span className="font-semibold">{progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ApplicationsList;