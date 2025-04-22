// context/AuthContext.js
'use client';

import { createContext, useContext } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/nextjs';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const { isLoaded, isSignedIn, signOut } = useClerkAuth();
  const { user } = useUser();

  const value = {
    isLoaded,
    isSignedIn,
    user,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);