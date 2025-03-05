
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, Settings, User } from "lucide-react";

export function UserButton() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Get current session and user
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
      setLoading(false);
      
      // Listen for auth changes
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          console.log("Auth state changed:", event, session?.user?.email);
          setUser(session?.user || null);
        }
      );
      
      return () => {
        authListener.subscription.unsubscribe();
      };
    };
    
    fetchUser();
  }, []);
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast("Signed out", {
        description: "You have been successfully signed out."
      });
    } catch (error: any) {
      toast("Error signing out", {
        description: error.message
      });
    }
  };
  
  if (loading) {
    return <Button variant="ghost" size="sm" className="text-amber-300" disabled>Loading...</Button>;
  }
  
  if (!user) {
    return (
      <Button variant="outline" size="sm" className="border-amber-700/50 text-amber-300 hover:bg-amber-900/30 hover:text-amber-200" asChild>
        <Link to="/auth">Sign In</Link>
      </Button>
    );
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-amber-900/30">
          <Avatar className="h-8 w-8 border border-amber-600/30">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email.split('@')[0]}`} alt="User avatar" />
            <AvatarFallback className="bg-amber-700 text-amber-100">{user.email.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-gray-900 border-amber-700/40" align="end" forceMount>
        <DropdownMenuLabel className="font-normal text-amber-100/90">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.email.split('@')[0]}</p>
            <p className="text-xs leading-none text-amber-400/70">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-amber-700/20" />
        <DropdownMenuItem className="text-amber-100/90 focus:bg-amber-800/30 focus:text-amber-100">
          <User className="mr-2 h-4 w-4 text-amber-500" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-amber-100/90 focus:bg-amber-800/30 focus:text-amber-100">
          <Settings className="mr-2 h-4 w-4 text-amber-500" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-amber-700/20" />
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="text-amber-100/90 focus:bg-amber-800/30 focus:text-amber-100"
        >
          <LogOut className="mr-2 h-4 w-4 text-amber-500" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
