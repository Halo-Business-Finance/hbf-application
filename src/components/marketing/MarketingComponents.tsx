import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Shield, DollarSign, Clock, Users, Building2, Zap, Star, TrendingUp } from "lucide-react";

interface LoanProgramCardProps {
  title: string;
  description: string;
  features: string[];
  badge: string;
  onSelect: () => void;
}

export const LoanProgramCard: React.FC<LoanProgramCardProps> = ({ 
  title, 
  description, 
  features, 
  badge, 
  onSelect 
}) => (
  <Card className="loan-program-card" onClick={onSelect}>
    <CardHeader className="pb-4">
      <div className="flex items-center justify-between mb-2">
        <Badge className="badge-secondary">
          {badge}
        </Badge>
      </div>
      <CardTitle className="text-xl group-hover:text-primary transition-colors">
        {title}
      </CardTitle>
      <CardDescription className="text-base">
        {description}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle className="w-4 h-4 text-primary mr-3 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>
      <Button 
        variant="outline" 
        className="w-full mt-6 group-hover:bg-primary group-hover:text-white transition-colors"
      >
        Learn More
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </CardContent>
  </Card>
);

interface ProcessStepProps {
  step: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  isLast?: boolean;
}

export const ProcessStep: React.FC<ProcessStepProps> = ({ 
  step, 
  title, 
  description, 
  icon: IconComponent, 
  isLast = false 
}) => (
  <div className="process-step">
    <div className="relative mb-6">
      <div className="process-icon">
        <IconComponent className="w-8 h-8 text-primary" />
      </div>
      <div className="process-badge">
        {step}
      </div>
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm">{description}</p>
    {!isLast && (
      <div className="hidden md:block absolute top-10 left-full w-full">
        <ArrowRight className="w-6 h-6 text-muted-foreground/40 mx-auto" />
      </div>
    )}
  </div>
);

interface FeatureBenefitProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

export const FeatureBenefit: React.FC<FeatureBenefitProps> = ({ 
  icon: IconComponent, 
  title, 
  description 
}) => (
  <div className="feature-card">
    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
      <IconComponent className="w-8 h-8 text-primary" />
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

interface StatItemProps {
  value: string;
  label: string;
}

export const StatItem: React.FC<StatItemProps> = ({ value, label }) => (
  <div className="stat-item">
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
  </div>
);

interface HeroSectionProps {
  title: React.ReactNode;
  subtitle: string;
  onGetStarted: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ title, subtitle, onGetStarted }) => (
  <section className="hero-section py-24">
    <div className="hero-background"></div>
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center animate-fade-in">
        <Badge variant="secondary" className="mb-6 px-4 py-2">
          <Zap className="w-4 h-4 mr-2" />
          SBA & Commercial Loan Marketplace
        </Badge>
        <h1 className="hero-title mb-6">
          {title}
        </h1>
        <p className="hero-subtitle mb-8">
          {subtitle}
        </p>
        
        {/* CTA Card */}
        <Card className="max-w-lg mx-auto shadow-hero border-0 professional-card">
          <CardContent className="p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-foreground mb-2">Get Pre-Qualified</h3>
              <p className="text-muted-foreground">Fast 2-minute application</p>
            </div>
            <Button 
              size="lg" 
              className="cta-primary w-full"
              onClick={onGetStarted}
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
);