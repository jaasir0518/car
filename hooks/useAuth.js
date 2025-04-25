'use client'

// hooks/useAuth.js

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/db/index';
import { AuthService, UserModel } from '@/lib/db/models/User';

// Create context
const AuthContext = createContext(null);

// Context provider component
export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook for components to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider hook to create auth object and handle state
function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // Get current user on mount
  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      
      // Check session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { user: userData } = await UserModel.getCurrentUser();
        setUser(userData);
      }
      
      setLoading(false);
    };
    
    getUser();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          const { user: userData } = await UserModel.getCurrentUser();
          setUser(userData);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );
    
    // Clean up subscription
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);
  
  // Sign up function
  const signUp = async (email, password, userData) => {
    setLoading(true);
    
    try {
      const { user: newUser, error } = await AuthService.signUp(email, password, userData);
      
      if (error) {
        throw new Error(error);
      }
      
      setUser(newUser);
      router.push('/dashboard');
      
      return { user: newUser };
    } catch (error) {
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Sign in function
  const signIn = async (email, password) => {
    setLoading(true);
    
    try {
      const { user: authUser, session, error } = await AuthService.signIn(email, password);
      
      if (error) {
        throw new Error(error);
      }
      
      // Get full user profile
      const { user: userData } = await UserModel.getCurrentUser();
      setUser(userData);
      
      router.push('/dashboard');
      
      return { user: userData };
    } catch (error) {
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Sign out function
  const signOut = async () => {
    setLoading(true);
    
    try {
      const { error } = await AuthService.signOut();
      
      if (error) {
        throw new Error(error);
      }
      
      setUser(null);
      router.push('/');
      
      return { success: true };
    } catch (error) {
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Update user profile
  const updateProfile = async (profileData) => {
    setLoading(true);
    
    try {
      const { user: updatedUser, error } = await UserModel.updateProfile(profileData);
      
      if (error) {
        throw new Error(error);
      }
      
      setUser(prev => ({ ...prev, ...updatedUser }));
      
      return { user: updatedUser };
    } catch (error) {
      return { error: error.message };
    } finally {
      setLoading(false);
    }
  };
  
  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile
  };
}