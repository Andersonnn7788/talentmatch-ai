
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Employee Pages
import EmployeeHome from "./pages/employee/Home";
import EmployeeProfile from "./pages/employee/Profile";
import JobMatches from "./pages/employee/JobMatches";
import AptitudeTests from "./pages/employee/AptitudeTests";

// Recruiter Pages
import RecruiterHome from "./pages/recruiter/Home";
import RecruiterProfile from "./pages/recruiter/Profile";
import Candidates from "./pages/recruiter/Candidates";
import Aptitude from "./pages/recruiter/Aptitude";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Employee Routes */}
          <Route path="/employee/home" element={<EmployeeHome />} />
          <Route path="/employee/profile" element={<EmployeeProfile />} />
          <Route path="/employee/job-matches" element={<JobMatches />} />
          <Route path="/employee/aptitude-tests" element={<AptitudeTests />} />
          
          {/* Recruiter Routes */}
          <Route path="/recruiter/home" element={<RecruiterHome />} />
          <Route path="/recruiter/profile" element={<RecruiterProfile />} />
          <Route path="/recruiter/candidates" element={<Candidates />} />
          <Route path="/recruiter/aptitude" element={<Aptitude />} />
          
          {/* Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
