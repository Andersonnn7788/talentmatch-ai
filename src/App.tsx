
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import TestPage from "./pages/TestPageFixed";
import EnvTest from "./pages/EnvTest";
import SimpleTest from "./pages/SimpleTest";

// Employee Pages
import EmployeeHome from "./pages/employee/Home";
import EmployeeProfile from "./pages/employee/Profile";
import JobMatches from "./pages/employee/JobMatches";
import EmployeeAptitudeTests from "./pages/employee/AptitudeTests";
import EmployeeInterviews from "./pages/employee/Interviews";

// Recruiter Pages
import RecruiterHome from "./pages/recruiter/Home";
import RecruiterProfile from "./pages/recruiter/Profile";
import Candidates from "./pages/recruiter/Candidates";
import RecruiterAptitudeTests from "./pages/recruiter/Aptitude";
import RecruiterInterviews from "./pages/recruiter/Interviews";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Employee Routes */}
            <Route path="/employee/home" element={
              <ProtectedRoute userType="employee">
                <EmployeeHome />
              </ProtectedRoute>
            } />
            <Route path="/employee/profile" element={
              <ProtectedRoute userType="employee">
                <EmployeeProfile />
              </ProtectedRoute>
            } />
            <Route path="/employee/job-matches" element={
              <ProtectedRoute userType="employee">
                <JobMatches />
              </ProtectedRoute>
            } />
            <Route path="/employee/aptitude-tests" element={
              <ProtectedRoute userType="employee">
                <EmployeeAptitudeTests />
              </ProtectedRoute>
            } />
            <Route path="/employee/interviews" element={
              <ProtectedRoute userType="employee">
                <EmployeeInterviews />
              </ProtectedRoute>
            } />
            
            {/* Recruiter Routes */}
            <Route path="/recruiter/home" element={
              <ProtectedRoute userType="recruiter">
                <RecruiterHome />
              </ProtectedRoute>
            } />
            <Route path="/recruiter/profile" element={
              <ProtectedRoute userType="recruiter">
                <RecruiterProfile />
              </ProtectedRoute>
            } />
            <Route path="/recruiter/candidates" element={
              <ProtectedRoute userType="recruiter">
                <Candidates />
              </ProtectedRoute>
            } />
            <Route path="/recruiter/aptitude" element={
              <ProtectedRoute userType="recruiter">
                <RecruiterAptitudeTests />
              </ProtectedRoute>
            } />            <Route path="/recruiter/interviews" element={
              <ProtectedRoute userType="recruiter">
                <RecruiterInterviews />
              </ProtectedRoute>
            } />
              {/* Test Page for Resume Upload */}
            <Route path="/test" element={<TestPage />} />
              {/* Environment Variables Test */}
            <Route path="/env-test" element={<EnvTest />} />
            
            {/* Simple Test */}
            <Route path="/simple-test" element={<SimpleTest />} />
            
            {/* Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
