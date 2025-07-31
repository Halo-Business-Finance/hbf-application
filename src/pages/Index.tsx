import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, HelpCircle, LogIn, Home, Building2, CreditCard, Store, Banknote, TrendingUp, Sparkles, CheckCircle, ArrowRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import ApplicationsList from "@/components/ApplicationsList";
import RefinanceForm from "@/components/forms/RefinanceForm";
import BridgeLoanForm from "@/components/forms/BridgeLoanForm";
import WorkingCapitalForm from "@/components/forms/WorkingCapitalForm";

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

  const loanTypes = [
    {
      id: 1,
      title: "Refinance Property",
      icon: Home,
      description: "Optimize your existing commercial property financing",
      badge: "Popular",
      badgeColor: "bg-primary"
    },
    {
      id: 2,
      title: "Bridge Loan",
      icon: Building2, 
      description: "Short-term financing for immediate opportunities",
      badge: "Fast",
      badgeColor: "bg-accent"
    },
    {
      id: 3,
      title: "Property Purchase",
      icon: CreditCard,
      description: "Acquire commercial real estate assets",
      badge: "Coming Soon",
      badgeColor: "bg-warning"
    },
    {
      id: 4,
      title: "Franchise Financing",
      icon: Store,
      description: "Fund your franchise expansion dreams",
      badge: "Coming Soon",
      badgeColor: "bg-warning"
    },
    {
      id: 5,
      title: "Invoice Factoring", 
      icon: Banknote,
      description: "Convert receivables to immediate working capital",
      badge: "Coming Soon",
      badgeColor: "bg-warning"
    },
    {
      id: 6,
      title: "Working Capital",
      icon: TrendingUp,
      description: "Fuel your business operations and growth",
      badge: "Available",
      badgeColor: "bg-accent"
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
      <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
        <div className="text-center animate-fade-in">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin border-t-primary mx-auto"></div>
            <Sparkles className="w-6 h-6 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Loading Your Dashboard</h3>
          <p className="text-muted-foreground">Preparing your loan application experience...</p>
        </div>
      </div>
    );
  }

  // Show auth prompt for unauthenticated users
  if (!authenticated && !loading) {
    return (
      <div className="min-h-screen bg-gradient-background">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
          <div className="relative px-4 py-16 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="animate-fade-in">
                <Badge variant="secondary" className="mb-4 px-4 py-1.5 text-sm font-medium">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Trusted by 1000+ Businesses
                </Badge>
                <h1 className="text-5xl sm:text-6xl font-bold font-display text-foreground mb-6 leading-tight">
                  Halo Business
                  <span className="bg-gradient-primary bg-clip-text text-transparent"> Finance</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                  Your premier commercial loan marketplace. Access competitive financing solutions 
                  tailored for your business growth and success.
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-slide-up">
                {[
                  { icon: CheckCircle, title: "Fast Approval", desc: "Get pre-approved in 24 hours" },
                  { icon: Building2, title: "Expert Support", desc: "Dedicated loan specialists" },
                  { icon: TrendingUp, title: "Best Rates", desc: "Competitive market pricing" }
                ].map((feature, index) => (
                  <div key={index} className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 text-center hover:bg-card/80 transition-all duration-300">
                    <feature.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Auth Card */}
        <div className="px-4 pb-16">
          <Card className="max-w-lg mx-auto shadow-xl border-0 bg-card/95 backdrop-blur-sm animate-scale-in">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">
                Get Started Today
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Sign in or create your account to access our loan marketplace and start your application journey.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-2">
              <Button 
                size="lg" 
                className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-300 text-lg font-semibold py-6 group"
                onClick={() => navigate('/auth')}
              >
                Access Loan Marketplace
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  New to Halo Business Finance?
                </p>
                <p className="text-xs text-muted-foreground">
                  Create your account in under 2 minutes - completely secure and confidential.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <Badge variant="secondary" className="mb-4 px-4 py-1.5">
            <Sparkles className="w-4 h-4 mr-2" />
            Loan Application Portal
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold font-display text-foreground mb-4">
            Halo Business Finance
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your Commercial Loan Marketplace - Streamlined applications, competitive rates, expert support
          </p>
        </div>

        {/* Back Button */}
        {selectedLoanType && (
          <div className="mb-8 animate-slide-up">
            <Alert className="border-primary/20 bg-primary-muted/50">
              <AlertDescription className="flex items-center justify-between">
                <Button 
                  variant="ghost" 
                  onClick={handleBackToHome}
                  className="p-0 h-auto text-primary hover:text-primary/80 font-medium group"
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
          <Card className="mb-12 shadow-lg border-0 bg-card/95 backdrop-blur-sm animate-scale-in">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-bold text-foreground mb-2">Choose Your Loan Type</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                Select the financing solution that best fits your business needs
              </CardDescription>
              <p className="text-sm text-muted-foreground mt-2">Click on any option to get started with your application</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loanTypes.map((loanType, index) => {
                  const IconComponent = loanType.icon;
                  const isComingSoon = loanType.badge === "Coming Soon";
                  return (
                    <Card
                      key={loanType.id}
                      className={`cursor-pointer transition-all duration-300 border-2 group relative overflow-hidden ${
                        isComingSoon 
                          ? 'opacity-60 cursor-not-allowed hover:border-border' 
                          : 'hover:scale-105 hover:shadow-xl hover:border-primary/30 hover:bg-card/90'
                      }`}
                      onClick={() => !isComingSoon && handleLoanTypeSelect(loanType.id)}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="absolute top-4 right-4">
                        <Badge className={`${loanType.badgeColor} text-white text-xs font-medium`}>
                          {loanType.badge}
                        </Badge>
                      </div>
                      
                      <CardContent className="p-6 text-center">
                        <div className="mb-6 flex justify-center relative">
                          <div className={`w-20 h-20 flex items-center justify-center rounded-2xl transition-all duration-300 ${
                            isComingSoon 
                              ? 'bg-muted' 
                              : 'bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110'
                          }`}>
                            <IconComponent className={`w-10 h-10 ${isComingSoon ? 'text-muted-foreground' : 'text-primary'}`} />
                          </div>
                          {!isComingSoon && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute -top-2 -right-2 w-8 h-8 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <HelpCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        
                        <h3 className={`font-bold text-xl mb-3 transition-colors ${
                          isComingSoon 
                            ? 'text-muted-foreground' 
                            : 'text-foreground group-hover:text-primary'
                        }`}>
                          {loanType.title}
                        </h3>
                        
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {loanType.description}
                        </p>

                        {!isComingSoon && (
                          <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="outline" size="sm" className="w-full">
                              Start Application
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        )}
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
            {selectedLoanType === 1 && <RefinanceForm />}
            {selectedLoanType === 2 && <BridgeLoanForm />}
            {selectedLoanType === 3 && (
              <Card className="shadow-lg">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-warning" />
                  </div>
                  <CardTitle className="text-2xl">Property Purchase Application</CardTitle>
                  <CardDescription className="text-lg">Coming Soon - We're building something amazing!</CardDescription>
                </CardHeader>
              </Card>
            )}
            {selectedLoanType === 4 && (
              <Card className="shadow-lg">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Store className="w-8 h-8 text-warning" />
                  </div>
                  <CardTitle className="text-2xl">Franchise Loan Application</CardTitle>
                  <CardDescription className="text-lg">Coming Soon - We're building something amazing!</CardDescription>
                </CardHeader>
              </Card>
            )}
            {selectedLoanType === 5 && (
              <Card className="shadow-lg">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Banknote className="w-8 h-8 text-warning" />
                  </div>
                  <CardTitle className="text-2xl">Invoice Factoring Application</CardTitle>
                  <CardDescription className="text-lg">Coming Soon - We're building something amazing!</CardDescription>
                </CardHeader>
              </Card>
            )}
            {selectedLoanType === 6 && <WorkingCapitalForm />}
          </div>
        )}

        {/* Applications List */}
        {!selectedLoanType && authenticated && (
          <div className="animate-slide-up">
            <ApplicationsList />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
