import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HaloNavigation } from '@/components/HaloNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
      <div className="bg-gray-800 text-white px-4 py-3 text-center relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
          <div className="flex-1 text-left">
            <span>
              <strong>Privacy Policy:</strong> Your privacy is important to us. We collect and use your information to process loan applications and connect you with qualified lenders. We implement industry-leading security measures to protect your data and comply with all applicable privacy regulations.
            </span>
          </div>
          <Button variant="outline" size="sm" className="ml-4 bg-white text-gray-800 border-white hover:bg-gray-100">
            Accept
          </Button>
        </div>
        <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300">
          ✕
        </button>
      </div>

      <HaloNavigation />
      
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBackground})` }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Business Financing<br />
                <span className="text-white">that Grows with You</span>
              </h1>
              <p className="text-xl mb-8 text-gray-200 leading-relaxed">
                Our Loan Marketplace offers flexible <span className="underline">SBA</span> and <span className="underline">Commercial Financing</span> to help your business go far.
              </p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-8">
                <div className="flex items-center text-gray-300">
                  <CheckCircle className="w-5 h-5 mr-2 text-white flex-shrink-0" />
                  <span>SBA & Commercial Loan Marketplace</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 mr-2 text-white flex-shrink-0" />
                  <span>Secure & Encrypted</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-end">
              <Card className="w-full max-w-md bg-gray-800/90 backdrop-blur-sm border-0 shadow-2xl">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Get Pre-Qualified</h3>
                    <p className="text-gray-300">Fast 2-minute application</p>
                  </div>
                  <Button 
                    size="lg" 
                    className="w-full bg-white hover:bg-gray-100 text-blue-600 font-semibold py-4 text-lg"
                    onClick={handleGetStarted}
                  >
                    Start Application
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Loan Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Streamlined Loan Process</h2>
            <p className="text-xl text-gray-600">We make commercial lending simple</p>
          </div>
          
          {/* Process Image Section */}
          <div className="text-center mb-16">
            <div className="max-w-2xl mx-auto">
              <img 
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800" 
                alt="Loan Process Overview" 
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>
          
          {/* Process Steps */}
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Select</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Choose from our comprehensive range of loan products
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Answer</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Complete our simple application about your loan request
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Get Pre-approved</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Receive preliminary approval and loan terms
              </p>
            </div>
            
            {/* Step 4 */}
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">4</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Upload</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Submit required documentation for final approval
              </p>
            </div>
            
            {/* Step 5 */}
            <div className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">5</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Get Funded</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Sign your loan documents and receive your funding
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Fast, Simple, Secure</h3>
            <p className="text-gray-600 mb-6">Professional lending process with modern technology</p>
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};