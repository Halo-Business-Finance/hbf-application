import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle, Users, Activity } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';

interface SecurityMetrics {
  recentEvents: number;
  failedLogins: number;
  activeUsers: number;
  criticalAlerts: number;
}

export const SecurityOverview = () => {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    recentEvents: 0,
    failedLogins: 0,
    activeUsers: 0,
    criticalAlerts: 0
  });
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useUserRole();

  useEffect(() => {
    if (!isAdmin()) return;

    const fetchSecurityMetrics = async () => {
      try {
        // Get total users count
        const { count: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Get recent notifications count (last 24 hours) as proxy for events
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        const { count: eventsCount } = await supabase
          .from('notifications')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', yesterday.toISOString());

        // Get recent loan applications as activity indicator
        const { count: recentActivity } = await supabase
          .from('loan_applications')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', yesterday.toISOString());

        setMetrics({
          recentEvents: eventsCount || 0,
          failedLogins: 0, // Placeholder - would need auth logs
          activeUsers: usersCount || 0,
          criticalAlerts: 0 // Placeholder - would need security monitoring
        });
      } catch (error) {
        console.error('Error fetching security metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSecurityMetrics();
  }, [isAdmin]);

  if (!isAdmin()) return null;

  const securityItems = [
    {
      icon: Activity,
      label: 'Recent Events',
      value: metrics.recentEvents,
      color: 'text-blue-600'
    },
    {
      icon: AlertTriangle,
      label: 'Failed Logins',
      value: metrics.failedLogins,
      color: 'text-orange-600'
    },
    {
      icon: Users,
      label: 'Active Users',
      value: metrics.activeUsers,
      color: 'text-green-600'
    },
    {
      icon: Shield,
      label: 'Critical Alerts',
      value: metrics.criticalAlerts,
      color: 'text-red-600'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {securityItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex flex-col items-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <Icon className={`h-8 w-8 mb-2 ${item.color}`} />
                  <p className="text-2xl font-bold">{item.value}</p>
                  <p className="text-sm text-muted-foreground text-center">
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
