import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { Shield, AlertTriangle, Info, User, FileText } from 'lucide-react';

interface AuditEvent {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  details?: Record<string, any>;
}

export const SecurityAuditLog: React.FC = () => {
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useUserRole();

  useEffect(() => {
    if (isAdmin()) {
      fetchAuditEvents();
    }
  }, [isAdmin]);

  const fetchAuditEvents = async () => {
    try {
      // For now, create mock audit events since audit_logs table doesn't exist
      const mockEvents: AuditEvent[] = [
        {
          id: '1',
          user_id: 'user-123',
          action: 'login',
          resource_type: 'authentication',
          ip_address: '192.168.1.1',
          created_at: new Date().toISOString(),
          details: { success: true }
        },
        {
          id: '2',
          user_id: 'admin-456',
          action: 'create_application',
          resource_type: 'loan_application',
          ip_address: '192.168.1.2',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          details: { application_type: 'conventional' }
        }
      ];
      setAuditEvents(mockEvents);
    } catch (error) {
      console.error('Error fetching audit events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (action: string) => {
    switch (action) {
      case 'login':
      case 'logout':
        return <User className="w-4 h-4" />;
      case 'create_application':
      case 'update_application':
        return <FileText className="w-4 h-4" />;
      case 'access_denied':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getEventSeverity = (action: string) => {
    if (action.includes('denied') || action.includes('failed')) {
      return 'destructive';
    }
    if (action.includes('admin') || action.includes('role')) {
      return 'default';
    }
    return 'secondary';
  };

  if (!isAdmin()) {
    return null;
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Audit Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading audit events...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Security Audit Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        {auditEvents.length === 0 ? (
          <div className="text-center py-4">
            <Info className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No audit events found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {auditEvents.map((event) => (
              <div key={event.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="mt-0.5">
                  {getEventIcon(event.action)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{event.action.replace('_', ' ')}</span>
                    <Badge variant={getEventSeverity(event.action) as any} className="text-xs">
                      {event.resource_type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    User: {event.user_id.slice(0, 8)}... • 
                    {event.ip_address && ` IP: ${event.ip_address} •`}
                    {new Date(event.created_at).toLocaleString()}
                  </p>
                  {event.details && (
                    <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                      {JSON.stringify(event.details, null, 2)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};