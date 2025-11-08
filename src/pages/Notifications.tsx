import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { NotificationCenter } from '@/components/NotificationCenter';

const Notifications = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/my-account')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My Account
        </Button>
        <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
        <p className="text-muted-foreground mt-2">
          Stay updated with all your loan application activities
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <NotificationCenter maxHeight="600px" showHeader={true} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
