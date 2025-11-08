import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle, Users, Activity, Lock, UserX, Database, Clock } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

interface SecurityMetrics {
  recentLogins: number;
  failedAuthAttempts: number;
  activeAdmins: number;
  recentAdminActions: number;
  pendingApplications: number;
  databaseSize: number;
}

interface RecentEvent {
  type: string;
  message: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'error';
}

export const SecurityOverview = () => {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    recentLogins: 0,
    failedAuthAttempts: 0,
    activeAdmins: 0,
    recentAdminActions: 0,
    pendingApplications: 0,
    databaseSize: 0
  });
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useUserRole();

  useEffect(() => {
    if (!isAdmin()) return;

    const fetchSecurityMetrics = async () => {
      try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        // Get admin users count
        const { data: adminProfiles } = await supabase
          .from('profiles')
          .select('id, role')
          .eq('role', 'admin');

        // Get recent admin actions from status history
        const { data: adminActions } = await supabase
          .from('loan_application_status_history')
          .select('id, created_at, changed_by, status')
          .gte('created_at', yesterday.toISOString())
          .order('created_at', { ascending: false })
          .limit(5);

        // Get pending applications
        const { count: pendingCount } = await supabase
          .from('loan_applications')
          .select('*', { count: 'exact', head: true })
          .in('status', ['submitted', 'under_review']);

        // Get all tables for database size estimation
        const { count: loansCount } = await supabase
          .from('loan_applications')
          .select('*', { count: 'exact', head: true });

        const { count: docsCount } = await supabase
          .from('borrower_documents')
          .select('*', { count: 'exact', head: true });

        // Get recent notifications as events
        const { data: notifications } = await supabase
          .from('notifications')
          .select('created_at, type, message')
          .gte('created_at', yesterday.toISOString())
          .order('created_at', { ascending: false })
          .limit(5);

        // Parse recent events
        const events: RecentEvent[] = [];
        
        if (adminActions) {
          adminActions.forEach(action => {
            events.push({
              type: 'admin_action',
              message: `Application status changed to ${action.status}`,
              timestamp: new Date(action.created_at),
              severity: action.status === 'rejected' ? 'warning' : 'info'
            });
          });
        }

        if (notifications) {
          notifications.slice(0, 3).forEach(notif => {
            events.push({
              type: 'notification',
              message: notif.message,
              timestamp: new Date(notif.created_at),
              severity: notif.type === 'error' ? 'error' : 'info'
            });
          });
        }

        setRecentEvents(events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 5));

        setMetrics({
          recentLogins: 0, // Would need auth.audit_log_entries access
          failedAuthAttempts: 0, // Would need auth logs
          activeAdmins: adminProfiles?.length || 0,
          recentAdminActions: adminActions?.length || 0,
          pendingApplications: pendingCount || 0,
          databaseSize: ((loansCount || 0) + (docsCount || 0))
        });
      } catch (error) {
        console.error('Error fetching security metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSecurityMetrics();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchSecurityMetrics, 30000);
    return () => clearInterval(interval);
  }, [isAdmin]);

  if (!isAdmin()) return null;

  const securityItems = [
    {
      icon: Shield,
      label: 'Active Admins',
      value: metrics.activeAdmins,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      icon: Activity,
      label: 'Admin Actions (24h)',
      value: metrics.recentAdminActions,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Clock,
      label: 'Pending Reviews',
      value: metrics.pendingApplications,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      icon: Database,
      label: 'Total Records',
      value: metrics.databaseSize,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  const getSeverityColor = (severity: RecentEvent['severity']) => {
    switch (severity) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security & System Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {securityItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className={`flex flex-col items-center p-4 rounded-lg ${item.bgColor} hover:opacity-80 transition-opacity`}
                  >
                    <Icon className={`h-8 w-8 mb-2 ${item.color}`} />
                    <p className="text-2xl font-bold text-foreground">{item.value}</p>
                    <p className="text-sm text-muted-foreground text-center mt-1">
                      {item.label}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Recent Activity */}
            {recentEvents.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Recent Activity
                </h4>
                <div className="space-y-2">
                  {recentEvents.map((event, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between p-3 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">{event.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {event.timestamp.toLocaleString()}
                        </p>
                      </div>
                      <Badge variant={getSeverityColor(event.severity)} className="ml-2 flex-shrink-0">
                        {event.type.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
