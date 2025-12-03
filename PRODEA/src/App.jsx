import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import Users from './components/Users';
import Posts from './components/Posts';
import Comments from './components/Comments';
import Solutions from './components/Solutions';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('access_token');
  const userId = localStorage.getItem('user_id');
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    navigate('/login');
    window.location.reload();
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="logo" style={{ textDecoration: 'none' }}>PRODEA</Link>
        <div className="nav-links">
          {isAuthenticated ? (
            <>
              <div className="user-info">
                <span className="user-badge">
                  👤 {username || 'User'} (ID: {userId})
                </span>
              </div>
              <Link to="/" className={`nav-link ${location.pathname === '/' || location.pathname === '/posts' ? 'active' : ''}`}>
                Problems & Solutions
              </Link>
              <Link to="/users" className={`nav-link ${location.pathname === '/users' ? 'active' : ''}`}>
                Users
              </Link>
              <button onClick={handleLogout} className="nav-link logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}>
                Login
              </Link>
              <Link to="/register" className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Posts />} />
            <Route path="/users" element={<Users />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/comments" element={<Comments />} />
            <Route path="/solutions" element={<Solutions />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

