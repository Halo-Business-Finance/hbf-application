import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
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

interface ApplicationsListProps {
  statusFilter?: string | null;
  applications?: LoanApplication[];
}

const ApplicationsList = ({ statusFilter = null, applications: externalApplications }: ApplicationsListProps) => {
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

  useEffect(() => {
    if (externalApplications) {
      setApplications(externalApplications);
      setIsLoading(false);
      return;
    }
    fetchApplications();
  }, [externalApplications]);

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
    if (!externalApplications) {
      fetchApplications();
    }
  }, [user, externalApplications]);

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
      draft: 'border-slate-300 text-slate-700 bg-slate-50',
      submitted: 'border-slate-400 text-slate-800 bg-slate-50',
      under_review: 'border-amber-400 text-amber-800 bg-amber-50',
      approved: 'border-emerald-400 text-emerald-800 bg-emerald-50',
      rejected: 'border-red-400 text-red-800 bg-red-50',
      funded: 'border-indigo-400 text-indigo-800 bg-indigo-50'
    };
    return colors[status as keyof typeof colors] || 'border-slate-300 text-slate-700 bg-slate-50';
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

  // Filter applications based on statusFilter prop
  const filteredApplications = statusFilter 
    ? applications.filter(app => {
        if (statusFilter === 'all') return true;
        if (statusFilter === 'pending') return app.status === 'under_review' || app.status === 'submitted';
        if (statusFilter === 'approved') return app.status === 'approved' || app.status === 'funded';
        return app.status === statusFilter;
      })
    : applications;

  if (filteredApplications.length === 0 && statusFilter) {
    return (
      <div>
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Applications Found</h3>
            <p className="text-muted-foreground">
              No applications match the selected filter.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusMessage = (status: string) => {
    const messages = {
      draft: { text: 'Draft - Continue Application', color: 'text-slate-700' },
      submitted: { text: 'Application Submitted', color: 'text-foreground' },
      under_review: { text: 'Under Review', color: 'text-amber-700' },
      approved: { text: 'Approved', color: 'text-emerald-700' },
      rejected: { text: 'Application Declined', color: 'text-red-700' },
      funded: { text: 'Funded', color: 'text-indigo-700' }
    };
    return messages[status as keyof typeof messages] || messages.draft;
  };

  return (
    <div>
      <div className="space-y-4">
        {filteredApplications.map((application) => {
          const statusInfo = getStatusMessage(application.status);
          const isCollapsed = collapsedCards.has(application.id);
          
          return (
            <Collapsible key={application.id} open={!isCollapsed} onOpenChange={() => toggleCard(application.id)}>
              <Card className="overflow-hidden border-2 border-blue-950 shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg bg-white">
                {/* Header Section */}
                <div className="bg-blue-950 px-4 sm:px-6 py-3 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 text-sm">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-white/70 font-semibold mb-1">Date</div>
                    <div className="font-semibold text-xs sm:text-sm text-white">
                      {format(new Date(application.application_started_date), 'MMM d, yyyy')}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-white/70 font-semibold mb-1">Amount</div>
                    <div className="font-semibold text-xs sm:text-sm text-white">{formatCurrency(application.amount_requested)}</div>
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs uppercase tracking-wide text-white/70 font-semibold mb-1">Business</div>
                    <div className="font-semibold text-xs sm:text-sm truncate text-white">{application.business_name}</div>
                  </div>
                  <div className="col-span-2 sm:col-span-1 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-xs uppercase tracking-wide text-white/70 font-semibold mb-1">Application #</div>
                      <div className="font-mono font-semibold text-xs sm:text-sm text-white">{application.application_number}</div>
                    </div>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white/10 transition-all">
                        {isCollapsed ? <ChevronDown className="h-4 w-4 text-white" /> : <ChevronUp className="h-4 w-4 text-white" />}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>

                {/* Collapsed Status Bar */}
                {isCollapsed && (
                  <div className="px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border-t border-gray-200">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <Badge variant="outline" className={`${getStatusColor(application.status)} text-xs uppercase tracking-wide font-semibold border`}>
                        {application.status.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs sm:text-sm font-medium text-gray-700">
                        {getLoanTypeDisplay(application.loan_type)}
                      </span>
                    </div>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const programId = getProgramIdForLoanType(application.loan_type);
                        if (programId) {
                          navigate(`/?id=${programId}&app=${application.id}`);
                        } else {
                          navigate(`/?id=7&app=${application.id}`);
                        }
                      }}
                      className="w-full sm:w-auto border-blue-950 text-blue-950 hover:bg-blue-950 hover:text-white transition-all"
                    >
                      View Details
                    </Button>
                  </div>
                )}

                {/* Expandable Content Section */}
                <CollapsibleContent>
                  <CardContent className="p-4 sm:p-5 bg-white border-t border-gray-200">
                    <div className="flex flex-col lg:flex-row gap-4">
                      {/* Left side - Timeline and details */}
                      <div className="flex-1 space-y-4">
                        {/* Timeline Section */}
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <LoanTimeline 
                            loanApplicationId={application.id} 
                            currentStatus={application.status}
                          />
                        </div>
                        
                        <Separator className="bg-gray-200" />
                        
                        {/* Progress Bar */}
                        <LoanProgressBar status={application.status} />
                        
                        <Separator className="bg-gray-200" />
                        
                        <div className="mb-2">
                          <div className={`text-sm sm:text-base font-semibold ${statusInfo.color}`}>
                            {statusInfo.text}
                          </div>
                        </div>
                        
                        <div className="flex gap-3 mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm sm:text-base mb-1 text-gray-900">
                              {getLoanTypeDisplay(application.loan_type)}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 mb-1">
                              {application.first_name} {application.last_name} • {application.business_name}
                            </p>
                            {application.status === 'draft' && (
                              <p className="text-xs text-gray-600">
                                Started on {format(new Date(application.application_started_date), 'MMM d, yyyy')}
                              </p>
                            )}
                            {application.application_submitted_date && (
                              <p className="text-xs text-gray-600">
                                Submitted on {format(new Date(application.application_submitted_date), 'MMM d, yyyy')}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          {['draft', 'submitted', 'under_review'].includes(application.status) ? (
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const programId = getProgramIdForLoanType(application.loan_type);
                                if (programId) {
                                  navigate(`/?id=${programId}&app=${application.id}`);
                                } else {
                                  navigate(`/?id=7&app=${application.id}`);
                                }
                              }}
                              className="w-full sm:w-auto border-blue-950 text-blue-950 hover:bg-blue-950 hover:text-white transition-all font-semibold"
                            >
                              Continue Application
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" className="w-full sm:w-auto border-blue-950 text-blue-950 hover:bg-blue-950 hover:text-white transition-all font-semibold">
                              View Application
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="w-full sm:w-auto text-gray-700 hover:bg-gray-100 transition-all">
                            Download PDF
                          </Button>
                        </div>
                      </div>

                      {/* Right side - Action buttons */}
                      <div className="flex flex-col gap-2 w-full lg:min-w-[180px] lg:border-l lg:border-gray-200 lg:pl-4">
                        <div className="text-xs uppercase tracking-wide text-gray-600 font-semibold mb-1">Actions</div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full justify-start text-gray-700 hover:bg-gray-100 transition-all text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCard(application.id);
                          }}
                        >
                          View Status
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full justify-start text-gray-700 hover:bg-gray-100 transition-all text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/document-storage');
                          }}
                        >
                          Upload Documents
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full justify-start text-gray-700 hover:bg-gray-100 transition-all text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/support');
                          }}
                        >
                          Contact Support
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full justify-start text-gray-700 hover:bg-gray-100 transition-all text-sm"
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