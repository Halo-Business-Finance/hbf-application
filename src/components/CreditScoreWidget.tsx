import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [scores, setScores] = useState<ScoreWithChange[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadCreditScores();
    }
  }, [user]);

  const loadCreditScores = async () => {
    try {
      const { data, error } = await supabase
        .from('credit_scores')
        .select('*')
        .eq('user_id', user?.id)
        .order('score_date', { ascending: false });

      if (error) throw error;

      // Get latest score for each bureau and calculate changes
      const bureaus = ['experian', 'equifax', 'transunion'];
      const latestScores: ScoreWithChange[] = [];

      for (const bureau of bureaus) {
        const bureauScores = (data || [])
          .filter(s => s.bureau.toLowerCase() === bureau)
          .sort((a, b) => new Date(b.score_date).getTime() - new Date(a.score_date).getTime());

        if (bureauScores.length > 0) {
          const latest = bureauScores[0];
          const previous = bureauScores[1];
          
          latestScores.push({
            ...latest,
            change: previous ? Number(latest.score) - Number(previous.score) : 0,
            previousScore: previous ? Number(previous.score) : null
          });
        }
      }

      setScores(latestScores);
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

  const personalScores = scores.filter(s => ['transunion', 'equifax'].includes(s.bureau.toLowerCase()));
  const businessScores = scores.filter(s => !['transunion', 'equifax'].includes(s.bureau.toLowerCase()));

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
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

  const renderScoreCards = (scoreList: ScoreWithChange[]) => {
    if (scoreList.length === 0) {
      return (
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardContent className="p-6">
            <p className="text-sm text-gray-700">No credit scores available</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scoreList.map((score) => {
        const scoreColor = score.score >= 740 ? 'text-green-600' : score.score >= 670 ? 'text-yellow-600' : 'text-orange-600';
        const changeColor = score.change > 0 ? 'text-green-600' : score.change < 0 ? 'text-red-600' : 'text-gray-500';
        const ChangeIcon = score.change > 0 ? TrendingUp : score.change < 0 ? TrendingDown : Minus;
        const changeText = score.change === 0 ? 'No Change' : `${score.change > 0 ? '+' : ''}${score.change} Point${Math.abs(score.change) !== 1 ? 's' : ''}`;
        
          return (
            <Card 
              key={score.id} 
              className="border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 bg-white group cursor-pointer"
              onClick={() => navigate('/credit-reports')}
            >
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{getBureauDisplay(score.bureau)}</h3>
                
                <div className="flex items-baseline gap-2 mb-2">
                  <span className={`text-6xl font-bold ${scoreColor}`}>{score.score}</span>
                  <span className="text-gray-600 text-lg">out of 850</span>
                </div>
                
                <div className="flex items-center gap-3 mb-3">
                  <div className={`flex items-center gap-1 text-sm ${changeColor}`}>
                    <ChangeIcon className="w-4 h-4" />
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
    );
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="inline-flex h-12 items-center justify-start rounded-xl bg-black p-1 w-auto border-2 border-black">
        <TabsTrigger 
          value="personal" 
          className="relative rounded-lg px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-white data-[state=inactive]:hover:bg-white/10"
        >
          Personal Credit
          <Badge className="ml-2 bg-white/20 text-white hover:bg-white/20">{personalScores.length}</Badge>
        </TabsTrigger>
        <TabsTrigger 
          value="business"
          className="relative rounded-lg px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-white data-[state=inactive]:hover:bg-white/10"
        >
          Business Credit
          <Badge className="ml-2 bg-white/20 text-white hover:bg-white/20">{businessScores.length}</Badge>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="personal" className="mt-6">
        {renderScoreCards(personalScores)}
        <p className="text-sm text-gray-600 mt-4">Scores checked daily with VantageScore 3.0</p>
      </TabsContent>

      <TabsContent value="business" className="mt-6">
        {renderScoreCards(businessScores)}
        <p className="text-sm text-gray-600 mt-4">Scores checked daily with VantageScore 3.0</p>
      </TabsContent>
    </Tabs>
  );
};
