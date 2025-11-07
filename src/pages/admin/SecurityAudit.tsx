import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SecurityAuditLog } from '@/components/SecurityAuditLog';
import { Shield, Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';

const SecurityAudit = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
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
              <BreadcrumbLink href="/admin">Admin Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Security & Audit Logs</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <Button variant="ghost" onClick={() => navigate('/admin')} className="mb-4">
            ← Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold mb-2">Security & Audit Logs</h1>
          <p className="text-muted-foreground">Monitor security events and audit logs</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SecurityAuditLog />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center py-8">
              <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Security dashboard coming soon</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SecurityAudit;
