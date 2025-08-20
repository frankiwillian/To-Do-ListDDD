import api from './api';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../types';

export const getAllTasks = async (): Promise<Task[]> => {
  const response = await api.get<Task[]>('/tasks');
  return response.data;
};

export const getPendingTasks = async (): Promise<Task[]> => {
  const response = await api.get<Task[]>('/tasks/pending');
  return response.data;
};

export const getCompletedTasks = async (): Promise<Task[]> => {
  const response = await api.get<Task[]>('/tasks/completed');
  return response.data;
};

export const getOverdueTasks = async (): Promise<Task[]> => {
  const response = await api.get<Task[]>('/tasks/overdue');
  return response.data;
};

export const getTaskById = async (id: string): Promise<Task> => {
  const response = await api.get<Task>(`/tasks/${id}`);
  return response.data;
};

export const createTask = async (data: CreateTaskRequest): Promise<Task> => {
  const response = await api.post<Task>('/tasks', data);
  return response.data;
};

export const updateTask = async (id: string, data: UpdateTaskRequest): Promise<Task> => {
  const response = await api.put<Task>(`/tasks/${id}`, data);
  return response.data;
};

export const markAsCompleted = async (id: string): Promise<Task> => {
  const response = await api.patch<Task>(`/tasks/${id}/complete`);
  return response.data;
};

export const markAsIncomplete = async (id: string): Promise<Task> => {
  const response = await api.patch<Task>(`/tasks/${id}/incomplete`);
  return response.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};