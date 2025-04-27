import api from '../axios';
import { UserData, LoginCredentials, AuthResponse, User } from '../../types/auth.types';

export const usersService = {
  register: async (userData: UserData): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/users/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/users/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  logout: (): void => {
    localStorage.removeItem('token');
  },
  
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await api.get<User>('/users/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};