
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { User, BriefcaseBusiness, Search, Bell, GraduationCap } from 'lucide-react';

interface NavbarProps {
  userType: 'employee' | 'recruiter';
}

const Navbar = ({ userType }: NavbarProps) => {
  const location = useLocation();
  const basePath = `/${userType}`;
  
  const navItems = userType === 'employee' 
    ? [
        { name: 'Home', path: `${basePath}/home`, icon: Search },
        { name: 'Profile', path: `${basePath}/profile`, icon: User },
        { name: 'Job Matches', path: `${basePath}/job-matches`, icon: BriefcaseBusiness },
        { name: 'Aptitude Tests', path: `${basePath}/aptitude-tests`, icon: GraduationCap },
      ]
    : [
        { name: 'Home', path: `${basePath}/home`, icon: Search },
        { name: 'Profile', path: `${basePath}/profile`, icon: User },
        { name: 'Candidates', path: `${basePath}/candidates`, icon: BriefcaseBusiness },
        { name: 'Aptitude', path: `${basePath}/aptitude`, icon: GraduationCap },
      ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-2xl tracking-tight text-primary">
              TalentMatch<span className="text-primary/90">.AI</span>
            </span>
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
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full bg-primary/10">
              <User size={20} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
