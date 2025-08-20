import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TaskList from './pages/TaskList';
import Profile from './pages/Profile';
import './styles/App.css';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <TaskProvider>
          <div className="app">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tarefas" element={<TaskList />} />
                <Route path="/perfil" element={<Profile />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>
            <footer className="app-footer">
              <div className="container">
                <p>&copy; {new Date().getFullYear()} Lista de Tarefas - Todos os direitos reservados</p>
              </div>
            </footer>
          </div>
        </TaskProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;