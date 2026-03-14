import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Key, Activity, Lock, ArrowRight, Shield } from 'lucide-react';

const Home = () => {
    return (
        <div className="landing-page portal-mode">
            {/* Ambient Background Elements */}
            <div className="ambient-orb orb-1"></div>
            <div className="ambient-orb orb-2"></div>

            <nav className="portal-nav">
                <div className="nav-logo">
                    <ShieldCheck size={32} color="#00f2fe" />
                    <span>SecureKey</span>
                </div>
                <div className="auth-buttons">
                    <Link to="/login" className="login-link">Sign In</Link>
                    <Link to="/register" className="btn-primary">Get Started</Link>
                </div>
            </nav>

            <div className="portal-container">
                <div className="hero-section-full">
                    <div className="hero-badge">The Future of API Security</div>
                    <h1>Secure API <span className="gradient-text">Credential Lifecycle</span> <br /> & Monitoring</h1>
                    <p>Experience enterprise-grade API key management, real-time analytics, and proactive security alerts in one unified platform.</p>

                    <div className="hero-cta-main">
                        <Link to="/register" className="btn-primary btn-extra-large">
                            Get Started for Free <ArrowRight size={20} />
                        </Link>
                        <Link to="/login" className="btn-outline btn-extra-large">
                            View Demo
                        </Link>
                    </div>

                    <div className="hero-features-grid">
                        <div className="mini-feat">
                            <Key size={18} className="text-primary" />
                            <span>Lifecycle Management</span>
                        </div>
                        <div className="mini-feat">
                            <Activity size={18} className="text-secondary" />
                            <span>Real-time Monitoring</span>
                        </div>
                        <div className="mini-feat">
                            <Shield size={18} className="text-accent" />
                            <span>Intelligent Alerts</span>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="portal-footer">
                <p>© 2026 SecureKey Inc. - Advanced API Security Console</p>
                <div className="footer-links">
                    <a href="#">Security</a>
                    <a href="#">Privacy</a>
                    <a href="#">Docs</a>
                </div>
            </footer>
        </div>
    );
};

export default Home;
