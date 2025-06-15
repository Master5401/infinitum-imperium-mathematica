
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, AlertTriangle } from "lucide-react";
import { validateEmail, validatePassword, sanitizeInput, rateLimiter, generateCSRFToken, logSecurityEvent } from "@/utils/security";

export function SecureAuthForm({ mode }: { mode: "signin" | "signup" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = (location.state as any)?.from?.pathname || "/";

  useEffect(() => {
    setCsrfToken(generateCSRFToken());
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeInput(e.target.value);
    setEmail(sanitized);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    if (mode === "signup" && newPassword) {
      const validation = validatePassword(newPassword);
      setPasswordErrors(validation.errors);
    }
  };

  const validateForm = (): boolean => {
    // Rate limiting check
    const clientId = `${navigator.userAgent}-${window.location.hostname}`;
    if (!rateLimiter.isAllowed(clientId, 3, 15 * 60 * 1000)) {
      setIsRateLimited(true);
      logSecurityEvent('RATE_LIMIT_EXCEEDED', { clientId, action: mode });
      toast("Too many attempts", {
        description: "Please wait 15 minutes before trying again."
      });
      return false;
    }

    // Email validation
    if (!validateEmail(email)) {
      toast("Invalid email", {
        description: "Please provide a valid email address."
      });
      return false;
    }

    // Password validation for signup
    if (mode === "signup") {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        toast("Password requirements not met", {
          description: passwordValidation.errors[0]
        });
        return false;
      }

      if (password !== confirmPassword) {
        toast("Passwords don't match", {
          description: "Please ensure both passwords are identical."
        });
        return false;
      }
    }

    // Basic security checks
    if (password.length < 6) {
      toast("Password too short", {
        description: "Password must be at least 6 characters long."
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isRateLimited) {
      toast("Rate limited", {
        description: "Please wait before trying again."
      });
      return;
    }

    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: sanitizeInput(email),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              csrf_token: csrfToken
            }
          }
        });
        
        if (error) throw error;
        
        if (data?.user) {
          if (data.user.identities?.length === 0) {
            toast("Account already exists", {
              description: "Please sign in instead."
            });
            return;
          }

          logSecurityEvent('USER_REGISTERED', { email: sanitizeInput(email) });
          toast("Account created!", {
            description: "Welcome to Math Torcher! Please check your email for confirmation."
          });
          
          await handleSignIn();
        }
      } else {
        await handleSignIn();
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      logSecurityEvent('AUTH_FAILED', { 
        error: error.message, 
        email: sanitizeInput(email), 
        mode 
      });
      
      toast("Authentication failed", {
        description: error.message || "An unexpected error occurred"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizeInput(email),
        password,
      });
      
      if (error) throw error;
      
      if (data?.user) {
        logSecurityEvent('USER_SIGNED_IN', { email: sanitizeInput(email) });
        toast("Login successful", {
          description: "Welcome back to Math Torcher!"
        });
        
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      throw error;
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="csrf_token" value={csrfToken} />
      
      {isRateLimited && (
        <Alert className="border-red-700/30 bg-red-950/20">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-red-400">
            Too many login attempts. Please wait 15 minutes before trying again.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-amber-100">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={handleEmailChange}
          required
          maxLength={254}
          className="bg-gray-800 border-amber-700/30 text-amber-100 placeholder:text-amber-100/50"
          autoComplete="email"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-amber-100">Password</Label>
        </div>
        <Input
          id="password"
          type="password"
          placeholder={mode === "signup" ? "Create a strong password" : "Enter your password"}
          value={password}
          onChange={handlePasswordChange}
          required
          maxLength={128}
          className="bg-gray-800 border-amber-700/30 text-amber-100 placeholder:text-amber-100/50"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
        />
        {mode === "signup" && passwordErrors.length > 0 && (
          <div className="space-y-1">
            {passwordErrors.map((error, index) => (
              <p key={index} className="text-xs text-red-400">{error}</p>
            ))}
          </div>
        )}
      </div>

      {mode === "signup" && (
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-amber-100">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            maxLength={128}
            className="bg-gray-800 border-amber-700/30 text-amber-100 placeholder:text-amber-100/50"
            autoComplete="new-password"
          />
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full bg-amber-600 hover:bg-amber-700 transition-colors" 
        disabled={loading || isRateLimited}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {mode === "signin" ? "Signing in..." : "Creating account..."}
          </>
        ) : (
          mode === "signin" ? "Sign In" : "Create Account"
        )}
      </Button>
    </form>
  );
}
