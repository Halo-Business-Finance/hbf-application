import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type MFALevel = 'aal1' | 'aal2';

export const useMFAStatus = () => {
  const { user, authenticated } = useAuth();
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<MFALevel>('aal1');
  const [loading, setLoading] = useState(true);

  const checkMFAStatus = useCallback(async () => {
    if (!authenticated || !user) {
      setMfaEnabled(false);
      setCurrentLevel('aal1');
      setLoading(false);
      return;
    }

    try {
      // Check current AAL (Authentication Assurance Level)
      const { data: aalData, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      
      if (aalError) {
        console.error('Error getting AAL:', aalError);
        setLoading(false);
        return;
      }

      setCurrentLevel(aalData?.currentLevel as MFALevel || 'aal1');

      // Check if user has enrolled MFA factors
      const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();
      
      if (factorsError) {
        console.error('Error listing factors:', factorsError);
        setLoading(false);
        return;
      }

      const verifiedFactors = factorsData?.totp?.filter(f => f.status === 'verified') || [];
      setMfaEnabled(verifiedFactors.length > 0);
    } catch (error) {
      console.error('Error checking MFA status:', error);
    } finally {
      setLoading(false);
    }
  }, [user, authenticated]);

  useEffect(() => {
    checkMFAStatus();
  }, [checkMFAStatus]);

  // Check if user needs to verify MFA (has MFA enabled but current session is only AAL1)
  const needsMFAVerification = mfaEnabled && currentLevel === 'aal1';

  // Check if user has achieved AAL2 (fully authenticated with MFA)
  const isFullyAuthenticated = currentLevel === 'aal2';

  return {
    mfaEnabled,
    currentLevel,
    loading,
    needsMFAVerification,
    isFullyAuthenticated,
    refreshStatus: checkMFAStatus
  };
};
