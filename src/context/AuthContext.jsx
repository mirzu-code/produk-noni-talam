/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from 'react';
import { supabase, buildAdminEmail } from '../supabaseClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setIsAuthenticated(true);
      }
    };
    initAuth();
  }, []);

  const login = async (username, password) => {
    const email = buildAdminEmail(username);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.warn('Supabase login error:', error.message);
      return false;
    }

    if (data.session?.user) {
      setIsAuthenticated(true);
      return true;
    }

    return false;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
