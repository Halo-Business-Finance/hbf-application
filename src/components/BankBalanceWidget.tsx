import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Building2, User } from 'lucide-react';

interface BankAccount {
  id: string;
  account_name: string;
  institution: string;
  balance: number;
  is_business: boolean;
  status: string;
}

export const BankBalanceWidget = () => {
  const [accounts] = useState<BankAccount[]>([
    {
      id: '1',
      account_name: 'Main Checking',
      institution: 'Chase Bank',
      balance: 45230,
      is_business: false,
      status: 'active'
    },
    {
      id: '2',
      account_name: 'Savings Account',
      institution: 'Wells Fargo',
      balance: 78500,
      is_business: false,
      status: 'active'
    },
    {
      id: '3',
      account_name: 'Business Checking',
      institution: 'Bank of America',
      balance: 125000,
      is_business: true,
      status: 'active'
    },
    {
      id: '4',
      account_name: 'Payroll Account',
      institution: 'Silicon Valley Bank',
      balance: 89400,
      is_business: true,
      status: 'active'
    }
  ]);
  const [isLoading] = useState(false);

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border border-gray-200 shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-12 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <Card className="border border-gray-200 shadow-sm bg-white">
        <CardContent className="p-6 text-center">
          <Building2 className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="text-lg font-semibold text-gray-900 mb-1">No Bank Accounts</p>
          <p className="text-sm text-gray-600">Connect your first bank account to get started</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {personalAccounts.map((account) => (
        <Card key={account.id} className="border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 bg-white group hover:scale-105 cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
              <h3 className="text-lg font-semibold text-gray-900">Personal Account</h3>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">{account.account_name}</p>
              <p className="text-sm font-medium text-gray-700">{account.institution}</p>
            </div>
            
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-green-600">{formatCurrency(Number(account.balance))}</span>
            </div>
            
            <p className="text-xs text-gray-600 mt-3">Last synced: Recently</p>
          </CardContent>
        </Card>
      ))}
      
      {businessAccounts.map((account) => (
        <Card key={account.id} className="border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 bg-white group hover:scale-105 cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
              <h3 className="text-lg font-semibold text-gray-900">Business Account</h3>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">{account.account_name}</p>
              <p className="text-sm font-medium text-gray-700">{account.institution}</p>
            </div>
            
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-green-600">{formatCurrency(Number(account.balance))}</span>
            </div>
            
            <p className="text-xs text-gray-600 mt-3">Last synced: Recently</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
