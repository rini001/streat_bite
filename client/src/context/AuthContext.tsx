import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import mockUsers from '@/mock/mockUsers';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  toggleSavedVendor: (vendorId: string) => void;
  isVendorSaved: (vendorId: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => false,
  logout: () => {},
  register: async () => false,
  toggleSavedVendor: () => {},
  isVendorSaved: () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Mock login functionality
  const login = async (email: string, password: string): Promise<boolean> => {
    // Find user with matching email (in a real app, we'd check password too)
    const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  // Mock logout functionality
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  // Mock registration functionality
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Check if email already exists
    const emailExists = mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (emailExists) {
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: `u${mockUsers.length + 1}`,
      name,
      email,
      savedVendors: [],
    };
    
    // In a real app, we'd save this to a database
    // For now, we'll just set it as the current user
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    return true;
  };

  // Toggle saved vendor
  const toggleSavedVendor = (vendorId: string) => {
    if (!user) return;
    
    const updatedUser = { ...user };
    
    if (updatedUser.savedVendors.includes(vendorId)) {
      updatedUser.savedVendors = updatedUser.savedVendors.filter(id => id !== vendorId);
    } else {
      updatedUser.savedVendors = [...updatedUser.savedVendors, vendorId];
    }
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Check if vendor is saved
  const isVendorSaved = (vendorId: string): boolean => {
    return user?.savedVendors.includes(vendorId) || false;
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    register,
    toggleSavedVendor,
    isVendorSaved,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
