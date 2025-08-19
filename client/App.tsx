import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/hooks/use-language.tsx";
import { UserSessionProvider } from "@/hooks/use-user-session.tsx";
import { NotificationProvider } from "@/hooks/use-notifications.tsx";
import { AdminProvider } from "@/hooks/use-admin.tsx";
import { NotificationCenter } from "@/components/NotificationCenter";
import Index from "./pages/Index";
import ProfileSelection from "./pages/ProfileSelection";
import Introduction from "./pages/Introduction";
import SafetyCourse from "./pages/SafetyCourse";
import QCM from "./pages/QCM";
import Certificate from "./pages/Certificate";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/profile-selection" element={<ProfileSelection />} />
            <Route path="/introduction" element={<Introduction />} />
            <Route path="/safety-course" element={<SafetyCourse />} />
            <Route path="/qcm" element={<QCM />} />
            <Route path="/certificate" element={<Certificate />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
