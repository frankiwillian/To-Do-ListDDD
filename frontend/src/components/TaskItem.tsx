import React from 'react';
import { Task } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TaskItemProps {
  task: Task;
  onTaskUpdated: () => Promise<void>;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onTaskUpdated }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const handleComplete = async () => {
    try {
      // Implementar a chamada para marcar como concluída
      await onTaskUpdated();
    } catch (error) {
      console.error('Erro ao marcar tarefa como concluída:', error);
    }
  };

  const handleIncomplete = async () => {
    try {
      // Implementar a chamada para marcar como pendente
      await onTaskUpdated();
    } catch (error) {
      console.error('Erro ao marcar tarefa como pendente:', error);
    }
  };

  const handleEdit = async () => {
    try {
      // Implementar a chamada para editar
      await onTaskUpdated();
    } catch (error) {
      console.error('Erro ao editar tarefa:', error);
    }
  };

  const handleDelete = async () => {
    try {
      // Implementar a chamada para excluir
      await onTaskUpdated();
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
    }
  };

  return (
    <div className={`task-item ${task.isCompleted ? 'completed' : ''} ${task.isOverdue && !task.isCompleted ? 'overdue' : ''}`}>
      <div className="task-header">
        <h3>{task.title}</h3>
        <div className="task-actions">
          {task.isCompleted ? (
            <button 
              className="btn btn-outline-secondary btn-sm" 
              onClick={handleIncomplete}
              title="Marcar como pendente"
            >
              <i className="fas fa-times"></i> Desfazer
            </button>
          ) : (
            <button 
              className="btn btn-success btn-sm" 
              onClick={handleComplete}
              title="Marcar como concluída"
            >
              <i className="fas fa-check"></i> Concluir
            </button>
          )}
          <button 
            className="btn btn-primary btn-sm" 
            onClick={handleEdit}
            title="Editar tarefa"
          >
            <i className="fas fa-edit"></i> Editar
          </button>
          <button 
            className="btn btn-danger btn-sm" 
            onClick={handleDelete}
            title="Excluir tarefa"
          >
            <i className="fas fa-trash"></i> Excluir
          </button>
        </div>
      </div>
      
      <div className="task-content">
        <p>{task.description}</p>
      </div>
      
      <div className="task-footer">
        <div className="task-dates">
          <span className="created-date">
            <strong>Criada em:</strong> {formatDate(task.createdAt)}
          </span>
          <span className="due-date">
            <strong>Prazo:</strong> {formatDate(task.dueDate)}
            {task.isOverdue && !task.isCompleted && (
              <span className="overdue-badge">Atrasada</span>
            )}
          </span>
        </div>
        <div className="task-status">
          {task.isCompleted ? (
            <span className="status-badge completed">Concluída</span>
          ) : (
            <span className="status-badge pending">Pendente</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;