
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the "from" location from state, or default to "/"
  const from = (location.state as any)?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please provide both email and password.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: "Account created!",
          description: "Welcome to Math Torcher! Please check your email for confirmation.",
        });
        
        // After signup, automatically try to sign in
        await handleSignIn();
      } else {
        await handleSignIn();
      }
    } catch (error: any) {
      toast({
        title: mode === "signup" ? "Signup failed" : "Login failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Login successful",
        description: "Welcome back to Math Torcher!",
      });
      
      // Redirect to the original page the user was trying to visit (or home)
      navigate(from, { replace: true });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          {mode === "signin" && (
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground">
              Forgot password?
            </a>
          )}
        </div>
        <Input
          id="password"
          type="password"
          placeholder={mode === "signup" ? "Create a password" : "Enter your password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading
          ? "Processing..."
          : mode === "signin"
          ? "Sign In"
          : "Create Account"}
      </Button>
    </form>
  );
}
