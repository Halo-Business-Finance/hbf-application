import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'moderator' | 'user';

export const useUserRole = () => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, authenticated } = useAuth();

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!authenticated || !user) {
        setRole('user'); // Default role for unauthenticated users
        setLoading(false);
        return;
      }

      try {
        // For now, check if user email contains 'admin' for admin role
        // This is a temporary solution until user_roles table is created
        if (user.email && user.email.includes('admin')) {
          setRole('admin');
        } else {
          setRole('user');
        }
      } catch (error) {
        console.error('Error determining user role:', error);
        setRole('user'); // Default fallback
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user, authenticated]);

  const hasRole = (requiredRole: UserRole): boolean => {
    if (!role) return false;
    
    const roleHierarchy: Record<UserRole, number> = {
      'user': 1,
      'moderator': 2,
      'admin': 3
    };

    return roleHierarchy[role] >= roleHierarchy[requiredRole];
  };

  const isAdmin = () => hasRole('admin');
  const isModerator = () => hasRole('moderator');

  return {
    role,
    loading,
    hasRole,
    isAdmin,
    isModerator
  };
};