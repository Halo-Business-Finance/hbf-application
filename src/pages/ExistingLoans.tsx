import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ModernTabs, ModernTabsContent, ModernTabsList, ModernTabsTrigger } from '@/components/ui/modern-tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Wallet, 
  Building2, 
  DollarSign, 
  Calendar, 
  Percent, 
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface ExistingLoan {
  id: string;
  loanType: 'commercial' | 'business';
  loanName: string;
  lender: string;
  loanBalance: number;
  originalAmount: number;
  monthlyPayment: number;
  interestRate: number;
  termMonths: number;
  remainingMonths: number;
  maturityDate: string;
  originationDate: string;
  hasPrepaymentPenalty: boolean;
  prepaymentPeriodEndDate?: string;
  status: 'current' | 'funded_by_us' | 'partner_funded';
  loanPurpose: string;
}

const ExistingLoans = () => {
  const { authenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [loadingData, setLoadingData] = useState(true);
  const [commercialLoans, setCommercialLoans] = useState<ExistingLoan[]>([]);
  const [businessLoans, setBusinessLoans] = useState<ExistingLoan[]>([]);

  useEffect(() => {
    if (!loading && !authenticated) {
      navigate('/');
      return;
    }

    if (authenticated) {
      loadExistingLoans();
    }
  }, [authenticated, loading, navigate]);

  const loadExistingLoans = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please log in to view your loans');
        return;
      }

      const { data: loans, error } = await supabase
        .from('existing_loans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching existing loans:', error);
        toast.error('Failed to load existing loans');
        return;
      }

      // Transform database records to component format
      const transformedLoans: ExistingLoan[] = (loans || []).map(loan => ({
        id: loan.id,
        loanType: loan.loan_type as 'commercial' | 'business',
        loanName: loan.loan_name,
        lender: loan.lender,
        loanBalance: Number(loan.loan_balance),
        originalAmount: Number(loan.original_amount),
        monthlyPayment: Number(loan.monthly_payment),
        interestRate: Number(loan.interest_rate),
        termMonths: loan.term_months,
        remainingMonths: loan.remaining_months,
        maturityDate: loan.maturity_date,
        originationDate: loan.origination_date,
        hasPrepaymentPenalty: loan.has_prepayment_penalty,
        prepaymentPeriodEndDate: loan.prepayment_period_end_date,
        status: loan.status as 'current' | 'funded_by_us' | 'partner_funded',
        loanPurpose: loan.loan_purpose
      }));

      // Separate by loan type
      const commercial = transformedLoans.filter(loan => loan.loanType === 'commercial');
      const business = transformedLoans.filter(loan => loan.loanType === 'business');

      setCommercialLoans(commercial);
      setBusinessLoans(business);
    } catch (error) {
      console.error('Error loading existing loans:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoadingData(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      current: { variant: 'secondary' as const, label: 'Current', className: 'bg-blue-100 text-blue-800' },
      funded_by_us: { variant: 'default' as const, label: 'Funded by Us', className: 'bg-green-100 text-green-800' },
      partner_funded: { variant: 'default' as const, label: 'Partner Funded', className: 'bg-purple-100 text-purple-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.current;

    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculatePayoffPercentage = (balance: number, original: number) => {
    return ((original - balance) / original) * 100;
  };

  const calculateTotalBalance = (loans: ExistingLoan[]) => {
    return loans.reduce((sum, loan) => sum + loan.loanBalance, 0);
  };

  const calculateTotalMonthlyPayment = (loans: ExistingLoan[]) => {
    return loans.reduce((sum, loan) => sum + loan.monthlyPayment, 0);
  };

  const renderLoanCard = (loan: ExistingLoan) => {
    const payoffPercentage = calculatePayoffPercentage(loan.loanBalance, loan.originalAmount);

    return (
      <Card key={loan.id} className="overflow-hidden">
        <CardHeader className="bg-muted/30">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                {loan.loanName}
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {loan.lender}
              </CardDescription>
            </div>
            {getStatusBadge(loan.status)}
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Loan Balance Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Current Balance</span>
              <span className="text-2xl font-bold text-primary">{formatCurrency(loan.loanBalance)}</span>
            </div>
            <Progress value={payoffPercentage} className="h-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Original: {formatCurrency(loan.originalAmount)}</span>
              <span>{payoffPercentage.toFixed(1)}% paid off</span>
            </div>
          </div>

          {/* Payment Details Grid */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="w-4 h-4" />
                Monthly Payment
              </div>
              <p className="text-lg font-semibold">{formatCurrency(loan.monthlyPayment)}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Percent className="w-4 h-4" />
                Interest Rate
              </div>
              <p className="text-lg font-semibold">{loan.interestRate}%</p>
            </div>
          </div>

          {/* Term Details Grid */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                Term
              </div>
              <p className="font-semibold">{loan.termMonths} months</p>
              <p className="text-xs text-muted-foreground">{loan.remainingMonths} remaining</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Maturity Date
              </div>
              <p className="font-semibold">{formatDate(loan.maturityDate)}</p>
            </div>
          </div>

          {/* Prepayment Penalty Section */}
          <div className="pt-4 border-t">
            {loan.hasPrepaymentPenalty ? (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-amber-900">Prepayment Penalty Period</p>
                  <p className="text-xs text-amber-700">
                    Ends: {loan.prepaymentPeriodEndDate ? formatDate(loan.prepaymentPeriodEndDate) : 'N/A'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-sm font-medium text-green-900">No Prepayment Penalty</p>
              </div>
            )}
          </div>

          {/* Additional Details */}
          <div className="pt-4 border-t space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Loan Purpose</span>
              <span className="font-medium">{loan.loanPurpose}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Origination Date</span>
              <span className="font-medium">{formatDate(loan.originationDate)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading existing loans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold tracking-tight mb-2">Existing Loans</h1>
          <p className="text-muted-foreground">
            View your commercial and business loans funded by us, partners, or third parties
          </p>
        </div>

        <Tabs defaultValue="commercial" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="commercial">Commercial Loans</TabsTrigger>
            <TabsTrigger value="business">Business Loans</TabsTrigger>
          </TabsList>

          <TabsContent value="commercial" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs">Total Balance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(calculateTotalBalance(commercialLoans))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs">Total Monthly Payments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(calculateTotalMonthlyPayment(commercialLoans))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs">Active Loans</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{commercialLoans.length}</div>
                </CardContent>
              </Card>
            </div>

            {/* Loan Cards */}
            {commercialLoans.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {commercialLoans.map(renderLoanCard)}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No Commercial Loans</h3>
                  <p className="text-sm text-muted-foreground">
                    Your commercial loans will appear here once pulled from third-party APIs or funded
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="business" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs">Total Balance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(calculateTotalBalance(businessLoans))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs">Total Monthly Payments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(calculateTotalMonthlyPayment(businessLoans))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs">Active Loans</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{businessLoans.length}</div>
                </CardContent>
              </Card>
            </div>

            {/* Loan Cards */}
            {businessLoans.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {businessLoans.map(renderLoanCard)}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No Business Loans</h3>
                  <p className="text-sm text-muted-foreground">
                    Your business loans will appear here once pulled from third-party APIs or funded
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ExistingLoans;
