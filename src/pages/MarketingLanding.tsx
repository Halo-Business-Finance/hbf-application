import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Shield, DollarSign, Clock, Users, Building2, Zap, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MarketingLanding = () => {
  const navigate = useNavigate();

  const loanPrograms = [
    {
      title: "SBA Loans",
      description: "Government-backed financing with competitive rates and flexible terms",
      features: ["Up to $5M financing", "Low down payments", "Competitive rates"],
      badge: "Most Popular"
    },
    {
      title: "USDA Loans", 
      description: "Rural business development financing with government guarantee",
      features: ["Up to $25M available", "Rural focus", "Job creation incentives"],
      badge: "Rural Businesses"
    },
    {
      title: "Commercial Loans",
      description: "Traditional business financing for established companies",
      features: ["Fast approval", "Flexible terms", "No SBA requirements"],
      badge: "Quick Process"
    },
    {
      title: "Equipment Financing",
      description: "Fund equipment purchases with the equipment as collateral",
      features: ["100% financing", "Fast approval", "Tax benefits"],
      badge: "Tax Advantages"
    },
    {
      title: "Capital Markets",
      description: "Access to debt and equity capital markets for growth",
      features: ["Large transactions", "Strategic partnerships", "Growth capital"],
      badge: "Growth Capital"
    },
    {
      title: "Debt and Equity",
      description: "Comprehensive capital solutions for business expansion",
      features: ["Flexible structures", "Strategic advice", "Growth support"],
      badge: "Strategic"
    }
  ];

  const processSteps = [
    {
      step: "1",
      title: "Select",
      description: "Choose your loan program",
      icon: CheckCircle
    },
    {
      step: "2", 
      title: "Answer",
      description: "Complete our simple application",
      icon: Users
    },
    {
      step: "3",
      title: "Get Pre-approved",
      description: "Receive conditional approval within 24 hours",
      icon: Shield
    },
    {
      step: "4",
      title: "Upload",
      description: "Submit your documents",
      icon: Building2
    },
    {
      step: "5",
      title: "Get Funded",
      description: "Receive your funding",
      icon: DollarSign
    }
  ];

  const benefits = [
    { icon: Clock, title: "Fast 2-minute application", description: "Quick and simple process" },
    { icon: Shield, title: "Secure & Encrypted", description: "Bank-level security" },
    { icon: Users, title: "Expert Support", description: "Dedicated loan specialists" },
    { icon: Star, title: "Best Rates", description: "Competitive market pricing" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/5 py-24">
        <div className="absolute inset-0 bg-[url('/assets/hero-pattern.svg')] opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <Badge variant="secondary" className="mb-6 px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              SBA & Commercial Loan Marketplace
            </Badge>
            <h1 className="text-4xl sm:text-6xl font-bold font-display text-foreground mb-6 leading-tight">
              Business Financing
              <br />
              <span className="text-primary">that Grows with You</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Our Loan Marketplace offers flexible <span className="font-semibold text-primary">SBA</span> and{" "}
              <span className="font-semibold text-primary">Commercial Financing</span> to help your business go far.
            </p>
            
            {/* CTA Card */}
            <Card className="max-w-lg mx-auto shadow-xl border-0 bg-card/95 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">Get Pre-Qualified</h3>
                  <p className="text-muted-foreground">Fast 2-minute application</p>
                </div>
                <Button 
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 text-lg group"
                  onClick={() => navigate('/application')}
                >
                  Start Application
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <div className="flex items-center justify-center mt-4 space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-1 text-primary" />
                    SBA & Commercial Loan Marketplace
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1 text-primary" />
                    Secure & Encrypted
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Our Streamlined Loan Process
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We make commercial lending simple
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {processSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                  {index < processSteps.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-full w-full">
                      <ArrowRight className="w-6 h-6 text-muted-foreground/40 mx-auto" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <h3 className="text-xl font-semibold text-foreground mb-4">Fast, Simple, Secure</h3>
            <Button 
              size="lg"
              onClick={() => navigate('/application')}
              className="group"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Professional lending process with modern technology
            </p>
          </div>
        </div>
      </section>

      {/* Loan Programs Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Comprehensive Business Financing Solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Access a wide range of financing options tailored to your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loanPrograms.map((program, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-card/95 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {program.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {program.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {program.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {program.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-primary mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant="outline" 
                    className="w-full mt-6 group-hover:bg-primary group-hover:text-white transition-colors"
                    onClick={() => navigate('/application')}
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">2,500+</div>
              <div className="text-primary-foreground/80">Happy Clients</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">$2.5B+</div>
              <div className="text-primary-foreground/80">Funding Provided</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-primary-foreground/80">Approval Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">7 Days</div>
              <div className="text-primary-foreground/80">Avg Processing</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Ready to Grow Your Business?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of successful businesses that have secured funding through our marketplace
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-white font-semibold py-4 px-8 text-lg group"
            onClick={() => navigate('/application')}
          >
            Start Your Application Now
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Get pre-qualified in just 2 minutes • No impact to credit score
          </p>
        </div>
      </section>
    </div>
  );
};

export default MarketingLanding;