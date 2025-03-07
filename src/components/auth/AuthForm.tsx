
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
      toast("Missing fields", {
        description: "Please provide both email and password."
      });
      return;
    }
    
    setLoading(true);
    
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin
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

          toast("Account created!", {
            description: "Welcome to Math Torcher! Please check your email for confirmation."
          });
          
          // Attempt to sign in immediately if email confirmation is not required
          await handleSignIn();
        } else {
          toast("Something went wrong", {
            description: "Please try again."
          });
        }
      } else {
        await handleSignIn();
      }
    } catch (error: any) {
      console.error("Auth error:", error);
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
        email,
        password,
      });
      
      if (error) throw error;
      
      if (data?.user) {
        toast("Login successful", {
          description: "Welcome back to Math Torcher!"
        });
        
        // Redirect to the original page the user was trying to visit (or home)
        navigate(from, { replace: true });
      } else {
        toast("Something went wrong", {
          description: "Please try again."
        });
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast("Login failed", {
        description: error.message || "An unexpected error occurred"
      });
      throw error; // Rethrow for handling in the parent function
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-amber-100">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-gray-800 border-amber-700/30 text-amber-100 placeholder:text-amber-100/50"
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-amber-100">Password</Label>
          {mode === "signin" && (
            <a href="#" className="text-xs text-amber-500 hover:text-amber-400 transition-colors">
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
          className="bg-gray-800 border-amber-700/30 text-amber-100 placeholder:text-amber-100/50"
        />
      </div>
      <Button 
        type="submit" 
        className="w-full bg-amber-600 hover:bg-amber-700 transition-colors" 
        disabled={loading}
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
