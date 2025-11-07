import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, TrendingUp, TrendingDown, Calculator } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CreditScoreSimulator() {
  const navigate = useNavigate();
  
  // Current state
  const [currentScore, setCurrentScore] = useState(677);
  const [totalDebt, setTotalDebt] = useState(15000);
  const [creditLimit, setCreditLimit] = useState(25000);
  const [paymentHistory, setPaymentHistory] = useState(95);
  const [debtPayoff, setDebtPayoff] = useState(0);
  
  // Calculate credit utilization
  const currentUtilization = Math.round((totalDebt / creditLimit) * 100);
  const newUtilization = Math.round(((totalDebt - debtPayoff) / creditLimit) * 100);
  
  // Calculate projected score based on debt payoff
  const calculateProjectedScore = () => {
    let scoreChange = 0;
    
    // Credit utilization impact (high impact)
    const utilizationDiff = currentUtilization - newUtilization;
    if (utilizationDiff > 0) {
      if (newUtilization < 10) scoreChange += 40;
      else if (newUtilization < 30) scoreChange += 30;
      else if (newUtilization < 50) scoreChange += 20;
      else scoreChange += 10;
    }
    
    // Payment history bonus (if paying off debt)
    if (debtPayoff > 0 && paymentHistory < 100) {
      scoreChange += 5;
    }
    
    return Math.min(850, currentScore + scoreChange);
  };
  
  const projectedScore = calculateProjectedScore();
  const scoreIncrease = projectedScore - currentScore;
  
  // Credit factors breakdown
  const currentFactors = [
    { name: 'Payment History', percentage: 35, value: paymentHistory, color: 'bg-blue-500' },
    { name: 'Credit Utilization', percentage: 30, value: currentUtilization, color: 'bg-green-500' },
    { name: 'Credit Age', percentage: 15, value: 60, color: 'bg-yellow-500' },
    { name: 'Credit Mix', percentage: 10, value: 70, color: 'bg-purple-500' },
    { name: 'New Credit', percentage: 10, value: 50, color: 'bg-red-500' }
  ];
  
  const projectedFactors = [
    { name: 'Payment History', percentage: 35, value: Math.min(100, paymentHistory + (debtPayoff > 0 ? 5 : 0)), color: 'bg-blue-500' },
    { name: 'Credit Utilization', percentage: 30, value: newUtilization, color: 'bg-green-500' },
    { name: 'Credit Age', percentage: 15, value: 60, color: 'bg-yellow-500' },
    { name: 'Credit Mix', percentage: 10, value: 70, color: 'bg-purple-500' },
    { name: 'New Credit', percentage: 10, value: 50, color: 'bg-red-500' }
  ];
  
  const getScoreRating = (score: number) => {
    if (score >= 750) return { label: 'Excellent', color: 'text-green-600' };
    if (score >= 700) return { label: 'Good', color: 'text-green-500' };
    if (score >= 650) return { label: 'Fair', color: 'text-yellow-600' };
    if (score >= 600) return { label: 'Poor', color: 'text-orange-600' };
    return { label: 'Very Poor', color: 'text-red-600' };
  };
  
  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/credit-reports')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Credit Score Simulator</h1>
          <p className="text-foreground">See how paying off debt impacts your credit score</p>
        </div>
      </div>

      {/* Score Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current Score */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Current Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3">
              <div className={`text-6xl font-bold ${getScoreRating(currentScore).color}`}>
                {currentScore}
              </div>
              <div className="pb-2 text-sm text-foreground">
                out of 850
              </div>
            </div>
            <Badge className="mt-2" variant="secondary">
              {getScoreRating(currentScore).label}
            </Badge>
          </CardContent>
        </Card>

        {/* Projected Score */}
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {scoreIncrease > 0 ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-foreground" />
              )}
              Projected Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3">
              <div className={`text-6xl font-bold ${getScoreRating(projectedScore).color}`}>
                {projectedScore}
              </div>
              <div className="pb-2 text-sm text-foreground">
                out of 850
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={scoreIncrease > 0 ? 'bg-green-600' : ''}>
                {getScoreRating(projectedScore).label}
              </Badge>
              {scoreIncrease > 0 && (
                <Badge variant="outline" className="text-green-600">
                  +{scoreIncrease} points
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Simulator Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Adjust Your Finances</CardTitle>
          <CardDescription className="text-foreground">
            Move the sliders to see how different actions affect your credit score
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Total Debt */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Total Credit Card Debt</Label>
              <span className="font-semibold">${totalDebt.toLocaleString()}</span>
            </div>
            <Slider
              value={[totalDebt]}
              onValueChange={([value]) => {
                setTotalDebt(value);
                setDebtPayoff(Math.min(debtPayoff, value));
              }}
              min={0}
              max={50000}
              step={500}
              className="w-full"
            />
          </div>

          {/* Credit Limit */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Total Credit Limit</Label>
              <span className="font-semibold">${creditLimit.toLocaleString()}</span>
            </div>
            <Slider
              value={[creditLimit]}
              onValueChange={([value]) => setCreditLimit(value)}
              min={totalDebt}
              max={100000}
              step={1000}
              className="w-full"
            />
          </div>

          {/* Debt Payoff Amount */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Amount to Pay Off</Label>
              <span className="font-semibold text-green-600">${debtPayoff.toLocaleString()}</span>
            </div>
            <Slider
              value={[debtPayoff]}
              onValueChange={([value]) => setDebtPayoff(value)}
              min={0}
              max={totalDebt}
              step={100}
              className="w-full"
            />
            <p className="text-sm text-foreground">
              Remaining debt: ${(totalDebt - debtPayoff).toLocaleString()}
            </p>
          </div>

          {/* Payment History */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>On-Time Payment History</Label>
              <span className="font-semibold">{paymentHistory}%</span>
            </div>
            <Slider
              value={[paymentHistory]}
              onValueChange={([value]) => setPaymentHistory(value)}
              min={0}
              max={100}
              step={5}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Credit Utilization Impact */}
      <Card>
        <CardHeader>
          <CardTitle>Credit Utilization Impact</CardTitle>
          <CardDescription className="text-foreground">
            Your credit utilization ratio is a major factor in your credit score (30% weight)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Utilization */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Current Utilization</span>
                <span className={`font-bold ${currentUtilization > 30 ? 'text-red-600' : 'text-green-600'}`}>
                  {currentUtilization}%
                </span>
              </div>
              <Progress value={currentUtilization} className="h-3" />
              <p className="text-sm text-foreground">
                ${totalDebt.toLocaleString()} / ${creditLimit.toLocaleString()}
              </p>
            </div>

            {/* Projected Utilization */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Projected Utilization</span>
                <span className={`font-bold ${newUtilization > 30 ? 'text-red-600' : 'text-green-600'}`}>
                  {newUtilization}%
                </span>
              </div>
              <Progress value={newUtilization} className="h-3" />
              <p className="text-sm text-foreground">
                ${(totalDebt - debtPayoff).toLocaleString()} / ${creditLimit.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Utilization Guidelines:</p>
            <ul className="text-sm space-y-1 text-foreground">
              <li>• Under 10% - Excellent (maximum score boost)</li>
              <li>• 10-30% - Good (positive impact)</li>
              <li>• 30-50% - Fair (neutral to slightly negative)</li>
              <li>• Over 50% - Poor (negative impact on score)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Credit Factors Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current Factors */}
        <Card>
          <CardHeader>
            <CardTitle>Current Credit Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentFactors.map((factor, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{factor.name}</span>
                    <span className="text-foreground">{factor.percentage}% weight</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={factor.value} className="h-2 flex-1" />
                    <span className="text-sm font-semibold w-12 text-right">
                      {factor.value}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Projected Factors */}
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle>Projected Credit Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projectedFactors.map((factor, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{factor.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-foreground">{factor.percentage}% weight</span>
                      {factor.value !== currentFactors[index].value && (
                        <Badge variant="outline" className="text-green-600">
                          +{factor.value - currentFactors[index].value}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={factor.value} className="h-2 flex-1" />
                    <span className="text-sm font-semibold w-12 text-right">
                      {factor.value}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Recommendations */}
      {scoreIncrease > 0 && (
        <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-green-700 dark:text-green-300">Recommended Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {debtPayoff > 0 && (
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Pay off ${debtPayoff.toLocaleString()} in debt to reduce utilization to {newUtilization}%</span>
                </li>
              )}
              {currentUtilization > 30 && (
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Keep credit utilization under 30% for optimal credit score</span>
                </li>
              )}
              {paymentHistory < 100 && (
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Make all payments on time to improve payment history</span>
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
