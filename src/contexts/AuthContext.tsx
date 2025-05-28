
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔄 Auth state change:', event, session?.user?.email);
        
        if (event === 'SIGNED_OUT') {
          console.log('👋 User signed out');
          setSession(null);
          setUser(null);
        } else if (event === 'SIGNED_IN') {
          console.log('👋 User signed in:', session?.user?.email);
          setSession(session);
          setUser(session?.user ?? null);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);  const signOut = async () => {
    try {
      console.log('🚪 AuthContext: Starting sign out...');
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ AuthContext: Sign out error:', error);
        throw error;
      }
      
      // Manually clear state
      setUser(null);
      setSession(null);
      
      console.log('✅ AuthContext: Sign out successful');
      
    } catch (error) {
      console.error('❌ AuthContext: Sign out failed:', error);
      // Even if there's an error, clear local state
      setUser(null);
      setSession(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
