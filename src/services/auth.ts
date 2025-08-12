export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'counselor' | 'student';
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
}

export class AuthService {
  private static readonly USER_KEY = 'crm_user';
  private static readonly TOKEN_KEY = 'crm_token';

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
        const authResponse: AuthResponse = {
          user: {
            id: 'user-1',
            name: 'Sarah Johnson',
            email: credentials.email,
            role: 'admin',
            avatar: undefined,
          },
          token: 'mock-jwt-token',
          refreshToken: 'mock-refresh-token',
        };

        this.setAuthData(authResponse);
        return authResponse;
      }

      throw new Error('Invalid credentials');
    } catch (error) {
      throw new Error('Login failed');
    }
  }

  static async logout(): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem(this.USER_KEY);
        localStorage.removeItem(this.TOKEN_KEY);
      }
    } catch (error) {
      throw new Error('Logout failed');
    }
  }

  static getCurrentUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;

    try {
      const userData = localStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  }

  static getToken(): string | null {
    if (typeof window === 'undefined') return null;

    return localStorage.getItem(this.TOKEN_KEY);
  }

  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null && this.getToken() !== null;
  }

  static async refreshToken(): Promise<string> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const newToken = 'new-mock-jwt-token';
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.TOKEN_KEY, newToken);
      }

      return newToken;
    } catch (error) {
      throw new Error('Token refresh failed');
    }
  }

  static async updateProfile(updates: Partial<Omit<AuthUser, 'id'>>): Promise<AuthUser> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        throw new Error('No user logged in');
      }

      const updatedUser = { ...currentUser, ...updates };
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
      }

      return updatedUser;
    } catch (error) {
      throw new Error('Profile update failed');
    }
  }

  private static setAuthData(authResponse: AuthResponse): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USER_KEY, JSON.stringify(authResponse.user));
      localStorage.setItem(this.TOKEN_KEY, authResponse.token);
    }
  }

  static async validateSession(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) return false;

      await new Promise(resolve => setTimeout(resolve, 300));

      return true;
    } catch (error) {
      return false;
    }
  }
}

export const authService = new AuthService();