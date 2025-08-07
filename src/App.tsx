import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLoanDetail from "./pages/AdminLoanDetail";
import AdminUserManagement from "./pages/AdminUserManagement";
import BorrowerPortal from "./pages/BorrowerPortal";
import CRM from "./pages/CRM";
import Layout from "./components/Layout";
import AuthContextProvider from "./contexts/AuthContext";
import { LoanflowCrmIntegration } from "./components/LoanflowCrmIntegration";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RateLimitProvider } from "./components/RateLimitProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthContextProvider>
          <RateLimitProvider>
            <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/loans/:id" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLoanDetail />
                </ProtectedRoute>
              } />
              <Route path="/crm" element={
                <ProtectedRoute requiredRole="admin">
                  <CRM />
                </ProtectedRoute>
              } />
              <Route path="/crm/loanflow-integration" element={
                <ProtectedRoute requiredRole="admin">
                  <LoanflowCrmIntegration />
                </ProtectedRoute>
              } />
              <Route path="/portal" element={
                <ProtectedRoute>
                  <BorrowerPortal />
                </ProtectedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
          </RateLimitProvider>
        </AuthContextProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
