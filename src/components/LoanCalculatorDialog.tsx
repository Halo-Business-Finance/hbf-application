import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ModernTabs as Tabs, ModernTabsContent as TabsContent, ModernTabsList as TabsList, ModernTabsTrigger as TabsTrigger } from '@/components/ui/modern-tabs';
import { Calculator, DollarSign, Percent, Calendar } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

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

interface LoanCalculatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoanCalculatorDialog({ open, onOpenChange }: LoanCalculatorDialogProps) {
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
      interestOnlyPayment = principal * monthlyRate;
      
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

      const remainingMonths = totalMonths - interestOnlyMonths;
      const principalAndInterestPayment = 
        (balance * monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) /
        (Math.pow(1 + monthlyRate, remainingMonths) - 1);

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
                     (principalAndInterestPayment * (totalMonths - interestOnlyMonths));
      totalInterest = totalPayment - principal;
    } else {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-900 flex items-center gap-2">
            <Calculator className="w-6 h-6" />
            Loan Calculator
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(90vh-120px)] pr-4">
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-blue-900">Loan Details</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="dialog-loanType">Loan Type</Label>
                  <Select value={loanType} onValueChange={setLoanType}>
                    <SelectTrigger id="dialog-loanType">
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
                  <Label htmlFor="dialog-loanAmount" className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Loan Amount
                  </Label>
                  <Input
                    id="dialog-loanAmount"
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    placeholder="250000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dialog-interestRate" className="flex items-center gap-2">
                    <Percent className="w-4 h-4" />
                    Annual Interest Rate (%)
                  </Label>
                  <Input
                    id="dialog-interestRate"
                    type="number"
                    step="0.01"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    placeholder="6.5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dialog-loanTerm" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Loan Term (Years)
                  </Label>
                  <Input
                    id="dialog-loanTerm"
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                    placeholder="20"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="dialog-interestOnly">Interest-Only Period</Label>
                    <p className="text-xs text-muted-foreground">
                      Pay only interest for an initial period
                    </p>
                  </div>
                  <Switch
                    id="dialog-interestOnly"
                    checked={interestOnly}
                    onCheckedChange={setInterestOnly}
                  />
                </div>

                {interestOnly && (
                  <div className="space-y-2">
                    <Label htmlFor="dialog-interestOnlyPeriod">Interest-Only Period (Years)</Label>
                    <Input
                      id="dialog-interestOnlyPeriod"
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
              </div>

              {/* Results Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-blue-900">Payment Summary</h3>
                
                {result ? (
                  <div className="space-y-4">
                    {result.interestOnlyPayment && (
                      <div className="p-4 border rounded-lg bg-blue-50">
                        <p className="text-sm text-muted-foreground mb-1">Interest-Only Payment</p>
                        <p className="text-2xl font-bold text-blue-900">
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
                      <p className="text-2xl font-bold text-blue-900">
                        {formatCurrency(result.monthlyPayment)}/mo
                      </p>
                      {result.interestOnlyPayment && (
                        <p className="text-xs text-muted-foreground mt-1">
                          After interest-only period
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 border rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Total Payment</p>
                        <p className="text-lg font-semibold">{formatCurrency(result.totalPayment)}</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Total Interest</p>
                        <p className="text-lg font-semibold">{formatCurrency(result.totalInterest)}</p>
                      </div>
                    </div>

                    <div className="p-3 border rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Principal Amount</p>
                      <p className="text-lg font-semibold">{formatCurrency(result.principalPaid)}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Calculator className="w-12 h-12 text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Enter loan details and click Calculate
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Amortization Schedule */}
            {amortization.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-blue-900">Amortization Schedule</h3>
                
                <Tabs defaultValue="yearly">
                  <TabsList className="mb-4 grid w-full grid-cols-2">
                    <TabsTrigger value="yearly">Yearly Summary</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly Details</TabsTrigger>
                  </TabsList>

                  <TabsContent value="yearly">
                    <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                      <div className="space-y-4">
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
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="monthly">
                    <ScrollArea className="h-[300px] w-full rounded-md border">
                      <div className="p-4">
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
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
