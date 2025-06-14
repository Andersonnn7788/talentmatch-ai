
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Employee Pages
import EmployeeHome from "./pages/employee/Home";
import EmployeeProfile from "./pages/employee/Profile";
import EmployeeJobMatches from "./pages/employee/JobMatches";
import EmployeeAptitudeTests from "./pages/employee/AptitudeTests";
import EmployeeInterviews from "./pages/employee/Interviews";

// Recruiter Pages
import RecruiterHome from "./pages/recruiter/Home";
import RecruiterProfile from "./pages/recruiter/Profile";
import RecruiterCandidates from "./pages/recruiter/Candidates";
import RecruiterAptitude from "./pages/recruiter/Aptitude";
import RecruiterInterviews from "./pages/recruiter/Interviews";
import RecruiterPricing from "./pages/RecruiterPricing";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Employee routes */}
            <Route path="/employee/home" element={
              <ProtectedRoute>
                <EmployeeHome />
              </ProtectedRoute>
            } />
            <Route path="/employee/profile" element={
              <ProtectedRoute>
                <EmployeeProfile />
              </ProtectedRoute>
            } />
            <Route path="/employee/job-matches" element={
              <ProtectedRoute>
                <EmployeeJobMatches />
              </ProtectedRoute>
            } />
            <Route path="/employee/aptitude-tests" element={
              <ProtectedRoute>
                <EmployeeAptitudeTests />
              </ProtectedRoute>
            } />
            <Route path="/employee/interviews" element={
              <ProtectedRoute>
                <EmployeeInterviews />
              </ProtectedRoute>
            } />
            
            {/* Recruiter routes */}
            <Route path="/recruiter/home" element={
              <ProtectedRoute>
                <RecruiterHome />
              </ProtectedRoute>
            } />
            <Route path="/recruiter/profile" element={
              <ProtectedRoute>
                <RecruiterProfile />
              </ProtectedRoute>
            } />
            <Route path="/recruiter/candidates" element={
              <ProtectedRoute>
                <RecruiterCandidates />
              </ProtectedRoute>
            } />
            <Route path="/recruiter/aptitude" element={
              <ProtectedRoute>
                <RecruiterAptitude />
              </ProtectedRoute>
            } />
            <Route path="/recruiter/interviews" element={
              <ProtectedRoute>
                <RecruiterInterviews />
              </ProtectedRoute>
            } />
            <Route path="/recruiter/pricing" element={
              <ProtectedRoute>
                <RecruiterPricing />
              </ProtectedRoute>
            } />
            
            {/* Redirect /employee and /recruiter to their home pages */}
            <Route path="/employee" element={<Navigate to="/employee/home" replace />} />
            <Route path="/recruiter" element={<Navigate to="/recruiter/home" replace />} />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
