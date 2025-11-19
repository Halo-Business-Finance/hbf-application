import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ModernTabs as Tabs, ModernTabsContent as TabsContent, ModernTabsList as TabsList, ModernTabsTrigger as TabsTrigger } from '@/components/ui/modern-tabs';
import { Calculator, DollarSign, Percent, Calendar } from 'lucide-react';

interface CalculationResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  principalPaid: number;
  interestOnlyPayment?: number;
}

interface AmortizationEntry {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

const LoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState<string>('250000');
  const [interestRate, setInterestRate] = useState<string>('6.5');
  const [loanTerm, setLoanTerm] = useState<string>('20');
  const [loanType, setLoanType] = useState<string>('conventional');
  const [interestOnly, setInterestOnly] = useState(false);
  const [interestOnlyPeriod, setInterestOnlyPeriod] = useState<string>('5');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [amortization, setAmortization] = useState<AmortizationEntry[]>([]);

  const loanTypes = [
    { value: 'conventional', label: 'Conventional Loan' },
    { value: 'sba7a', label: 'SBA 7(a) Loan' },
    { value: 'sba504', label: 'SBA 504 Loan' },
    { value: 'sbaexpress', label: 'SBA Express Loan' },
    { value: 'bridge', label: 'Bridge Loan' },
    { value: 'term', label: 'Term Loan' },
    { value: 'loc', label: 'Business Line of Credit' },
    { value: 'equipment', label: 'Equipment Financing' },
    { value: 'invoice', label: 'Invoice Factoring' },
    { value: 'working', label: 'Working Capital Loan' },
    { value: 'refinance', label: 'Refinance' },
    { value: 'usda', label: 'USDA B&I Loan' }
  ];

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount);
    const annualRate = parseFloat(interestRate) / 100;
    const monthlyRate = annualRate / 12;
    const totalMonths = parseInt(loanTerm) * 12;
    const interestOnlyMonths = interestOnly ? parseInt(interestOnlyPeriod) * 12 : 0;

    if (isNaN(principal) || isNaN(annualRate) || isNaN(totalMonths)) {
      return;
    }

    let monthlyPayment: number;
    let interestOnlyPayment: number | undefined;
    let totalPayment: number;
    let totalInterest: number;
    const schedule: AmortizationEntry[] = [];
    let balance = principal;

    if (interestOnly && interestOnlyMonths > 0) {
      // Interest-only payment
      interestOnlyPayment = principal * monthlyRate;
      
      // Add interest-only period to schedule
      for (let i = 1; i <= interestOnlyMonths; i++) {
        const interestPayment = balance * monthlyRate;
        schedule.push({
          month: i,
          payment: interestPayment,
          principal: 0,
          interest: interestPayment,
          balance: balance
        });
      }

      // Calculate remaining principal and interest payment
      const remainingMonths = totalMonths - interestOnlyMonths;
      const principalAndInterestPayment = 
        (balance * monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) /
        (Math.pow(1 + monthlyRate, remainingMonths) - 1);

      // Add principal and interest period to schedule
      for (let i = interestOnlyMonths + 1; i <= totalMonths; i++) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = principalAndInterestPayment - interestPayment;
        balance -= principalPayment;
        
        schedule.push({
          month: i,
          payment: principalAndInterestPayment,
          principal: principalPayment,
          interest: interestPayment,
          balance: Math.max(0, balance)
        });
      }

      monthlyPayment = principalAndInterestPayment;
      totalPayment = (interestOnlyPayment * interestOnlyMonths) + 
                     (principalAndInterestPayment * remainingMonths);
      totalInterest = totalPayment - principal;
    } else {
      // Standard amortization
      monthlyPayment = 
        (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);

      for (let i = 1; i <= totalMonths; i++) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        balance -= principalPayment;
        
        schedule.push({
          month: i,
          payment: monthlyPayment,
          principal: principalPayment,
          interest: interestPayment,
          balance: Math.max(0, balance)
        });
      }

      totalPayment = monthlyPayment * totalMonths;
      totalInterest = totalPayment - principal;
    }

    setResult({
      monthlyPayment,
      totalPayment,
      totalInterest,
      principalPaid: principal,
      interestOnlyPayment
    });
    setAmortization(schedule);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2 text-blue-900 flex items-center justify-center gap-2">
            <Calculator className="w-8 h-8" />
            Loan Calculator
          </h1>
          <p className="text-muted-foreground">Calculate monthly payments and view amortization schedules</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-900">Loan Details</CardTitle>
              <CardDescription>Enter your loan information to calculate payments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="loanType">Loan Type</Label>
                <Select value={loanType} onValueChange={setLoanType}>
                  <SelectTrigger id="loanType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {loanTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="loanAmount" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Loan Amount
                </Label>
                <Input
                  id="loanAmount"
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="250000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interestRate" className="flex items-center gap-2">
                  <Percent className="w-4 h-4" />
                  Annual Interest Rate (%)
                </Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.01"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="6.5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="loanTerm" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Loan Term (Years)
                </Label>
                <Input
                  id="loanTerm"
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  placeholder="20"
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor="interestOnly">Interest-Only Period</Label>
                  <p className="text-xs text-muted-foreground">
                    Pay only interest for an initial period
                  </p>
                </div>
                <Switch
                  id="interestOnly"
                  checked={interestOnly}
                  onCheckedChange={setInterestOnly}
                />
              </div>

              {interestOnly && (
                <div className="space-y-2">
                  <Label htmlFor="interestOnlyPeriod">Interest-Only Period (Years)</Label>
                  <Input
                    id="interestOnlyPeriod"
                    type="number"
                    value={interestOnlyPeriod}
                    onChange={(e) => setInterestOnlyPeriod(e.target.value)}
                    placeholder="5"
                  />
                </div>
              )}

              <Button onClick={calculateLoan} className="w-full" size="lg">
                <Calculator className="w-4 h-4 mr-2" />
                Calculate Payment
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-900">Payment Summary</CardTitle>
              <CardDescription>Your calculated loan payment details</CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6">
                  {result.interestOnlyPayment && (
                    <div className="p-4 border rounded-lg bg-blue-50">
                      <p className="text-sm text-muted-foreground mb-1">Interest-Only Payment</p>
                      <p className="text-3xl font-bold text-blue-900">
                        {formatCurrency(result.interestOnlyPayment)}/mo
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        For the first {interestOnlyPeriod} years
                      </p>
                    </div>
                  )}

                  <div className="p-4 border rounded-lg bg-primary/5">
                    <p className="text-sm text-muted-foreground mb-1">
                      {result.interestOnlyPayment ? 'Principal & Interest Payment' : 'Monthly Payment'}
                    </p>
                    <p className="text-3xl font-bold text-blue-900">
                      {formatCurrency(result.monthlyPayment)}/mo
                    </p>
                    {result.interestOnlyPayment && (
                      <p className="text-xs text-muted-foreground mt-1">
                        After interest-only period
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Total Payment</p>
                      <p className="text-xl font-semibold">{formatCurrency(result.totalPayment)}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Total Interest</p>
                      <p className="text-xl font-semibold">{formatCurrency(result.totalInterest)}</p>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Principal Amount</p>
                    <p className="text-xl font-semibold">{formatCurrency(result.principalPaid)}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Calculator className="w-16 h-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Enter loan details and click Calculate to see your payment summary
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Amortization Schedule */}
        {amortization.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-900">Amortization Schedule</CardTitle>
              <CardDescription>Monthly breakdown of principal and interest payments</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="yearly">
                <TabsList className="mb-4 grid w-full grid-cols-2">
                  <TabsTrigger value="yearly">Yearly Summary</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly Details</TabsTrigger>
                </TabsList>

                <TabsContent value="yearly">
                  <div className="max-h-[300px] overflow-y-auto space-y-4">
                    {Array.from({ length: Math.ceil(amortization.length / 12) }, (_, yearIndex) => {
                      const year = yearIndex + 1;
                      const yearData = amortization.slice(yearIndex * 12, (yearIndex + 1) * 12);
                      const yearPayment = yearData.reduce((sum, entry) => sum + entry.payment, 0);
                      const yearPrincipal = yearData.reduce((sum, entry) => sum + entry.principal, 0);
                      const yearInterest = yearData.reduce((sum, entry) => sum + entry.interest, 0);
                      const endBalance = yearData[yearData.length - 1]?.balance || 0;

                      return (
                        <div key={year} className="p-4 border rounded-lg bg-card">
                          <div className="font-semibold mb-3 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Year {year}
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-muted-foreground">Total Payment</p>
                              <p className="font-medium">{formatCurrency(yearPayment)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Principal</p>
                              <p className="font-medium">{formatCurrency(yearPrincipal)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Interest</p>
                              <p className="font-medium">{formatCurrency(yearInterest)}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">End Balance</p>
                              <p className="font-medium">{formatCurrency(endBalance)}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="monthly">
                  <div className="max-h-[300px] overflow-y-auto border rounded-lg">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-background border-b">
                        <tr className="text-left">
                          <th className="p-2">Month</th>
                          <th className="p-2">Payment</th>
                          <th className="p-2">Principal</th>
                          <th className="p-2">Interest</th>
                          <th className="p-2">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {amortization.map((entry) => (
                          <tr key={entry.month} className="border-b hover:bg-muted/50">
                            <td className="p-2">{entry.month}</td>
                            <td className="p-2">{formatCurrency(entry.payment)}</td>
                            <td className="p-2">{formatCurrency(entry.principal)}</td>
                            <td className="p-2">{formatCurrency(entry.interest)}</td>
                            <td className="p-2">{formatCurrency(entry.balance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LoanCalculator;
