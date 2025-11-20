import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  FileText, 
  AlertCircle,
  User,
  Mail,
  Phone,
  Building,
  Edit,
  Save,
  X,
  LogOut
} from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CreditScoreWidget } from '@/components/CreditScoreWidget';
import { BankBalanceWidget } from '@/components/BankBalanceWidget';

const profileSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required").max(100, "First name must be less than 100 characters"),
  last_name: z.string().trim().min(1, "Last name is required").max(100, "Last name must be less than 100 characters"),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(20, "Phone number must be less than 20 characters").optional().or(z.literal('')),
});

const BorrowerPortal = () => {
  const { authenticated, loading, user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loadingData, setLoadingData] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userProfile, setUserProfile] = useState<{ 
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    phone: string | null;
  } | null>(null);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (!loading && !authenticated) {
      navigate('/');
      return;
    }

    if (authenticated) {
      loadPortalData();
    }
  }, [authenticated, loading, navigate]);

  const loadPortalData = async () => {
    try {
      // Fetch user profile
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('first_name, last_name, phone')
          .eq('id', user.id)
          .maybeSingle();
        
        if (profileData) {
          setUserProfile({
            ...profileData,
            email: user.email || null
          });
          form.reset({
            first_name: profileData.first_name || '',
            last_name: profileData.last_name || '',
            phone: profileData.phone || '',
          });
        } else {
          // If no profile exists, use user email
          setUserProfile({
            first_name: null,
            last_name: null,
            email: user.email || null,
            phone: null,
          });
          form.reset({
            first_name: '',
            last_name: '',
            phone: '',
          });
        }
      }
    } catch (error) {
      console.error('Error loading portal data:', error);
      toast({
        title: "Error",
        description: "Failed to load portal data",
        variant: "destructive"
      });
    } finally {
      setLoadingData(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke('update_profile', {
        body: {
          first_name: values.first_name,
          last_name: values.last_name,
          phone: values.phone || '',
        },
      });

      if (error) throw error;

      setUserProfile({
        ...userProfile,
        first_name: values.first_name,
        last_name: values.last_name,
        phone: values.phone || null,
      });

      setIsEditing(false);
      toast({
        title: "Success",
        description: "Your profile has been updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: `Failed to update profile: ${error?.message || JSON.stringify(error)}`,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    form.reset({
      first_name: userProfile?.first_name || '',
      last_name: userProfile?.last_name || '',
      phone: userProfile?.phone || '',
    });
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
      navigate('/');
    } catch (error: any) {
      console.error('Error logging out:', error);
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive"
      });
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Loading your portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="space-y-4 sm:space-y-6">
          {/* Dashboard Widgets */}
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            <CreditScoreWidget />
            <BankBalanceWidget />
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight mb-2">My Account</h2>
            <p className="text-sm sm:text-base text-foreground">Manage your account information and preferences</p>
          </div>

          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </div>
                  {!isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                disabled={!isEditing}
                                className={!isEditing ? "bg-muted/50" : ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="last_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input 
                                {...field}
                                disabled={!isEditing}
                                className={!isEditing ? "bg-muted/50" : ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </Label>
                      <Input 
                        value={userProfile?.email || user?.email || ''} 
                        readOnly 
                        className="bg-muted/50"
                      />
                      <p className="text-xs text-foreground">Email cannot be changed here</p>
                    </div>
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            Phone
                          </FormLabel>
                          <FormControl>
                            <Input 
                              {...field}
                              disabled={!isEditing}
                              className={!isEditing ? "bg-muted/50" : ""}
                              placeholder="Not provided"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {isEditing && (
                      <div className="flex flex-col sm:flex-row gap-2 pt-4">
                        <Button 
                          type="submit" 
                          className="flex-1"
                          disabled={isSaving}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={handleCancelEdit}
                          disabled={isSaving}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/change-email')}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Change Email
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/change-password')}
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/two-factor-auth')}
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Two-Factor Authentication
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast({
                    title: "Coming Soon",
                    description: "Notification preferences will be available soon."
                  })}
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Notification Preferences
                </Button>
                <Button 
                  variant="destructive" 
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowerPortal;
