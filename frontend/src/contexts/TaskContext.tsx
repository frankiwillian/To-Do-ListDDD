import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import * as taskService from '../services/taskService';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../types';
import { useAuth } from './AuthContext';

interface TaskContextData {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  getAllTasks: () => Promise<Task[]>;
  getPendingTasks: () => Promise<Task[]>;
  getCompletedTasks: () => Promise<Task[]>;
  getOverdueTasks: () => Promise<Task[]>;
  createTask: (data: CreateTaskRequest) => Promise<Task>;
  updateTask: (id: string, data: UpdateTaskRequest) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  markAsComplete: (id: string) => Promise<Task>;
  markAsIncomplete: (id: string) => Promise<Task>;
}

const TaskContext = createContext<TaskContextData>({} as TaskContextData);

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [overdueTasks, setOverdueTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  
  const loadAllTasks = async () => {
    if (!isAuthenticated) {
      setTasks([]);
      setPendingTasks([]);
      setCompletedTasks([]);
      setOverdueTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [allTasks, pending, completed, overdue] = await Promise.all([
        taskService.getAllTasks(),
        taskService.getPendingTasks(),
        taskService.getCompletedTasks(),
        taskService.getOverdueTasks()
      ]);

      setTasks(allTasks);
      setPendingTasks(pending);
      setCompletedTasks(completed);
      setOverdueTasks(overdue);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
      setError('Erro ao carregar tarefas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllTasks();
    } else {
      setTasks([]);
      setPendingTasks([]);
      setCompletedTasks([]);
      setOverdueTasks([]);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const createTask = async (data: CreateTaskRequest): Promise<Task> => {
    const newTask = await taskService.createTask(data);
    setTasks(prevTasks => [...prevTasks, newTask]);
    setPendingTasks(prevTasks => [...prevTasks, newTask]);
    return newTask;
  };

  const updateTask = async (id: string, data: UpdateTaskRequest): Promise<Task> => {
    const updatedTask = await taskService.updateTask(id, data);
    
    setTasks(prevTasks => 
      prevTasks.map(task => task.id === id ? updatedTask : task)
    );
    
    setPendingTasks(prevTasks => 
      prevTasks.map(task => task.id === id ? updatedTask : task).filter(task => !task.isCompleted)
    );
    
    setCompletedTasks(prevTasks => 
      prevTasks.map(task => task.id === id ? updatedTask : task).filter(task => task.isCompleted)
    );
    
    setOverdueTasks(prevTasks => 
      prevTasks.map(task => task.id === id ? updatedTask : task).filter(task => task.isOverdue)
    );
    
    return updatedTask;
  };

  const deleteTask = async (id: string): Promise<void> => {
    await taskService.deleteTask(id);
    
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    setPendingTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    setCompletedTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    setOverdueTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  const markAsComplete = async (id: string): Promise<Task> => {
    const updatedTask = await taskService.markAsCompleted(id);
    
    setTasks(prevTasks => 
      prevTasks.map(task => task.id === id ? updatedTask : task)
    );
    
    setPendingTasks(prevTasks => 
      prevTasks.filter(task => task.id !== id)
    );
    
    setCompletedTasks(prevTasks => [...prevTasks, updatedTask]);
    
    return updatedTask;
  };

  const markAsIncomplete = async (id: string): Promise<Task> => {
    const updatedTask = await taskService.markAsIncomplete(id);
    
    setTasks(prevTasks => 
      prevTasks.map(task => task.id === id ? updatedTask : task)
    );
    
    setCompletedTasks(prevTasks => 
      prevTasks.filter(task => task.id !== id)
    );
    
    setPendingTasks(prevTasks => [...prevTasks, updatedTask]);
    
    return updatedTask;
  };

  // Implementação dos métodos de busca de tarefas
  const getAllTasks = async (): Promise<Task[]> => {
    setLoading(true);
    try {
      const allTasks = await taskService.getAllTasks();
      setTasks(allTasks);
      return allTasks;
    } catch (error) {
      console.error('Erro ao buscar todas as tarefas:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getPendingTasks = async (): Promise<Task[]> => {
    setLoading(true);
    try {
      const pending = await taskService.getPendingTasks();
      setPendingTasks(pending);
      return pending;
    } catch (error) {
      console.error('Erro ao buscar tarefas pendentes:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getCompletedTasks = async (): Promise<Task[]> => {
    setLoading(true);
    try {
      const completed = await taskService.getCompletedTasks();
      setCompletedTasks(completed);
      return completed;
    } catch (error) {
      console.error('Erro ao buscar tarefas concluídas:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getOverdueTasks = async (): Promise<Task[]> => {
    setLoading(true);
    try {
      const overdue = await taskService.getOverdueTasks();
      setOverdueTasks(overdue);
      return overdue;
    } catch (error) {
      console.error('Erro ao buscar tarefas atrasadas:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error: null,
        getAllTasks,
        getPendingTasks,
        getCompletedTasks,
        getOverdueTasks,
        createTask,
        updateTask,
        deleteTask,
        markAsComplete,
        markAsIncomplete
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => useContext(TaskContext);