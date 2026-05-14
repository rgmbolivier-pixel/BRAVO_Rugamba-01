import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, type UserRole } from '../../context/AuthContext';
import { Terminal, Lock, Mail, Server } from 'lucide-react';
import './Login.css';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('admin@bravoos.az');
  const [password, setPassword] = useState('BravoOS@2024!');
  const [error, setError] = useState<string | null>(null);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Authentication failed. Please check your credentials.');
    }
  };

  const setDemo = (roleEmail: string, pass: string) => {
    setEmail(roleEmail);
    setPassword(pass);
  };

  return (
    <div className="login-container terminal-ui">
      <div className="login-box glow-panel">
        <div className="login-header">
          <Terminal size={48} className="login-logo text-primary" />
          <h1 className="login-title">████ BRAVOOS ████</h1>
          <p className="login-subtitle">RETAIL OPERATING SYSTEM v1.0</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {error && (
            <div className="panel border-danger text-danger mb-4" style={{ fontSize: '0.8rem', padding: '10px' }}>
              ⚠ {error}
            </div>
          )}
          <div className="form-group">
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="EMAIL"
                className="terminal-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="PASSWORD"
                className="terminal-input"
                required
              />
            </div>
          </div>

          <div className="login-actions">
            <button type="submit" className="btn btn-primary w-full">
              AUTHENTICATE
            </button>
          </div>
        </form>

        <div className="demo-credentials panel">
          <h3 className="demo-title">DEMO CREDENTIALS:</h3>
          <div className="demo-grid">
            <button className="demo-btn" onClick={() => setDemo('admin@bravoos.az', 'BravoOS@2024!')}>
              👑 HQ Admin
            </button>
            <button className="demo-btn" onClick={() => setDemo('manager@bravoos.az', 'BravoOS@2024!')}>
              👔 Store Mgr
            </button>
            <button className="demo-btn" onClick={() => setDemo('staff@bravoos.az', 'BravoOS@2024!')}>
              👥 Store Staff
            </button>
          </div>
        </div>

        <div className="system-status">
          <div className="status-item">
            <div className="status-dot online"></div>
            <span>SYSTEM ONLINE</span>
          </div>
          <div className="status-item">
            <Server size={14} />
            <span>CONNECTED STORES: 12</span>
          </div>
        </div>
      </div>
    </div>
  );
};
