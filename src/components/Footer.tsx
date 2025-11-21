import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-foreground mb-3">Halo Business Finance</h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive business financing solutions to help your business grow.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/loan-applications" className="text-muted-foreground hover:text-foreground transition-colors">
                  Loan Applications
                </Link>
              </li>
              <li>
                <Link to="/calculator" className="text-muted-foreground hover:text-foreground transition-colors">
                  Loan Calculator
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-muted-foreground hover:text-foreground transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Halo Business Finance. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
