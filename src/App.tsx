import React from "react";
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
import Support from "./pages/Support";
import LoanCalculator from "./pages/LoanCalculator";
import MyDocuments from "./pages/MyDocuments";
import Layout from "./components/Layout";
import AuthContextProvider from "./contexts/AuthContext";
import { LoanflowCrmIntegration } from "./components/LoanflowCrmIntegration";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RateLimitProvider } from "./components/RateLimitProvider";

// Admin pages
import AllApplications from "./pages/admin/AllApplications";
import ApplicationReview from "./pages/admin/ApplicationReview";
import Analytics from "./pages/admin/Analytics";
import SystemSettings from "./pages/admin/SystemSettings";
import SecurityAudit from "./pages/admin/SecurityAudit";
import ExportData from "./pages/admin/ExportData";
import LoanProducts from "./pages/admin/LoanProducts";
import PaymentManagement from "./pages/admin/PaymentManagement";
import Notifications from "./pages/admin/Notifications";
import SupportTickets from "./pages/admin/SupportTickets";
import DatabaseManagement from "./pages/admin/DatabaseManagement";
import ApiIntegrations from "./pages/admin/ApiIntegrations";

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
              <Route path="/admin/applications" element={
                <ProtectedRoute requiredRole="admin">
                  <AllApplications />
                </ProtectedRoute>
              } />
              <Route path="/admin/review" element={
                <ProtectedRoute requiredRole="admin">
                  <ApplicationReview />
                </ProtectedRoute>
              } />
              <Route path="/admin/analytics" element={
                <ProtectedRoute requiredRole="admin">
                  <Analytics />
                </ProtectedRoute>
              } />
              <Route path="/admin/settings" element={
                <ProtectedRoute requiredRole="admin">
                  <SystemSettings />
                </ProtectedRoute>
              } />
              <Route path="/admin/security" element={
                <ProtectedRoute requiredRole="admin">
                  <SecurityAudit />
                </ProtectedRoute>
              } />
              <Route path="/admin/export" element={
                <ProtectedRoute requiredRole="admin">
                  <ExportData />
                </ProtectedRoute>
              } />
              <Route path="/admin/products" element={
                <ProtectedRoute requiredRole="admin">
                  <LoanProducts />
                </ProtectedRoute>
              } />
              <Route path="/admin/payments" element={
                <ProtectedRoute requiredRole="admin">
                  <PaymentManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/notifications" element={
                <ProtectedRoute requiredRole="admin">
                  <Notifications />
                </ProtectedRoute>
              } />
              <Route path="/admin/support" element={
                <ProtectedRoute requiredRole="admin">
                  <SupportTickets />
                </ProtectedRoute>
              } />
              <Route path="/admin/database" element={
                <ProtectedRoute requiredRole="admin">
                  <DatabaseManagement />
                </ProtectedRoute>
              } />
              <Route path="/admin/integrations" element={
                <ProtectedRoute requiredRole="admin">
                  <ApiIntegrations />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminUserManagement />
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
              <Route path="/documents" element={
                <ProtectedRoute>
                  <MyDocuments />
                </ProtectedRoute>
              } />
              <Route path="/support" element={
                <ProtectedRoute>
                  <Support />
                </ProtectedRoute>
              } />
              <Route path="/calculator" element={
                <LoanCalculator />
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
