import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, DollarSign, Clock, Users, Building2, CheckCircle, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  LoanProgramCard, 
  ProcessStep, 
  FeatureBenefit, 
  StatItem, 
  HeroSection 
} from "@/components/marketing/MarketingComponents";

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
    { icon: TrendingUp, title: "Best Rates", description: "Competitive market pricing" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection
        title={
          <>
            Business Financing
            <br />
            <span className="text-primary">that Grows with You</span>
          </>
        }
        subtitle="Our Loan Marketplace offers flexible SBA and Commercial Financing to help your business go far."
        onGetStarted={() => navigate('/application')}
      />

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
            {processSteps.map((step, index) => (
              <ProcessStep
                key={index}
                step={step.step}
                title={step.title}
                description={step.description}
                icon={step.icon}
                isLast={index === processSteps.length - 1}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <h3 className="text-xl font-semibold text-foreground mb-4">Fast, Simple, Secure</h3>
            <Button 
              size="lg"
              onClick={() => navigate('/application')}
              className="cta-primary"
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
              <LoanProgramCard
                key={index}
                title={program.title}
                description={program.description}
                features={program.features}
                badge={program.badge}
                onSelect={() => navigate('/application')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <FeatureBenefit
                key={index}
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem value="2,500+" label="Happy Clients" />
            <StatItem value="$2.5B+" label="Funding Provided" />
            <StatItem value="95%" label="Approval Rate" />
            <StatItem value="7 Days" label="Avg Processing" />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Ready to Grow Your Business?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of successful businesses that have secured funding through our marketplace
          </p>
          <Button 
            size="lg" 
            className="cta-primary"
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