import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Landmark, TrendingUp, TrendingDown, DollarSign, Calendar, Building2, User } from 'lucide-react';

interface BankAccount {
  id: string;
  accountName: string;
  accountNumber: string;
  accountType: string;
  balance: number;
  currency: string;
  institution: string;
  lastUpdated: string;
  status: 'active' | 'pending' | 'closed';
}

const BankAccounts = () => {
  const { authenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [loadingData, setLoadingData] = useState(true);
  const [personalAccounts, setPersonalAccounts] = useState<BankAccount[]>([]);
  const [businessAccounts, setBusinessAccounts] = useState<BankAccount[]>([]);

  useEffect(() => {
    if (!loading && !authenticated) {
      navigate('/auth');
      return;
    }

    if (authenticated) {
      loadBankAccounts();
    }
  }, [authenticated, loading, navigate]);

  const loadBankAccounts = async () => {
    try {
      // Simulate API call - In production, this would fetch from your third-party banking API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock personal accounts data
      const mockPersonalAccounts: BankAccount[] = [
        {
          id: '1',
          accountName: 'Personal Checking',
          accountNumber: '****1234',
          accountType: 'Checking',
          balance: 15420.50,
          currency: 'USD',
          institution: 'Chase Bank',
          lastUpdated: new Date().toISOString(),
          status: 'active'
        },
        {
          id: '2',
          accountName: 'Personal Savings',
          accountNumber: '****5678',
          accountType: 'Savings',
          balance: 48750.00,
          currency: 'USD',
          institution: 'Chase Bank',
          lastUpdated: new Date().toISOString(),
          status: 'active'
        }
      ];

      // Mock business accounts data
      const mockBusinessAccounts: BankAccount[] = [
        {
          id: '3',
          accountName: 'Business Checking',
          accountNumber: '****9012',
          accountType: 'Business Checking',
          balance: 125340.75,
          currency: 'USD',
          institution: 'Bank of America',
          lastUpdated: new Date().toISOString(),
          status: 'active'
        },
        {
          id: '4',
          accountName: 'Business Savings',
          accountNumber: '****3456',
          accountType: 'Business Savings',
          balance: 287500.00,
          currency: 'USD',
          institution: 'Bank of America',
          lastUpdated: new Date().toISOString(),
          status: 'active'
        },
        {
          id: '5',
          accountName: 'Operating Account',
          accountNumber: '****7890',
          accountType: 'Business Checking',
          balance: 52100.25,
          currency: 'USD',
          institution: 'Wells Fargo',
          lastUpdated: new Date().toISOString(),
          status: 'active'
        }
      ];

      setPersonalAccounts(mockPersonalAccounts);
      setBusinessAccounts(mockBusinessAccounts);
    } catch (error) {
      console.error('Error loading bank accounts:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      pending: { variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' },
      closed: { variant: 'destructive' as const, className: '' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;

    return (
      <Badge variant={config.variant} className={config.className}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateTotalBalance = (accounts: BankAccount[]) => {
    return accounts.reduce((sum, account) => sum + account.balance, 0);
  };

  const renderAccountCard = (account: BankAccount) => (
    <Card key={account.id}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Landmark className="w-5 h-5" />
              {account.accountName}
            </CardTitle>
            <CardDescription>{account.institution}</CardDescription>
          </div>
          {getStatusBadge(account.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Account Number</p>
            <p className="font-mono font-semibold">{account.accountNumber}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Account Type</p>
            <p className="font-semibold">{account.accountType}</p>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(account.balance)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-muted-foreground" />
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>
            Last updated: {new Date(account.lastUpdated).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading bank accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Bank Accounts</h1>
          <p className="text-muted-foreground">
            View your connected personal and business bank account balances
          </p>
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Personal Accounts
            </TabsTrigger>
            <TabsTrigger value="business" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Business Accounts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Personal Balance</p>
                    <p className="text-3xl font-bold">
                      {formatCurrency(calculateTotalBalance(personalAccounts))}
                    </p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-primary" />
                </div>
              </CardContent>
            </Card>

            {personalAccounts.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {personalAccounts.map(renderAccountCard)}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Landmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No Personal Accounts</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect your personal bank accounts via our third-party API integration
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="business" className="space-y-6">
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Business Balance</p>
                    <p className="text-3xl font-bold">
                      {formatCurrency(calculateTotalBalance(businessAccounts))}
                    </p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            {businessAccounts.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {businessAccounts.map(renderAccountCard)}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Landmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No Business Accounts</h3>
                  <p className="text-sm text-muted-foreground">
                    Connect your business bank accounts via our third-party API integration
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BankAccounts;
