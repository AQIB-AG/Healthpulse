import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Hospital, AuthResponse } from '../services/authService';
import { fetchCurrentHospital } from '../services/authService';

interface AuthContextValue {
  hospital: Hospital | null;
  token: string | null;
  loading: boolean;
  loginFromResponse: (resp: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = 'hp_jwt';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const existingToken = window.localStorage.getItem(TOKEN_KEY);
    if (!existingToken) {
      setLoading(false);
      return;
    }
    setToken(existingToken);
    (async () => {
      try {
        const profile = await fetchCurrentHospital();
        setHospital(profile);
      } catch (err) {
        console.error(err);
        window.localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const loginFromResponse = (resp: AuthResponse) => {
    window.localStorage.setItem(TOKEN_KEY, resp.token);
    setToken(resp.token);
    setHospital(resp.hospital);
  };

  const logout = () => {
    window.localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setHospital(null);
  };

  return (
    <AuthContext.Provider value={{ hospital, token, loading, loginFromResponse, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

