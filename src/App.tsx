
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Index from "@/pages/Index";
import DailyChallenge from "@/pages/DailyChallenge";
import Library from "@/pages/Library";
import Learn from "@/pages/Learn";
import Graphing from "@/pages/Graphing";
import SpecialNumbers from "@/pages/SpecialNumbers";
import SpecialNumbersBrowse from "@/pages/SpecialNumbersBrowse";
import SequenceSubmit from "@/pages/SequenceSubmit";
import NotFound from "@/pages/NotFound";
import Auth from "@/pages/Auth";
import { RequireAuth } from "@/components/auth/RequireAuth";
import NavBar from "@/components/NavBar";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <NavBar />
        <main className="page-content">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/daily-challenge" 
              element={
                <RequireAuth guestAllowed={true}>
                  <DailyChallenge />
                </RequireAuth>
              } 
            />
            <Route 
              path="/library" 
              element={
                <RequireAuth guestAllowed={true}>
                  <Library />
                </RequireAuth>
              } 
            />
            <Route 
              path="/learn" 
              element={
                <RequireAuth guestAllowed={true}>
                  <Learn />
                </RequireAuth>
              } 
            />
            <Route 
              path="/graphing" 
              element={
                <RequireAuth guestAllowed={true}>
                  <Graphing />
                </RequireAuth>
              } 
            />
            <Route 
              path="/special-numbers" 
              element={
                <RequireAuth guestAllowed={true}>
                  <SpecialNumbers />
                </RequireAuth>
              } 
            />
            <Route 
              path="/special-numbers/browse" 
              element={
                <RequireAuth guestAllowed={true}>
                  <SpecialNumbersBrowse />
                </RequireAuth>
              } 
            />
            <Route 
              path="/sequences" 
              element={
                <RequireAuth guestAllowed={true}>
                  <SequenceSubmit />
                </RequireAuth>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;
