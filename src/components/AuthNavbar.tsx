
import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AuthNavbarProps {
  userType: 'employee' | 'recruiter';
}

const AuthNavbar = ({ userType }: AuthNavbarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const handleSignOut = async () => {
    try {
      console.log('🚪 Starting sign out process...');
      
      // Show loading state
      toast({
        title: "Signing out...",
        description: "Please wait while we sign you out.",
      });

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Sign out error:', error);
        throw error;
      }

      console.log('✅ Sign out successful');
      
      // Clear any local storage if needed
      localStorage.removeItem('supabase.auth.token');
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
      
      // Navigate to auth page
      navigate('/auth');
      
      // Optionally reload the page to ensure clean state
      setTimeout(() => {
        window.location.href = '/auth';
      }, 1000);
      
    } catch (error: any) {
      console.error('❌ Error during sign out:', error);
      toast({
        title: "Error signing out",
        description: error.message || "There was a problem signing you out.",
        variant: "destructive",
      });
      
      // Force navigation even on error
      navigate('/auth');
    }
  };

  const handleProfileClick = () => {
    navigate(`/${userType}/profile`);
  };

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.full_name || user?.email} />
              <AvatarFallback>
                {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="flex flex-col space-y-1 p-2">
            <p className="text-sm font-medium leading-none">{user?.user_metadata?.full_name || 'User'}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
          </div>
          <DropdownMenuItem onClick={handleProfileClick}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AuthNavbar;
