import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Calendar, DollarSign, FileText, User, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { LoanProgressBar } from '@/components/LoanProgressBar';
import { LoanTimeline } from '@/components/LoanTimeline';

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
  const [collapsedCards, setCollapsedCards] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const toggleCard = (id: string) => {
    setCollapsedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

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

  // Map DB loan_type to Index page loan program id
  const getProgramIdForLoanType = (loanType: string): number | null => {
    const map: Record<string, number> = {
      refinance: 11,
      bridge_loan: 4,
      working_capital: 7,
      factoring: 10,
    };
    return map[loanType] ?? null;
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

  const getStatusMessage = (status: string) => {
    const messages = {
      draft: { text: 'Draft - Continue Application', color: 'text-gray-700' },
      submitted: { text: 'Application Submitted', color: 'text-foreground' },
      under_review: { text: 'Under Review', color: 'text-foreground' },
      approved: { text: 'Approved', color: 'text-green-700' },
      rejected: { text: 'Application Declined', color: 'text-red-700' },
      funded: { text: 'Funded', color: 'text-purple-700' }
    };
    return messages[status as keyof typeof messages] || messages.draft;
  };

  return (
    <div>
      <div className="space-y-4">
        {applications.map((application) => {
          const statusInfo = getStatusMessage(application.status);
          const isCollapsed = collapsedCards.has(application.id);
          
          return (
            <Collapsible key={application.id} open={!isCollapsed} onOpenChange={() => toggleCard(application.id)}>
              <Card className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
                {/* Header Section */}
                <div className="bg-muted/30 px-3 sm:px-6 py-3 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 text-sm border-b">
                  <div>
                    <div className="text-xs text-muted-foreground font-medium mb-1">DATE</div>
                    <div className="font-medium text-xs sm:text-sm">
                      {format(new Date(application.application_started_date), 'MMM d, yyyy')}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-medium mb-1">AMOUNT</div>
                    <div className="font-medium text-xs sm:text-sm">{formatCurrency(application.amount_requested)}</div>
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs text-muted-foreground font-medium mb-1">BUSINESS</div>
                    <div className="font-medium text-xs sm:text-sm truncate">{application.business_name}</div>
                  </div>
                  <div className="col-span-2 sm:col-span-1 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground font-medium mb-1">APPLICATION #</div>
                      <div className="font-medium text-primary text-xs sm:text-sm">{application.application_number}</div>
                    </div>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>

                {/* Collapsed Status Bar */}
                {isCollapsed && (
                  <div className="px-3 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <Badge className={getStatusColor(application.status)}>
                        {application.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <span className="text-xs sm:text-sm font-medium">
                        {getLoanTypeDisplay(application.loan_type)}
                      </span>
                    </div>
                    <Button 
                      variant="default"
                      size="sm"
                      onClick={() => {
                        const programId = getProgramIdForLoanType(application.loan_type);
                        if (programId) {
                          navigate(`/?id=${programId}&app=${application.id}`);
                        } else {
                          navigate(`/?id=7&app=${application.id}`);
                        }
                      }}
                      className="w-full sm:w-auto"
                    >
                      View
                    </Button>
                  </div>
                )}

                {/* Expandable Content Section */}
                <CollapsibleContent>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Left side - Timeline and details */}
                      <div className="flex-1 space-y-6">
                        {/* Timeline */}
                        <LoanTimeline 
                          loanApplicationId={application.id} 
                          currentStatus={application.status}
                        />
                        
                        {/* Progress Bar */}
                        <LoanProgressBar status={application.status} />
                        
                        <div className="mb-3">
                          <div className={`text-base sm:text-lg font-semibold ${statusInfo.color}`}>
                            {statusInfo.text}
                          </div>
                        </div>
                        
                        <div className="flex gap-4 mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm sm:text-base mb-1">
                              {getLoanTypeDisplay(application.loan_type)}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                              {application.first_name} {application.last_name} • {application.business_name}
                            </p>
                            {application.status === 'draft' && (
                              <p className="text-xs text-muted-foreground">
                                Started on {format(new Date(application.application_started_date), 'MMM d, yyyy')}
                              </p>
                            )}
                            {application.application_submitted_date && (
                              <p className="text-xs text-muted-foreground">
                                Submitted on {format(new Date(application.application_submitted_date), 'MMM d, yyyy')}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          {['draft', 'submitted', 'under_review'].includes(application.status) ? (
                            <Button 
                              variant="default"
                              size="sm"
                              onClick={() => {
                                const programId = getProgramIdForLoanType(application.loan_type);
                                if (programId) {
                                  navigate(`/?id=${programId}&app=${application.id}`);
                                } else {
                                  navigate(`/?id=7&app=${application.id}`);
                                }
                              }}
                              className="w-full sm:w-auto"
                            >
                              Continue Application
                            </Button>
                          ) : (
                            <Button variant="default" size="sm" className="w-full sm:w-auto">
                              View Application
                            </Button>
                          )}
                          <Button variant="outline" size="sm" className="w-full sm:w-auto">
                            Download PDF
                          </Button>
                        </div>
                      </div>

                      {/* Right side - Action buttons */}
                      <div className="flex flex-col gap-2 w-full lg:min-w-[200px]">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCard(application.id);
                          }}
                        >
                          View Status
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/document-storage');
                          }}
                        >
                          Upload Documents
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/support');
                          }}
                        >
                          Contact Support
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.print();
                          }}
                        >
                          Print Application
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
};

export default ApplicationsList;