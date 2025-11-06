import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Plus } from 'lucide-react';

const LoanProducts = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Button variant="ghost" onClick={() => navigate('/admin')} className="mb-4">
              ← Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold mb-2">Loan Products</h1>
            <p className="text-muted-foreground">Manage available loan products and configurations</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Active Loan Products
            </CardTitle>
            <CardDescription>Configure and manage loan product offerings</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Loan product management coming soon</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoanProducts;
