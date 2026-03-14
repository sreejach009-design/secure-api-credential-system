import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Shield,
  Users,
  Key,
  Activity,
  History,
  Settings,
  Globe,
  LogOut,
  LayoutDashboard,
  Zap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const AdminNavbar = ({ user, logout, collapsed, setCollapsed }) => {
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { path: '/admin/users', label: 'Users', icon: <Users size={18} /> },
    { path: '/admin/keys', label: 'Key Registry', icon: <Key size={18} /> },
    { path: '/admin/vaults', label: 'External Vaults', icon: <Globe size={18} /> },
    { path: '/admin/telemetry', label: 'Telemetry', icon: <Activity size={18} /> },
    { path: '/admin/audit', label: 'Audit Trail', icon: <History size={18} /> },
    { path: '/admin/config', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <nav className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="admin-sidebar-header">
        <div className="admin-logo-icon">
          <Shield size={20} />
        </div>
        {!collapsed && (
          <div className="admin-logo-text">
            <span className="admin-logo-title">SecureKey</span>
            <span className="admin-logo-sub">Admin Console</span>
          </div>
        )}
        <button 
          className="admin-sidebar-toggle" 
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {!collapsed && (
        <div className="admin-sidebar-status">
          <div className="sidebar-status-dot active"></div>
          <span>System Online</span>
        </div>
      )}

      <div className="admin-sidebar-links">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            title={collapsed ? item.label : ""}
          >
            <div className="admin-nav-icon">{item.icon}</div>
            {!collapsed && <span className="admin-nav-label">{item.label}</span>}
          </Link>
        ))}
      </div>

      <div className="admin-sidebar-footer">
        <div className="admin-operator-card">
          <div className="operator-avatar">
            <Zap size={14} />
          </div>
          {!collapsed && (
            <div className="operator-meta">
              <span className="operator-name">{user?.username}</span>
              <span className="operator-role">Administrator</span>
            </div>
          )}
        </div>
        <button onClick={logout} className="admin-logout-btn" title="Sign out">
          <LogOut size={14} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
