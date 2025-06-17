import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Shield, AlertCircle, Heart, ArrowLeft, Eye, EyeOff, Lock, Timer } from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Link } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const { loginAdmin, loginAttempts, isLocked } = useAdminAuth();
  const [step, setStep] = useState<"login" | "2fa">("login");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  useEffect(() => {
    if (isLocked) {
      const lockoutTime = localStorage.getItem('adminLockoutTime');
      if (lockoutTime) {
        const lockoutEndTime = parseInt(lockoutTime) + (15 * 60 * 1000); // 15 minutes
        const updateTimer = () => {
          const remaining = Math.max(0, lockoutEndTime - Date.now());
          setTimeLeft(remaining);
          if (remaining > 0) {
            setTimeout(updateTimer, 1000);
          }
        };
        updateTimer();
      }
    }
  }, [isLocked]);

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLocked) {
      setError(`Account locked. Try again in ${formatTime(timeLeft)}`);
      return;
    }

    // Step 1: Email + Password
    const success = loginAdmin(email, password);
    if (!success) {
      if (isLocked) {
        setError('Too many failed attempts. Account locked for 15 minutes.');
      } else {
        const remaining = 3 - (loginAttempts + 1);
        if (remaining > 0) {
          setError(`Invalid credentials. ${remaining} attempts remaining.`);
        } else {
          setError('Account locked due to too many failed attempts.');
        }
      }
      setPassword(''); // Clear password on failed attempt
    } else {
      // Move to 2FA step (simulate, would call a real system)
      setStep("2fa");
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");
    if (otp.trim() === "123456") { // Placeholder OTP for demo only!
      // Authenticated, nothing more needed, let context handle redirect
    } else {
      setOtpError("Invalid one-time code.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back Link */}
        <div>
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        <Card className="w-full bg-white rounded-2xl shadow-lg border border-red-100">
          <CardHeader className="text-center">
            <div className="mx-auto bg-red-600 p-3 rounded-full w-fit mb-4 shadow-md">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Heart className="h-6 w-6 text-red-600" />
              <CardTitle className="text-2xl font-bold text-red-800">Admin Portal</CardTitle>
            </div>
            <p className="text-red-600 font-medium">Secure access to companion management</p>
            
            {isLocked && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                  <Timer className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    Account locked. Try again in {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
            )}
          </CardHeader>
          
          <CardContent>
            {step === "login" ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Admin email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLocked}
                    // Updated for reference screenshot: yellow bg, dark text, dark placeholder
                    className="w-full border-red-200 focus:border-red-500 focus:ring-red-500 bg-yellow-400 text-gray-900 placeholder:text-gray-800 font-semibold"
                  />
                </div>
                
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLocked}
                    className="w-full border-red-200 focus:border-red-500 focus:ring-red-500 pr-10 bg-yellow-400 text-gray-900 placeholder:text-gray-800 font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLocked}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                
                {error && (
                  <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}
                
                {loginAttempts > 0 && !isLocked && (
                  <div className="flex items-center gap-2 text-amber-600 text-sm bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <Lock className="h-4 w-4" />
                    <span>Warning: {loginAttempts}/3 failed attempts</span>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full bg-red-400 hover:bg-red-500 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!email || !password || isLocked}
                >
                  {isLocked ? 'Account Locked' : 'Access Admin Dashboard'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div>
                  <label htmlFor="otp" className="block font-medium mb-1">Enter 2FA code:</label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter the 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    inputMode="numeric"
                    pattern="\d*"
                    required
                    maxLength={6}
                  />
                  {otpError && (
                    <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200 mt-1">
                      <AlertCircle className="h-4 w-4" />
                      {otpError}
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-red-400 hover:bg-red-500 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Validate 2FA Code
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full mt-2"
                  onClick={() => setStep("login")}
                >
                  ← Back to Email Login
                </Button>
              </form>
            )}
            
            <div className="mt-6 text-center">
              <Link 
                to="/auth" 
                className="text-sm text-gray-500 hover:text-red-600"
              >
                User Login
              </Link>
            </div>

            <div className="mt-4 text-center">
              <div className="text-xs text-gray-700 bg-yellow-50 border border-yellow-400 p-2 rounded flex items-center justify-center gap-1">
                <Lock className="h-3 w-3 inline mr-1" />
                <span className="font-medium">
                  Secure admin access with session timeout and account lockout protection
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;
