
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Update RequireAuth to include a guestAllowed prop
export function RequireAuth({ 
  children, 
  guestAllowed = false 
}: { 
  children: JSX.Element,
  guestAllowed?: boolean
}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
      setLoading(false);

      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setUser(session?.user || null);
        }
      );

      return () => {
        authListener.subscription.unsubscribe();
      };
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">
      <div className="animate-spin h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full"></div>
    </div>;
  }

  if (!user && !guestAllowed) {
    // Redirect to the /auth page, but save the current location
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
}
