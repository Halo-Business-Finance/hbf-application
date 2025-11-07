import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Mail, MessageSquare, Smartphone, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  notificationPreferencesService,
  NotificationPreferences,
  notificationEventLabels,
  notificationEventDescriptions,
} from '@/services/notificationPreferencesService';

const NotificationPreferencesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const prefs = await notificationPreferencesService.getPreferences();
      setPreferences(prefs);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load notification preferences',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (
    eventType: keyof NotificationPreferences,
    channel: 'email' | 'in_app' | 'sms',
    enabled: boolean
  ) => {
    if (!preferences) return;

    setPreferences({
      ...preferences,
      [eventType]: {
        ...preferences[eventType],
        [channel]: enabled,
      },
    });
  };

  const handleSave = async () => {
    if (!preferences) return;

    setSaving(true);
    try {
      await notificationPreferencesService.updatePreferences(preferences);
      toast({
        title: 'Success',
        description: 'Notification preferences saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save notification preferences',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAllChannel = async (channel: 'email' | 'in_app' | 'sms', enabled: boolean) => {
    if (!preferences) return;

    const updated = { ...preferences };
    Object.keys(updated).forEach((key) => {
      updated[key as keyof NotificationPreferences][channel] = enabled;
    });
    setPreferences(updated);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-6 max-w-4xl">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="container mx-auto p-4 md:p-6 max-w-4xl">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Failed to load preferences</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/portal')} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Portal
        </Button>
        <h1 className="text-3xl font-bold text-foreground">Notification Preferences</h1>
        <p className="text-muted-foreground mt-2">
          Customize how you want to receive notifications for different events
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Toggle all notifications for each channel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                <Label>All Email</Label>
              </div>
              <Switch
                checked={Object.values(preferences).every((p) => p.email)}
                onCheckedChange={(checked) => handleToggleAllChannel('email', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                <Label>All In-App</Label>
              </div>
              <Switch
                checked={Object.values(preferences).every((p) => p.in_app)}
                onCheckedChange={(checked) => handleToggleAllChannel('in_app', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-primary" />
                <Label>All SMS</Label>
              </div>
              <Switch
                checked={Object.values(preferences).every((p) => p.sms)}
                onCheckedChange={(checked) => handleToggleAllChannel('sms', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Event Preferences</CardTitle>
          <CardDescription>
            Choose which channels you want to receive notifications for each event type
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(preferences).map(([eventKey, eventPrefs], index) => (
            <div key={eventKey}>
              {index > 0 && <Separator className="my-4" />}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {notificationEventLabels[eventKey as keyof NotificationPreferences]}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {notificationEventDescriptions[eventKey as keyof NotificationPreferences]}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <Label className="text-sm">Email</Label>
                    </div>
                    <Switch
                      checked={eventPrefs.email}
                      onCheckedChange={(checked) =>
                        handleToggle(eventKey as keyof NotificationPreferences, 'email', checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-muted-foreground" />
                      <Label className="text-sm">In-App</Label>
                    </div>
                    <Switch
                      checked={eventPrefs.in_app}
                      onCheckedChange={(checked) =>
                        handleToggle(eventKey as keyof NotificationPreferences, 'in_app', checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-muted-foreground" />
                      <Label className="text-sm">SMS</Label>
                    </div>
                    <Switch
                      checked={eventPrefs.sms}
                      onCheckedChange={(checked) =>
                        handleToggle(eventKey as keyof NotificationPreferences, 'sms', checked)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  );
};

export default NotificationPreferencesPage;
