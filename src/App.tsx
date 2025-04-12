
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ServiceProvider } from "./contexts/ServiceContext";
import { ThemeProvider } from "./providers/ThemeProvider";

// Auth Pages
import LoginPage from "./pages/auth/Login";
import RegisterPage from "./pages/auth/Register";

// Public Pages
import PublicStatusPage from "./pages/public/StatusPage";
import Landing from "./pages/Landing";

// Dashboard Pages
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Services from "./pages/dashboard/Services";
import Incidents from "./pages/dashboard/Incidents";
import Maintenance from "./pages/dashboard/Maintenance";
import Settings from "./pages/dashboard/Settings";
import Teams from "./pages/dashboard/Teams";

// Not Found
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="status-dashboard-theme">
      <AuthProvider>
        <ServiceProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Landing Page */}
                <Route path="/landing" element={<Landing />} />
                
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/public" element={<PublicStatusPage />} />
                
                {/* Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Dashboard Routes */}
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="services" element={<Services />} />
                  <Route path="incidents" element={<Incidents />} />
                  <Route path="maintenance" element={<Maintenance />} />
                  <Route path="teams" element={<Teams />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
                
                {/* Legacy Index (redirects to landing) */}
                <Route path="/index" element={<Index />} />
                
                {/* Catch-all Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ServiceProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
