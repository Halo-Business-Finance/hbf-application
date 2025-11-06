import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface LoanProgressBarProps {
  status: string;
  className?: string;
}

const statusConfig = {
  draft: {
    progress: 20,
    label: 'Draft',
    color: 'bg-gray-500',
  },
  submitted: {
    progress: 40,
    label: 'Submitted',
    color: 'bg-blue-500',
  },
  under_review: {
    progress: 60,
    label: 'Under Review',
    color: 'bg-yellow-500',
  },
  approved: {
    progress: 80,
    label: 'Approved',
    color: 'bg-green-500',
  },
  funded: {
    progress: 100,
    label: 'Funded',
    color: 'bg-purple-500',
  },
  rejected: {
    progress: 0,
    label: 'Rejected',
    color: 'bg-red-500',
  },
};

export const LoanProgressBar = ({ status, className }: LoanProgressBarProps) => {
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
  const isRejected = status === 'rejected';

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <span className="font-medium text-muted-foreground">Progress</span>
        <span className={cn(
          'font-semibold',
          isRejected ? 'text-red-600' : 'text-foreground'
        )}>
          {config.label}
        </span>
      </div>
      
      {isRejected ? (
        <div className="h-2 rounded-full bg-red-100">
          <div className="h-full rounded-full bg-red-500 w-full" />
        </div>
      ) : (
        <div className="relative">
          <Progress 
            value={config.progress} 
            className="h-2"
          />
          <style>
            {`
              [role="progressbar"] > div {
                background-color: ${config.color.replace('bg-', '')};
              }
            `}
          </style>
        </div>
      )}
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Start</span>
        <span>{isRejected ? 'Declined' : `${config.progress}%`}</span>
        <span>Complete</span>
      </div>
    </div>
  );
};
