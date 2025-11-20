import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Wallet, TrendingUp } from 'lucide-react';

export const DashboardOverview = () => {
  const [totalBalance] = useState(338130);
  const [averageScore] = useState<number | null>(785);
  const [isLoading] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Card className="border-2 border-blue-950 bg-gradient-to-br from-blue-950 to-blue-900 shadow-lg">
        <CardContent className="p-8">
          <div className="animate-pulse flex items-center justify-between">
            <div className="space-y-3 flex-1">
              <div className="h-6 bg-white/20 rounded w-1/4"></div>
              <div className="h-10 bg-white/20 rounded w-1/2"></div>
            </div>
            <div className="space-y-3 flex-1 text-right">
              <div className="h-6 bg-white/20 rounded w-1/4 ml-auto"></div>
              <div className="h-10 bg-white/20 rounded w-1/2 ml-auto"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-blue-950 bg-gradient-to-br from-blue-950 to-blue-900 shadow-lg hover:shadow-xl transition-all duration-200">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Balance */}
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-all duration-200 cursor-pointer hover:scale-105">
            <div className="p-2 bg-white/10 rounded-lg">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/70 uppercase tracking-wide mb-1">Total Balance</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalBalance)}</p>
            </div>
          </div>

          {/* Average Credit Score */}
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-all duration-200 cursor-pointer hover:scale-105">
            <div className="p-2 bg-white/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/70 uppercase tracking-wide mb-1">Average Credit Score</p>
              <p className="text-2xl font-bold text-white">
                {averageScore !== null ? averageScore : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
