import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTask } from '../contexts/TaskContext';
import { useAuth } from '../contexts/AuthContext';
import TaskItem from '../components/TaskItem';
import TaskForm from '../components/TaskForm';
import { Task, CreateTaskRequest } from '../types';

const TaskList: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { 
    tasks, 
    getAllTasks, 
    getPendingTasks, 
    getCompletedTasks, 
    getOverdueTasks,
    createTask
  } = useTask();
  
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'overdue'>('all');
  const [showForm, setShowForm] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    loadTasks();
  }, [isAuthenticated, navigate, filter, getAllTasks, getPendingTasks, getCompletedTasks, getOverdueTasks]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      switch (filter) {
        case 'pending':
          await getPendingTasks();
          break;
        case 'completed':
          await getCompletedTasks();
          break;
        case 'overdue':
          await getOverdueTasks();
          break;
        default:
          await getAllTasks();
      }
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (data: CreateTaskRequest) => {
    try {
      await createTask(data);
      setShowForm(false);
      await loadTasks();
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
    }
  };

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h1>Minhas Tarefas</h1>
        <div className="task-actions">
          <button 
            className="btn btn-primary" 
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancelar' : 'Nova Tarefa'}
          </button>
        </div>
      </div>
      
      {showForm && (
        <div className="task-form-container">
          <TaskForm 
            onSubmit={handleCreateTask}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}
      
      <div className="task-filters">
        <button 
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setFilter('all')}
        >
          Todas
        </button>
        <button 
          className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setFilter('pending')}
        >
          Pendentes
        </button>
        <button 
          className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setFilter('completed')}
        >
          Concluídas
        </button>
        <button 
          className={`btn ${filter === 'overdue' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setFilter('overdue')}
        >
          Atrasadas
        </button>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      ) : tasks.length > 0 ? (
        <div className="task-list">
          {tasks.map((task: Task) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onTaskUpdated={loadTasks}
            />
          ))}
        </div>
      ) : (
        <div className="no-tasks">
          <i className="fas fa-clipboard-list fa-3x"></i>
          <p>Nenhuma tarefa encontrada</p>
          {filter !== 'all' && (
            <button 
              className="btn btn-link" 
              onClick={() => setFilter('all')}
            >
              Ver todas as tarefas
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskList;