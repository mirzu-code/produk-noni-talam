import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const success = await login(username, password);
    if (success) {
      navigate('/admin');
    } else {
      setError('Invalid username or password. Please use your Supabase admin credentials.');
    }
  };

  return (
    <div className="login-page" style={{ 
      minHeight: 'calc(100vh - 80px)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem',
      backgroundColor: 'var(--color-bg-subtle)'
    }}>
      <div style={{ 
        background: 'var(--color-bg)', 
        padding: '3rem', 
        borderRadius: 'var(--border-radius)', 
        boxShadow: 'var(--shadow-lg)',
        width: '100%',
        maxWidth: '450px'
      }} className="animate-fade-up">
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Admin Access</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Login with your registered admin account.</p>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: '#FFEBEE', 
            color: '#D32F2F', 
            padding: '1rem', 
            borderRadius: '8px', 
            marginBottom: '1.5rem',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username or Email</label>
            <input 
              type="text" 
              id="username"
              className="form-control" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="admin 01, admin01, or email"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password"
              className="form-control" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter password"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Login to Dashboard
          </button>
          <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Example admin login: <strong>admin 01</strong> / <strong>Mirzu12345</strong>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
