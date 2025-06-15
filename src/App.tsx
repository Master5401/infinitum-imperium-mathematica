
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
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
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/daily-challenge" element={<DailyChallenge />} />
                <Route path="/library" element={<Library />} />
                <Route path="/sequences" element={<SequenceSubmit />} />
                <Route path="/special-numbers" element={<SpecialNumbers />} />
                <Route path="/special-numbers/browse" element={<SpecialNumbersBrowse />} />
                <Route path="/learn" element={<Learn />} />
                <Route path="/graphing" element={<Graphing />} />
                <Route path="/gamification" element={
                  <ProtectedRoute>
                    <Gamification />
                  </ProtectedRoute>
                } />
                <Route path="/security" element={<Security />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
