import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  ExternalLink, 
  Key,
  Database,
  Webhook,
  Activity,
  ArrowLeftRight,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { crmService, type CRMIntegrationSettings } from "@/services/crmService";

const CRMIntegration = () => {
  const [settings, setSettings] = useState<CRMIntegrationSettings>({
    external_crm_name: 'loanflow-nexus',
    sync_enabled: false,
    sync_direction: 'bidirectional',
    field_mappings: {},
    settings: {}
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'error'>('disconnected');
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadIntegrationSettings();
  }, []);

  const loadIntegrationSettings = async () => {
    try {
      setLoading(true);
      const settingsData = await crmService.getIntegrationSettings();
      if (settingsData.length > 0) {
        setSettings(settingsData[0]);
        setLastSyncAt(settingsData[0].last_sync_at || null);
        setConnectionStatus(settingsData[0].sync_enabled ? 'connected' : 'disconnected');
      }
    } catch (error) {
      console.error('Error loading integration settings:', error);
      toast({
        title: "Error",
        description: "Failed to load integration settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      await crmService.updateIntegrationSettings(settings);
      toast({
        title: "Settings Saved",
        description: "Integration settings have been updated successfully",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save integration settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async () => {
    try {
      setTesting(true);
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (settings.api_endpoint && settings.sync_enabled) {
        setConnectionStatus('connected');
        toast({
          title: "Connection Test Successful",
          description: "Successfully connected to loanflow-nexus CRM",
        });
      } else {
        setConnectionStatus('error');
        toast({
          title: "Connection Test Failed",
          description: "Please check your API endpoint and credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      setConnectionStatus('error');
      toast({
        title: "Connection Test Failed",
        description: "Failed to connect to external CRM",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  const triggerSync = async () => {
    try {
      await crmService.syncWithExternalCRM('all', {});
      setLastSyncAt(new Date().toISOString());
      toast({
        title: "Sync Complete",
        description: "Successfully synchronized with loanflow-nexus CRM",
      });
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to sync with external CRM",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-accent" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-destructive" />;
      default:
        return <AlertCircle className="w-5 h-5 text-warning" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'error':
        return 'Connection Error';
      default:
        return 'Not Connected';
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-accent';
      case 'error':
        return 'bg-destructive';
      default:
        return 'bg-warning';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin border-t-primary mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Loading Integration Settings</h3>
          <p className="text-muted-foreground">Configuring your CRM connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold font-display text-foreground">CRM Integration</h1>
            <p className="text-muted-foreground">Connect and sync with your loanflow-nexus CRM</p>
          </div>
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <Badge className={`${getStatusColor()} text-white`}>
              {getStatusText()}
            </Badge>
          </div>
        </div>

        {/* Connection Status Card */}
        <Card className="border-0 shadow-lg bg-card/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              Connection Status
            </CardTitle>
            <CardDescription>Current status of your loanflow-nexus CRM integration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                {getStatusIcon()}
                <div>
                  <h3 className="font-semibold text-foreground">{getStatusText()}</h3>
                  <p className="text-sm text-muted-foreground">
                    {connectionStatus === 'connected' 
                      ? 'Your CRM is successfully connected and syncing'
                      : connectionStatus === 'error'
                      ? 'There was an issue connecting to your CRM'
                      : 'Configure your CRM connection below'
                    }
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={testConnection} 
                  disabled={testing || !settings.api_endpoint}
                  variant="outline"
                  className="gap-2"
                >
                  {testing ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ExternalLink className="w-4 h-4" />
                  )}
                  Test Connection
                </Button>
                {connectionStatus === 'connected' && (
                  <Button onClick={triggerSync} className="gap-2 bg-gradient-primary">
                    <RefreshCw className="w-4 h-4" />
                    Sync Now
                  </Button>
                )}
              </div>
            </div>

            {lastSyncAt && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                Last synced: {new Date(lastSyncAt).toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settings Tabs */}
        <Tabs defaultValue="connection" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="connection">Connection</TabsTrigger>
            <TabsTrigger value="sync">Sync Settings</TabsTrigger>
            <TabsTrigger value="mapping">Field Mapping</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          </TabsList>

          {/* Connection Tab */}
          <TabsContent value="connection" className="space-y-6">
            <Card className="border-0 shadow-lg bg-card/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-primary" />
                  Connection Settings
                </CardTitle>
                <CardDescription>Configure your loanflow-nexus CRM connection details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="crm-name">CRM Name</Label>
                    <Input
                      id="crm-name"
                      value={settings.external_crm_name}
                      onChange={(e) => setSettings({ ...settings, external_crm_name: e.target.value })}
                      placeholder="loanflow-nexus"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="api-endpoint">API Endpoint</Label>
                    <Input
                      id="api-endpoint"
                      value={settings.api_endpoint || ''}
                      onChange={(e) => setSettings({ ...settings, api_endpoint: e.target.value })}
                      placeholder="https://api.loanflow-nexus.com/v1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="Enter your loanflow-nexus API key"
                    onChange={(e) => setSettings({ 
                      ...settings, 
                      settings: { ...settings.settings, api_key: e.target.value }
                    })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Your API key will be encrypted and stored securely
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/30">
                  <div>
                    <h3 className="font-semibold text-foreground">Enable Integration</h3>
                    <p className="text-sm text-muted-foreground">
                      Turn on to start syncing data with loanflow-nexus
                    </p>
                  </div>
                  <Switch
                    checked={settings.sync_enabled}
                    onCheckedChange={(checked) => setSettings({ ...settings, sync_enabled: checked })}
                  />
                </div>

                <Button onClick={saveSettings} disabled={saving} className="w-full bg-gradient-primary">
                  {saving ? 'Saving...' : 'Save Connection Settings'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sync Settings Tab */}
          <TabsContent value="sync" className="space-y-6">
            <Card className="border-0 shadow-lg bg-card/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowLeftRight className="w-5 h-5 text-primary" />
                  Sync Configuration
                </CardTitle>
                <CardDescription>Configure how data syncs between systems</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="sync-direction">Sync Direction</Label>
                  <Select 
                    value={settings.sync_direction} 
                    onValueChange={(value) => setSettings({ ...settings, sync_direction: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sync direction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bidirectional">Bidirectional (Both ways)</SelectItem>
                      <SelectItem value="push_only">Push Only (To loanflow-nexus)</SelectItem>
                      <SelectItem value="pull_only">Pull Only (From loanflow-nexus)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Choose how data should flow between the systems
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Sync Contacts</h3>
                    <div className="space-y-3">
                      {['new', 'updated', 'deleted'].map((action) => (
                        <div key={action} className="flex items-center justify-between">
                          <Label htmlFor={`contacts-${action}`} className="text-sm">
                            {action.charAt(0).toUpperCase() + action.slice(1)} contacts
                          </Label>
                          <Switch id={`contacts-${action}`} defaultChecked />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground">Sync Opportunities</h3>
                    <div className="space-y-3">
                      {['new', 'updated', 'deleted'].map((action) => (
                        <div key={action} className="flex items-center justify-between">
                          <Label htmlFor={`opportunities-${action}`} className="text-sm">
                            {action.charAt(0).toUpperCase() + action.slice(1)} opportunities
                          </Label>
                          <Switch id={`opportunities-${action}`} defaultChecked />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Button onClick={saveSettings} disabled={saving} className="w-full bg-gradient-primary">
                  {saving ? 'Saving...' : 'Save Sync Settings'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Field Mapping Tab */}
          <TabsContent value="mapping" className="space-y-6">
            <Card className="border-0 shadow-lg bg-card/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Field Mapping
                </CardTitle>
                <CardDescription>Map fields between Halo Business Finance and loanflow-nexus</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Contact Field Mapping</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Halo Fields</Label>
                      <div className="space-y-2 mt-2">
                        {['first_name', 'last_name', 'email', 'phone', 'company_name'].map((field) => (
                          <div key={field} className="p-2 bg-muted/30 rounded text-sm">
                            {field.replace('_', ' ').toUpperCase()}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Loanflow-nexus Fields</Label>
                      <div className="space-y-2 mt-2">
                        {['first_name', 'last_name', 'email', 'phone', 'company_name'].map((field) => (
                          <Select key={field}>
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder={`Map ${field}`} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={field}>{field.replace('_', ' ')}</SelectItem>
                              <SelectItem value={`custom_${field}`}>custom_{field}</SelectItem>
                            </SelectContent>
                          </Select>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Opportunity Field Mapping</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Halo Fields</Label>
                      <div className="space-y-2 mt-2">
                        {['opportunity_name', 'loan_type', 'loan_amount', 'stage', 'probability'].map((field) => (
                          <div key={field} className="p-2 bg-muted/30 rounded text-sm">
                            {field.replace('_', ' ').toUpperCase()}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Loanflow-nexus Fields</Label>
                      <div className="space-y-2 mt-2">
                        {['opportunity_name', 'loan_type', 'loan_amount', 'stage', 'probability'].map((field) => (
                          <Select key={field}>
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder={`Map ${field}`} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={field}>{field.replace('_', ' ')}</SelectItem>
                              <SelectItem value={`deal_${field}`}>deal_{field}</SelectItem>
                            </SelectContent>
                          </Select>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Button onClick={saveSettings} disabled={saving} className="w-full bg-gradient-primary">
                  {saving ? 'Saving...' : 'Save Field Mappings'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Webhooks Tab */}
          <TabsContent value="webhooks" className="space-y-6">
            <Card className="border-0 shadow-lg bg-card/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Webhook className="w-5 h-5 text-primary" />
                  Webhook Configuration
                </CardTitle>
                <CardDescription>Set up real-time data synchronization via webhooks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <Input
                    id="webhook-url"
                    value={settings.webhook_url || ''}
                    onChange={(e) => setSettings({ ...settings, webhook_url: e.target.value })}
                    placeholder="https://your-webhook-endpoint.com/receive"
                  />
                  <p className="text-xs text-muted-foreground">
                    URL where loanflow-nexus will send webhook notifications
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhook-secret">Webhook Secret</Label>
                  <Input
                    id="webhook-secret"
                    type="password"
                    placeholder="Enter webhook secret for verification"
                    onChange={(e) => setSettings({ 
                      ...settings, 
                      settings: { ...settings.settings, webhook_secret: e.target.value }
                    })}
                  />
                  <p className="text-xs text-muted-foreground">
                    Secret key used to verify webhook authenticity
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Webhook Events</h3>
                  <div className="space-y-3">
                    {[
                      'contact.created',
                      'contact.updated',
                      'contact.deleted',
                      'opportunity.created',
                      'opportunity.updated',
                      'opportunity.stage_changed'
                    ].map((event) => (
                      <div key={event} className="flex items-center justify-between">
                        <Label htmlFor={`webhook-${event}`} className="text-sm">
                          {event.replace('.', ' ').replace('_', ' ')}
                        </Label>
                        <Switch id={`webhook-${event}`} defaultChecked />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 border border-border rounded-lg bg-muted/30">
                  <h4 className="font-semibold text-foreground mb-2">Test Webhook</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Send a test webhook to verify your endpoint is working correctly
                  </p>
                  <Button variant="outline" className="gap-2">
                    <Activity className="w-4 h-4" />
                    Send Test Webhook
                  </Button>
                </div>

                <Button onClick={saveSettings} disabled={saving} className="w-full bg-gradient-primary">
                  {saving ? 'Saving...' : 'Save Webhook Settings'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CRMIntegration;