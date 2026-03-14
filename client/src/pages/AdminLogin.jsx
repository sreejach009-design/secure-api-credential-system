import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ShieldAlert, ArrowRight, ShieldCheck } from 'lucide-react';
import api from '../api';
import { useAlert } from '../context/AlertContext';

const AdminLogin = ({ onLogin }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { showAlert } = useAlert();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/login', formData);

            if (res.data.user.role !== 'admin') {
                showAlert('Access Denied: Not an administrator account', 'error');
                setLoading(false);
                return;
            }

            onLogin(res.data);
            showAlert('Admin access granted', 'success');
            navigate('/admin');
        } catch (err) {
            const msg = err.response?.data?.message || 'Admin login failed';
            showAlert(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="landing-page admin-portal">
            <div className="ambient-orb orb-admin"></div>

            <div className="portal-container">
                <div className="auth-card glass admin-card border-purple">
                    <div className="auth-header">
                        <div className="auth-icon-container admin-icon-bg">
                            <ShieldAlert size={40} color="#a855f7" />
                        </div>
                        <h1 className="text-purple">Security Command</h1>
                        <p>Authorized personnel only</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="input-group">
                            <Mail size={18} />
                            <input
                                type="email"
                                placeholder="Admin Email"
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
                                placeholder="Security Key"
                                className="input-field"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary admin-submit" disabled={loading}>
                            {loading ? 'Authenticating...' : 'Enter Console'} <ArrowRight size={18} />
                        </button>
                    </form>

                    <p className="auth-footer">
                        Regular user? <Link to="/login">Sign in here</Link>
                    </p>
                </div>
            </div>

            <Link to="/" className="portal-back-link">
                <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} /> Back to Network
            </Link>
        </div>
    );
};

export default AdminLogin;
