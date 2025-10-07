import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginForm.scss';
import logo from './Assets/logo.png';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('https://60swqrng-8080.asse.devtunnels.ms/api/v1/permit/auth/login', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.token) {
          localStorage.setItem('token', data.token);

          // Simpan data user jika tersedia
          if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
          }

          alert('Login berhasil!');
          navigate('/dashboard');
        } else {
          alert('Token tidak tersedia. Silakan coba lagi.');
        }
      } else {
        alert(`Login gagal: ${data.message || 'Periksa kembali username dan password'}`);
      }
    } catch (error) {
      console.error('Error login:', error);
      alert('Terjadi kesalahan saat login. Silakan coba lagi nanti.');
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
          <button type="submit" className="submit">Login</button>
          <div className="register-link">
            <p>Don't have an account? <Link to="/RegisterForm">Register</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;