import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, HelpCircle, LogIn } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import ApplicationsList from "@/components/ApplicationsList";
import RefinanceForm from "@/components/forms/RefinanceForm";
import BridgeLoanForm from "@/components/forms/BridgeLoanForm";

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
      title: "Refinance of Property",
      icon: "/loantypes/refinance.svg",
      description: "Refinance your existing commercial property"
    },
    {
      id: 2,
      title: "Bridge Loan",
      icon: "/loantypes/bridge.svg", 
      description: "Short-term financing to bridge the gap"
    },
    {
      id: 3,
      title: "Purchase of Property",
      icon: "/loantypes/purchase.svg",
      description: "Finance the purchase of commercial property"
    },
    {
      id: 4,
      title: "Franchise Loan",
      icon: "/loantypes/businessterm.svg",
      description: "Financing for franchise opportunities"
    },
    {
      id: 5,
      title: "Factoring Loan", 
      icon: "/loantypes/sba.svg",
      description: "Convert receivables to immediate cash"
    },
    {
      id: 6,
      title: "Working Capital",
      icon: "/loantypes/shorttermbusiness.svg",
      description: "Finance day-to-day business operations"
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
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth prompt for unauthenticated users
  if (!authenticated && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Halo Business Finance
            </h1>
            <p className="text-xl text-muted-foreground">
              Your Commercial Loan Marketplace
            </p>
          </div>

          {/* Auth Required Card */}
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <LogIn className="w-6 h-6" />
                Authentication Required
              </CardTitle>
              <CardDescription className="text-base">
                Please sign in or create an account to access loan applications and manage your submissions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                size="lg" 
                className="w-full"
                onClick={() => navigate('/auth')}
              >
                Sign In / Sign Up
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                New to Halo Business Finance? You can create an account quickly and securely.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Halo Business Finance
          </h1>
          <p className="text-xl text-muted-foreground">
            Your Commercial Loan Marketplace
          </p>
        </div>

        {/* Back Button */}
        {selectedLoanType && (
          <div className="mb-6">
            <Alert>
              <AlertDescription>
                <Button 
                  variant="ghost" 
                  onClick={handleBackToHome}
                  className="p-0 h-auto text-primary hover:text-primary/80"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to home
                </Button>
                <span className="ml-4 text-muted-foreground">
                  Once you go back, you'll need to start from the beginning
                </span>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Loan Type Selection */}
        {!selectedLoanType && (
          <Card className="mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Step 1</CardTitle>
              <CardDescription className="text-lg">
                Which type of loan do you prefer?
              </CardDescription>
              <p className="text-muted-foreground">Please select one to continue</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loanTypes.map((loanType) => (
                  <Card
                    key={loanType.id}
                    className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 hover:border-primary/50 group"
                    onClick={() => handleLoanTypeSelect(loanType.id)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="mb-4 flex justify-center relative">
                        <img 
                          src={loanType.icon} 
                          alt={loanType.title}
                          className="w-20 h-20 object-contain"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                        >
                          <HelpCircle className="w-4 h-4" />
                        </Button>
                      </div>
                      <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                        {loanType.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {loanType.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loan Application Forms */}
        {selectedLoanType && (
          <div className="space-y-6">
            {selectedLoanType === 1 && <RefinanceForm />}
            {selectedLoanType === 2 && <BridgeLoanForm />}
            {selectedLoanType === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Purchase Application</CardTitle>
                  <CardDescription>Form coming soon</CardDescription>
                </CardHeader>
              </Card>
            )}
            {selectedLoanType === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Franchise Loan Application</CardTitle>
                  <CardDescription>Form coming soon</CardDescription>
                </CardHeader>
              </Card>
            )}
            {selectedLoanType === 5 && (
              <Card>
                <CardHeader>
                  <CardTitle>Factoring Application</CardTitle>
                  <CardDescription>Form coming soon</CardDescription>
                </CardHeader>
              </Card>
            )}
            {selectedLoanType === 6 && (
              <Card>
                <CardHeader>
                  <CardTitle>Working Capital Application</CardTitle>
                  <CardDescription>Form coming soon</CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        )}

        {/* Applications List */}
        {!selectedLoanType && authenticated && <ApplicationsList />}
      </div>
    </div>
  );
};

export default Index;
