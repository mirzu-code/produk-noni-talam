/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from 'react';
import { supabase, buildAdminEmail } from '../supabaseClient';

export const AuthContext = createContext();

const getAdminRecord = async (identifier) => {
  if (!identifier) return null;
  try {
    const raw = identifier.trim();
    const normalized = raw.replace(/\s+/g, '').toLowerCase();
    const searchEmail = raw.includes('@') ? raw.toLowerCase() : null;
    const localPart = searchEmail ? searchEmail.split('@')[0] : null;

    const { data: rows, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.warn('Admin lookup failed:', error.message);
      return null;
    }

    if (!rows?.length) return null;

    const match = rows.find((item) => {
      const email = item.email?.trim().toLowerCase();
      const username = item.username?.trim().toLowerCase();
      const usernameNoSpace = username?.replace(/\s+/g, '');

      if (searchEmail && email === searchEmail) return true;
      if (localPart && username === localPart) return true;
      if (username === raw.toLowerCase()) return true;
      if (usernameNoSpace === normalized) return true;
      if (email === normalized) return true;
      return false;
    });

    return match || null;
  } catch (e) {
    console.warn('Admin lookup failed:', e?.message || e);
    return null;
  }
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
      const user = data.session?.user ?? data.user;
      if (user?.email) {
        let admin = await getAdminRecord(user.email);
        if (!admin && user.email.includes('@')) {
          const localPart = user.email.split('@')[0];
          admin = await getAdminRecord(localPart);
        }
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

    const user = data.session?.user ?? data.user;
    const userEmail = user?.email;
    let admin = await getAdminRecord(userEmail);
    if (!admin) {
      admin = await getAdminRecord(username);
    }
    if (!admin && userEmail?.includes('@')) {
      const localPart = userEmail.split('@')[0];
      admin = await getAdminRecord(localPart);
    }
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
