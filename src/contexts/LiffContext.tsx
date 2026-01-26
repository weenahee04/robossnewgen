import React, { createContext, useContext, useState, useEffect } from 'react';
import liff from '@line/liff';

interface LiffContextType {
  isLiffReady: boolean;
  isLoggedIn: boolean;
  profile: any | null;
  liffError: string | null;
  login: () => void;
  logout: () => void;
}

const LiffContext = createContext<LiffContextType | undefined>(undefined);

export const useLiff = () => {
  const context = useContext(LiffContext);
  if (!context) {
    throw new Error('useLiff must be used within LiffProvider');
  }
  return context;
};

interface LiffProviderProps {
  children: React.ReactNode;
  liffId: string;
}

export const LiffProvider: React.FC<LiffProviderProps> = ({ children, liffId }) => {
  const [isLiffReady, setIsLiffReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<any | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);

  useEffect(() => {
    initializeLiff();
  }, []);

  const initializeLiff = async () => {
    try {
      await liff.init({ liffId });
      setIsLiffReady(true);

      if (liff.isLoggedIn()) {
        setIsLoggedIn(true);
        const userProfile = await liff.getProfile();
        setProfile(userProfile);
      }
    } catch (error: any) {
      console.error('LIFF initialization failed:', error);
      setLiffError(error.message || 'Failed to initialize LIFF');
      setIsLiffReady(true);
    }
  };

  const login = () => {
    if (!liff.isLoggedIn()) {
      liff.login();
    }
  };

  const logout = () => {
    if (liff.isLoggedIn()) {
      liff.logout();
      setIsLoggedIn(false);
      setProfile(null);
    }
  };

  return (
    <LiffContext.Provider
      value={{
        isLiffReady,
        isLoggedIn,
        profile,
        liffError,
        login,
        logout,
      }}
    >
      {children}
    </LiffContext.Provider>
  );
};
