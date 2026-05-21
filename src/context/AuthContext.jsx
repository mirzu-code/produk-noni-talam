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

const resolveAdminEmail = async (identifier) => {
  const raw = identifier?.trim();
  if (!raw) return null;
  if (raw.includes('@')) {
    return raw.toLowerCase();
  }

  const normalized = raw.replace(/\s+/g, '').toLowerCase();
  const { data, error } = await supabase
    .from('admin_users')
    .select('email, username')
    .eq('is_active', true);

  if (error) {
    console.warn('Admin email lookup failed:', error.message);
    return buildAdminEmail(raw);
  }

  const match = data?.find((item) => {
    const username = item.username?.trim().toLowerCase();
    return username === raw.toLowerCase() || username?.replace(/\s+/g, '') === normalized;
  });

  return match?.email ?? buildAdminEmail(raw);
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
    const email = await resolveAdminEmail(username);
    if (!email) return false;

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
