import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import Footer from '../../Components/footer/footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Admin credentials
  const ADMIN_EMAIL = 'bawwa@gmail.com';
  const ADMIN_PASSWORD = 'bawwa';
  const DEFAULT_PASSWORD = 'defaultPassword123';

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    // Check for admin login
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem('userEmail', email);
      localStorage.setItem('isAdmin', 'true');
      navigate('/adminPanel');
      return;
    }

    // Check for regular user login
    if (password === DEFAULT_PASSWORD) {
      localStorage.setItem('userEmail', email);
      localStorage.setItem('isAdmin', 'false');
      navigate('/');
      return;
    }

    // Invalid credentials
    setError('Invalid email or password');
  };

  const handleCreateAccount = () => {
    navigate('/register');
  };

  return (
    <div className="login-page">
      <div className="login-background"></div>
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Please enter your credentials to login</p>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
              <span className="input-icon">✉️</span>
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <span className="input-icon">🔒</span>
            </div>
            
            <div className="form-options">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="/forgot-password" className="forgot-password">
                Forgot password?
              </a>
            </div>
            
            <button type="submit" className="login-btn">
              Sign In
            </button>
          </form>
          
          <div className="login-footer">
            <p>Don't have an account?</p>
            <button onClick={handleCreateAccount} className="create-account-btn">
              Create Account
            </button>
          </div>
          
          <div className="social-login">
            <p>Or sign in with</p>
            <div className="social-icons">
              <button className="social-btn google">Google</button>
              <button className="social-btn facebook">Facebook</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;