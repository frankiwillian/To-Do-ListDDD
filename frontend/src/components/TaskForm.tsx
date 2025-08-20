import React, { useState, useEffect } from 'react';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../types';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: CreateTaskRequest | UpdateTaskRequest) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      // Formatar a data para o formato esperado pelo input type="date"
      const date = new Date(task.dueDate);
      setDueDate(date.toISOString().split('T')[0]);
    }
  }, [task]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'O título é obrigatório';
    }
    
    if (!dueDate) {
      newErrors.dueDate = 'A data de vencimento é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    const formData: CreateTaskRequest | UpdateTaskRequest = {
      title,
      description,
      dueDate
    };
    
    onSubmit(formData);
  };

  return (
    <div className="task-form-container">
      <h2>{task ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Título</label>
          <input
            type="text"
            id="title"
            className={`form-control ${errors.title ? 'is-invalid' : ''}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Digite o título da tarefa"
          />
          {errors.title && <div className="invalid-feedback">{errors.title}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Descrição</label>
          <textarea
            id="description"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Digite a descrição da tarefa"
            rows={4}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="dueDate">Data de Vencimento</label>
          <input
            type="date"
            id="dueDate"
            className={`form-control ${errors.dueDate ? 'is-invalid' : ''}`}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          {errors.dueDate && <div className="invalid-feedback">{errors.dueDate}</div>}
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {task ? 'Atualizar' : 'Criar'} Tarefa
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;