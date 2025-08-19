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
import { DeviceSwitch, InterfaceSelector } from "@/components/DeviceSwitch";
import { DeviceAdaptiveContainer } from "@/hooks/use-device-detection";
import Index from "./pages/Index";
import ProfileSelection from "./pages/ProfileSelection";
import Introduction from "./pages/Introduction";
import SafetyCourse from "./pages/SafetyCourse";
import QCM from "./pages/QCM";
import Certificate from "./pages/Certificate";
import Dashboard from "./pages/Dashboard";
import EnhancedAdminDashboard from "./pages/EnhancedAdminDashboard";
import MobileDashboard from "./pages/MobileDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AdminProvider>
      <NotificationProvider>
        <UserSessionProvider>
          <LanguageProvider>
            <TooltipProvider>
              <DeviceAdaptiveContainer>
                <Toaster />
                <Sonner />

                {/* Global Notification Center */}
                <div className="fixed top-4 right-4 z-50">
                  <NotificationCenter />
                </div>

                {/* Interface Selector */}
                <div className="fixed top-4 left-4 z-50">
                  <InterfaceSelector />
                </div>

                {/* Device Switch Modal */}
                <DeviceSwitch />

                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route
                      path="/profile-selection"
                      element={<ProfileSelection />}
                    />
                    <Route path="/introduction" element={<Introduction />} />
                    <Route path="/safety-course" element={<SafetyCourse />} />
                    <Route path="/qcm" element={<QCM />} />
                    <Route path="/certificate" element={<Certificate />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/admin" element={<EnhancedAdminDashboard />} />
                    <Route path="/mobile" element={<MobileDashboard />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </DeviceAdaptiveContainer>
            </TooltipProvider>
          </LanguageProvider>
        </UserSessionProvider>
      </NotificationProvider>
    </AdminProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
