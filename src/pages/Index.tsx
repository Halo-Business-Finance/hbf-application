import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, HelpCircle, LogIn, Home, Building2, CreditCard, Store, Banknote, TrendingUp, Sparkles, CheckCircle, ArrowRight, Shield, Building, Settings, HardHat, Handshake, FileText, RotateCcw, Zap } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
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

const Index = () => {
  const [selectedLoanType, setSelectedLoanType] = useState<number | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { authenticated, loading } = useAuth();
  
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

  // Show auth prompt for unauthenticated users
  if (!authenticated && !loading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="relative px-6 py-20 sm:px-8 lg:px-12">
            <div className="max-w-5xl mx-auto text-center">
              <div className="animate-fade-in">
                <p className="text-sm font-semibold text-primary mb-6">Enterprise Loan Solutions</p>
                <h1 className="font-playfair text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-6 leading-tight">
                  Commercial Loan
                  <span className="text-primary"> Marketplace</span>
                </h1>
                <p className="text-lg text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
                  Your premier commercial loan marketplace. Access competitive financing solutions 
                  tailored for your business growth and success.
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Auth Card */}
        <div className="px-6 pb-8 -mt-8">
          <Card className="max-w-2xl mx-auto border-0 shadow-xl animate-scale-in">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <LogIn className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground mb-2">
                Get Started Today
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Sign in or create your account to access our loan marketplace and start your application journey.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-2">
              <Button 
                size="lg" 
                className="w-full text-base font-semibold py-7 group shadow-md hover:shadow-lg"
                onClick={() => navigate('/auth')}
              >
                Access Loan Marketplace
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <div className="text-center pt-2">
                <p className="text-sm text-muted-foreground mb-2">
                  New to our platform?
                </p>
                <p className="text-xs text-muted-foreground">
                  Create your account in under 2 minutes - completely secure and confidential.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="px-6 pb-20 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: CheckCircle, title: "Fast Approval", desc: "Get pre-approved in 24 hours", color: "text-success" },
              { icon: Building2, title: "Expert Support", desc: "Dedicated loan specialists", color: "text-primary" },
              { icon: TrendingUp, title: "Best Rates", desc: "Competitive market pricing", color: "text-accent" }
            ].map((feature, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300 border-0">
                <div className={`w-12 h-12 ${feature.color} bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-foreground mb-2 text-lg">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Welcome Header for Authenticated Users */}
        {authenticated && !selectedLoanType && (
          <div className="mb-8 animate-fade-in">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back!</h1>
                <p className="text-muted-foreground">Manage your loan applications and track your progress</p>
              </div>
              <Button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>
                + New Application
              </Button>
            </div>
          </div>
        )}

        {/* My Applications Section - Shows First for Authenticated Users */}
        {!selectedLoanType && authenticated && (
          <div className="mb-12 animate-slide-up">
            <ApplicationsList />
          </div>
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
