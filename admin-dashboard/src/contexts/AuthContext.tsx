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
    try {
      const response = await adminApi.login(email, password);
      setUser(response.user);
    } catch (error: any) {
      const errorMessage = error?.message || '';
      if (
        errorMessage.includes('API_URL not configured') ||
        errorMessage.includes('Empty response') ||
        errorMessage.includes('Network error') ||
        errorMessage.includes('fetch') ||
        errorMessage.includes('ERR_CONNECTION_REFUSED')
      ) {
        console.log('Using demo mode - no backend available');
        // Fallback to demo user
        const demoUser: User = {
          id: 'admin-demo',
          email: 'admin@roboss.com',
          name: 'Admin Demo',
        };
        setUser(demoUser);
        localStorage.setItem('adminToken', 'demo-token');
      } else {
        throw error;
      }
    }
  };

  const demoLogin = async () => {
    try {
      const response = await adminApi.demoLogin();
      setUser(response.user);
    } catch (error: any) {
      const errorMessage = error?.message || '';
      if (
        errorMessage.includes('API_URL not configured') ||
        errorMessage.includes('Empty response') ||
        errorMessage.includes('Network error') ||
        errorMessage.includes('fetch') ||
        errorMessage.includes('ERR_CONNECTION_REFUSED')
      ) {
        console.log('Using demo mode - no backend available');
        // Fallback to demo user
        const demoUser: User = {
          id: 'admin-demo',
          email: 'admin@roboss.com',
          name: 'Admin Demo',
        };
        setUser(demoUser);
        localStorage.setItem('adminToken', 'demo-token');
      } else {
        throw error;
      }
    }
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
