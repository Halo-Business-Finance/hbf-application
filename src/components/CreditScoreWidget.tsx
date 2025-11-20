import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CreditScore {
  id: string;
  score: number;
  bureau: string;
  score_date: string;
}

interface ScoreWithChange extends CreditScore {
  change: number;
  previousScore: number | null;
}

export const CreditScoreWidget = () => {
  const [filter, setFilter] = useState<'all' | string>('all');
  const [scores] = useState<ScoreWithChange[]>([
    {
      id: '1',
      score: 785,
      bureau: 'experian',
      score_date: '2025-11-15',
      change: 12,
      previousScore: 773
    },
    {
      id: '2',
      score: 792,
      bureau: 'equifax',
      score_date: '2025-11-15',
      change: -5,
      previousScore: 797
    },
    {
      id: '3',
      score: 778,
      bureau: 'transunion',
      score_date: '2025-11-15',
      change: 8,
      previousScore: 770
    }
  ]);
  const [isLoading] = useState(false);

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

  const displayedScores = filter === 'all' ? scores : scores.filter(s => s.bureau === filter);

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
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            filter === 'all' 
              ? 'bg-blue-600 text-white shadow-sm' 
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          All Bureaus ({scores.length})
        </button>
        {scores.map((score) => (
          <button
            key={score.bureau}
            onClick={() => setFilter(score.bureau)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === score.bureau 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {getBureauDisplay(score.bureau)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedScores.map((score) => {
        const scoreColor = score.score >= 740 ? 'text-green-600' : score.score >= 670 ? 'text-yellow-600' : 'text-orange-600';
        const changeColor = score.change > 0 ? 'text-green-600' : score.change < 0 ? 'text-red-600' : 'text-gray-500';
        const ChangeIcon = score.change > 0 ? TrendingUp : score.change < 0 ? TrendingDown : Minus;
        const changeText = score.change === 0 ? 'No Change' : `${score.change > 0 ? '+' : ''}${score.change} Point${Math.abs(score.change) !== 1 ? 's' : ''}`;
        
        return (
          <Card key={score.id} className="border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 bg-white group hover:scale-105 cursor-pointer">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{getBureauDisplay(score.bureau)}</h3>
              
              <div className="flex items-baseline gap-2 mb-2">
                <span className={`text-6xl font-bold ${scoreColor} group-hover:scale-105 transition-transform duration-200`}>{score.score}</span>
                <span className="text-gray-600 text-lg">out of 850</span>
              </div>
              
              <div className="flex items-center gap-3 mb-3">
                <div className={`flex items-center gap-1 text-sm ${changeColor}`}>
                  <ChangeIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  <span>{changeText}</span>
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
    </div>
  );
};
