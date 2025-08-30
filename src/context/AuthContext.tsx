import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api/client';

type User = { id?: string; email?: string; username?: string; role?: 'ADMIN' | 'USER' };

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string, role?: 'ADMIN' | 'USER') => Promise<void>;
  logout: () => void;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (token) {
      // load profile
      refreshMe().catch(() => {
        setToken(null);
        localStorage.removeItem('token');
      });
    }
  }, []);

  const login = async (username: string, password: string) => {
    const data = await api.post('/auth/login', { username, password });
    const access = data?.access_token ?? data?.accessToken ?? data?.token;
    if (!access) throw new Error('No token returned');
    localStorage.setItem('token', access);
    setToken(access);
    await refreshMe();
  };

  const signup = async (username: string, password: string, role: 'ADMIN' | 'USER' = 'USER') => {
    // Admin registration may be admin-only on backend; this endpoint here mirrors controllers.
    await api.post('/auth/register', { username, password, role });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const refreshMe = async () => {
    const me = await api.get('/users/me');
    setUser(me);
  };

  return <AuthContext.Provider value={{ user, token, login, signup, logout, refreshMe }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
