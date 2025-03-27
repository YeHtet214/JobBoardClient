import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  useCurrentUser,
  useLogin as useLoginQuery,
  useRegister as useRegisterQuery,
  useLogout as useLogoutQuery,
  useGoogleLogin as useGoogleLoginQuery,
  useGoogleCallback as useGoogleCallbackQuery
} from '../hooks/react-queries/auth';
import authService from '../services/auth.service';
import { User } from '../types/auth.types';
import { isTokenExpired } from '../utils/jwt';

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
  showSessionExpiredDialog: boolean;
  dismissSessionExpiredDialog: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Initialize authentication state based on token validity
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    return !!(accessToken && refreshToken && !isTokenExpired(accessToken));
  });
  const [showSessionExpiredDialog, setShowSessionExpiredDialog] = useState(false);

  // Use React Query hooks
  const {
    data: currentUser,
    isLoading: isUserLoading,
    isError,
    refetch: refetchUser
  } = useCurrentUser();

  const loginMutation = useLoginQuery();
  const registerMutation = useRegisterQuery();
  const logoutMutation = useLogoutQuery();
  const googleLoginMutation = useGoogleLoginQuery();
  const googleCallbackMutation = useGoogleCallbackQuery();

  // Handle session expiration events
  useEffect(() => {
    const handleSessionExpired = () => {
      console.log('Session expired event received');
      setIsAuthenticated(false);
      setShowSessionExpiredDialog(true);
    };

    window.addEventListener('auth:sessionExpired', handleSessionExpired);

    return () => {
      window.removeEventListener('auth:sessionExpired', handleSessionExpired);
    };
  }, []);

  // Update authentication state based on tokens and user data
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    // Check if tokens exist and are valid
    const tokensValid = accessToken && refreshToken && 
                        !isTokenExpired(accessToken) && 
                        !isTokenExpired(refreshToken);
    
    console.log('Tokens valid:', tokensValid);
    console.log('Current user in context:', currentUser);
    
    if (tokensValid) {
      setIsAuthenticated(true);
      
      // If we have valid tokens but no user data, refetch the user
      if (!currentUser && !isUserLoading) {
        console.log('Refetching user data...');
        refetchUser();
      }
    } else if (!tokensValid) {
      // If tokens are invalid, ensure we're logged out
      setIsAuthenticated(false);
      // Only show expired dialog if we previously had a valid session
      if (accessToken || refreshToken) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }

    // If the user query failed due to auth error, ensure we're logged out
    if (isError) {
      console.log('User query error, logging out');
      setIsAuthenticated(false);
    }
  }, [currentUser, isError, isUserLoading, refetchUser]);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      await loginMutation.mutateAsync({ email, password });
      setIsAuthenticated(true);
      refetchUser(); // Refresh user data after login
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (userData: any): Promise<void> => {
    try {
      await registerMutation.mutateAsync(userData);
      setIsAuthenticated(true);
      refetchUser(); // Refresh user data after registration
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const googleLogin = async (): Promise<void> => {
    try {
      await googleLoginMutation.mutateAsync();
      // The page will be redirected to Google's OAuth page
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const handleGoogleCallback = async (code: string): Promise<void> => {
    try {
      await googleCallbackMutation.mutateAsync(code);
      setIsAuthenticated(true);
      refetchUser(); // Refresh user data after Google login
    } catch (error) {
      console.error('Google callback error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if the API call fails, we should log out locally
      setIsAuthenticated(false);
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      // We can't call a hook inside a function, so use the service directly
      const response = await authService.verifyEmail(token);
      return response;
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  };

  const dismissSessionExpiredDialog = () => {
    setShowSessionExpiredDialog(false);
  };

  const isLoading = isUserLoading ||
    loginMutation.isPending ||
    registerMutation.isPending ||
    logoutMutation.isPending ||
    googleLoginMutation.isPending ||
    googleCallbackMutation.isPending;

  const value = {
    currentUser: currentUser || null,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    verifyEmail,
    googleLogin,
    handleGoogleCallback,
    showSessionExpiredDialog,
    dismissSessionExpiredDialog
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
