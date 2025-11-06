import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  FileText, 
  AlertCircle,
  User,
  Mail,
  Phone,
  Building
} from 'lucide-react';

const BorrowerPortal = () => {
  const { authenticated, loading, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loadingData, setLoadingData] = useState(true);
  const [userProfile, setUserProfile] = useState<{ 
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    phone: string | null;
    business_name: string | null;
  } | null>(null);

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
          .select('first_name, last_name, phone, business_name')
          .eq('id', user.id)
          .single();
        
        if (profileData) {
          setUserProfile({
            ...profileData,
            email: user.email || null
          });
        } else {
          // If no profile exists, use user email
          setUserProfile({
            first_name: null,
            last_name: null,
            email: user.email || null,
            phone: null,
            business_name: null
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

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">My Account</h2>
            <p className="text-muted-foreground">Manage your account information and preferences</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input 
                    value={userProfile?.first_name || ''} 
                    readOnly 
                    className="bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input 
                    value={userProfile?.last_name || ''} 
                    readOnly 
                    className="bg-muted/50"
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
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone
                  </Label>
                  <Input 
                    value={userProfile?.phone || 'Not provided'} 
                    readOnly 
                    className="bg-muted/50"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Business Information
                </CardTitle>
                <CardDescription>Your business details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Business Name</Label>
                  <Input 
                    value={userProfile?.business_name || 'Not provided'} 
                    readOnly 
                    className="bg-muted/50"
                  />
                </div>
                <div className="pt-4">
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => toast({
                      title: "Coming Soon",
                      description: "Profile editing feature will be available soon."
                    })}
                  >
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
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
                onClick={() => navigate('/document-storage')}
              >
                <FileText className="w-4 h-4 mr-2" />
                Document Storage
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BorrowerPortal;
