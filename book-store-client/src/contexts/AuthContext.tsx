import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWithToken } from '../services/api';
import { LOGIN_ENDPOINT, SIGNUP_ENDPOINT, LOGOUT_ENDPOINT } from '../utils/constant';
import { User, AuthResponse } from '../types/auth';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (name: string, phone: string, address: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const login = useCallback(async (username: string, password: string) => {
    try {
      const data = await fetchWithToken<AuthResponse>(LOGIN_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      sessionStorage.setItem('accessToken', data.accessToken);
      setUser(data.user);
      navigate('/home');
    } catch (error) {
      throw error;
    }
  }, [navigate]);

  const signup = useCallback(async (name: string, phone: string, address: string, password: string) => {
    try {
      await fetchWithToken(SIGNUP_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({ 
          name, 
          phoneNumber: phone, 
          address, 
          password,
          id: phone 
        })
      });
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetchWithToken(LOGOUT_ENDPOINT, {
        method: 'POST'
      });
      sessionStorage.removeItem('accessToken');
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};