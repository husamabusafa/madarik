import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'MANAGER';
  preferredLocale: 'EN' | 'AR';
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  // Invite-only: register replaced by acceptInvite
  acceptInvite: (token: string, password: string, preferredLocale?: 'EN' | 'AR') => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
  isCompanyOwner: boolean;
  isCompanyMember: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      // Validate token and fetch user data
      validateTokenAndFetchUser(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const validateTokenAndFetchUser = async (token: string) => {
    try {
      const response = await fetch('http://localhost:3100/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `query Me { me { id email role preferredLocale isActive } }`,
        }),
      });

      const json = await response.json();
      if (!response.ok || json.errors) {
        // Token is invalid, remove it
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsLoading(false);
        return;
      }

      const userData = json.data?.me ?? null;
      setUser(userData);
    } catch (error) {
      console.error('Token validation error:', error);
      // Token validation failed, remove it
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3100/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `mutation Login($email: String!, $password: String!) {\n            login(input: { email: $email, password: $password }) {\n              token\n              user { id email role preferredLocale isActive }\n            }\n          }`,
          variables: { email, password },
        }),
      });

      const json = await response.json();
      if (!response.ok || json.errors) {
        throw new Error(json.errors?.[0]?.message || 'Login failed');
      }

      const payload = json.data?.login;
      if (!payload?.token || !payload?.user) {
        throw new Error('Invalid login response');
      }
      setToken(payload.token);
      setUser(payload.user);
      localStorage.setItem('token', payload.token);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Client-side logout for JWT in localStorage
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const acceptInvite = async (tokenValue: string, password: string, preferredLocale?: 'EN' | 'AR') => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3100/api/v1/auth/accept-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: tokenValue, password, preferredLocale }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Accept invite failed');
      }

      const json = await response.json();
      const data = json.data;
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
    } catch (error) {
      console.error('Accept invite error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3100/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to send reset email');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3100/api/v1/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Password reset failed');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (token: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3100/api/v1/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Email verification failed');
      }
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerification = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3100/api/v1/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to resend verification');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    acceptInvite,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    isLoading,
    isAuthenticated: !!user && !!token,
    isCompanyOwner: user?.role === 'ADMIN',
    isCompanyMember: user?.role === 'MANAGER' || user?.role === 'ADMIN',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
