import api from './api';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types';

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/users/login', data);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/users/register', data);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated(): boolean {
    return localStorage.getItem('token') !== null;
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};