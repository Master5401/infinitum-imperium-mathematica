
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Index from "@/pages/Index";
import DailyChallenge from "@/pages/DailyChallenge";
import Library from "@/pages/Library";
import Learn from "@/pages/Learn";
import Graphing from "@/pages/Graphing";
import NotFound from "@/pages/NotFound";
import Auth from "@/pages/Auth";
import { RequireAuth } from "@/components/auth/RequireAuth";
import NavBar from "@/components/NavBar";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route 
          path="/daily-challenge" 
          element={
            <RequireAuth>
              <DailyChallenge />
            </RequireAuth>
          } 
        />
        <Route 
          path="/library" 
          element={
            <RequireAuth>
              <Library />
            </RequireAuth>
          } 
        />
        <Route 
          path="/learn" 
          element={
            <RequireAuth>
              <Learn />
            </RequireAuth>
          } 
        />
        <Route 
          path="/graphing" 
          element={
            <RequireAuth>
              <Graphing />
            </RequireAuth>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
