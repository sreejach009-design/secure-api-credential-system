import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, ShieldCheck, ArrowRight } from 'lucide-react';
import api from '../api';
import { useAlert } from '../context/AlertContext';


const Register = ({ onLogin }) => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const { showAlert } = useAlert();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', formData);
      onLogin(res.data);
      showAlert('Account created successfully', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      showAlert(msg, 'error');
    }

  };

  return (
    <div className="landing-page portal-mode">
      {/* Ambient Background Elements */}
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>

      <div className="portal-container">
        <div className="auth-card glass gate-card">
          <div className="auth-header">
            <div className="auth-icon-container">
              <ShieldCheck size={40} color="#00f2fe" />
            </div>
            <h1>Create Account</h1>
            <p>Join the SecureKey platform today</p>
          </div>


          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <UserIcon size={18} />
              <input
                type="text"
                placeholder="Username"
                className="input-field"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
            <div className="input-group">
              <Mail size={18} />
              <input
                type="email"
                placeholder="Email Address"
                className="input-field"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="input-group">
              <Lock size={18} />
              <input
                type="password"
                placeholder="Password"
                className="input-field"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn-primary auth-submit">
              Register Account <ArrowRight size={18} />
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
        </div>
      </div>

      <Link to="/" className="portal-back-link">
        <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} /> Back to Home
      </Link>
    </div>
  );
};

export default Register;
