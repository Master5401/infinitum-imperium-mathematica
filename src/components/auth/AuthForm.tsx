
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
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
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;
        
        if (data?.user) {
          if (data.user.identities?.length === 0) {
            toast({
              title: "Account already exists",
              description: "Please sign in instead.",
            });
            return;
          }

          toast({
            title: "Account created!",
            description: "Welcome to Math Torcher! Please check your email for confirmation.",
          });
          
          // Attempt to sign in immediately if email confirmation is not required
          await handleSignIn();
        } else {
          toast({
            title: "Something went wrong",
            description: "Please try again.",
            variant: "destructive",
          });
        }
      } else {
        await handleSignIn();
      }
    } catch (error: any) {
      console.error("Auth error:", error);
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data?.user) {
        toast({
          title: "Login successful",
          description: "Welcome back to Math Torcher!",
        });
        
        // Redirect to the original page the user was trying to visit (or home)
        navigate(from, { replace: true });
      } else {
        toast({
          title: "Something went wrong",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast({
        title: "Login failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      throw error; // Rethrow for handling in the parent function
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
      <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={loading}>
        {loading
          ? "Processing..."
          : mode === "signin"
          ? "Sign In"
          : "Create Account"}
      </Button>
    </form>
  );
}
