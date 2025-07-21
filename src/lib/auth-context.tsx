"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: 'admin' | 'tutor' | 'student';
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const extractUserProfile = async (user: User) => {
    try {
      // Get the session to access the access token for role extraction
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        const token = session.access_token;
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(function (c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
        );
        const decodedToken = JSON.parse(jsonPayload);
        
        return {
          id: user.id,
          email: user.email || '',
          role: decodedToken.user_role || 'student',
          first_name: user.user_metadata?.first_name,
          last_name: user.user_metadata?.last_name,
        };
      }
    } catch (error) {
      console.error('Error extracting user profile:', error);
    }
    
    // Fallback profile
    return {
      id: user.id,
      email: user.email || '',
      role: 'student' as const,
      first_name: user.user_metadata?.first_name,
      last_name: user.user_metadata?.last_name,
    };
  };

  useEffect(() => {
    // Get initial user (secure method)
    const getInitialUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Error getting user:', error);
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }
      
      setUser(user);
      
      if (user) {
        const userProfile = await extractUserProfile(user);
        setProfile(userProfile);
      }
      setLoading(false);
    };

    getInitialUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const sessionUser = session?.user ?? null;
        setUser(sessionUser);
        
        if (sessionUser) {
          const userProfile = await extractUserProfile(sessionUser);
          setProfile(userProfile);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const value = {
    user,
    profile,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 