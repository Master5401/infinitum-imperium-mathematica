
import { useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Auth = () => {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center p-4 bg-gray-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-gray-900 to-gray-950">
      <Card className="mx-auto w-full max-w-md border-amber-600/20 bg-gradient-to-b from-gray-900 to-gray-950 shadow-lg shadow-amber-900/10">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-amber-500">Math Torcher</CardTitle>
          <CardDescription className="text-amber-100/70">
            {activeTab === "signin"
              ? "Sign in to your account to continue"
              : "Create an account to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" onValueChange={(value) => setActiveTab(value as "signin" | "signup")}>
            <TabsList className="grid w-full grid-cols-2 bg-gray-800/50">
              <TabsTrigger 
                value="signin" 
                className="data-[state=active]:bg-amber-900/30 data-[state=active]:text-amber-100 text-amber-300/70"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="data-[state=active]:bg-amber-900/30 data-[state=active]:text-amber-100 text-amber-300/70"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <AuthForm mode="signin" />
            </TabsContent>
            <TabsContent value="signup">
              <AuthForm mode="signup" />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-amber-100/50">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
