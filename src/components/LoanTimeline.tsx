import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Check, Circle, X, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface StatusHistoryItem {
  id: string;
  status: string;
  changed_at: string;
  notes: string | null;
}

interface LoanTimelineProps {
  loanApplicationId: string;
  currentStatus: string;
}

const statusConfig = {
  draft: {
    label: 'Draft Created',
    icon: Circle,
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-300',
  },
  submitted: {
    label: 'Application Submitted',
    icon: Check,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300',
  },
  under_review: {
    label: 'Under Review',
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-300',
  },
  approved: {
    label: 'Approved',
    icon: Check,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300',
  },
  funded: {
    label: 'Funded',
    icon: Check,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-300',
  },
  rejected: {
    label: 'Application Declined',
    icon: X,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-300',
  },
};

export const LoanTimeline = ({ loanApplicationId, currentStatus }: LoanTimelineProps) => {
  const [history, setHistory] = useState<StatusHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data, error } = await supabase
          .from('loan_application_status_history')
          .select('*')
          .eq('loan_application_id', loanApplicationId)
          .order('changed_at', { ascending: true });

        if (error) throw error;
        setHistory(data || []);
      } catch (error) {
        console.error('Error fetching status history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('status-history-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'loan_application_status_history',
          filter: `loan_application_id=eq.${loanApplicationId}`,
        },
        (payload) => {
          setHistory((prev) => [...prev, payload.new as StatusHistoryItem]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loanApplicationId]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-4">
        No status history available yet.
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <h4 className="text-sm font-semibold mb-4 text-foreground">Application Timeline</h4>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

        {/* Timeline items */}
        <div className="space-y-6">
          {history.map((item, index) => {
            const config = statusConfig[item.status as keyof typeof statusConfig] || statusConfig.draft;
            const Icon = config.icon;
            const isLast = index === history.length - 1;
            const isCurrent = item.status === currentStatus;

            return (
              <div key={item.id} className="relative flex gap-4">
                {/* Icon */}
                <div
                  className={cn(
                    'relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2',
                    config.borderColor,
                    config.bgColor,
                    isCurrent && 'ring-4 ring-offset-2 ring-offset-background',
                    isCurrent && config.bgColor
                  )}
                >
                  <Icon className={cn('w-4 h-4', config.color)} />
                </div>

                {/* Content */}
                <div className={cn('flex-1 pb-6', isLast && 'pb-0')}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h5
                        className={cn(
                          'text-sm font-semibold',
                          isCurrent ? config.color : 'text-foreground'
                        )}
                      >
                        {config.label}
                      </h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(item.changed_at), 'MMM d, yyyy • h:mm a')}
                      </p>
                      {item.notes && (
                        <p className="text-xs text-muted-foreground mt-2 italic">
                          {item.notes}
                        </p>
                      )}
                    </div>
                    {isCurrent && (
                      <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                        Current
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
