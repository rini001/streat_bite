import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { usersService } from '../api/services/usersService';
import { User, UserData, LoginCredentials, AuthResponse } from '../types/auth.types';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  register: (userData: UserData) => Promise<boolean>;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkLoggedIn = async (): Promise<void> => {
      try {
        if (localStorage.getItem('token')) {
          const userData = await usersService.getCurrentUser();
          setUser(userData);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    
    checkLoggedIn();
  }, []);

  const register = async (userData: UserData): Promise<boolean> => {
    setError(null);
    try {
      await usersService.register(userData);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setError(null);
    try {
      const response = await usersService.login(credentials);
      setUser(response.user);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };
const navigate = useNavigate(); 
  const logout = (): void => {
    usersService.logout();
    setUser(null);
    navigate('/')
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};