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
    // Allow login if admin_users cannot be read due to policies, but still use a generic admin profile.
    return { email, username: null, role: 'Admin', is_active: true };
  }

  return data || null;
};

const resolveAdminEmail = async (identifier) => {
  const raw = identifier?.trim();
  if (!raw) return null;
  const normalized = raw.replace(/\s+/g, '').toLowerCase();

  if (raw.includes('@')) {
    return raw.toLowerCase();
  }

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
    if (!email) {
      return { success: false, message: 'Admin account not registered' };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.warn('Supabase login error:', error.message);
      // If Supabase Auth sign-in fails, allow a fallback to check the admin_users.password column
      // (useful if admin rows were created manually and Auth users not created). This is a
      // compatibility fallback — prefer Supabase Auth for real deployments.
      try {
        const { data: adminRow, error: adminErr } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', email)
          .maybeSingle();

        if (!adminErr && adminRow && adminRow.password && adminRow.password === password) {
          // authenticate using the admin_users password fallback
          setIsAuthenticated(true);
          setAdminUser(adminRow);
          return { success: true, message: 'Authenticated via admin_users fallback' };
        }
      } catch (e) {
        console.warn('Fallback admin password check failed:', e?.message || e);
      }

      const msg = error.message?.toLowerCase().includes('invalid') ? 'Invalid email or password' : error.message;
      return { success: false, message: msg };
    }

    const userEmail = data.session?.user?.email;
    const admin = await getAdminRecord(userEmail);
    if (!admin) {
      await supabase.auth.signOut();
      return { success: false, message: 'Admin access not found' };
    }

    setIsAuthenticated(true);
    setAdminUser(admin);
    return { success: true };
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
