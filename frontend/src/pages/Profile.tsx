import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user, isAuthenticated, updateUser, logout } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user, isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword && newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      
      await updateUser({
        name,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined
      });
      
      setSuccess('Perfil atualizado com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha ao atualizar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setError('');
      setLoading(true);
      
      // Implementar a chamada para excluir a conta
      // await deleteAccount();
      
      logout();
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha ao excluir conta. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">Meu Perfil</h2>
        
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        
        {success && (
          <div className="alert alert-success" role="alert">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              id="name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              disabled
            />
            <small className="form-text text-muted">
              O email não pode ser alterado.
            </small>
          </div>
          
          <hr />
          <h4>Alterar Senha</h4>
          
          <div className="form-group">
            <label htmlFor="currentPassword">Senha Atual</label>
            <input
              type="password"
              id="currentPassword"
              className="form-control"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Digite sua senha atual"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="newPassword">Nova Senha</label>
            <input
              type="password"
              id="newPassword"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Digite sua nova senha"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
            <input
              type="password"
              id="confirmPassword"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme sua nova senha"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
        
        <hr />
        <div className="danger-zone">
          <h4>Zona de Perigo</h4>
          
          {!showDeleteConfirm ? (
            <button 
              className="btn btn-danger" 
              onClick={() => setShowDeleteConfirm(true)}
            >
              Excluir Minha Conta
            </button>
          ) : (
            <div className="delete-confirm">
              <p>Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.</p>
              <div className="delete-actions">
                <button 
                  className="btn btn-danger" 
                  onClick={handleDeleteAccount}
                  disabled={loading}
                >
                  {loading ? 'Excluindo...' : 'Sim, Excluir Minha Conta'}
                </button>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;