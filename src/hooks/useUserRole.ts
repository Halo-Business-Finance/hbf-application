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
        // Check roles using the secure has_app_role RPC function
        // This queries the user_roles table via a SECURITY DEFINER function
        const { data: isAdmin, error: adminError } = await supabase
          .rpc('has_app_role', { _user_id: user.id, _role: 'admin' });

        if (adminError) {
          console.error('Error checking admin role:', adminError);
          setRole('user');
          setLoading(false);
          return;
        }

        if (isAdmin) {
          setRole('admin');
          setLoading(false);
          return;
        }

        // Check for moderator role
        const { data: isModerator, error: modError } = await supabase
          .rpc('has_app_role', { _user_id: user.id, _role: 'moderator' });

        if (modError) {
          console.error('Error checking moderator role:', modError);
          setRole('user');
          setLoading(false);
          return;
        }

        if (isModerator) {
          setRole('moderator');
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
