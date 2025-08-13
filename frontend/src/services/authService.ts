import api from './api';
import { User, ApiResponse } from '../types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role?: 'manager' | 'admin';
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>('/auth/login', credentials);
    if (response.data.success && response.data.data) {
      const { user, token } = response.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return { user, token };
    }
    throw new Error(response.data.message || 'Login failed');
  },

  async register(userData: RegisterData): Promise<{ user: User; token: string }> {
    const response = await api.post<ApiResponse<{ user: User; token: string }>>('/auth/register', userData);
    if (response.data.success && response.data.data) {
      const { user, token } = response.data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return { user, token };
    }
    throw new Error(response.data.message || 'Registration failed');
  },

  async getProfile(): Promise<User> {
    const response = await api.get<ApiResponse<{ user: User }>>('/auth/profile');
    if (response.data.success && response.data.data) {
      return response.data.data.user;
    }
    throw new Error(response.data.message || 'Failed to get profile');
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getStoredToken(): string | null {
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }
};