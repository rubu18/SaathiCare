import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Heart, User, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Link, useLocation } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  // Reset password modal state
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const location = useLocation();

  // Admin Access Reveal Logic
  const [showAdminAccess, setShowAdminAccess] = useState(false);

  useEffect(() => {
    // Show if on /admin (for direct route support)
    if (location.pathname === "/admin") setShowAdminAccess(true);

    // Show in development (localhost)
    if (window?.location?.hostname === "localhost" || window?.location?.hostname === "127.0.0.1") {
      setShowAdminAccess(true);
    }

    // Listen for the secret keyboard shortcut
    const handleKeydown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "A" || e.key === "a")
      ) {
        setShowAdminAccess(true);
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [location.pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Check your email to confirm your account",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Successfully signed in",
        });
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Reset password form submit handler
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetLoading(true);
    setResetSent(false);

    if (!resetEmail) {
      setResetError('Please enter your email address.');
      setResetLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        // This should match your Auth redirect (see Supabase docs)
        redirectTo: `${window.location.origin}/auth`,
      });
      if (error) throw error;
      setResetSent(true);
      toast({
        title: "Email sent",
        description: "A password reset link has been sent. Please check your inbox.",
      });
    } catch (error: any) {
      setResetError(error.message || "Something went wrong. Please try again.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-saathi-blue-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 group mb-6">
            <div className="bg-saathi-blue-500 p-3 rounded-xl group-hover:bg-saathi-blue-600 transition-colors">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-saathi-blue-800">SaathiCare</span>
          </Link>
        </div>

        <Card className="bg-white rounded-2xl shadow-lg border border-saathi-blue-100">
          <CardHeader className="text-center">
            <div className="mx-auto bg-saathi-blue-100 p-3 rounded-full w-fit mb-4">
              <User className="h-8 w-8 text-saathi-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-saathi-blue-800">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </CardTitle>
            <p className="text-saathi-blue-600">
              {isSignUp ? 'Join SaathiCare to find your perfect companion' : 'Sign in to your account'}
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-12 px-4 border-saathi-blue-200 focus:border-saathi-blue-500 bg-white text-gray-900 placeholder:text-gray-500"
                />
              </div>
              
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-12 px-4 border-saathi-blue-200 focus:border-saathi-blue-500 bg-white text-gray-900 placeholder:text-gray-500"
                />
              </div>

              {isSignUp && (
                <div>
                  <Input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full h-12 px-4 border-saathi-blue-200 focus:border-saathi-blue-500 bg-white text-gray-900 placeholder:text-gray-500"
                  />
                </div>
              )}
              
              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full saathi-button h-12"
                disabled={loading || !email || !password || (isSignUp && !confirmPassword)}
              >
                {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </Button>
            </form>

            <div className="mt-3 flex justify-between items-center">
              <Dialog open={showReset} onOpenChange={setShowReset}>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="text-xs text-saathi-blue-600 hover:text-saathi-blue-800 underline px-0 bg-transparent"
                  >
                    Forgot password?
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-md bg-white text-saathi-blue-900">
                  <DialogHeader>
                    <DialogTitle>Reset your password</DialogTitle>
                    <DialogDescription>
                      Enter your email and we'll send a password reset link.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <Input
                      type="email"
                      placeholder="Your email address"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                      disabled={resetLoading}
                    />
                    {resetError && (
                      <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                        <AlertCircle className="h-4 w-4" />
                        {resetError}
                      </div>
                    )}
                    {resetSent ? (
                      <div className="text-green-700 bg-green-50 p-2 rounded border border-green-200 text-sm text-center">
                        Reset email sent! Check your inbox.
                      </div>
                    ) : (
                      <Button
                        type="submit"
                        disabled={resetLoading}
                        className="w-full"
                      >
                        {resetLoading ? "Sending..." : "Send reset link"}
                      </Button>
                    )}
                  </form>
                  <DialogFooter>
                    <Button
                      variant="ghost"
                      onClick={() => setShowReset(false)}
                      type="button"
                      className="w-full mt-2"
                    >
                      Cancel
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-saathi-blue-600 hover:text-saathi-blue-700 font-medium"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>

            {showAdminAccess && (
              <div className="mt-4 text-center">
                <Link 
                  to="/admin" 
                  className="text-sm text-gray-500 hover:text-saathi-blue-600"
                >
                  Admin Access
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
