import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Bell, Mail, Database, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const SystemSettings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<Record<string, any>>({});

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*');
      
      if (error) throw error;
      
      const settingsMap = data.reduce((acc, setting) => {
        acc[setting.setting_key] = setting.setting_value;
        return acc;
      }, {} as Record<string, any>);
      
      setSettings(settingsMap);
    } catch (error: any) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    try {
      const { error } = await supabase
        .from('system_settings')
        .update({ setting_value: value })
        .eq('setting_key', key);
      
      if (error) throw error;
      
      setSettings(prev => ({ ...prev, [key]: value }));
      toast.success('Setting updated successfully');
    } catch (error: any) {
      console.error('Error updating setting:', error);
      toast.error('Failed to update setting');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <Button variant="ghost" onClick={() => navigate('/admin')} className="mb-4">
            ← Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold mb-2">System Settings</h1>
          <p className="text-muted-foreground">Configure system-wide settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <Switch
                  id="email-notifications"
                  checked={settings.notification_email_enabled?.enabled ?? true}
                  onCheckedChange={(checked) => 
                    updateSetting('notification_email_enabled', { enabled: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sms-notifications">SMS Notifications</Label>
                <Switch
                  id="sms-notifications"
                  checked={settings.notification_sms_enabled?.enabled ?? false}
                  onCheckedChange={(checked) => 
                    updateSetting('notification_sms_enabled', { enabled: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="system-notifications">System Notifications</Label>
                <Switch
                  id="system-notifications"
                  checked={settings.notification_system_enabled?.enabled ?? true}
                  onCheckedChange={(checked) => 
                    updateSetting('notification_system_enabled', { enabled: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Email Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email Templates
              </CardTitle>
              <CardDescription>Manage welcome email template</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-subject">Email Subject</Label>
                <Input
                  id="email-subject"
                  value={settings.email_template_welcome?.subject ?? ''}
                  onChange={(e) => 
                    updateSetting('email_template_welcome', {
                      ...settings.email_template_welcome,
                      subject: e.target.value
                    })
                  }
                  placeholder="Welcome to Our Platform"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-body">Email Body</Label>
                <Textarea
                  id="email-body"
                  value={settings.email_template_welcome?.body ?? ''}
                  onChange={(e) => 
                    updateSetting('email_template_welcome', {
                      ...settings.email_template_welcome,
                      body: e.target.value
                    })
                  }
                  placeholder="Welcome {{name}}!"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">Use {`{{name}}`} for user name</p>
              </div>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Data Retention
              </CardTitle>
              <CardDescription>Configure data retention policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="applications-retention">Applications Retention (days)</Label>
                <Input
                  id="applications-retention"
                  type="number"
                  value={settings.data_retention_days?.applications ?? 365}
                  onChange={(e) => 
                    updateSetting('data_retention_days', {
                      ...settings.data_retention_days,
                      applications: parseInt(e.target.value)
                    })
                  }
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logs-retention">Logs Retention (days)</Label>
                <Input
                  id="logs-retention"
                  type="number"
                  value={settings.data_retention_days?.logs ?? 90}
                  onChange={(e) => 
                    updateSetting('data_retention_days', {
                      ...settings.data_retention_days,
                      logs: parseInt(e.target.value)
                    })
                  }
                  min="1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Manage security and authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password-length">Minimum Password Length</Label>
                <Input
                  id="password-length"
                  type="number"
                  value={settings.security_password_min_length?.value ?? 8}
                  onChange={(e) => 
                    updateSetting('security_password_min_length', {
                      value: parseInt(e.target.value)
                    })
                  }
                  min="6"
                  max="20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input
                  id="session-timeout"
                  type="number"
                  value={settings.security_session_timeout?.minutes ?? 60}
                  onChange={(e) => 
                    updateSetting('security_session_timeout', {
                      minutes: parseInt(e.target.value)
                    })
                  }
                  min="5"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
