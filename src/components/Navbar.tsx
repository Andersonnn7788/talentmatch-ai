
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { User, BriefcaseBusiness, Search, Bell, Video, GraduationCap, SwitchCamera } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import AuthNavbar from '@/components/AuthNavbar';

interface NavbarProps {
  userType: 'employee' | 'recruiter';
}

const Navbar = ({ userType }: NavbarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const basePath = `/${userType}`;
  
  const navItems = userType === 'employee' 
    ? [
        { name: 'Home', path: `${basePath}/home`, icon: Search },
        { name: 'Profile', path: `${basePath}/profile`, icon: User },
        { name: 'Job Matches', path: `${basePath}/job-matches`, icon: BriefcaseBusiness },
        { name: 'Aptitude Tests', path: `${basePath}/aptitude-tests`, icon: GraduationCap },
        { name: 'Interviews', path: `${basePath}/interviews`, icon: Video },
      ]
    : [
        { name: 'Home', path: `${basePath}/home`, icon: Search },
        { name: 'Profile', path: `${basePath}/profile`, icon: User },
        { name: 'Candidates', path: `${basePath}/candidates`, icon: BriefcaseBusiness },
        { name: 'Aptitude Tests', path: `${basePath}/aptitude`, icon: GraduationCap },
        { name: 'Interviews', path: `${basePath}/interviews`, icon: Video },
        { name: 'Pricing', path: `${basePath}/pricing`, icon: User },
      ];

  const handleSwitchRole = () => {
    const currentPath = location.pathname;
    const targetRole = userType === 'employee' ? 'recruiter' : 'employee';
    
    // Map common pages directly
    if (currentPath.includes('/home')) {
      navigate(`/${targetRole}/home`);
    } else if (currentPath.includes('/profile')) {
      navigate(`/${targetRole}/profile`);
    } else if (currentPath.includes('/interviews')) {
      navigate(`/${targetRole}/interviews`);
    } 
    // Handle special cases
    else if (userType === 'employee' && currentPath.includes('/job-matches')) {
      navigate('/recruiter/candidates');
    } else if (userType === 'recruiter' && currentPath.includes('/candidates')) {
      navigate('/employee/job-matches');
    } else if (currentPath.includes('/aptitude')) {
      navigate(`/${targetRole}/${targetRole === 'employee' ? 'aptitude-tests' : 'aptitude'}`);
    } else {
      // Default fallback to home
      navigate(`/${targetRole}/home`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/d05cc45a-3134-49fc-9dd2-6aedf61c151a.png" 
              alt="TM.AI Logo" 
              className="h-12 w-auto"
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className={`flex items-center space-x-1 py-2 transition-colors ${
                    isActive 
                      ? 'text-primary font-medium' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <item.icon size={16} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="relative bg-primary/5 hover:bg-primary/10"
                    onClick={handleSwitchRole}
                  >
                    <SwitchCamera size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Switch to {userType === 'employee' ? 'Recruiter' : 'Job Seeker'} View</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </Button>
            
            <AuthNavbar userType={userType} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
