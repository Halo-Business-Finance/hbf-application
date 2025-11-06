import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Inbox } from 'lucide-react';

const SupportTickets = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <Button variant="ghost" onClick={() => navigate('/admin')} className="mb-4">
            ← Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold mb-2">Support Tickets</h1>
          <p className="text-muted-foreground">Review and respond to user support requests</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Inbox className="w-5 h-5" />
                Open Tickets
              </CardTitle>
              <CardDescription>Tickets awaiting response</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-8">
              <Inbox className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No open tickets</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Ticket History
              </CardTitle>
              <CardDescription>Resolved and closed tickets</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-8">
              <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Ticket management coming soon</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupportTickets;
