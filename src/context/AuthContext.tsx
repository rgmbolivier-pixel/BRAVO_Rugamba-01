import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'ADMIN' | 'MANAGER' | 'STAFF';

interface User {
  name: string;
  email: string;
  role: UserRole;
  branch?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('testos_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email: string, role: UserRole) => {
    const newUser: User = {
      name: role === 'ADMIN' ? 'John Admin' : role === 'MANAGER' ? 'Jane Smith' : 'Sarah Staff',
      email,
      role,
      branch: role !== 'ADMIN' ? 'Downtown Store' : undefined
    };
    setUser(newUser);
    localStorage.setItem('testos_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('testos_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
