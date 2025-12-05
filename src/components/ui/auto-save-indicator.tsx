import { useState, useEffect } from 'react';
import { Cloud, CloudOff, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AutoSaveIndicatorProps {
  storageKey: string;
  className?: string;
}

export function AutoSaveIndicator({ storageKey, className }: AutoSaveIndicatorProps) {
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    // Check for existing saved data
    const checkSaved = () => {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const { timestamp } = JSON.parse(saved);
          setLastSaved(new Date(timestamp));
          setStatus('saved');
        }
      } catch {
        // Ignore errors
      }
    };

    checkSaved();

    // Listen for storage changes
    const handleStorage = (e: StorageEvent) => {
      if (e.key === storageKey) {
        if (e.newValue) {
          setStatus('saving');
          setTimeout(() => {
            setStatus('saved');
            try {
              const { timestamp } = JSON.parse(e.newValue || '{}');
              setLastSaved(new Date(timestamp));
            } catch {
              // Ignore errors
            }
          }, 300);
        } else {
          setStatus('idle');
          setLastSaved(null);
        }
      }
    };

    // Custom event for same-tab updates
    const handleCustomStorage = () => {
      checkSaved();
      setStatus('saving');
      setTimeout(() => setStatus('saved'), 300);
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(`autosave-${storageKey}`, handleCustomStorage);

    // Poll for changes (for same-tab updates)
    const interval = setInterval(checkSaved, 2000);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(`autosave-${storageKey}`, handleCustomStorage);
      clearInterval(interval);
    };
  }, [storageKey]);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    return date.toLocaleDateString();
  };

  if (status === 'idle' && !lastSaved) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-2 text-xs text-muted-foreground transition-all duration-300',
        className
      )}
    >
      {status === 'saving' ? (
        <>
          <Cloud className="h-3.5 w-3.5 animate-pulse text-primary" />
          <span>Saving...</span>
        </>
      ) : status === 'saved' ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-500" />
          <span>Draft saved {lastSaved && formatTime(lastSaved)}</span>
        </>
      ) : (
        <>
          <CloudOff className="h-3.5 w-3.5" />
          <span>Not saved</span>
        </>
      )}
    </div>
  );
}
