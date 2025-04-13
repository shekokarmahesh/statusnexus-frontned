import  Toaster  from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react"; // Add this import
import { ServiceProvider } from "./contexts/ServiceContext";
import { ThemeProvider } from "./providers/ThemeProvider";
import { SignInPage, SignUpPage, ProtectedRoute } from "./pages/auth/AuthComponents";
import { AuthSuccess } from "./pages/auth/AuthSuccess";
// Auth Pages
import { CreateOrganizationPage, OrganizationProfilePage, OrganizationCheck } from "./pages/organization/OrganizationPages";

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
import {Uptime} from "./pages/dashboard/Uptime";

import { AuthProvider } from "./context/AuthContext";

// Not Found
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

const queryClient = new QueryClient();

// Replace the hardcoded fallback key with an empty string
// This will prevent the app from using an invalid key when the environment variable is missing
const clerkPubKey = import.meta.env.CLERK_PUBLISHABLE_KEY || "";
const isClerkConfigured = Boolean(clerkPubKey && clerkPubKey.startsWith('pk_'));

// Option to add validation
if (!clerkPubKey) {
  console.warn("Missing Clerk publishable key. Authentication features will not work properly.");
}

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      {clerkPubKey ? (
        <ClerkProvider 
          publishableKey={clerkPubKey}
          signInFallbackRedirectUrl="/auth-success"
          signUpFallbackRedirectUrl="/auth-success"
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
        >
          <ThemeProvider defaultTheme="system" storageKey="status-dashboard-theme">
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
                    <Route path="/sign-in/*" element={<SignInPage />} />
                    <Route path="/sign-up/*" element={<SignUpPage />} />
                    <Route path="/auth-success" element={<AuthSuccess />} />

                    {/* Protected Routes */}
                    <Route 
                      path="/create-team" 
                      element={
                        <ProtectedRoute>
                          <CreateOrganizationPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/team-settings" 
                      element={
                        <ProtectedRoute>
                          <OrganizationCheck>
                            <OrganizationProfilePage />
                          </OrganizationCheck>
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Dashboard Routes - Consolidated with protection */}
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute>
                          <OrganizationCheck>
                            <DashboardLayout />
                          </OrganizationCheck>
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<Dashboard />} />
                      <Route path="services" element={<Services />} />
                      <Route path="incidents" element={<Incidents />} />
                      <Route path="maintenance" element={<Maintenance />} />
                      <Route path="settings" element={<Settings />} />
                      <Route path="uptime" element={<Uptime />} />
                      
                    </Route>
                    
                    {/* Legacy Index (redirects to landing) */}
                    <Route path="/index" element={<Index />} />
                    
                    {/* Catch-all Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </ServiceProvider>
          </ThemeProvider>
        </ClerkProvider>
      ) : (
        // Provide a fallback when there's no valid Clerk key
        <ThemeProvider defaultTheme="system" storageKey="status-dashboard-theme">
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Include only public routes when Clerk isn't available */}
                <Route path="/" element={<Landing />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/public" element={<PublicStatusPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      )}
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
