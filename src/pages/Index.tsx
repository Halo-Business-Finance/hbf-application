import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, HelpCircle, LogIn, Home, Building2, CreditCard, Store, Banknote, TrendingUp, Sparkles, CheckCircle, ArrowRight, Shield, Building, Settings, HardHat, Handshake, FileText, RotateCcw, Zap, DollarSign, Clock, Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ApplicationsList from "@/components/ApplicationsList";
import RefinanceForm from "@/components/forms/RefinanceForm";
import BridgeLoanForm from "@/components/forms/BridgeLoanForm";
import WorkingCapitalForm from "@/components/forms/WorkingCapitalForm";
import SBA7aLoanForm from "@/components/forms/SBA7aLoanForm";
import SBA504LoanForm from "@/components/forms/SBA504LoanForm";
import EquipmentFinancingForm from "@/components/forms/EquipmentFinancingForm";
import { USDABILoanForm } from "@/components/forms/USDABILoanForm";
import { ConventionalLoanForm } from "@/components/forms/ConventionalLoanForm";
import { TermLoanForm } from "@/components/forms/TermLoanForm";
import { BusinessLineOfCreditForm } from "@/components/forms/BusinessLineOfCreditForm";
import InvoiceFactoringForm from "@/components/forms/InvoiceFactoringForm";
import SBAExpressLoanForm from "@/components/forms/SBAExpressLoanForm";
import { supabase } from "@/integrations/supabase/client";

const FundedLoansView = ({ userId }: { userId?: string }) => {
  const [fundedLoans, setFundedLoans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFundedLoans = async () => {
      if (!userId) return;

      const { data } = await supabase
        .from('loan_applications')
        .select('*')
        .eq('user_id', userId)
        .in('status', ['funded', 'approved'])
        .order('application_submitted_date', { ascending: false });

      setFundedLoans(data || []);
      setIsLoading(false);
    };

    fetchFundedLoans();
  }, [userId]);

  const getLoanTypeDisplay = (loanType: string) => {
    const types = {
      refinance: 'Refinance',
      bridge_loan: 'Bridge Loan',
      working_capital: 'Working Capital',
      sba_7a: 'SBA 7(a)',
      sba_504: 'SBA 504',
      equipment_financing: 'Equipment Financing',
      term_loan: 'Term Loan',
      business_line_of_credit: 'Business Line of Credit'
    };
    return types[loanType as keyof typeof types] || loanType;
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
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (fundedLoans.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <CheckCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Funded Loans</h3>
          <p className="text-muted-foreground">You don't have any funded or closed loans yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-start gap-3">
        <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
        <div>
          <h2 className="text-2xl font-bold mb-1">Your Funded Loans</h2>
          <p className="text-muted-foreground">
            Track your active and closed loans
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {fundedLoans.map((loan) => (
          <Card key={loan.id} className="hover:shadow-md transition-shadow border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    {loan.business_name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Application #{loan.application_number}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-foreground">
                      <span className="font-semibold">Type:</span> {getLoanTypeDisplay(loan.loan_type)}
                    </span>
                    <span className="text-foreground">
                      <span className="font-semibold">Amount:</span> {formatCurrency(loan.amount_requested)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Funded: {loan.application_submitted_date ? new Date(loan.application_submitted_date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    {loan.status === 'funded' ? '✓ FUNDED' : '✓ APPROVED'}
                  </Badge>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const DashboardView = () => {
  const [stats, setStats] = useState({
    totalApplications: 0,
    approvedAmount: 0,
    pendingReview: 0,
    successRate: 0
  });
  const { user } = useAuth();
  const [firstName, setFirstName] = useState<string | null>(null);
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      // Fetch user's first name from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name')
        .eq('id', user.id)
        .maybeSingle();

      setFirstName(profile?.first_name ?? null);

      const { data: applications } = await supabase
        .from('loan_applications')
        .select('*')
        .eq('user_id', user.id);

      if (applications) {
        const total = applications.length;
        const approved = applications.filter(app => app.status === 'approved').length;
        const pending = applications.filter(app => app.status === 'under_review' || app.status === 'submitted').length;
        const approvedSum = applications
          .filter(app => app.status === 'approved')
          .reduce((sum, app) => sum + (app.amount_requested || 0), 0);

        setStats({
          totalApplications: total,
          approvedAmount: approvedSum,
          pendingReview: pending,
          successRate: total > 0 ? Math.round((approved / total) * 100) : 0
        });
      }
    };

    fetchStats();
  }, [user]);

  return (
    <div className="space-y-8 mb-12">
      {/* Welcome Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back{firstName ? `, ${firstName}` : ''}!</h1>
          <p className="text-muted-foreground">Manage your loan applications and track your progress</p>
        </div>
        <Button size="lg" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>
          + New Application
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Applications</p>
              <p className="text-3xl font-bold">{stats.totalApplications}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Approved Amount</p>
              <p className="text-3xl font-bold">${stats.approvedAmount.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pending Review</p>
              <p className="text-3xl font-bold">{stats.pendingReview}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Success Rate</p>
              <p className="text-3xl font-bold">{stats.successRate}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="applications" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="applications">My Applications</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="loans">Loans</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="mt-6">
          <ApplicationsList />
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardContent className="p-12 text-center">
              <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Recent Activity</h3>
              <p className="text-muted-foreground">Your recent application activity will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loans" className="mt-6">
          <FundedLoansView userId={user?.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Index = () => {
  const [selectedLoanType, setSelectedLoanType] = useState<number | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { authenticated, loading, signIn, signUp } = useAuth();
  const { toast } = useToast();
  
  // Auth form state - must be at top level, not conditional
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  
  const loanTypeId = searchParams.get('id');

  useEffect(() => {
    if (loanTypeId) {
      setSelectedLoanType(parseInt(loanTypeId));
    }
  }, [loanTypeId]);

  const loanPrograms = [
    {
      id: 1,
      title: "SBA 7(a) Loans",
      icon: Shield,
      description: "Versatile financing for working capital, equipment, and real estate purchases",
      badge: "Prime + 2.75%",
      badgeColor: "bg-primary",
      details: "Up to $5 million | Long-term financing | Most popular SBA program"
    },
    {
      id: 2,
      title: "SBA 504 Loans", 
      icon: Building,
      description: "Fixed-rate financing for real estate and major equipment purchases",
      badge: "Fixed Rate",
      badgeColor: "bg-primary",
      details: "Up to $5.5 million | 10% down payment | Long-term fixed rates"
    },
    {
      id: 3,
      title: "USDA B&I Loans",
      icon: Shield,
      description: "Rural business development financing backed by USDA guarantee",
      badge: "Prime + 2%",
      badgeColor: "bg-primary",
      details: "Up to $25 million | Rural area focus | Job creation requirements"
    },
    {
      id: 4,
      title: "Bridge Loans",
      icon: Building2, 
      description: "Short-term financing to bridge cash flow gaps while securing permanent financing",
      badge: "8.5% APR",
      badgeColor: "bg-accent",
      details: "Fast 7-day closing | Up to $10 million | Quick access to capital"
    },
    {
      id: 5,
      title: "Conventional Loans",
      icon: CreditCard,
      description: "Traditional commercial financing for established businesses with strong credit profiles",
      badge: "5.25% APR",
      badgeColor: "bg-accent",
      details: "No government guarantee | Faster approval | Flexible terms"
    },
    {
      id: 6,
      title: "Equipment Financing",
      icon: Settings,
      description: "Fund new or used equipment purchases with competitive terms",
      badge: "6.25% APR",
      badgeColor: "bg-accent",
      details: "100% financing available | Fast approval | Equipment as collateral"
    },
    {
      id: 7,
      title: "Working Capital",
      icon: TrendingUp,
      description: "Bridge cash flow gaps and fund day-to-day business operations",
      badge: "Prime + 1%",
      badgeColor: "bg-accent",
      details: "Revolving credit line | Quick access | Fund daily operations"
    },
    {
      id: 8,
      title: "Business Line of Credit",
      icon: CreditCard,
      description: "Flexible access to capital when you need it with revolving credit lines",
      badge: "Prime + 2%",
      badgeColor: "bg-accent",
      details: "Draw as needed | Pay interest only on used funds | Revolving credit"
    },
    {
      id: 9,
      title: "Term Loans",
      icon: Banknote,
      description: "Fixed-rate business loans for major investments and growth initiatives",
      badge: "5.75% APR",
      badgeColor: "bg-accent",
      details: "Fixed monthly payments | Competitive rates | Major investments"
    },
    {
      id: 10,
      title: "Invoice Factoring",
      icon: FileText,
      description: "Convert outstanding invoices into immediate cash flow for your business",
      badge: "1.5% Factor",
      badgeColor: "bg-accent",
      details: "90% advance rate | Same-day funding | No debt on balance sheet"
    },
    {
      id: 11,
      title: "Refinance Loans",
      icon: RotateCcw,
      description: "Refinance existing debt to improve cash flow and reduce monthly payments",
      badge: "4.5% APR",
      badgeColor: "bg-accent",
      details: "Lower payments | Improved terms | Debt consolidation"
    },
    {
      id: 12,
      title: "SBA Express Loans",
      icon: Zap,
      description: "Fast-track SBA financing with expedited approval process",
      badge: "Prime + 4.5%",
      badgeColor: "bg-primary",
      details: "Up to $500K | 36-hour approval | Express processing"
    }
  ];

  const handleLoanTypeSelect = (id: number) => {
    setSelectedLoanType(id);
    navigate(`/?id=${id}`);
  };

  const handleBackToHome = () => {
    navigate('/');
    setSelectedLoanType(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center animate-fade-in">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin border-t-primary mx-auto"></div>
            <Sparkles className="w-6 h-6 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Loading Your Dashboard</h3>
          <p className="text-sm text-muted-foreground">Preparing your loan application experience...</p>
        </div>
      </div>
    );
  }

  // Auth form handlers
  const handleAuthSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setAuthError("");
      setAuthLoading(true);

      try {
        if (!isLogin) {
          // Validation for signup
          if (password !== confirmPassword) {
            setAuthError("Passwords do not match");
            setAuthLoading(false);
            return;
          }
          if (password.length < 6) {
            setAuthError("Password must be at least 6 characters long");
            setAuthLoading(false);
            return;
          }
          if (!firstName.trim() || !lastName.trim()) {
            setAuthError("First name and last name are required");
            setAuthLoading(false);
            return;
          }

          const { error } = await signUp(email, password);
          
          if (error) {
            if (error.message?.includes("User already registered")) {
              setAuthError("An account with this email already exists. Please sign in instead.");
            } else if (error.message?.includes("Invalid email")) {
              setAuthError("Please enter a valid email address");
            } else {
              setAuthError(error.message || "Failed to create account");
            }
          } else {
            setTimeout(() => {
              toast({
                title: "Account created successfully!",
                description: "Please check your email to verify your account, then sign in.",
              });
            }, 7000);
            setIsLogin(true);
            setPassword("");
            setConfirmPassword("");
          }
        } else {
          // Sign in
          const { error } = await signIn(email, password);
          
          if (error) {
            if (error.message?.includes("Invalid login credentials")) {
              setAuthError("Invalid email or password. Please check your credentials and try again.");
            } else if (error.message?.includes("Email not confirmed")) {
              setAuthError("Please check your email and click the confirmation link before signing in.");
            } else {
              setAuthError(error.message || "Failed to sign in");
            }
          } else {
            toast({
              title: "Welcome back!",
              description: "You have successfully signed in.",
            });
          }
        }
      } catch (err) {
        setAuthError("An unexpected error occurred. Please try again.");
      } finally {
        setAuthLoading(false);
      }
  };

  const handleMicrosoftSignIn = async () => {
      setAuthLoading(true);
      setAuthError("");
      
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'azure',
          options: {
            redirectTo: `${window.location.origin}/`
          }
        });
        
        if (error) {
          setAuthError(error.message || "Failed to sign in with Microsoft");
        }
      } catch (err) {
        setAuthError("An unexpected error occurred. Please try again.");
      } finally {
        setAuthLoading(false);
      }
  };

  const resetForm = () => {
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setFirstName("");
      setLastName("");
      setAuthError("");
  };

  const switchMode = (mode: string) => {
    setIsLogin(mode === "login");
    resetForm();
  };

  // Show auth forms for unauthenticated users
  if (!authenticated && !loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-12">
        {/* Auth Card */}
        <div className="px-6 w-full">
          <Card className="max-w-xl mx-auto shadow-xl">
            <CardHeader className="text-center pb-4 pt-8">
              <CardTitle className="text-3xl font-bold text-foreground mb-2">
                Welcome to Halo Business Finance
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Sign in to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <Tabs value={isLogin ? "login" : "signup"} onValueChange={switchMode} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-4 mt-0">
                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground font-normal">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={authLoading}
                        className="h-11"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-foreground font-normal">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={authLoading}
                          className="h-11 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={authLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <Eye className="h-5 w-5 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {authError && (
                      <Alert variant="destructive">
                        <AlertDescription>{authError}</AlertDescription>
                      </Alert>
                    )}

                    <Button type="submit" className="w-full h-12 text-base font-medium" disabled={authLoading}>
                      {authLoading ? "Signing in..." : "Sign In"}
                    </Button>
                    
                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-3 text-muted-foreground tracking-wider">
                          OR CONTINUE WITH
                        </span>
                      </div>
                    </div>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full h-12 text-base" 
                      onClick={handleMicrosoftSignIn}
                      disabled={authLoading}
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 23 23">
                        <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                        <path fill="#f35325" d="M1 1h10v10H1z"/>
                        <path fill="#81bc06" d="M12 1h10v10H12z"/>
                        <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                        <path fill="#ffba08" d="M12 12h10v10H12z"/>
                      </svg>
                      Continue with Microsoft
                    </Button>
                    
                    <div className="text-center pt-2">
                      <Button 
                        type="button" 
                        variant="link" 
                        className="text-base text-muted-foreground hover:text-foreground p-0 h-auto"
                        onClick={async () => {
                          if (!email) {
                            setAuthError("Please enter your email address first");
                            return;
                          }
                          setAuthLoading(true);
                          const { error } = await supabase.auth.resetPasswordForEmail(email, {
                            redirectTo: `${window.location.origin}/auth?type=recovery`
                          });
                          setAuthLoading(false);
                          if (error) {
                            setAuthError(error.message);
                          } else {
                            toast({
                              title: "Password reset email sent!",
                              description: "Check your email for the reset link.",
                            });
                          }
                        }}
                      >
                        Forgot your password?
                      </Button>
                    </div>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup" className="space-y-4 mt-0">
                  <form onSubmit={handleAuthSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-foreground font-normal">First Name</Label>
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="First name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                          disabled={authLoading}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-foreground font-normal">Last Name</Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Last name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                          disabled={authLoading}
                          className="h-11"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signupEmail" className="text-foreground font-normal">Email</Label>
                      <Input
                        id="signupEmail"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={authLoading}
                        className="h-11"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signupPassword" className="text-foreground font-normal">Password</Label>
                      <div className="relative">
                        <Input
                          id="signupPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={authLoading}
                          minLength={6}
                          className="h-11 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={authLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <Eye className="h-5 w-5 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-foreground font-normal">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={authLoading}
                        minLength={6}
                        className="h-11"
                      />
                    </div>

                    {authError && (
                      <Alert variant="destructive">
                        <AlertDescription>{authError}</AlertDescription>
                      </Alert>
                    )}

                    <Button type="submit" className="w-full h-12 text-base font-medium" disabled={authLoading}>
                      {authLoading ? "Creating account..." : "Sign Up"}
                    </Button>
                    
                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-3 text-muted-foreground tracking-wider">
                          OR CONTINUE WITH
                        </span>
                      </div>
                    </div>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full h-12 text-base" 
                      onClick={handleMicrosoftSignIn}
                      disabled={authLoading}
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 23 23">
                        <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                        <path fill="#f35325" d="M1 1h10v10H1z"/>
                        <path fill="#81bc06" d="M12 1h10v10H12z"/>
                        <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                        <path fill="#ffba08" d="M12 12h10v10H12z"/>
                      </svg>
                      Continue with Microsoft
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Terms text below card */}
          <p className="text-center text-sm text-muted-foreground mt-6 max-w-xl mx-auto">
            By signing up, you agree to our terms of service and privacy policy.
          </p>
        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Dashboard for Authenticated Users */}
        {authenticated && !selectedLoanType && (
          <DashboardView />
        )}

        {/* Header for Unauthenticated or When Viewing Forms */}
        {(!authenticated || selectedLoanType) && (
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Nationwide SBA & Commercial Financing</span>
            </div>
            <h1 className="font-playfair text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-4">
              Comprehensive Business Financing Solutions
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
              We provide credit, financing, treasury and payment solutions to help your business succeed. 
              Discover our comprehensive range of SBA-backed and conventional financing options designed to fuel your business growth.
            </p>
            
            {/* Company Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <Card className="p-6 border-0">
                <div className="text-3xl font-bold text-primary mb-1">2,500+</div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Happy Clients</div>
              </Card>
              <Card className="p-6 border-0">
                <div className="text-3xl font-bold text-primary mb-1">$2.5B+</div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Funding Provided</div>
              </Card>
              <Card className="p-6 border-0">
                <div className="text-3xl font-bold text-primary mb-1">95%</div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Approval Rate</div>
              </Card>
              <Card className="p-6 border-0">
                <div className="text-3xl font-bold text-primary mb-1">7 Days</div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Avg Processing</div>
              </Card>
            </div>
          </div>
        )}

        {/* Back Button */}
        {selectedLoanType && (
          <div className="mb-8 animate-slide-up">
            <Alert className="border-primary/20 bg-primary/5">
              <AlertDescription className="flex items-center justify-between">
                <Button 
                  variant="ghost" 
                  onClick={handleBackToHome}
                  className="p-0 h-auto text-primary hover:text-primary/80 font-semibold group"
                >
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Return to Loan Types
                </Button>
                <span className="text-sm text-muted-foreground">
                  Your progress will be saved as a draft
                </span>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Loan Type Selection */}
        {!selectedLoanType && (
          <Card className="mb-12 border-0 shadow-lg animate-scale-in">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl font-bold text-foreground mb-3">
                Explore Our 12 Comprehensive Financing Programs
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Select the financing solution that best fits your business needs
              </CardDescription>
              <p className="text-sm text-muted-foreground mt-2">Click on any option to get started with your application</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loanPrograms.map((program, index) => {
                  const IconComponent = program.icon;
                  const isComingSoon = ![1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].includes(program.id);
                  return (
                    <Card
                      key={program.id}
                      className={`cursor-pointer transition-all duration-300 overflow-hidden border-0 flex flex-col h-full ${
                        isComingSoon 
                          ? 'opacity-60 cursor-not-allowed' 
                          : 'hover:scale-[1.02] hover:shadow-xl'
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Blue Header Section */}
                      <div className="bg-primary p-4 text-white">
                        <div className="flex justify-center mb-2">
                          <IconComponent className="w-10 h-10" />
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-center">
                          {program.title}
                        </h3>
                        <p className="text-xs text-center leading-relaxed opacity-90 line-clamp-2">
                          {program.description}
                        </p>
                      </div>

                      {/* White Body Section */}
                      <CardContent className="p-4 flex-1 flex flex-col">
                        <div className="mb-4">
                          <div className="text-xl font-bold text-foreground mb-0.5">
                            {program.badge}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Starting Rate
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="font-semibold text-sm text-foreground mb-1">
                            Loan Terms
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {program.details?.split('|')[0]?.trim() || 'Contact for details'}
                          </div>
                        </div>

                        <ul className="space-y-1.5 mb-4 flex-1">
                          {program.details?.split('|').slice(1, 3).map((detail, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                              <div className="w-1 h-1 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                              <span className="line-clamp-1">{detail.trim()}</span>
                            </li>
                          ))}
                        </ul>

                        <Button 
                          className="w-full font-semibold text-sm py-2"
                          onClick={() => !isComingSoon && handleLoanTypeSelect(program.id)}
                          disabled={isComingSoon}
                        >
                          {isComingSoon ? 'Coming Soon' : 'Apply Now'}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loan Application Forms */}
        {selectedLoanType && (
          <div className="space-y-6 animate-fade-in">
            {/* Active Forms */}
            {selectedLoanType === 1 && <SBA7aLoanForm />}
            {selectedLoanType === 2 && <SBA504LoanForm />}
            {selectedLoanType === 3 && <USDABILoanForm />}
            {selectedLoanType === 4 && <BridgeLoanForm />}
            {selectedLoanType === 5 && <ConventionalLoanForm />}
            {selectedLoanType === 6 && <EquipmentFinancingForm />}
            {selectedLoanType === 7 && <WorkingCapitalForm />}
            {selectedLoanType === 8 && <BusinessLineOfCreditForm />}
            {selectedLoanType === 9 && <TermLoanForm />}
            {selectedLoanType === 10 && <InvoiceFactoringForm />}
            {selectedLoanType === 11 && <RefinanceForm />}
            {selectedLoanType === 12 && <SBAExpressLoanForm />}
            
            {/* Coming Soon Forms */}
            {selectedLoanType === 1 && (
              <Card className="shadow-lg">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">SBA 7(a) Loan Application</CardTitle>
                  <CardDescription className="text-lg">
                    Versatile financing for working capital, equipment, and real estate purchases
                    <br />
                    <span className="text-sm text-muted-foreground">Prime + 2.75% Starting Rate • Up to $5M • SBA Guarantee</span>
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
            {selectedLoanType === 2 && (
              <Card className="shadow-lg">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">SBA 504 Loan Application</CardTitle>
                  <CardDescription className="text-lg">
                    Fixed-rate financing for real estate and major equipment purchases
                    <br />
                    <span className="text-sm text-muted-foreground">Fixed Rate Long-term • Up to $5.5M • 10% Down Payment</span>
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
            {selectedLoanType === 3 && (
              <Card className="shadow-lg">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">USDA B&I Loan Application</CardTitle>
                  <CardDescription className="text-lg">
                    Rural business development financing backed by USDA guarantee
                    <br />
                    <span className="text-sm text-muted-foreground">Prime + 2% Starting Rate • Up to $25M • Rural Focus • Job Creation Requirements</span>
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
            {selectedLoanType === 5 && (
              <Card className="shadow-lg">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-accent" />
                  </div>
                  <CardTitle className="text-2xl">Conventional Loan Application</CardTitle>
                  <CardDescription className="text-lg">
                    Traditional commercial financing for established businesses
                    <br />
                    <span className="text-sm text-muted-foreground">5.25% Starting APR • No Government Guarantee • Fast Approval</span>
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
            {selectedLoanType === 6 && (
              <Card className="shadow-lg">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-8 h-8 text-accent" />
                  </div>
                  <CardTitle className="text-2xl">Equipment Financing Application</CardTitle>
                  <CardDescription className="text-lg">
                    Fund new or used equipment purchases with competitive terms
                    <br />
                    <span className="text-sm text-muted-foreground">6.25% Starting APR • 100% Financing Available • Fast Approval</span>
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
            {selectedLoanType === 8 && (
              <Card className="shadow-lg">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-accent" />
                  </div>
                  <CardTitle className="text-2xl">Business Line of Credit Application</CardTitle>
                  <CardDescription className="text-lg">
                    Flexible access to capital when you need it with revolving credit lines
                    <br />
                    <span className="text-sm text-muted-foreground">Prime + 2% Starting Rate • Draw as Needed • Revolving Credit</span>
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
            {selectedLoanType === 9 && (
              <Card className="shadow-lg">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Banknote className="w-8 h-8 text-accent" />
                  </div>
                  <CardTitle className="text-2xl">Term Loan Application</CardTitle>
                  <CardDescription className="text-lg">
                    Fixed-rate business loans for major investments and growth initiatives
                    <br />
                    <span className="text-sm text-muted-foreground">5.75% Starting APR • Fixed Monthly Payments • Quick Approval</span>
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Index;
