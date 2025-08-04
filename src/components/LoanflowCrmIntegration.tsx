import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, TestTube, Settings, Zap } from "lucide-react";
import { createLoanflowCrmService, DEFAULT_FIELD_MAPPING } from "@/services/loanflowCrmService";
import { Switch } from "@/components/ui/switch";

interface IntegrationSettings {
  apiEndpoint: string;
  apiKey: string;
  webhookUrl: string;
  autoSync: boolean;
  fieldMapping: Record<string, string>;
}

export function LoanflowCrmIntegration() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<IntegrationSettings>({
    apiEndpoint: '',
    apiKey: '',
    webhookUrl: '',
    autoSync: true,
    fieldMapping: DEFAULT_FIELD_MAPPING,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('loanflow-crm-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem('loanflow-crm-settings', JSON.stringify(settings));
    toast({
      title: "Settings Saved",
      description: "Your Loanflow CRM integration settings have been saved.",
    });
  };

  const testConnection = async () => {
    if (!settings.apiEndpoint && !settings.webhookUrl) {
      toast({
        title: "Configuration Required",
        description: "Please provide either an API endpoint or webhook URL.",
        variant: "destructive",
      });
      return;
    }

    setConnectionStatus('testing');
    setIsLoading(true);

    try {
      const crmService = createLoanflowCrmService({
        apiEndpoint: settings.apiEndpoint,
        apiKey: settings.apiKey,
        webhookUrl: settings.webhookUrl,
        fieldMapping: settings.fieldMapping,
      });

      const result = await crmService.testConnection();

      if (result.success) {
        setConnectionStatus('success');
        toast({
          title: "Connection Successful",
          description: "Successfully connected to Loanflow CRM.",
        });
      } else {
        setConnectionStatus('failed');
        toast({
          title: "Connection Failed",
          description: result.error || "Failed to connect to Loanflow CRM.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setConnectionStatus('failed');
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getConnectionBadge = () => {
    switch (connectionStatus) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">Connected</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'testing':
        return <Badge variant="secondary">Testing...</Badge>;
      default:
        return <Badge variant="outline">Not Tested</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Loanflow CRM Integration</h2>
          <p className="text-muted-foreground">
            Automatically sync loan applications to your Loanflow CRM system.
          </p>
        </div>
        {getConnectionBadge()}
      </div>

      <Tabs defaultValue="configuration" className="space-y-4">
        <TabsList>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="field-mapping">Field Mapping</TabsTrigger>
          <TabsTrigger value="status">Status & Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="configuration">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Connection Settings
              </CardTitle>
              <CardDescription>
                Configure your Loanflow CRM connection details. You can use either an API endpoint or a webhook URL.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="api-endpoint">API Endpoint (Optional)</Label>
                  <Input
                    id="api-endpoint"
                    placeholder="https://api.loanflow-crm.com/v1/leads"
                    value={settings.apiEndpoint}
                    onChange={(e) => setSettings(prev => ({ ...prev, apiEndpoint: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key (Optional)</Label>
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="Your API key"
                    value={settings.apiKey}
                    onChange={(e) => setSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhook-url">Webhook URL (Alternative to API)</Label>
                  <Input
                    id="webhook-url"
                    placeholder="https://hooks.zapier.com/hooks/catch/..."
                    value={settings.webhookUrl}
                    onChange={(e) => setSettings(prev => ({ ...prev, webhookUrl: e.target.value }))}
                  />
                  <p className="text-sm text-muted-foreground">
                    You can use a Zapier webhook URL to connect to Loanflow CRM through Zapier.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-sync"
                    checked={settings.autoSync}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoSync: checked }))}
                  />
                  <Label htmlFor="auto-sync">Enable automatic sync when applications are submitted</Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={saveSettings}>
                  Save Settings
                </Button>
                <Button 
                  variant="outline" 
                  onClick={testConnection}
                  disabled={isLoading || (!settings.apiEndpoint && !settings.webhookUrl)}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <TestTube className="h-4 w-4 mr-2" />
                  )}
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="field-mapping">
          <Card>
            <CardHeader>
              <CardTitle>Field Mapping</CardTitle>
              <CardDescription>
                Map loan application fields to your Loanflow CRM fields.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {Object.entries(DEFAULT_FIELD_MAPPING).map(([appField, crmField]) => (
                  <div key={appField} className="grid grid-cols-2 gap-4 items-center">
                    <div className="font-medium">{appField.replace(/_/g, ' ')}</div>
                    <Input
                      value={settings.fieldMapping[appField] || crmField}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        fieldMapping: {
                          ...prev.fieldMapping,
                          [appField]: e.target.value
                        }
                      }))}
                      placeholder={crmField}
                    />
                  </div>
                ))}
              </div>
              <Button className="mt-4" onClick={saveSettings}>
                Save Field Mapping
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Integration Status
              </CardTitle>
              <CardDescription>
                Monitor your CRM integration status and sync history.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Connection Status</Label>
                    <div className="mt-1">{getConnectionBadge()}</div>
                  </div>
                  <div>
                    <Label>Auto Sync</Label>
                    <div className="mt-1">
                      <Badge variant={settings.autoSync ? "default" : "secondary"}>
                        {settings.autoSync ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Integration Details</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div>API Endpoint: {settings.apiEndpoint || 'Not configured'}</div>
                    <div>Webhook URL: {settings.webhookUrl || 'Not configured'}</div>
                    <div>Fields Mapped: {Object.keys(settings.fieldMapping).length}</div>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">
                    When auto-sync is enabled, loan applications will be automatically sent to Loanflow CRM when they are submitted.
                  </p>
                  <p>
                    Check the CRM Sync Logs in your admin dashboard to monitor sync status and troubleshoot any issues.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}