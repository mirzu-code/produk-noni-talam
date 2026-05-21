/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from 'react';
import { supabase, buildAdminEmail } from '../supabaseClient';

export const AuthContext = createContext();

const getAdminRecord = async (email) => {
  if (!email) return null;
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('email', email)
    .eq('is_active', true)
    .single();

  if (error) {
    console.warn('Admin lookup failed:', error.message);
    return null;
  }

  return data || null;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (user?.email) {
        const admin = await getAdminRecord(user.email);
        if (admin) {
          setIsAuthenticated(true);
          setAdminUser(admin);
          return;
        }
      }
      setIsAuthenticated(false);
      setAdminUser(null);
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

    const userEmail = data.session?.user?.email;
    const admin = await getAdminRecord(userEmail);
    if (!admin) {
      await supabase.auth.signOut();
      return false;
    }

    setIsAuthenticated(true);
    setAdminUser(admin);
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, adminUser }}>
      {children}
    </AuthContext.Provider>
  );
};
