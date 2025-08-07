import React, { createContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@/types';
import type { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setUserFromSession = useCallback(async (session: Session | null) => {
    console.log('setUserFromSession called with session:', session ? 'exists' : 'null');
    
    // Always set loading to false when we get the session result
    setIsLoading(false);
    
    if (!session) {
      console.log('No session, setting user to null');
      setUser(null);
      return;
    }

    // If we have a session, the user is authenticated
    // Load profile in background - don't block authentication on this
    try {
      console.log('Fetching profile for user:', session.user.id);
      // Try to get profile from database
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        // Create a basic user object from session data as fallback
        setUser({
          id: session.user.id,
          email: session.user.email!,
          fullName: session.user.user_metadata?.full_name,
          avatarUrl: session.user.user_metadata?.avatar_url,
        });
        return;
      }

      if (!profile) {
        console.log('Profile not found, creating new profile');
        // Create profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: session.user.id,
            email: session.user.email!,
            full_name: session.user.user_metadata?.full_name,
            avatar_url: session.user.user_metadata?.avatar_url,
            language: 'ar',
            first_tracking_month: new Date().toISOString().slice(0, 7),
          })
          .select()
          .maybeSingle();

        if (createError) {
          console.error('Error creating profile:', createError);
          // Use session data as fallback
          setUser({
            id: session.user.id,
            email: session.user.email!,
            fullName: session.user.user_metadata?.full_name,
            avatarUrl: session.user.user_metadata?.avatar_url,
          });
          return;
        }

        if (newProfile) {
          console.log('New profile created successfully');
          setUser({
            id: newProfile.id,
            email: newProfile.email,
            fullName: newProfile.full_name || undefined,
            avatarUrl: newProfile.avatar_url || undefined,
          });
        } else {
          console.log('Failed to create profile, using session data');
          setUser({
            id: session.user.id,
            email: session.user.email!,
            fullName: session.user.user_metadata?.full_name,
            avatarUrl: session.user.user_metadata?.avatar_url,
          });
        }
      } else {
        console.log('Profile found, setting user');
        setUser({
          id: profile.id,
          email: profile.email,
          fullName: profile.full_name || undefined,
          avatarUrl: profile.avatar_url || undefined,
        });
      }
    } catch (error) {
      console.error('Error setting user from session:', error);
      // Use session data as fallback
      setUser({
        id: session.user.id,
        email: session.user.email!,
        fullName: session.user.user_metadata?.full_name,
        avatarUrl: session.user.user_metadata?.avatar_url,
      });
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (mounted) {
        if (error) {
          console.error('Error getting initial session:', error);
          setIsLoading(false);
          return;
        }
        setSession(session);
        setUserFromSession(session); // This will handle setting isLoading to false
      }
    }).catch((error) => {
      console.error('Error in getSession:', error);
      if (mounted) {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session);
        setUserFromSession(session); // This will handle setting isLoading to false
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [setUserFromSession]);

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
          queryParams: {
            prompt: 'select_account',
          },
        },
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setSession(null);
      setUser(null);
      
      const { error } = await supabase.auth.signOut({
        scope: 'global'
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const isAuthenticated = !!session; // User is authenticated if they have a session

  return (
    <AuthContext.Provider value={{ 
      user, 
      session,
      isAuthenticated, 
      isLoading, 
      signInWithGoogle, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
export type { User, AuthContextType };
