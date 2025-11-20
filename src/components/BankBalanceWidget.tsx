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
      <Card className="border-none shadow-sm overflow-hidden bg-orange-500">
        <CardHeader className="bg-orange-600">
          <CardTitle className="text-sm font-semibold uppercase tracking-wide text-blue-900 flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Bank Accounts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-orange-500">
          <div className="animate-pulse space-y-3">
            <div className="h-8 bg-orange-400 rounded w-1/3"></div>
            <div className="h-4 bg-orange-400 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (accounts.length === 0) {
    return (
      <Card className="border-none shadow-sm overflow-hidden bg-orange-500">
        <CardHeader className="bg-orange-600">
          <CardTitle className="text-sm font-semibold uppercase tracking-wide text-blue-900 flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Bank Accounts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-orange-500">
          <p className="text-sm text-blue-800">No active bank accounts</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden bg-orange-500">
      <CardHeader className="bg-orange-600">
        <CardTitle className="text-sm font-semibold uppercase tracking-wide text-blue-900 flex items-center gap-2">
          <Wallet className="w-4 h-4" />
          Bank Accounts
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 bg-orange-500">
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{formatCurrency(totalBalance)}</span>
            <Badge variant="outline" className="border-white bg-white/10 text-white font-semibold">
              Total Balance
            </Badge>
          </div>
          <p className="text-xs text-white/80 mt-1">{accounts.length} active account{accounts.length > 1 ? 's' : ''}</p>
        </div>

        <div className="space-y-3">
          {totalPersonal > 0 && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-orange-400/50 border border-orange-300">
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Personal</p>
                <p className="text-xs text-white/80">{personalAccounts.length} account{personalAccounts.length > 1 ? 's' : ''}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-white">{formatCurrency(totalPersonal)}</p>
              </div>
            </div>
          )}
          
          {totalBusiness > 0 && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-orange-400/50 border border-orange-300">
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Business</p>
                <p className="text-xs text-white/80">{businessAccounts.length} account{businessAccounts.length > 1 ? 's' : ''}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-white">{formatCurrency(totalBusiness)}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
