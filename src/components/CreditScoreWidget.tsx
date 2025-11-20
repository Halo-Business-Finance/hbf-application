import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp } from 'lucide-react';

interface CreditScore {
  id: string;
  score: number;
  bureau: string;
  score_date: string;
}

export const CreditScoreWidget = () => {
  const [scores, setScores] = useState<CreditScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCreditScores();
  }, []);

  const loadCreditScores = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('credit_scores')
        .select('*')
        .eq('user_id', user.user.id)
        .order('score_date', { ascending: false })
        .limit(3);

      if (error) throw error;
      setScores(data || []);
    } catch (error) {
      console.error('Error loading credit scores:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreRating = (score: number) => {
    if (score >= 800) return 'Exceptional';
    if (score >= 740) return 'Very Good';
    if (score >= 670) return 'Good';
    if (score >= 580) return 'Fair';
    return 'Poor';
  };

  const getBureauDisplay = (bureau: string) => {
    const bureaus = {
      experian: 'Experian',
      equifax: 'Equifax',
      transunion: 'TransUnion'
    };
    return bureaus[bureau as keyof typeof bureaus] || bureau;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border border-gray-200 shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-16 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (scores.length === 0) {
    return (
      <Card className="border border-gray-200 shadow-sm bg-white">
        <CardContent className="p-6">
          <p className="text-sm text-gray-700">No credit scores available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {scores.map((score) => {
        const scoreColor = score.score >= 740 ? 'text-green-600' : score.score >= 670 ? 'text-yellow-600' : 'text-orange-600';
        const changeColor = 'text-green-600';
        
        return (
          <Card key={score.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{getBureauDisplay(score.bureau)}</h3>
              
              <div className="flex items-baseline gap-2 mb-2">
                <span className={`text-6xl font-bold ${scoreColor}`}>{score.score}</span>
                <span className="text-gray-600 text-lg">out of 850</span>
              </div>
              
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>+1 Point</span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-sm font-medium text-gray-700">{getScoreRating(score.score)}</span>
              </div>
              
              <p className="text-sm text-gray-600">Checked daily</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
