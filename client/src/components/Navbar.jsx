import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Key,
  BarChart3,
  LogOut,
  ShieldCheck,
  ShieldAlert,
  History,
  Settings,
  BookOpen,
  Shield,
  Link2,
  PieChart
} from 'lucide-react';

const Navbar = ({ user, logout }) => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/credentials', label: 'Internal Keys', icon: <Key size={20} /> },
    { path: '/external-providers', label: 'External APIs', icon: <BarChart3 size={20} /> },
    { path: '/vault', label: 'Secure Vault', icon: <ShieldCheck size={20} /> },
    { path: '/external-analytics', label: 'Ext Analytics', icon: <PieChart size={20} /> },
    { path: '/oauth-connections', label: 'Linked Accounts', icon: <Link2 size={20} /> },
    { path: '/analytics', label: 'Internal Stats', icon: <BarChart3 size={20} /> },
    { path: '/security', label: 'Security', icon: <ShieldAlert size={20} /> },
    { path: '/logs', label: 'Activity Logs', icon: <History size={20} /> },
    { path: '/profile', label: 'Settings', icon: <Settings size={20} /> },
    { path: '/docs', label: 'API Docs', icon: <BookOpen size={20} /> },
  ];

  return (
    <nav className="navbar glass">
      <div className="nav-logo">
        <ShieldCheck size={28} color="#00f2fe" />
        <span>SecureKey</span>
      </div>

      <div className="nav-links">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="nav-footer">
        <Link to="/profile" className={`nav-user ${location.pathname === '/profile' ? 'active' : ''}`}>
          <div className="user-avatar">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.username}</span>
            <span className="user-role-badge">{user?.role}</span>
          </div>
        </Link>
        <button onClick={logout} className="logout-btn-full" title="Logout">
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
};


export default Navbar;
