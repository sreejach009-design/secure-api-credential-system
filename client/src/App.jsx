import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Credentials from './pages/Credentials';
import Analytics from './pages/Analytics';
import Security from './pages/Security';
import Logs from './pages/Logs';
import Profile from './pages/Profile';
import Docs from './pages/Docs';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import ExternalProviders from './pages/ExternalProviders';
import Vault from './pages/Vault';
import ExternalAnalytics from './pages/ExternalAnalytics';
import OAuthConnections from './pages/OAuthConnections';
import './index.css';
import { AlertProvider } from './context/AlertContext';
import Notification from './components/Notification';


/* ─── Role Guard Component ─── */
const RoleGuard = ({ user, requiredRole, children }) => {
  if (!user) return <Navigate to="/login" />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/dashboard" />;
  return children;
};

/* ─── Layout Wrappers ─── */
const UserLayout = ({ user, logout, children }) => (
  <>
    <Navbar user={user} logout={logout} />
    <main className="main-content">{children}</main>
  </>
);

const AdminLayout = ({ user, logout, sidebarCollapsed, setSidebarCollapsed, children }) => (
  <div className={`admin-layout-wrapper ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
    <AdminNavbar user={user} logout={logout} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
    <main className="admin-main-content">{children}</main>
  </div>
);


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData.user);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData.user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  /* Helper: where should user go after login? */
  const getDefaultRoute = () => (user?.role === 'admin' ? '/admin' : '/dashboard');

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <AlertProvider>
      <Router>
        <div className="app-container">
          <Notification />
          <Routes>
            {/* ═══════════ PUBLIC ROUTES ═══════════ */}
            <Route path="/" element={!user ? <Home /> : <Navigate to={getDefaultRoute()} />} />
            <Route path="/login" element={!user ? <Login onLogin={login} /> : <Navigate to={getDefaultRoute()} />} />
            <Route path="/admin-login" element={!user ? <AdminLogin onLogin={login} /> : <Navigate to="/admin" />} />
            <Route path="/register" element={!user ? <Register onLogin={login} /> : <Navigate to={getDefaultRoute()} />} />

            {/* ═══════════ USER ROUTES (Glassmorphism Portal) ═══════════ */}
            <Route path="/dashboard" element={
              user ? <UserLayout user={user} logout={logout}><Dashboard /></UserLayout> : <Navigate to="/login" />
            } />
            <Route path="/credentials" element={
              user ? <UserLayout user={user} logout={logout}><Credentials /></UserLayout> : <Navigate to="/login" />
            } />
            <Route path="/external-providers" element={
              user ? <UserLayout user={user} logout={logout}><ExternalProviders /></UserLayout> : <Navigate to="/login" />
            } />
            <Route path="/vault" element={
              user ? <UserLayout user={user} logout={logout}><Vault /></UserLayout> : <Navigate to="/login" />
            } />
            <Route path="/external-analytics" element={
              user ? <UserLayout user={user} logout={logout}><ExternalAnalytics /></UserLayout> : <Navigate to="/login" />
            } />
            <Route path="/oauth-connections" element={
              user ? <UserLayout user={user} logout={logout}><OAuthConnections /></UserLayout> : <Navigate to="/login" />
            } />
            <Route path="/analytics" element={
              user ? <UserLayout user={user} logout={logout}><Analytics /></UserLayout> : <Navigate to="/login" />
            } />
            <Route path="/security" element={
              user ? <UserLayout user={user} logout={logout}><Security /></UserLayout> : <Navigate to="/login" />
            } />
            <Route path="/logs" element={
              user ? <UserLayout user={user} logout={logout}><Logs /></UserLayout> : <Navigate to="/login" />
            } />
            <Route path="/profile" element={
              user ? <UserLayout user={user} logout={logout}><Profile user={user} logout={logout} /></UserLayout> : <Navigate to="/login" />
            } />
            <Route path="/docs" element={
              user ? <UserLayout user={user} logout={logout}><Docs /></UserLayout> : <Navigate to="/login" />
            } />

            {/* ═══════════ ADMIN ROUTES (Cyber Command Center) ═══════════ */}
            {/* All /admin/* routes use AdminLayout with AdminNavbar */}
            <Route path="/admin" element={
              <RoleGuard user={user} requiredRole="admin">
                <AdminLayout user={user} logout={logout} sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed}>
                  <AdminDashboard defaultTab="overview" />
                </AdminLayout>
              </RoleGuard>
            } />
            <Route path="/admin/users" element={
              <RoleGuard user={user} requiredRole="admin">
                <AdminLayout user={user} logout={logout} sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed}>
                  <AdminDashboard defaultTab="users" />
                </AdminLayout>
              </RoleGuard>
            } />
            <Route path="/admin/keys" element={
              <RoleGuard user={user} requiredRole="admin">
                <AdminLayout user={user} logout={logout} sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed}>
                  <AdminDashboard defaultTab="credentials" />
                </AdminLayout>
              </RoleGuard>
            } />
            <Route path="/admin/vaults" element={
              <RoleGuard user={user} requiredRole="admin">
                <AdminLayout user={user} logout={logout} sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed}>
                  <AdminDashboard defaultTab="external" />
                </AdminLayout>
              </RoleGuard>
            } />
            <Route path="/admin/telemetry" element={
              <RoleGuard user={user} requiredRole="admin">
                <AdminLayout user={user} logout={logout} sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed}>
                  <AdminDashboard defaultTab="telemetry" />
                </AdminLayout>
              </RoleGuard>
            } />
            <Route path="/admin/audit" element={
              <RoleGuard user={user} requiredRole="admin">
                <AdminLayout user={user} logout={logout} sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed}>
                  <AdminDashboard defaultTab="logs" />
                </AdminLayout>
              </RoleGuard>
            } />
            <Route path="/admin/config" element={
              <RoleGuard user={user} requiredRole="admin">
                <AdminLayout user={user} logout={logout} sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed}>
                  <AdminDashboard defaultTab="config" />
                </AdminLayout>
              </RoleGuard>
            } />

            {/* ═══════════ CATCH ALL ═══════════ */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AlertProvider>
  );
}

export default App;
