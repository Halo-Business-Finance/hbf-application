import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, Building2, User, TrendingUp, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function CreditReports() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading credit reports
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Mock data - this will be replaced with actual API data
  const personalCreditReport = {
    score: 720,
    provider: 'Experian',
    pulledDate: '2024-01-15',
    status: 'Good',
    accounts: [
      { type: 'Credit Card', balance: 5000, limit: 10000, status: 'Current' },
      { type: 'Auto Loan', balance: 15000, limit: 25000, status: 'Current' },
    ],
    inquiries: 2,
    publicRecords: 0,
  };

  const businessCreditReport = {
    score: 75,
    provider: 'Dun & Bradstreet',
    pulledDate: '2024-01-15',
    rating: 'Low Risk',
    tradelines: [
      { vendor: 'Office Supplies Inc', balance: 2500, terms: 'Net 30', status: 'Current' },
      { vendor: 'Equipment Leasing Co', balance: 8000, terms: 'Net 45', status: 'Current' },
    ],
    paymentHistory: 'Excellent',
    yearsInBusiness: 5,
  };

  const getScoreColor = (score: number) => {
    if (score >= 700) return 'text-green-600';
    if (score >= 600) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Credit Reports</h1>
          <p className="text-muted-foreground">View your personal and business credit information</p>
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Credit Report Information</AlertTitle>
        <AlertDescription>
          Credit reports are pulled through our secure third-party APIs. Your information is protected and only accessible to authorized parties.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Personal Credit
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Business Credit
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Credit Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getScoreColor(personalCreditReport.score)}`}>
                  {personalCreditReport.score}
                </div>
                <p className="text-xs text-muted-foreground">{personalCreditReport.status}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Provider</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{personalCreditReport.provider}</div>
                <p className="text-xs text-muted-foreground">Report Date: {personalCreditReport.pulledDate}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Credit Inquiries</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{personalCreditReport.inquiries}</div>
                <p className="text-xs text-muted-foreground">Last 12 months</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Public Records</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{personalCreditReport.publicRecords}</div>
                <p className="text-xs text-muted-foreground">None found</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Credit Accounts</CardTitle>
              <CardDescription>Your open credit accounts and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {personalCreditReport.accounts.map((account, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{account.type}</p>
                        <p className="text-sm text-muted-foreground">
                          ${account.balance.toLocaleString()} / ${account.limit.toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="outline">{account.status}</Badge>
                    </div>
                    {index < personalCreditReport.accounts.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Business Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{businessCreditReport.score}</div>
                <p className="text-xs text-muted-foreground">{businessCreditReport.rating}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Provider</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{businessCreditReport.provider}</div>
                <p className="text-xs text-muted-foreground">Report Date: {businessCreditReport.pulledDate}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Payment History</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{businessCreditReport.paymentHistory}</div>
                <p className="text-xs text-muted-foreground">On-time payments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Years in Business</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{businessCreditReport.yearsInBusiness}</div>
                <p className="text-xs text-muted-foreground">Established business</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Trade Lines</CardTitle>
              <CardDescription>Your business credit accounts and payment terms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {businessCreditReport.tradelines.map((trade, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{trade.vendor}</p>
                        <p className="text-sm text-muted-foreground">
                          ${trade.balance.toLocaleString()} • {trade.terms}
                        </p>
                      </div>
                      <Badge variant="outline">{trade.status}</Badge>
                    </div>
                    {index < businessCreditReport.tradelines.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
