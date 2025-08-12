import { useState, useEffect } from 'react';
import { AuthService, AuthUser, LoginCredentials } from '@/services/auth';

export interface UseAuthReturn {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Omit<AuthUser, 'id'>>) => Promise<void>;
  error: string | null;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const currentUser = AuthService.getCurrentUser();
      
      if (currentUser) {
        const isValid = await AuthService.validateSession();
        if (isValid) {
          setUser(currentUser);
        } else {
          await AuthService.logout();
          setUser(null);
        }
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      const authResponse = await AuthService.login(credentials);
      setUser(authResponse.user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await AuthService.logout();
      setUser(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Omit<AuthUser, 'id'>>) => {
    try {
      setError(null);
      const updatedUser = await AuthService.updateProfile(updates);
      setUser(updatedUser);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Profile update failed';
      setError(errorMessage);
      throw err;
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: user !== null,
    login,
    logout,
    updateProfile,
    error,
  };
}