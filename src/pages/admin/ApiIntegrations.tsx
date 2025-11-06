import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Plug, 
  Webhook, 
  Key, 
  CheckCircle, 
  XCircle, 
  Settings,
  Zap,
  CreditCard,
  Mail,
  MessageSquare,
  Database,
  Cloud
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: any;
  isActive: boolean;
  category: 'payment' | 'communication' | 'automation' | 'data';
}

const ApiIntegrations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [zapierWebhook, setZapierWebhook] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'stripe',
      name: 'Stripe',
      description: 'Payment processing and subscription management',
      icon: CreditCard,
      isActive: false,
      category: 'payment'
    },
    {
      id: 'sendgrid',
      name: 'SendGrid',
      description: 'Email delivery and marketing automation',
      icon: Mail,
      isActive: false,
      category: 'communication'
    },
    {
      id: 'twilio',
      name: 'Twilio',
      description: 'SMS and voice communication',
      icon: MessageSquare,
      isActive: false,
      category: 'communication'
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Workflow automation and app integration',
      icon: Zap,
      isActive: false,
      category: 'automation'
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      description: 'CRM and customer data management',
      icon: Database,
      isActive: false,
      category: 'data'
    },
    {
      id: 'webhook',
      name: 'Custom Webhooks',
      description: 'Configure custom webhook endpoints',
      icon: Webhook,
      isActive: true,
      category: 'automation'
    }
  ]);

  const toggleIntegration = (id: string) => {
    setIntegrations(prev => 
      prev.map(int => 
        int.id === id ? { ...int, isActive: !int.isActive } : int
      )
    );
    toast({
      title: "Integration Updated",
      description: `Integration has been ${integrations.find(i => i.id === id)?.isActive ? 'disabled' : 'enabled'}`,
    });
  };

  const handleTriggerZapier = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!zapierWebhook) {
      toast({
        title: "Error",
        description: "Please enter your Zapier webhook URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log("Triggering Zapier webhook:", zapierWebhook);

    try {
      const response = await fetch(zapierWebhook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          triggered_from: window.location.origin,
          event: "test_trigger"
        }),
      });

      toast({
        title: "Request Sent",
        description: "The request was sent to Zapier. Please check your Zap's history to confirm it was triggered.",
      });
    } catch (error) {
      console.error("Error triggering webhook:", error);
      toast({
        title: "Error",
        description: "Failed to trigger the Zapier webhook. Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      payment: 'Payment',
      communication: 'Communication',
      automation: 'Automation',
      data: 'Data'
    };
    return labels[category as keyof typeof labels] || category;
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <Button variant="ghost" onClick={() => navigate('/admin')} className="mb-4">
            ← Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Plug className="w-8 h-8 text-blue-900" />
            API Integrations
          </h1>
          <p className="text-muted-foreground">Manage external API connections and third-party integrations</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Integrations</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {integrations.map((integration) => {
                const Icon = integration.icon;
                return (
                  <Card key={integration.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 flex items-center justify-center bg-blue-50 rounded-lg">
                            <Icon className="w-6 h-6 text-blue-900" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{integration.name}</CardTitle>
                            <Badge variant="outline" className="mt-1">
                              {getCategoryLabel(integration.category)}
                            </Badge>
                          </div>
                        </div>
                        {integration.isActive ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{integration.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Status</span>
                        <Switch
                          checked={integration.isActive}
                          onCheckedChange={() => toggleIntegration(integration.id)}
                        />
                      </div>
                      <Button variant="outline" className="w-full" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Configure
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="active" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {integrations.filter(int => int.isActive).map((integration) => {
                const Icon = integration.icon;
                return (
                  <Card key={integration.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 flex items-center justify-center bg-blue-50 rounded-lg">
                            <Icon className="w-6 h-6 text-blue-900" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{integration.name}</CardTitle>
                            <Badge variant="outline" className="mt-1">
                              {getCategoryLabel(integration.category)}
                            </Badge>
                          </div>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{integration.description}</p>
                      <Button variant="outline" className="w-full" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Manage
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="webhooks" className="mt-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <Zap className="w-5 h-5" />
                    Zapier Integration
                  </CardTitle>
                  <CardDescription>
                    Connect your Zapier workflows by providing your webhook URL
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleTriggerZapier} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="zapierWebhook">Zapier Webhook URL</Label>
                      <Input
                        id="zapierWebhook"
                        type="url"
                        placeholder="https://hooks.zapier.com/hooks/catch/..."
                        value={zapierWebhook}
                        onChange={(e) => setZapierWebhook(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Get this URL from your Zapier Webhook trigger
                      </p>
                    </div>
                    <Button type="submit" disabled={isLoading} className="w-full">
                      <Zap className="w-4 h-4 mr-2" />
                      {isLoading ? 'Sending...' : 'Test Webhook'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <Webhook className="w-5 h-5" />
                    Custom Webhooks
                  </CardTitle>
                  <CardDescription>
                    Configure custom webhook endpoints for your applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Application Status Updates</span>
                        <Badge variant="outline">Active</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Receives notifications when loan application status changes
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">Test</Button>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Webhook className="w-4 h-4 mr-2" />
                      Add New Webhook
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="api-keys" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Key className="w-5 h-5" />
                  API Keys Management
                </CardTitle>
                <CardDescription>
                  Manage API keys for external services and integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Stripe API Key</span>
                    <Badge variant="secondary">Not Configured</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Required for payment processing
                  </p>
                  <Button variant="outline" size="sm">
                    <Key className="w-4 h-4 mr-2" />
                    Add API Key
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">SendGrid API Key</span>
                    <Badge variant="secondary">Not Configured</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Required for email notifications
                  </p>
                  <Button variant="outline" size="sm">
                    <Key className="w-4 h-4 mr-2" />
                    Add API Key
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Twilio API Key</span>
                    <Badge variant="secondary">Not Configured</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Required for SMS notifications
                  </p>
                  <Button variant="outline" size="sm">
                    <Key className="w-4 h-4 mr-2" />
                    Add API Key
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ApiIntegrations;
