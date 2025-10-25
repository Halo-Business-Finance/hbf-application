import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, HardDrive, Archive, RefreshCw } from 'lucide-react';

const DatabaseManagement = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <Button variant="ghost" onClick={() => navigate('/admin')} className="mb-4">
            ← Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold mb-2">Database Management</h1>
          <p className="text-muted-foreground">Monitor database health and perform maintenance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Database Health
              </CardTitle>
              <CardDescription>Monitor database performance</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-8">
              <Database className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Database monitoring coming soon</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Archive className="w-5 h-5" />
                Backup Management
              </CardTitle>
              <CardDescription>Manage database backups</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-8">
              <Archive className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Backup management coming soon</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="w-5 h-5" />
                Storage Usage
              </CardTitle>
              <CardDescription>Monitor storage consumption</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-8">
              <HardDrive className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Storage analytics coming soon</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Maintenance Tasks
              </CardTitle>
              <CardDescription>Schedule and run maintenance</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-8">
              <RefreshCw className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Maintenance tools coming soon</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DatabaseManagement;
