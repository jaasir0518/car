// lib/db/models/User.js

import { supabase, handleSupabaseError } from '../index';

export const UserModel = {
  // Get current user profile
  async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return { user: null };
      
      // Get user profile data
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      
      return { user: { ...user, ...data } };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },
  
  // Update user profile
  async updateProfile(profileData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return { error: 'Not authenticated' };
      
      const { data, error } = await supabase
        .from('users')
        .update(profileData)
        .eq('id', user.id)
        .select()
        .single();
        
      if (error) throw error;
      
      return { user: data };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },
  
  // Get user by ID (for admin or when viewing other profiles)
  async getUserById(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      
      return { user: data };
    } catch (error) {
      return handleSupabaseError(error);
    }
  }
};

// Authentication methods
export const AuthService = {
  // Sign up with email and password
  async signUp(email, password, userData) {
    try {
      // Register with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (authError) throw authError;
      
      // Create user profile
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email,
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone || null,
            created_at: new Date(),
            updated_at: new Date(),
          });
          
        if (profileError) throw profileError;
      }
      
      return { user: authData.user };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },
  
  // Sign in with email and password
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      return { session: data.session, user: data.user };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },
  
  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      return handleSupabaseError(error);
    }
  },
};