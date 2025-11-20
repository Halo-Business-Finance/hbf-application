import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Wallet, Building2, User, TrendingUp } from 'lucide-react';

interface BankAccount {
  id: string;
  account_name: string;
  institution: string;
  balance: number;
  is_business: boolean;
  status: string;
}

export const BankBalanceWidget = () => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBankAccounts();
  }, []);

  const loadBankAccounts = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('user_id', user.user.id)
        .eq('status', 'active')
        .order('balance', { ascending: false });

      if (error) throw error;
      setAccounts(data || []);
    } catch (error) {
      console.error('Error loading bank accounts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const personalAccounts = accounts.filter(a => !a.is_business);
  const businessAccounts = accounts.filter(a => a.is_business);
  
  const totalPersonal = personalAccounts.reduce((sum, a) => sum + Number(a.balance), 0);
  const totalBusiness = businessAccounts.reduce((sum, a) => sum + Number(a.balance), 0);
  const totalBalance = totalPersonal + totalBusiness;

  if (isLoading) {
    return (
      <Card className="border-2 border-blue-900 shadow-sm bg-blue-900">
        <CardHeader className="bg-blue-950 border-b border-blue-800">
          <CardTitle className="text-sm font-semibold uppercase tracking-wide text-white flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Bank Accounts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-8 bg-blue-800 rounded w-1/3"></div>
            <div className="h-4 bg-blue-800 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (accounts.length === 0) {
    return (
      <Card className="border-2 border-blue-900 shadow-sm bg-blue-900">
        <CardHeader className="bg-blue-950 border-b border-blue-800">
          <CardTitle className="text-sm font-semibold uppercase tracking-wide text-white flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Bank Accounts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-sm text-white/70">No active bank accounts</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-blue-900 shadow-sm hover:shadow-md transition-all duration-200 bg-blue-900">
      <CardHeader className="bg-blue-950 border-b border-blue-800">
        <CardTitle className="text-sm font-semibold uppercase tracking-wide text-white flex items-center gap-2">
          <Wallet className="w-4 h-4" />
          Bank Accounts
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{formatCurrency(totalBalance)}</span>
            <Badge variant="outline" className="border-orange-500 bg-orange-500 text-white">
              {accounts.length} Active
            </Badge>
          </div>
          <p className="text-xs text-white/70 mt-1">Total across all accounts</p>
        </div>

        <div className="space-y-3">
          {personalAccounts.length > 0 && (
            <div className="p-3 rounded-lg bg-blue-800/50 border border-blue-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-white/70" />
                  <span className="text-sm font-medium text-white">Personal Accounts</span>
                </div>
                <span className="text-lg font-semibold text-white">{formatCurrency(totalPersonal)}</span>
              </div>
              <p className="text-xs text-white/70 mt-1 ml-6">{personalAccounts.length} account{personalAccounts.length > 1 ? 's' : ''}</p>
            </div>
          )}

          {businessAccounts.length > 0 && (
            <div className="p-3 rounded-lg bg-blue-800/50 border border-blue-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-white/70" />
                  <span className="text-sm font-medium text-white">Business Accounts</span>
                </div>
                <span className="text-lg font-semibold text-white">{formatCurrency(totalBusiness)}</span>
              </div>
              <p className="text-xs text-white/70 mt-1 ml-6">{businessAccounts.length} account{businessAccounts.length > 1 ? 's' : ''}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
