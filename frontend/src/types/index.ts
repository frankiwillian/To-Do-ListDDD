// Tipos para autenticação
export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// Tipos para usuário
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  lastLogin?: string;
  active: boolean;
}

export interface UpdateUserRequest {
  name: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

// Tipos para tarefas
export interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  dueDate: string;
  isCompleted: boolean;
  userId: string;
  isOverdue: boolean;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  dueDate: string;
}

export interface UpdateTaskRequest {
  title: string;
  description: string;
  dueDate: string;
}