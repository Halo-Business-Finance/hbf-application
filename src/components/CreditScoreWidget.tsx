import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';

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

  const getScoreColor = (score: number) => {
    if (score >= 740) return 'text-white border-orange-500 bg-orange-500';
    if (score >= 670) return 'text-white border-orange-400 bg-orange-400';
    return 'text-white border-orange-600 bg-orange-600';
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

  const averageScore = scores.length > 0 
    ? Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length)
    : null;

  if (isLoading) {
    return (
      <Card className="border border-blue-950 shadow-sm overflow-hidden bg-white">
        <CardHeader className="bg-blue-950">
          <CardTitle className="text-sm font-semibold uppercase tracking-wide text-white flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Credit Scores
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-white">
          <div className="animate-pulse space-y-3">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (scores.length === 0) {
    return (
      <Card className="border border-blue-950 shadow-sm overflow-hidden bg-white">
        <CardHeader className="bg-blue-950">
          <CardTitle className="text-sm font-semibold uppercase tracking-wide text-white flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Credit Scores
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-white">
          <p className="text-sm text-gray-700">No credit scores available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-blue-950 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden bg-white">
      <CardHeader className="bg-blue-950">
        <CardTitle className="text-sm font-semibold uppercase tracking-wide text-white flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Credit Scores
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 bg-white">
        {averageScore && (
          <div className="mb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">{averageScore}</span>
              <Badge variant="outline" className="border-gray-900 bg-gray-900/10 text-gray-900 font-semibold">
                {getScoreRating(averageScore)}
              </Badge>
            </div>
            <p className="text-xs text-gray-600 mt-1">Average across {scores.length} bureau{scores.length > 1 ? 's' : ''}</p>
          </div>
        )}
        
        <div className="space-y-3">
          {scores.map((score) => (
            <div key={score.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{getBureauDisplay(score.bureau)}</p>
                <p className="text-xs text-gray-600">
                  {new Date(score.score_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">{score.score}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
