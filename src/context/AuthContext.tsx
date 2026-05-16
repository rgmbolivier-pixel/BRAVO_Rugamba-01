import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService } from '../services/api';
import { setToken } from '../lib/api/client';
import { jwtDecode } from 'jwt-decode';

export type UserRole = 'admin' | 'manager' | 'staff';

interface User {
  name: string;
  email: string;
  role: UserRole;
  branch?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded: any = jwtDecode(token as string);
          // If token is expired, logout
          if (decoded.exp * 1000 < Date.now()) {
            logout();
            setLoading(false);
            return;
          }
          // Fetch profile to get full user data
          const res = await authService.getUser();
          setUser(res.data);
        } catch (err) {
          console.error('Auth init error', err);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await authService.login({ email, password });
      const { access, refresh, user: userData } = res.data;
      localStorage.setItem('token', access);
      localStorage.setItem('refresh', refresh);
      setToken(access);
      setUser(userData);
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
