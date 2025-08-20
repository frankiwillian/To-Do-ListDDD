import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import { User, LoginRequest, RegisterRequest, UpdateUserRequest } from '../types';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateUser: (data: UpdateUserRequest) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStoredUser = () => {
      const storedUser = authService.getCurrentUser();
      if (storedUser) {
        setUser(storedUser);
      }
      setLoading(false);
    };

    loadStoredUser();
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      const response = await authService.login(data);
      setUser(response.user);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const response = await authService.register(data);
      setUser(response.user);
    } catch (error) {
      console.error('Erro ao registrar:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = async (data: UpdateUserRequest) => {
    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getToken()}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar usuário');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);