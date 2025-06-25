import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, FileText, BarChart3, LogOut } from 'lucide-react';
import './Navigation.css';

function Navigation({ user, onLogout }) {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <h2>80 in 80</h2>
          <span className="user-info">Welcome, {user.name}</span>
        </div>
        
        <div className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/')}`}>
            <Home size={20} />
            Dashboard
          </Link>
          <Link to={`/training/${user.currentDay}`} className={`nav-link ${location.pathname.includes('/training') ? 'active' : ''}`}>
            <BookOpen size={20} />
            Daily Training
          </Link>
          <Link to="/mock-test" className={`nav-link ${isActive('/mock-test')}`}>
            <FileText size={20} />
            Mock Test
          </Link>
          <Link to="/progress" className={`nav-link ${isActive('/progress')}`}>
            <BarChart3 size={20} />
            Progress
          </Link>
        </div>        
        <button onClick={onLogout} className="logout-btn">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navigation;