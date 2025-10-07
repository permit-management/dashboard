// RegisterForm.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './RegisterForm.scss';
import logo from './Assets/logo.png'; 

const RegisterForm = ({ setAction }) => {
  return (
<div className="register-wrapper">
       <div className="logo-container">
            <img src={logo} alt="Company Logo" className="logo-img" />
        </div> 
      <div className="register-card-glass">
        <form>
      <h1>Register</h1>
      <div className="input-box">
        <input type="text" placeholder="Full Name" required />
      </div>
      <div className="input-box">
        <input type="email" placeholder="Email" required />
      </div>
      <div className="input-box">
        <input type="text" placeholder="Username" required />
      </div>
      <div className="input-box">
        <input type="password" placeholder="Password" required />
      </div>
      <button type="submit" className="submit">Register</button>
      <div className="login-link">
        <p>Already have an account? <Link to="/LoginForm">Login</Link></p>
      </div>
    </form>   
  </div>
</div>
  );
};

export default RegisterForm;