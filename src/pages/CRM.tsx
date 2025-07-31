import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  Target, 
  Activity, 
  Settings, 
  Plus, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Building, 
  Calendar,
  DollarSign,
  TrendingUp,
  RefreshCw,
  CheckCircle,
  Clock,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company_name?: string;
  job_title?: string;
  lead_status: string;
  contact_type: string;
  last_contact_date?: string;
  next_follow_up_date?: string;
  created_at: string;
}

interface Opportunity {
  id: string;
  opportunity_name: string;
  loan_type: string;
  loan_amount?: number;
  probability: number;
  stage: string;
  expected_close_date?: string;
  crm_contacts: {
    first_name: string;
    last_name: string;
    email: string;
    company_name?: string;
  };
  loan_applications?: {
    application_number: string;
    status: string;
  };
  created_at: string;
}

interface Activity {
  id: string;
  activity_type: string;
  subject: string;
  description?: string;
  status: string;
  priority: string;
  scheduled_at?: string;
  completed_at?: string;
  created_at: string;
}

const CRM = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("contacts");
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadCRMData();
    }
  }, [user]);

  const loadCRMData = async () => {
    try {
      setLoading(true);
      
      // Load contacts
      const { data: contactsData, error: contactsError } = await supabase.functions.invoke('crm-integration', {
        body: { action: 'get_contacts' }
      });

      if (contactsError) throw contactsError;
      if (contactsData?.contacts) setContacts(contactsData.contacts);

      // Load opportunities
      const { data: opportunitiesData, error: opportunitiesError } = await supabase.functions.invoke('crm-integration', {
        body: { action: 'get_opportunities' }
      });

      if (opportunitiesError) throw opportunitiesError;
      if (opportunitiesData?.opportunities) setOpportunities(opportunitiesData.opportunities);

      // Load activities
      const { data: activitiesData, error: activitiesError } = await supabase.functions.invoke('crm-integration', {
        body: { action: 'get_activities' }
      });

      if (activitiesError) throw activitiesError;
      if (activitiesData?.activities) setActivities(activitiesData.activities);

    } catch (error) {
      console.error('Error loading CRM data:', error);
      toast({
        title: "Error Loading CRM Data",
        description: "Failed to load CRM information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new': return 'bg-blue-500';
      case 'contacted': return 'bg-yellow-500';
      case 'qualified': return 'bg-green-500';
      case 'proposal': return 'bg-purple-500';
      case 'negotiation': return 'bg-orange-500';
      case 'closed_won': return 'bg-green-600';
      case 'closed_lost': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'prospecting': return 'bg-blue-500';
      case 'qualification': return 'bg-yellow-500';
      case 'proposal': return 'bg-purple-500';
      case 'negotiation': return 'bg-orange-500';
      case 'closed_won': return 'bg-green-600';
      case 'closed_lost': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOpportunities = opportunities.filter(opportunity =>
    opportunity.opportunity_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opportunity.loan_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opportunity.crm_contacts.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
        <div className="text-center animate-fade-in">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin border-t-primary mx-auto"></div>
            <Users className="w-6 h-6 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Loading CRM Dashboard</h3>
          <p className="text-muted-foreground">Fetching your contacts and opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold font-display text-foreground mb-2">
                CRM Dashboard
              </h1>
              <p className="text-lg text-muted-foreground">
                Manage your leads, contacts, and opportunities
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={loadCRMData} variant="outline" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh Data
              </Button>
              <Button className="gap-2 bg-gradient-primary">
                <ExternalLink className="w-4 h-4" />
                Sync with LoanFlow Nexus
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-0 shadow-md bg-card/95 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Contacts</p>
                    <p className="text-2xl font-bold text-foreground">{contacts.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-card/95 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Opportunities</p>
                    <p className="text-2xl font-bold text-foreground">{opportunities.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-card/95 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pipeline Value</p>
                    <p className="text-2xl font-bold text-foreground">
                      ${opportunities.reduce((sum, opp) => sum + (opp.loan_amount || 0), 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-warning" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-card/95 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Win Rate</p>
                    <p className="text-2xl font-bold text-foreground">
                      {opportunities.length > 0 
                        ? Math.round((opportunities.filter(o => o.stage === 'closed_won').length / opportunities.length) * 100)
                        : 0}%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 animate-slide-up">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts and opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="animate-scale-in">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="contacts" className="gap-2">
              <Users className="w-4 h-4" />
              Contacts
            </TabsTrigger>
            <TabsTrigger value="opportunities" className="gap-2">
              <Target className="w-4 h-4" />
              Opportunities
            </TabsTrigger>
            <TabsTrigger value="activities" className="gap-2">
              <Activity className="w-4 h-4" />
              Activities
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" />
              Integration
            </TabsTrigger>
          </TabsList>

          {/* Contacts Tab */}
          <TabsContent value="contacts">
            <Card className="border-0 shadow-lg bg-card/95 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Contacts</CardTitle>
                  <CardDescription>Manage your leads and customers</CardDescription>
                </div>
                <Button className="gap-2 bg-gradient-primary">
                  <Plus className="w-4 h-4" />
                  Add Contact
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredContacts.map((contact) => (
                    <Card key={contact.id} className="border border-border/50 hover:border-primary/30 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className="w-12 h-12">
                              <AvatarFallback>
                                {contact.first_name[0]}{contact.last_name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {contact.first_name} {contact.last_name}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {contact.email}
                                </div>
                                {contact.phone && (
                                  <div className="flex items-center gap-1">
                                    <Phone className="w-3 h-3" />
                                    {contact.phone}
                                  </div>
                                )}
                                {contact.company_name && (
                                  <div className="flex items-center gap-1">
                                    <Building className="w-3 h-3" />
                                    {contact.company_name}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`${getStatusColor(contact.lead_status)} text-white`}>
                              {contact.lead_status}
                            </Badge>
                            <Badge variant="outline">
                              {contact.contact_type}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Opportunities Tab */}
          <TabsContent value="opportunities">
            <Card className="border-0 shadow-lg bg-card/95 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Opportunities</CardTitle>
                  <CardDescription>Track your loan pipeline</CardDescription>
                </div>
                <Button className="gap-2 bg-gradient-primary">
                  <Plus className="w-4 h-4" />
                  Add Opportunity
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredOpportunities.map((opportunity) => (
                    <Card key={opportunity.id} className="border border-border/50 hover:border-primary/30 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-foreground">
                                {opportunity.opportunity_name}
                              </h3>
                              <Badge variant="outline">
                                {opportunity.loan_type}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>
                                {opportunity.crm_contacts.first_name} {opportunity.crm_contacts.last_name}
                              </span>
                              {opportunity.crm_contacts.company_name && (
                                <span>• {opportunity.crm_contacts.company_name}</span>
                              )}
                              {opportunity.loan_amount && (
                                <span>• ${opportunity.loan_amount.toLocaleString()}</span>
                              )}
                              <span>• {opportunity.probability}% probability</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`${getStageColor(opportunity.stage)} text-white`}>
                              {opportunity.stage}
                            </Badge>
                            {opportunity.loan_applications && (
                              <Badge variant="secondary">
                                App #{opportunity.loan_applications.application_number}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities">
            <Card className="border-0 shadow-lg bg-card/95 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Activities</CardTitle>
                  <CardDescription>Track all interactions and tasks</CardDescription>
                </div>
                <Button className="gap-2 bg-gradient-primary">
                  <Plus className="w-4 h-4" />
                  Log Activity
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <Card key={activity.id} className="border border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                              {activity.activity_type === 'call' && <Phone className="w-4 h-4 text-primary" />}
                              {activity.activity_type === 'email' && <Mail className="w-4 h-4 text-primary" />}
                              {activity.activity_type === 'meeting' && <Calendar className="w-4 h-4 text-primary" />}
                              {activity.activity_type === 'note' && <Activity className="w-4 h-4 text-primary" />}
                              {activity.activity_type === 'application_submitted' && <CheckCircle className="w-4 h-4 text-accent" />}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-foreground">{activity.subject}</h4>
                              {activity.description && (
                                <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                              )}
                              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                <span>
                                  {activity.completed_at 
                                    ? new Date(activity.completed_at).toLocaleString()
                                    : new Date(activity.created_at).toLocaleString()
                                  }
                                </span>
                                <span>•</span>
                                <span className="capitalize">{activity.activity_type}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                              {activity.status}
                            </Badge>
                            <Badge variant="outline" className={
                              activity.priority === 'high' ? 'border-red-500 text-red-500' :
                              activity.priority === 'medium' ? 'border-yellow-500 text-yellow-500' :
                              'border-green-500 text-green-500'
                            }>
                              {activity.priority}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integration Settings Tab */}
          <TabsContent value="settings">
            <Card className="border-0 shadow-lg bg-card/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl">LoanFlow Nexus Integration</CardTitle>
                <CardDescription>Configure synchronization with your external CRM system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="api-endpoint">API Endpoint</Label>
                    <Input 
                      id="api-endpoint" 
                      placeholder="https://your-loanflow-nexus.com/api" 
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="api-key">API Key</Label>
                    <Input 
                      id="api-key" 
                      type="password" 
                      placeholder="Enter your API key" 
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="sync-direction">Sync Direction</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select sync direction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bidirectional">Bidirectional Sync</SelectItem>
                      <SelectItem value="push_only">Push to LoanFlow Nexus Only</SelectItem>
                      <SelectItem value="pull_only">Pull from LoanFlow Nexus Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <Input 
                    id="webhook-url" 
                    placeholder="https://your-app.com/webhook" 
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Configure this URL in your LoanFlow Nexus webhook settings
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <h4 className="font-semibold">Enable Automatic Sync</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatically sync data between systems
                    </p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1 bg-gradient-primary">
                    Save Integration Settings
                  </Button>
                  <Button variant="outline">
                    Test Connection
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

export default CRM;