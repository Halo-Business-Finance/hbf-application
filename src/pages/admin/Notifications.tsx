import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Plus, Send } from 'lucide-react';

const Notifications = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Button variant="ghost" onClick={() => navigate('/admin')} className="mb-4">
              ← Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold mb-2">Notifications</h1>
            <p className="text-muted-foreground">Send system notifications and manage alerts</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Notification
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Send Notification
              </CardTitle>
              <CardDescription>Broadcast messages to users</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-8">
              <Send className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Notification composer coming soon</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification History
              </CardTitle>
              <CardDescription>View sent notifications</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-8">
              <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Notification history coming soon</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
