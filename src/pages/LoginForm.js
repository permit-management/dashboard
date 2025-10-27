import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { setToken, setUser } from '../utils/auth';
import './LoginForm.scss';
import logo from './Assets/logo.png';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Get the intended destination or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/v1/permit/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.token) {
          // Store in localStorage
          setToken(data.token);
          if (data.user) {
            setUser(data.user);
          }

          // Update auth context
          login(data.token, data.user);

          alert('Login berhasil!');

          // Navigate to intended destination or dashboard
          navigate(from, { replace: true });
        } else {
          alert('Token tidak tersedia. Silakan coba lagi.');
        }
      } else {
        alert(`Login gagal: ${data.message || 'Periksa kembali username dan password'}`);
      }
    } catch (error) {
      console.error('Error login:', error);
      alert('Terjadi kesalahan saat login. Silakan coba lagi nanti.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="logo-container">
        <img src={logo} alt="Company Logo" className="logo-img" />
      </div>
      <div className="login-card-glass">
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#">Forgot password</a>
          </div>
          <button type="submit" className="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          <div className="register-link">
            <p>Don't have an account? <Link to="/RegisterForm">Register</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;