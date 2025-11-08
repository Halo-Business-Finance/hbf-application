import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Shield, Smartphone, AlertCircle, CheckCircle, Copy } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';

const TwoFactorAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [enrolledFactors, setEnrolledFactors] = useState<any[]>([]);
  const [hasEnrolledFactor, setHasEnrolledFactor] = useState(false);

  useEffect(() => {
    checkEnrollmentStatus();
  }, []);

  const checkEnrollmentStatus = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      
      if (error) throw error;

      const verified = data?.all?.filter(f => f.status === 'verified') || [];
      setEnrolledFactors(verified);
      setHasEnrolledFactor(verified.length > 0);
    } catch (error: any) {
      console.error('Error checking MFA status:', error);
      toast({
        title: "Error",
        description: "Failed to check 2FA status",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const startEnrollment = async () => {
    setEnrolling(true);
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Authenticator App'
      });

      if (error) throw error;

      setQrCode(data.totp.qr_code);
      setSecret(data.totp.secret);
      setFactorId(data.id);
      
      toast({
        title: "Success",
        description: "Scan the QR code with your authenticator app",
      });
    } catch (error: any) {
      console.error('Error enrolling MFA:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to start 2FA setup",
        variant: "destructive"
      });
      setEnrolling(false);
    }
  };

  const verifyEnrollment = async () => {
    if (!factorId || !verificationCode) {
      toast({
        title: "Error",
        description: "Please enter the verification code",
        variant: "destructive"
      });
      return;
    }

    setVerifying(true);
    try {
      const { data, error } = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code: verificationCode
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Two-factor authentication has been enabled successfully!",
      });

      // Reset enrollment state
      setQrCode(null);
      setSecret(null);
      setFactorId(null);
      setVerificationCode('');
      setEnrolling(false);
      
      // Refresh status
      checkEnrollmentStatus();
    } catch (error: any) {
      console.error('Error verifying MFA:', error);
      toast({
        title: "Error",
        description: error?.message || "Invalid verification code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setVerifying(false);
    }
  };

  const unenrollFactor = async (factorId: string) => {
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId });
      
      if (error) throw error;

      toast({
        title: "Success",
        description: "Two-factor authentication has been disabled",
      });

      checkEnrollmentStatus();
    } catch (error: any) {
      console.error('Error unenrolling MFA:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to disable 2FA",
        variant: "destructive"
      });
    }
  };

  const copySecret = () => {
    if (secret) {
      navigator.clipboard.writeText(secret);
      toast({
        title: "Copied",
        description: "Secret key copied to clipboard",
      });
    }
  };

  const cancelEnrollment = () => {
    setEnrolling(false);
    setQrCode(null);
    setSecret(null);
    setFactorId(null);
    setVerificationCode('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto p-4 md:p-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/my-account?tab=account')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Account
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Two-Factor Authentication
            </CardTitle>
            <CardDescription>
              Add an extra layer of security to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Information Alert */}
            <Alert>
              <Smartphone className="h-4 w-4" />
              <AlertTitle>What is 2FA?</AlertTitle>
              <AlertDescription>
                Two-factor authentication (2FA) adds an extra layer of security by requiring a verification code from your phone in addition to your password.
              </AlertDescription>
            </Alert>

            {/* Current Status */}
            {hasEnrolledFactor && !enrolling && (
              <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800 dark:text-green-200">2FA Enabled</AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-300">
                  Your account is protected with two-factor authentication
                </AlertDescription>
              </Alert>
            )}

            {/* Enrollment Flow */}
            {enrolling && qrCode && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Step 1: Scan QR Code</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Open your authenticator app (Google Authenticator, Authy, etc.) and scan this QR code:
                    </p>
                    <div className="flex justify-center p-6 bg-white rounded-lg">
                      <img src={qrCode} alt="QR Code" className="w-64 h-64" />
                    </div>
                  </div>

                  {secret && (
                    <div>
                      <Label>Or enter this code manually:</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          value={secret}
                          readOnly
                          className="font-mono"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={copySecret}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Step 2: Verify Code</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Enter the 6-digit code from your authenticator app:
                    </p>
                    <div className="space-y-2">
                      <Input
                        type="text"
                        placeholder="000000"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        maxLength={6}
                        className="text-center text-2xl tracking-widest font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={verifyEnrollment}
                      disabled={verifying || verificationCode.length !== 6}
                      className="flex-1"
                    >
                      {verifying ? "Verifying..." : "Verify & Enable 2FA"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={cancelEnrollment}
                      disabled={verifying}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            {!enrolling && (
              <div className="space-y-4">
                {!hasEnrolledFactor ? (
                  <div className="space-y-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Recommended</AlertTitle>
                      <AlertDescription>
                        Enable 2FA to significantly improve your account security. You'll need an authenticator app like Google Authenticator or Authy.
                      </AlertDescription>
                    </Alert>
                    <Button onClick={startEnrollment} className="w-full">
                      <Shield className="w-4 h-4 mr-2" />
                      Enable Two-Factor Authentication
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Enrolled Authenticators</h3>
                      {enrolledFactors.map((factor) => (
                        <div key={factor.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Smartphone className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{factor.friendly_name || 'Authenticator App'}</p>
                              <p className="text-xs text-muted-foreground">
                                Added on {new Date(factor.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => unenrollFactor(factor.id)}
                          >
                            Disable
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TwoFactorAuth;
