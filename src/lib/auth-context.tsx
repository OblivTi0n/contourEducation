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

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Decode JWT to get role
        try {
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
          
          setProfile({
            id: session.user.id,
            email: session.user.email || '',
            role: decodedToken.user_role || 'student',
            first_name: session.user.user_metadata?.first_name,
            last_name: session.user.user_metadata?.last_name,
          });
        } catch (error) {
          console.error('Error decoding token:', error);
          setProfile({
            id: session.user.id,
            email: session.user.email || '',
            role: 'student',
          });
        }
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          // Update profile when auth state changes
          try {
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
            
            setProfile({
              id: session.user.id,
              email: session.user.email || '',
              role: decodedToken.user_role || 'student',
              first_name: session.user.user_metadata?.first_name,
              last_name: session.user.user_metadata?.last_name,
            });
          } catch (error) {
            console.error('Error decoding token:', error);
            setProfile({
              id: session.user.id,
              email: session.user.email || '',
              role: 'student',
            });
          }
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