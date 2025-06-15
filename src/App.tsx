
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { PageTransition } from "./components/PageTransition";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import DailyChallenge from "./pages/DailyChallenge";
import Library from "./pages/Library";
import SequenceSubmit from "./pages/SequenceSubmit";
import SpecialNumbers from "./pages/SpecialNumbers";
import SpecialNumbersBrowse from "./pages/SpecialNumbersBrowse";
import Learn from "./pages/Learn";
import Graphing from "./pages/Graphing";
import Gamification from "./pages/Gamification";
import Security from "./pages/Security";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <NavBar />
            <main>
              <Routes>
                <Route path="/" element={
                  <PageTransition>
                    <Index />
                  </PageTransition>
                } />
                <Route path="/auth" element={
                  <PageTransition>
                    <Auth />
                  </PageTransition>
                } />
                <Route path="/profile" element={
                  <PageTransition>
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  </PageTransition>
                } />
                <Route path="/daily-challenge" element={
                  <PageTransition>
                    <DailyChallenge />
                  </PageTransition>
                } />
                <Route path="/library" element={
                  <PageTransition>
                    <Library />
                  </PageTransition>
                } />
                <Route path="/sequences" element={
                  <PageTransition>
                    <SequenceSubmit />
                  </PageTransition>
                } />
                <Route path="/special-numbers" element={
                  <PageTransition>
                    <SpecialNumbers />
                  </PageTransition>
                } />
                <Route path="/special-numbers/browse" element={
                  <PageTransition>
                    <SpecialNumbersBrowse />
                  </PageTransition>
                } />
                <Route path="/learn" element={
                  <PageTransition>
                    <Learn />
                  </PageTransition>
                } />
                <Route path="/graphing" element={
                  <PageTransition>
                    <Graphing />
                  </PageTransition>
                } />
                <Route path="/gamification" element={
                  <PageTransition>
                    <ProtectedRoute>
                      <Gamification />
                    </ProtectedRoute>
                  </PageTransition>
                } />
                <Route path="/security" element={
                  <PageTransition>
                    <Security />
                  </PageTransition>
                } />
                <Route path="*" element={
                  <PageTransition>
                    <NotFound />
                  </PageTransition>
                } />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
