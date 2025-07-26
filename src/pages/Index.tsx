import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  const [selectedLoanType, setSelectedLoanType] = useState<number | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
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
            <Card>
              <CardHeader>
                <CardTitle>
                  {loanTypes.find(lt => lt.id === selectedLoanType)?.title} Application
                </CardTitle>
                <CardDescription>
                  Complete the form below to start your loan application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    Loan application form for {loanTypes.find(lt => lt.id === selectedLoanType)?.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Form component will be implemented next
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Applications List */}
        {!selectedLoanType && (
          <Card>
            <CardHeader>
              <CardTitle>Your Applications</CardTitle>
              <CardDescription>
                Track the status of your loan applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No applications found. Start by selecting a loan type above.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
