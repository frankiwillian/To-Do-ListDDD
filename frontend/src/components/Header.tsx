import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="app-header">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <i className="fas fa-check-double"></i> Lista de Tarefas
          </Link>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              {isAuthenticated && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/dashboard">
                      Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/tarefas">
                      Minhas Tarefas
                    </Link>
                  </li>
                </>
              )}
            </ul>
            
            <div className="navbar-nav">
              {isAuthenticated ? (
                <div className="nav-item dropdown">
                  <a 
                    className="nav-link dropdown-toggle" 
                    href="/" 
                    id="userDropdown" 
                    role="button" 
                    data-bs-toggle="dropdown"
                  >
                    <i className="fas fa-user-circle"></i> {user?.name}
                  </a>
                  <div className="dropdown-menu dropdown-menu-end">
                    <Link className="dropdown-item" to="/perfil">
                      <i className="fas fa-user-cog"></i> Meu Perfil
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt"></i> Sair
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">
                      <i className="fas fa-sign-in-alt"></i> Entrar
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/registro">
                      <i className="fas fa-user-plus"></i> Registrar
                    </Link>
                  </li>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;