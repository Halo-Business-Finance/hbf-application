import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  Phone, 
  Mail, 
  Building2, 
  DollarSign,
  Activity,
  Plus,
  RefreshCw,
  Settings,
  Filter,
  Search,
  Home
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { crmService, type CRMContact, type CRMOpportunity, type CRMActivity } from "@/services/crmService";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

const CRMDashboard = () => {
  const [contacts, setContacts] = useState<CRMContact[]>([]);
  const [opportunities, setOpportunities] = useState<CRMOpportunity[]>([]);
  const [activities, setActivities] = useState<CRMActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    loadCRMData();
  }, []);

  const loadCRMData = async () => {
    try {
      setLoading(true);
      const [contactsData, opportunitiesData, activitiesData] = await Promise.all([
        crmService.getContacts(),
        crmService.getOpportunities(),
        crmService.getActivities()
      ]);
      
      setContacts(contactsData);
      setOpportunities(opportunitiesData);
      setActivities(activitiesData);
    } catch (error) {
      console.error('Error loading CRM data:', error);
      toast({
        title: "Error",
        description: "Failed to load CRM data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      await crmService.syncWithExternalCRM('all', {});
      toast({
        title: "Sync Complete",
        description: "Successfully synchronized with loanflow-nexus CRM",
      });
      loadCRMData();
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to sync with external CRM",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      'new': 'bg-blue-500',
      'contacted': 'bg-yellow-500',
      'qualified': 'bg-green-500',
      'proposal': 'bg-purple-500',
      'negotiation': 'bg-orange-500',
      'closed_won': 'bg-emerald-500',
      'closed_lost': 'bg-red-500',
      'prospecting': 'bg-blue-500',
      'qualification': 'bg-yellow-500',
    };
    return colors[status] || 'bg-gray-500';
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || contact.lead_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalPipelineValue = opportunities.reduce((sum, opp) => sum + (opp.loan_amount || 0), 0);
  const wonOpportunities = opportunities.filter(opp => opp.stage === 'closed_won');
  const totalWonValue = wonOpportunities.reduce((sum, opp) => sum + (opp.loan_amount || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin border-t-primary mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Loading CRM Dashboard</h3>
          <p className="text-muted-foreground">Fetching your customer data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>CRM Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold font-display text-foreground">CRM Dashboard</h1>
            <p className="text-muted-foreground">Manage your customer relationships and opportunities</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSync} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Sync with loanflow-nexus
            </Button>
            <Button variant="outline" className="gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
            <Button className="gap-2 bg-gradient-primary">
              <Plus className="w-4 h-4" />
              Add Contact
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-card/95 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Total Contacts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{contacts.length}</div>
              <p className="text-xs text-muted-foreground">
                +{contacts.filter(c => new Date(c.created_at || '').getMonth() === new Date().getMonth()).length} this month
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-card/95 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                Active Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {opportunities.filter(o => !['closed_won', 'closed_lost'].includes(o.stage || '')).length}
              </div>
              <p className="text-xs text-muted-foreground">
                {opportunities.length} total opportunities
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-card/95 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-warning" />
                Pipeline Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${totalPipelineValue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                ${totalWonValue.toLocaleString()} closed won
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-card/95 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4 text-destructive" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{activities.length}</div>
              <p className="text-xs text-muted-foreground">
                {activities.filter(a => new Date(a.created_at || '').toDateString() === new Date().toDateString()).length} today
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="contacts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
          </TabsList>

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="space-y-6">
            <Card className="border-0 shadow-lg bg-card/95 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Contacts</CardTitle>
                    <CardDescription>Manage your customer contacts and leads</CardDescription>
                  </div>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search contacts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="proposal">Proposal</SelectItem>
                        <SelectItem value="negotiation">Negotiation</SelectItem>
                        <SelectItem value="closed_won">Closed Won</SelectItem>
                        <SelectItem value="closed_lost">Closed Lost</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {contact.first_name} {contact.last_name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {contact.email}
                            </span>
                            {contact.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {contact.phone}
                              </span>
                            )}
                            {contact.company_name && (
                              <span className="flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                {contact.company_name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={`${getStatusBadgeColor(contact.lead_status || 'new')} text-white`}>
                          {contact.lead_status?.replace('_', ' ').toUpperCase() || 'NEW'}
                        </Badge>
                        <Badge variant="outline">
                          {contact.contact_type?.toUpperCase() || 'LEAD'}
                        </Badge>
                      </div>
                    </div>
                  ))}

                  {filteredContacts.length === 0 && (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No contacts found</h3>
                      <p className="text-muted-foreground">
                        {searchTerm || statusFilter !== "all" 
                          ? "Try adjusting your search or filter criteria"
                          : "Start by adding your first contact"}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Opportunities Tab */}
          <TabsContent value="opportunities" className="space-y-6">
            <Card className="border-0 shadow-lg bg-card/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">Loan Opportunities</CardTitle>
                <CardDescription>Track your loan opportunities and pipeline</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {opportunities.map((opportunity) => (
                    <div
                      key={opportunity.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{opportunity.opportunity_name}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{opportunity.loan_type.replace('_', ' ').toUpperCase()}</span>
                            {opportunity.loan_amount && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                ${opportunity.loan_amount.toLocaleString()}
                              </span>
                            )}
                            {opportunity.probability && (
                              <span>{opportunity.probability}% probability</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={`${getStatusBadgeColor(opportunity.stage || 'prospecting')} text-white`}>
                          {opportunity.stage?.replace('_', ' ').toUpperCase() || 'PROSPECTING'}
                        </Badge>
                        {opportunity.expected_close_date && (
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(opportunity.expected_close_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {opportunities.length === 0 && (
                    <div className="text-center py-12">
                      <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No opportunities found</h3>
                      <p className="text-muted-foreground">
                        Opportunities will appear here when loan applications are synced
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-6">
            <Card className="border-0 shadow-lg bg-card/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">Recent Activities</CardTitle>
                <CardDescription>Track all interactions and activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.slice(0, 10).map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-4 p-4 border border-border rounded-lg bg-muted/30"
                    >
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                        <Activity className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{activity.subject}</h4>
                        {activity.description && (
                          <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {activity.activity_type.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <span>{new Date(activity.created_at || '').toLocaleString()}</span>
                          {activity.status && (
                            <Badge 
                              className={`text-xs ${
                                activity.status === 'completed' ? 'bg-accent' : 'bg-warning'
                              } text-white`}
                            >
                              {activity.status.toUpperCase()}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {activities.length === 0 && (
                    <div className="text-center py-12">
                      <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No activities found</h3>
                      <p className="text-muted-foreground">
                        Activities will appear here as you interact with contacts and opportunities
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CRMDashboard;