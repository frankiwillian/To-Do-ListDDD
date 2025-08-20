import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTask } from '../contexts/TaskContext';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { 
    getAllTasks, 
    getPendingTasks, 
    getCompletedTasks, 
    getOverdueTasks 
  } = useTask();
  
  const [totalTasks, setTotalTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [overdueTasks, setOverdueTasks] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const fetchData = async () => {
      try {
        const [all, pending, completed, overdue] = await Promise.all([
          getAllTasks(),
          getPendingTasks(),
          getCompletedTasks(),
          getOverdueTasks()
        ]);
        
        setTotalTasks(all.length);
        setPendingTasks(pending.length);
        setCompletedTasks(completed.length);
        setOverdueTasks(overdue.length);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [isAuthenticated, navigate, getAllTasks, getPendingTasks, getCompletedTasks, getOverdueTasks]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Bem-vindo, {user?.name}!</h1>
        <p>Aqui está um resumo das suas tarefas</p>
      </div>
      
      <div className="dashboard-stats">
        <div className="stats-card total">
          <div className="stats-icon">
            <i className="fas fa-tasks"></i>
          </div>
          <div className="stats-info">
            <h3>{totalTasks}</h3>
            <p>Total de Tarefas</p>
          </div>
        </div>
        
        <div className="stats-card pending">
          <div className="stats-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stats-info">
            <h3>{pendingTasks}</h3>
            <p>Tarefas Pendentes</p>
          </div>
        </div>
        
        <div className="stats-card completed">
          <div className="stats-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stats-info">
            <h3>{completedTasks}</h3>
            <p>Tarefas Concluídas</p>
          </div>
        </div>
        
        <div className="stats-card overdue">
          <div className="stats-icon">
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <div className="stats-info">
            <h3>{overdueTasks}</h3>
            <p>Tarefas Atrasadas</p>
          </div>
        </div>
      </div>
      
      <div className="dashboard-actions">
        <button 
          className="btn btn-primary" 
          onClick={() => navigate('/tarefas')}
        >
          <i className="fas fa-list"></i> Ver Todas as Tarefas
        </button>
        <button 
          className="btn btn-success" 
          onClick={() => navigate('/tarefas/nova')}
        >
          <i className="fas fa-plus"></i> Criar Nova Tarefa
        </button>
      </div>
    </div>
  );
};

export default Dashboard;