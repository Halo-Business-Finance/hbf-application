import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ModernTabs as Tabs, ModernTabsContent as TabsContent, ModernTabsList as TabsList, ModernTabsTrigger as TabsTrigger } from '@/components/ui/modern-tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Landmark, TrendingUp, DollarSign, Calendar, Building2, User, Plus, Trash2 } from 'lucide-react';

interface BankAccount {
  id: string;
  account_name: string;
  account_number: string;
  account_type: string;
  balance: number;
  currency: string;
  institution: string;
  is_business: boolean;
  status: string;
  updated_at: string;
}

interface NewAccountForm {
  account_name: string;
  account_number: string;
  account_type: string;
  institution: string;
  balance: string;
  is_business: boolean;
}

const BankAccounts = () => {
  const { authenticated, loading, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loadingData, setLoadingData] = useState(true);
  const [personalAccounts, setPersonalAccounts] = useState<BankAccount[]>([]);
  const [businessAccounts, setBusinessAccounts] = useState<BankAccount[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteAccountId, setDeleteAccountId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newAccount, setNewAccount] = useState<NewAccountForm>({
    account_name: '',
    account_number: '',
    account_type: 'Checking',
    institution: '',
    balance: '0',
    is_business: false
  });

  useEffect(() => {
    if (!loading && !authenticated) {
      navigate('/');
      return;
    }

    if (authenticated) {
      loadBankAccounts();
    }
  }, [authenticated, loading, navigate]);

  const loadBankAccounts = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const personal = data?.filter(account => !account.is_business) || [];
      const business = data?.filter(account => account.is_business) || [];

      setPersonalAccounts(personal);
      setBusinessAccounts(business);
    } catch (error) {
      console.error('Error loading bank accounts:', error);
      toast({
        title: "Error",
        description: "Failed to load bank accounts",
        variant: "destructive"
      });
    } finally {
      setLoadingData(false);
    }
  };

  const handleAddAccount = async () => {
    try {
      if (!user) return;

      if (!newAccount.account_name || !newAccount.account_number || !newAccount.institution) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('bank_accounts')
        .insert([{
          user_id: user.id,
          account_name: newAccount.account_name.trim(),
          account_number: newAccount.account_number.trim(),
          account_type: newAccount.account_type,
          institution: newAccount.institution.trim(),
          balance: parseFloat(newAccount.balance) || 0,
          is_business: newAccount.is_business,
          status: 'active'
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Bank account added successfully"
      });

      setIsAddDialogOpen(false);
      setNewAccount({
        account_name: '',
        account_number: '',
        account_type: 'Checking',
        institution: '',
        balance: '0',
        is_business: false
      });
      
      loadBankAccounts();
    } catch (error) {
      console.error('Error adding bank account:', error);
      toast({
        title: "Error",
        description: "Failed to add bank account",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteAccountId) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('bank_accounts')
        .delete()
        .eq('id', deleteAccountId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Bank account deleted successfully"
      });

      setDeleteAccountId(null);
      loadBankAccounts();
    } catch (error) {
      console.error('Error deleting bank account:', error);
      toast({
        title: "Error",
        description: "Failed to delete bank account",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { variant: 'default' as const, className: 'bg-green-100 text-green-800' },
      pending: { variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800' },
      closed: { variant: 'destructive' as const, className: '' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;

    return (
      <Badge variant={config.variant} className={config.className}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateTotalBalance = (accounts: BankAccount[]) => {
    return accounts.reduce((sum, account) => sum + account.balance, 0);
  };

  const renderAccountCard = (account: BankAccount) => (
    <Card key={account.id}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Landmark className="w-5 h-5" />
              {account.account_name}
            </CardTitle>
            <CardDescription>{account.institution}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(account.status)}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteAccountId(account.id)}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Account Number</p>
            <p className="font-mono font-semibold">{account.account_number}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Account Type</p>
            <p className="font-semibold">{account.account_type}</p>
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(account.balance)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-muted-foreground" />
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>
            Last updated: {new Date(account.updated_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading bank accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight mb-2">Bank Accounts</h1>
            <p className="text-muted-foreground">
              View and manage your personal and business bank accounts
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Account
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Bank Account</DialogTitle>
                <DialogDescription>
                  Add a new personal or business bank account
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="account_name">Account Name *</Label>
                  <Input
                    id="account_name"
                    placeholder="e.g., Personal Checking"
                    value={newAccount.account_name}
                    onChange={(e) => setNewAccount({ ...newAccount, account_name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="institution">Institution *</Label>
                  <Input
                    id="institution"
                    placeholder="e.g., Chase Bank"
                    value={newAccount.institution}
                    onChange={(e) => setNewAccount({ ...newAccount, institution: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="account_number">Account Number *</Label>
                  <Input
                    id="account_number"
                    placeholder="e.g., ****1234"
                    value={newAccount.account_number}
                    onChange={(e) => setNewAccount({ ...newAccount, account_number: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="account_type">Account Type</Label>
                  <Select
                    value={newAccount.account_type}
                    onValueChange={(value) => setNewAccount({ ...newAccount, account_type: value })}
                  >
                    <SelectTrigger id="account_type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Checking">Checking</SelectItem>
                      <SelectItem value="Savings">Savings</SelectItem>
                      <SelectItem value="Business Checking">Business Checking</SelectItem>
                      <SelectItem value="Business Savings">Business Savings</SelectItem>
                      <SelectItem value="Money Market">Money Market</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="balance">Current Balance</Label>
                  <Input
                    id="balance"
                    type="number"
                    placeholder="0.00"
                    value={newAccount.balance}
                    onChange={(e) => setNewAccount({ ...newAccount, balance: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_business"
                    checked={newAccount.is_business}
                    onChange={(e) => setNewAccount({ ...newAccount, is_business: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="is_business" className="cursor-pointer">
                    This is a business account
                  </Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddAccount}>Add Account</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <AlertDialog open={!!deleteAccountId} onOpenChange={() => setDeleteAccountId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Bank Account</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this bank account? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="personal" count={personalAccounts.length}>
            Personal Accounts
          </TabsTrigger>
          <TabsTrigger value="business" count={businessAccounts.length}>
            Business Accounts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Personal Balance</p>
                  <p className="text-3xl font-bold">
                    {formatCurrency(calculateTotalBalance(personalAccounts))}
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 text-primary" />
              </div>
            </CardContent>
          </Card>

          {personalAccounts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {personalAccounts.map(renderAccountCard)}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Landmark className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Personal Accounts</h3>
                <p className="text-muted-foreground mb-4">
                  Connect your first personal bank account to get started
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="business" className="space-y-6">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Business Balance</p>
                  <p className="text-3xl font-bold">
                    {formatCurrency(calculateTotalBalance(businessAccounts))}
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 text-primary" />
              </div>
            </CardContent>
          </Card>

          {businessAccounts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {businessAccounts.map(renderAccountCard)}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Business Accounts</h3>
                <p className="text-muted-foreground mb-4">
                  Connect your first business bank account to get started
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};

export default BankAccounts;
