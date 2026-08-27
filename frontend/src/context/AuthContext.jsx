import React, { createContext, useContext, useMemo, useState } from 'react';
import { login, logout, register } from '../services/api';
import { readStoredSession, writeStoredSession } from '../services/authStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);

  const saveSession = (nextSession) => {
    setSession(nextSession);
    writeStoredSession(nextSession);
  };

  const value = useMemo(() => ({
    user: session?.user || null,
    token: session?.token || '',
    isAuthenticated: Boolean(session?.token),
    async loginUser(credentials) {
      const nextSession = await login(credentials);
      saveSession(nextSession);
      return nextSession;
    },
    async registerUser(details) {
      const nextSession = await register(details);
      saveSession(nextSession);
      return nextSession;
    },
    async logoutUser() {
      try {
        await logout();
      } finally {
        saveSession(null);
      }
    }
  }), [session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return value;
}
