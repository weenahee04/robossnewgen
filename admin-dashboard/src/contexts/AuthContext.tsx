import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminApi } from '../services/api';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setUser({ id: 'admin', email: 'admin@roboss.com', name: 'Admin' });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await adminApi.login(email, password);
    setUser(response.user);
  };

  const demoLogin = async () => {
    const response = await adminApi.demoLogin();
    setUser(response.user);
  };

  const logout = () => {
    adminApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, demoLogin, logout }}>
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
