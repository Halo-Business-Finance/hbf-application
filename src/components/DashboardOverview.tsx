import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Wallet, TrendingUp } from 'lucide-react';

export const DashboardOverview = () => {
  const [totalBalance, setTotalBalance] = useState(0);
  const [averageScore, setAverageScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      // Fetch bank accounts
      const { data: accounts } = await supabase
        .from('bank_accounts')
        .select('balance')
        .eq('user_id', user.user.id)
        .eq('status', 'active');

      // Fetch credit scores
      const { data: scores } = await supabase
        .from('credit_scores')
        .select('score, bureau, score_date')
        .eq('user_id', user.user.id)
        .order('score_date', { ascending: false });

      // Calculate total balance
      const total = accounts?.reduce((sum, acc) => sum + Number(acc.balance), 0) || 0;
      setTotalBalance(total);

      // Calculate average score (get latest score per bureau)
      if (scores && scores.length > 0) {
        const bureauMap = new Map<string, number>();
        scores.forEach(score => {
          if (!bureauMap.has(score.bureau)) {
            bureauMap.set(score.bureau, score.score);
          }
        });
        const avg = Math.round(Array.from(bureauMap.values()).reduce((sum, s) => sum + s, 0) / bureauMap.size);
        setAverageScore(avg);
      }
    } catch (error) {
      console.error('Error loading overview data:', error);
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
