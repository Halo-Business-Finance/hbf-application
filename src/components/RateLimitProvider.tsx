import React, { createContext, useContext, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface RateLimitContextType {
  checkRateLimit: (action: string, maxAttempts?: number, windowMs?: number) => boolean;
}

const RateLimitContext = createContext<RateLimitContextType | undefined>(undefined);

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export const RateLimitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rateLimits, setRateLimits] = useState<Record<string, RateLimitEntry>>({});
  const { toast } = useToast();

  const checkRateLimit = useCallback((
    action: string, 
    maxAttempts: number = 5, 
    windowMs: number = 60000 // 1 minute default
  ): boolean => {
    const now = Date.now();
    const key = action;
    const current = rateLimits[key];

    // Clean up expired entries
    if (current && now > current.resetTime) {
      setRateLimits(prev => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    }

    const entry = rateLimits[key];
    
    if (!entry) {
      // First attempt
      setRateLimits(prev => ({
        ...prev,
        [key]: {
          count: 1,
          resetTime: now + windowMs
        }
      }));
      return true;
    }

    if (entry.count >= maxAttempts) {
      const remainingTime = Math.ceil((entry.resetTime - now) / 1000);
      toast({
        title: "Rate Limit Exceeded",
        description: `Too many attempts. Please wait ${remainingTime} seconds before trying again.`,
        variant: "destructive"
      });
      return false;
    }

    // Increment counter
    setRateLimits(prev => ({
      ...prev,
      [key]: {
        ...entry,
        count: entry.count + 1
      }
    }));

    return true;
  }, [rateLimits, toast]);

  return (
    <RateLimitContext.Provider value={{ checkRateLimit }}>
      {children}
    </RateLimitContext.Provider>
  );
};

export const useRateLimit = () => {
  const context = useContext(RateLimitContext);
  if (!context) {
    throw new Error('useRateLimit must be used within a RateLimitProvider');
  }
  return context;
};