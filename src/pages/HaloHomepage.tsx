import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HaloNavigation } from '@/components/HaloNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Shield, CheckCircle } from 'lucide-react';
import heroBackground from '@/assets/hero-background.jpg';

export const HaloHomepage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen">
      {/* Privacy Notice Banner */}
      <div className="bg-muted border-b px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">
              <strong>Privacy Policy:</strong> Your privacy is important to us. We collect and use your information to process loan applications and connect you with qualified lenders. We implement industry-leading security measures to protect your data and comply with all applicable privacy regulations.
            </span>
          </div>
          <Button variant="outline" size="sm">Accept</Button>
        </div>
      </div>

      <HaloNavigation />
      
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBackground})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/70 to-slate-900/90"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white animate-fade-in">
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Business Financing<br />
                <span className="text-primary">that Grows with You</span>
              </h1>
              <p className="text-xl mb-8 text-gray-200 leading-relaxed">
                Our Loan Marketplace offers flexible <span className="underline text-primary">SBA</span> and <span className="underline text-primary">Commercial Financing</span> to help your business go far.
              </p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-8">
                <div className="flex items-center text-gray-300">
                  <CheckCircle className="w-5 h-5 mr-2 text-primary flex-shrink-0" />
                  <span>SBA & Commercial Loan Marketplace</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 mr-2 text-primary flex-shrink-0" />
                  <span>Secure & Encrypted</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-end">
              <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-foreground mb-2">Get Pre-Qualified</h3>
                    <p className="text-muted-foreground">Fast 2-minute application</p>
                  </div>
                  <Button 
                    size="lg" 
                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 text-lg group"
                    onClick={handleGetStarted}
                  >
                    Start Application
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Loan Process Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Streamlined Loan Process</h2>
            <p className="text-xl text-muted-foreground">We make commercial lending simple</p>
          </div>
          
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <Badge className="bg-primary text-white mb-2">Step 1</Badge>
              </div>
              <h3 className="text-lg font-semibold mb-2">Select</h3>
              <p className="text-muted-foreground text-sm">
                Choose from our comprehensive range of loan products
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <Badge className="bg-primary text-white mb-2">Step 2</Badge>
              </div>
              <h3 className="text-lg font-semibold mb-2">Answer</h3>
              <p className="text-muted-foreground text-sm">
                Complete our simple application about your loan request
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <Badge className="bg-primary text-white mb-2">Step 3</Badge>
              </div>
              <h3 className="text-lg font-semibold mb-2">Get Pre-approved</h3>
              <p className="text-muted-foreground text-sm">
                Receive preliminary approval and loan terms
              </p>
            </div>
            
            {/* Step 4 */}
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <span className="text-2xl font-bold text-primary">4</span>
                </div>
                <Badge className="bg-primary text-white mb-2">Step 4</Badge>
              </div>
              <h3 className="text-lg font-semibold mb-2">Upload</h3>
              <p className="text-muted-foreground text-sm">
                Submit required documentation for final approval
              </p>
            </div>
            
            {/* Step 5 */}
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <span className="text-2xl font-bold text-primary">5</span>
                </div>
                <Badge className="bg-primary text-white mb-2">Step 5</Badge>
              </div>
              <h3 className="text-lg font-semibold mb-2">Get Funded</h3>
              <p className="text-muted-foreground text-sm">
                Sign your loan documents and receive your funding
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Fast, Simple, Secure</h3>
            <p className="text-muted-foreground mb-6">Professional lending process with modern technology</p>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white font-semibold py-4 px-8"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Financing Solutions Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Comprehensive Business Financing Solutions</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              We provide credit, financing, treasury and payment solutions to help your business succeed. 
              Discover our comprehensive range of <a href="#" className="text-primary underline">SBA-backed</a> and conventional financing options designed to fuel your business growth.
            </p>
          </div>
          
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-center mb-2">SBA & Commercial Financing</h3>
            <p className="text-muted-foreground text-center mb-12">Comprehensive solutions for your business growth</p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* SBA 7(a) Loans */}
              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/30">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="destructive" className="bg-red-500 text-white">Popular</Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">SBA 7(a) Loans</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    <span className="text-2xl font-bold text-primary">Prime + 2.75%</span>
                    <div>Starting Rate</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Versatile financing for working capital, equipment, and real estate purchases.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                      Up to $5 million loan amount
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                      Long-term financing up to 25 years
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                      SBA government guarantee protection
                    </li>
                  </ul>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">Learn More</Button>
                    <Button size="sm" className="flex-1">Apply Now</Button>
                  </div>
                </CardContent>
              </Card>

              {/* SBA 504 Loans */}
              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/30">
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">SBA 504 Loans</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    <span className="text-2xl font-bold text-primary">Fixed Rate</span>
                    <div>Long-term</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Fixed-rate financing for real estate and major equipment purchases.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                      Up to $5.5 million total project
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                      Only 10% down payment required
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                      Fixed interest rates available
                    </li>
                  </ul>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">Learn More</Button>
                    <Button size="sm" className="flex-1">Apply Now</Button>
                  </div>
                </CardContent>
              </Card>

              {/* SBA Express Loans */}
              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/30">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="bg-blue-500 text-white">Fast</Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">SBA Express Loans</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    <span className="text-2xl font-bold text-primary">Prime + 4.5%</span>
                    <div>Starting Rate</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Fast-track SBA financing with expedited approval process.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                      Up to $500,000 loan amount
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                      36-hour approval timeline guaranteed
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                      Revolving credit line option available
                    </li>
                  </ul>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">Learn More</Button>
                    <Button size="sm" className="flex-1">Apply Now</Button>
                  </div>
                </CardContent>
              </Card>

              {/* USDA B&I Loans */}
              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/30">
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">USDA B&I Loans</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    <span className="text-2xl font-bold text-primary">Prime + 2%</span>
                    <div>Starting Rate</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Rural business development financing backed by USDA guarantee.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                      Up to $25 million loan amount
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                      Rural area business focus only
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                      USDA government guarantee backing
                    </li>
                  </ul>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">Learn More</Button>
                    <Button size="sm" className="flex-1">Apply Now</Button>
                  </div>
                </CardContent>
              </Card>

              {/* USDA Rural Development */}
              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/30">
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">USDA Rural Development</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    <span className="text-2xl font-bold text-primary">Prime + 1.5%</span>
                    <div>Starting Rate</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Rural community development and business growth financing programs.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                      Rural area development focus
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                      Community impact financing
                    </li>
                    <li className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                      USDA guarantee protection
                    </li>
                  </ul>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">Learn More</Button>
                    <Button size="sm" className="flex-1">Apply Now</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};