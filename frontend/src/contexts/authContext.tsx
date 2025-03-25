import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService from '../services/auth.service';
import { User } from '../types/auth.types';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (token: string) => Promise<any>;
  googleLogin: () => Promise<void>;
  handleGoogleCallback: (code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        // Check if token exists in localStorage
        const token = localStorage.getItem('accessToken');
        console.log("Access Token", token);
        
        if (token && authService.isAuthenticated()) {
          try {
            const user = await authService.getCurrentUser();
            setCurrentUser(user);
            setIsAuthenticated(true);
          } catch (error: any) {
            console.error('Failed to get current user:', error);
            // Only clear tokens if there's an authentication error
            // This prevents logout on network errors
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
              authService.logout();
              setCurrentUser(null);
              setIsAuthenticated(false);
            }
          }
        } else {
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      } catch (error: any) {
        console.error('Auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const user = await authService.login({ email, password });
      setCurrentUser(user);
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any): Promise<void> => {
    setIsLoading(true);
    try {
      const user = await authService.register(userData);
      alert("Register Function Called")
      setCurrentUser(user);
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.googleLogin();
      // The page will be redirected to Google's OAuth page
    } catch (error: any) {
      console.error('Google login error:', error);
      setIsLoading(false);
    }
  };

  const handleGoogleCallback = async (code: string): Promise<void> => {
    setIsLoading(true);
    try {
      const user = await authService.handleGoogleCallback(code);
      setCurrentUser(user);
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setCurrentUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (token: string) => {
    setIsLoading(true);
    try {
      const response = await authService.verifyEmail(token);
      return response;
    } finally {
        setIsLoading(false);
    }
  }

  const value = {
    currentUser,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    verifyEmail,
    googleLogin,
    handleGoogleCallback
  };

  return (
    <AuthContext.Provider value={value}>
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

export default AuthProvider;
