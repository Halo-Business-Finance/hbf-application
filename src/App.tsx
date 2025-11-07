import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLoanDetail from "./pages/AdminLoanDetail";
import AdminUserManagement from "./pages/AdminUserManagement";
import BorrowerPortal from "./pages/BorrowerPortal";
import ChangePassword from "./pages/ChangePassword";
import ChangeEmail from "./pages/ChangeEmail";
import TwoFactorAuth from "./pages/TwoFactorAuth";
import LoanApplications from "./pages/LoanApplications";
import CRM from "./pages/CRM";
import Support from "./pages/Support";
import LoanCalculator from "./pages/LoanCalculator";
import MyDocuments from "./pages/MyDocuments";
import CreditReports from "./pages/CreditReports";
import CreditScoreSimulator from "./pages/CreditScoreSimulator";
import BankAccounts from "./pages/BankAccounts";
import ExistingLoans from "./pages/ExistingLoans";
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
            <Routes>
              {/* Public routes without Layout */}
              <Route path="/" element={<Index />} />
              <Route path="/calculator" element={<LoanCalculator />} />
              
              {/* Protected routes with Layout */}
              <Route path="/admin" element={
                <Layout>
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                </Layout>
              } />
              <Route path="/admin/applications" element={
                <Layout>
                  <ProtectedRoute requiredRole="admin">
                    <AllApplications />
                  </ProtectedRoute>
                </Layout>
              } />
              <Route path="/admin/review" element={
                <Layout>
                  <ProtectedRoute requiredRole="admin">
                    <ApplicationReview />
                  </ProtectedRoute>
                </Layout>
              } />
              <Route path="/admin/analytics" element={
                <Layout>
                  <ProtectedRoute requiredRole="admin">
                    <Analytics />
                  </ProtectedRoute>
                </Layout>
              } />
              <Route path="/admin/settings" element={
                <Layout>
                  <ProtectedRoute requiredRole="admin">
                    <SystemSettings />
                  </ProtectedRoute>
                </Layout>
              } />
              <Route path="/admin/security" element={
                <Layout>
                  <ProtectedRoute requiredRole="admin">
                    <SecurityAudit />
                  </ProtectedRoute>
                </Layout>
              } />
              <Route path="/admin/export" element={
                <Layout>
                  <ProtectedRoute requiredRole="admin">
                    <ExportData />
                  </ProtectedRoute>
                </Layout>
              } />
              <Route path="/admin/products" element={
                <Layout>
                  <ProtectedRoute requiredRole="admin">
                    <LoanProducts />
                  </ProtectedRoute>
                </Layout>
              } />
              <Route path="/admin/payments" element={
                <Layout>
                  <ProtectedRoute requiredRole="admin">
                    <PaymentManagement />
                  </ProtectedRoute>
                </Layout>
              } />
              <Route path="/admin/notifications" element={
                <Layout>
                  <ProtectedRoute requiredRole="admin">
                    <Notifications />
                  </ProtectedRoute>
                </Layout>
              } />
              <Route path="/admin/support" element={
                <Layout>
                  <ProtectedRoute requiredRole="admin">
                    <SupportTickets />
                  </ProtectedRoute>
                </Layout>
              } />
              <Route path="/admin/database" element={
                <Layout>
                  <ProtectedRoute requiredRole="admin">
                    <DatabaseManagement />
                  </ProtectedRoute>
                </Layout>
              } />
              <Route path="/admin/integrations" element={
                <Layout>
                  <ProtectedRoute requiredRole="admin">
                    <ApiIntegrations />
                  </ProtectedRoute>
                </Layout>
              } />
              <Route path="/admin/users" element={
                <Layout>
                  <ProtectedRoute requiredRole="admin">
                    <AdminUserManagement />
                  </ProtectedRoute>
                </Layout>
              } />
              <Route path="/admin/loans/:id" element={
                <Layout>
                  <ProtectedRoute requiredRole="admin">
                    <AdminLoanDetail />
                  </ProtectedRoute>
                </Layout>
              } />
              <Route path="/crm" element={
                <Layout>
                  <ProtectedRoute requiredRole="admin">
                    <CRM />
                  </ProtectedRoute>
                </Layout>
              } />
              <Route path="/crm/loanflow-integration" element={
                <Layout>
                  <ProtectedRoute requiredRole="admin">
                    <LoanflowCrmIntegration />
                  </ProtectedRoute>
                </Layout>
              } />
              <Route path="/portal" element={
                <Layout>
                  <ProtectedRoute>
                    <BorrowerPortal />
                  </ProtectedRoute>
                </Layout>
              } />
              <Route path="/change-password" element={
                <Layout>
                  <ProtectedRoute>
                    <ChangePassword />
                  </ProtectedRoute>
                </Layout>
              } />
              <Route path="/change-email" element={
                <Layout>
                  <ProtectedRoute>
                    <ChangeEmail />
                  </ProtectedRoute>
                </Layout>
              } />
              <Route path="/two-factor-auth" element={
                <Layout>
                  <ProtectedRoute>
                    <TwoFactorAuth />
                  </ProtectedRoute>
                </Layout>
              } />
              <Route path="/loan-applications" element={
                <Layout>
                  <ProtectedRoute>
                    <LoanApplications />
                  </ProtectedRoute>
                </Layout>
              } />
              <Route path="/document-storage" element={
                <Layout>
                  <ProtectedRoute>
                    <MyDocuments />
                  </ProtectedRoute>
                </Layout>
              } />
              <Route path="/my-documents" element={
                <Layout>
                  <ProtectedRoute>
                    <MyDocuments />
                  </ProtectedRoute>
                </Layout>
              } />
              <Route path="/credit-reports" element={
                <Layout>
                  <ProtectedRoute>
                    <CreditReports />
                  </ProtectedRoute>
                </Layout>
              } />
              <Route path="/credit-score-simulator" element={
                <Layout>
                  <ProtectedRoute>
                    <CreditScoreSimulator />
                  </ProtectedRoute>
                </Layout>
              } />
              <Route path="/bank-accounts" element={
                <Layout>
                  <ProtectedRoute>
                    <BankAccounts />
                  </ProtectedRoute>
                </Layout>
              } />
              <Route path="/existing-loans" element={
                <Layout>
                  <ProtectedRoute>
                    <ExistingLoans />
                  </ProtectedRoute>
                </Layout>
              } />
              <Route path="/support" element={
                <Layout>
                  <ProtectedRoute>
                    <Support />
                  </ProtectedRoute>
                </Layout>
              } />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </RateLimitProvider>
        </AuthContextProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
