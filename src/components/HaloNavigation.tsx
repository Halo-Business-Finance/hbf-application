import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { ChevronDown, Search, Phone } from 'lucide-react';

export const HaloNavigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b shadow-sm">
      {/* Top Navigation Bar */}
      <div className="border-b bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 text-sm">
            <div className="flex items-center space-x-6">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-sm">Company</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="p-4 w-64">
                        <div className="space-y-2">
                          <NavigationMenuLink href="#" className="block px-3 py-2 hover:bg-muted rounded">About Us</NavigationMenuLink>
                          <NavigationMenuLink href="#" className="block px-3 py-2 hover:bg-muted rounded">Our Team</NavigationMenuLink>
                          <NavigationMenuLink href="#" className="block px-3 py-2 hover:bg-muted rounded">Careers</NavigationMenuLink>
                          <NavigationMenuLink href="#" className="block px-3 py-2 hover:bg-muted rounded">Contact</NavigationMenuLink>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuLink href="#" className="text-muted-foreground hover:text-foreground">Marketplace Benefits</NavigationMenuLink>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-sm">Resources</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="p-4 w-64">
                        <div className="space-y-2">
                          <NavigationMenuLink href="#" className="block px-3 py-2 hover:bg-muted rounded">Blog</NavigationMenuLink>
                          <NavigationMenuLink href="#" className="block px-3 py-2 hover:bg-muted rounded">Guides</NavigationMenuLink>
                          <NavigationMenuLink href="#" className="block px-3 py-2 hover:bg-muted rounded">FAQs</NavigationMenuLink>
                          <NavigationMenuLink href="#" className="block px-3 py-2 hover:bg-muted rounded">Support Center</NavigationMenuLink>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-sm">Partners</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="p-4 w-64">
                        <div className="space-y-2">
                          <NavigationMenuLink href="#" className="block px-3 py-2 hover:bg-muted rounded">Lender Partners</NavigationMenuLink>
                          <NavigationMenuLink href="#" className="block px-3 py-2 hover:bg-muted rounded">Broker Network</NavigationMenuLink>
                          <NavigationMenuLink href="#" className="block px-3 py-2 hover:bg-muted rounded">Integration Partners</NavigationMenuLink>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center">
                <Phone className="w-4 h-4 mr-1" />
                Customer Support
              </Button>
              <Button variant="outline" size="sm">
                SIGN IN
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-foreground">
              HALO BUSINESS FINANCE
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList className="space-x-1">
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-base">SBA Loans</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-6 w-96">
                      <div className="space-y-3">
                        <NavigationMenuLink href="#" className="block p-3 hover:bg-muted rounded-lg">
                          <div className="font-medium">SBA 7(a) Loans</div>
                          <div className="text-sm text-muted-foreground">Up to $5M for working capital & equipment</div>
                        </NavigationMenuLink>
                        <NavigationMenuLink href="#" className="block p-3 hover:bg-muted rounded-lg">
                          <div className="font-medium">SBA 504 Loans</div>
                          <div className="text-sm text-muted-foreground">Fixed-rate real estate financing</div>
                        </NavigationMenuLink>
                        <NavigationMenuLink href="#" className="block p-3 hover:bg-muted rounded-lg">
                          <div className="font-medium">SBA Express Loans</div>
                          <div className="text-sm text-muted-foreground">Fast approval up to $500K</div>
                        </NavigationMenuLink>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-base">USDA Loans</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-6 w-96">
                      <div className="space-y-3">
                        <NavigationMenuLink href="#" className="block p-3 hover:bg-muted rounded-lg">
                          <div className="font-medium">USDA B&I Loans</div>
                          <div className="text-sm text-muted-foreground">Rural business development financing</div>
                        </NavigationMenuLink>
                        <NavigationMenuLink href="#" className="block p-3 hover:bg-muted rounded-lg">
                          <div className="font-medium">USDA Rural Development</div>
                          <div className="text-sm text-muted-foreground">Community development programs</div>
                        </NavigationMenuLink>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-base">Commercial Loans</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-6 w-96">
                      <div className="space-y-3">
                        <NavigationMenuLink href="#" className="block p-3 hover:bg-muted rounded-lg">
                          <div className="font-medium">Term Loans</div>
                          <div className="text-sm text-muted-foreground">Fixed-rate business financing</div>
                        </NavigationMenuLink>
                        <NavigationMenuLink href="#" className="block p-3 hover:bg-muted rounded-lg">
                          <div className="font-medium">Lines of Credit</div>
                          <div className="text-sm text-muted-foreground">Flexible working capital solutions</div>
                        </NavigationMenuLink>
                        <NavigationMenuLink href="#" className="block p-3 hover:bg-muted rounded-lg">
                          <div className="font-medium">Bridge Loans</div>
                          <div className="text-sm text-muted-foreground">Short-term financing solutions</div>
                        </NavigationMenuLink>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-base">Equipment Financing</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-6 w-96">
                      <div className="space-y-3">
                        <NavigationMenuLink href="#" className="block p-3 hover:bg-muted rounded-lg">
                          <div className="font-medium">Equipment Loans</div>
                          <div className="text-sm text-muted-foreground">Finance business equipment purchases</div>
                        </NavigationMenuLink>
                        <NavigationMenuLink href="#" className="block p-3 hover:bg-muted rounded-lg">
                          <div className="font-medium">Equipment Leasing</div>
                          <div className="text-sm text-muted-foreground">Flexible equipment leasing options</div>
                        </NavigationMenuLink>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-base">Capital Markets</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-6 w-96">
                      <div className="space-y-3">
                        <NavigationMenuLink href="#" className="block p-3 hover:bg-muted rounded-lg">
                          <div className="font-medium">Invoice Factoring</div>
                          <div className="text-sm text-muted-foreground">Immediate cash flow solutions</div>
                        </NavigationMenuLink>
                        <NavigationMenuLink href="#" className="block p-3 hover:bg-muted rounded-lg">
                          <div className="font-medium">Revenue-Based Financing</div>
                          <div className="text-sm text-muted-foreground">Flexible repayment structures</div>
                        </NavigationMenuLink>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-base">Debt and Equity</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-6 w-96">
                      <div className="space-y-3">
                        <NavigationMenuLink href="#" className="block p-3 hover:bg-muted rounded-lg">
                          <div className="font-medium">Debt Refinancing</div>
                          <div className="text-sm text-muted-foreground">Restructure existing debt</div>
                        </NavigationMenuLink>
                        <NavigationMenuLink href="#" className="block p-3 hover:bg-muted rounded-lg">
                          <div className="font-medium">Equity Financing</div>
                          <div className="text-sm text-muted-foreground">Investment capital solutions</div>
                        </NavigationMenuLink>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Get Started Button */}
          <div className="flex items-center">
            <Button className="bg-primary hover:bg-primary/90 text-white font-semibold px-6">
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <ChevronDown className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="px-4 py-4 space-y-2">
            <a href="#" className="block px-3 py-2 text-base font-medium hover:bg-muted rounded">SBA Loans</a>
            <a href="#" className="block px-3 py-2 text-base font-medium hover:bg-muted rounded">USDA Loans</a>
            <a href="#" className="block px-3 py-2 text-base font-medium hover:bg-muted rounded">Commercial Loans</a>
            <a href="#" className="block px-3 py-2 text-base font-medium hover:bg-muted rounded">Equipment Financing</a>
            <a href="#" className="block px-3 py-2 text-base font-medium hover:bg-muted rounded">Capital Markets</a>
            <a href="#" className="block px-3 py-2 text-base font-medium hover:bg-muted rounded">Debt and Equity</a>
          </div>
        </div>
      )}
    </nav>
  );
};