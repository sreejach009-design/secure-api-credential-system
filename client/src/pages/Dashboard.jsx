import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  ShieldCheck,
  Key,
  Activity,
  ArrowRight,
  Play,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  History
} from 'lucide-react';
import api from '../api';
import { useAlert } from '../context/AlertContext';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalKeys: 0,
    activeKeys: 0,
    expiredKeys: 0,
    totalCalls: 0,
    recentAlerts: []
  });
  const [latestKey, setLatestKey] = useState(null);
  const [simulating, setSimulating] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAlert();

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000); // 10s polling
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [credsRes, statsRes, alertsRes, extCredsRes] = await Promise.all([
        api.get('/credentials'),
        api.get('/usage/stats'),
        api.get('/security'),
        api.get('/external-providers/list')
      ]);

      const creds = credsRes.data;
      const extCreds = extCredsRes.data;
      const combined = [...creds, ...extCreds];

      const active = combined.filter(k => k.status === 'active').length;
      const expired = combined.filter(k => k.status === 'expired' || k.status === 'revoked' || k.status === 'inactive').length;
      const calls = statsRes.data.totalCalls || statsRes.data.stats.reduce((acc, curr) => acc + curr.count, 0);

      // Calculate Security Health Score
      let score = 100;

      // Penalize legacy unhashed keys (internal)
      creds.forEach(k => {
        if (!k.apiKeyHash) score -= 15; // Legacy unhashed internal key
      });

      // Penalize external credentials
      extCreds.forEach(k => {
        if (!k.allowedIps || k.allowedIps.length === 0) score -= 10;
        if (k.status === 'revoked') score -= 20;
        if (!k.expiresAt) score -= 5;
      });

      // Penalize expired keys
      if (expired > 0) score -= (expired * 5);

      score = Math.max(0, score);

      setStats({
        allKeys: combined,
        totalKeys: combined.length,
        activeKeys: active,
        expiredKeys: expired,
        totalCalls: calls,
        recentAlerts: alertsRes.data.slice(0, 3),
        securityScore: score
      });

      if (!latestKey && combined.length > 0) {
        setLatestKey(combined[0]);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data', err);
      setLoading(false);
    }
  };

  const simulateApiCall = async (scenario = 'success') => {
    if (!latestKey) return;
    setSimulating(true);
    try {
      const res = await api.post('/usage/simulate', {
        credentialId: latestKey._id,   // use _id for reliable lookup
        endpoint: '/api/v1/user/profile',
        method: 'GET',
        scenario
      });
      
      showAlert(res.data.message || 'Simulation successful!', 'success');
      setTimeout(fetchDashboardData, 1000);
    } catch (err) {
      const errData = err.response?.data;
      const errorMsg = errData?.message || 'Simulation failed';
      const alertCreated = errData?.alertCreated;
      const severity = err.response?.status === 429 ? 'warning' : 'error';

      // Show what happened + hint about Security page if an alert was created
      showAlert(
        alertCreated
          ? `⚠️ ${errorMsg} — A security alert was created. Check the Security page.`
          : `Result: ${errorMsg}`,
        severity
      );

      // Always refresh so alert count in dashboard updates
      setTimeout(fetchDashboardData, 1000);
      console.error(err);
    } finally {
      setSimulating(false);
    }
  };


  if (loading) return <div className="loading">Loading Dashboard...</div>;

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <div>
          <h1>System Dashboard</h1>
          <p className="text-dim">Overview of your API security and performance</p>
        </div>
        <div className="header-actions">
          <Link to="/credentials" className="btn-primary">
            <Key size={18} /> Manage Keys
          </Link>
        </div>
      </header>

        <div className="stats-grid">
        <div className="stat-card glass">
          <div className="stat-icon" style={{ background: 'rgba(79, 172, 254, 0.1)', color: '#4facfe' }}>
            <Key size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Credentials</span>
            <span className="stat-value">{stats.totalKeys}</span>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <ShieldCheck size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Active Keys</span>
            <span className="stat-value">{stats.activeKeys}</span>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
            <ShieldAlert size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Expired / Revoked</span>
            <span className="stat-value">{stats.expiredKeys}</span>
          </div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <Activity size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Cloud Requests</span>
            <span className="stat-value">{stats.totalCalls}</span>
          </div>
        </div>
      </div>

      <div className="dashboard-main">
        <div className="main-left">
          <div className="feature-card glass highlight">
            <div className="feature-header">
              <Shield size={24} color="#00f2fe" />
              <h3>Security Status</h3>
            </div>
            <div className="feature-body">
              <div className="security-score-container" style={{ margin: '10px 0 20px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.9rem' }}>Infrastructure Health</span>
                  <span style={{ fontWeight: 'bold', color: stats.securityScore > 70 ? '#10b981' : stats.securityScore > 40 ? '#f59e0b' : '#ef4444' }}>
                    {stats.securityScore}%
                  </span>
                </div>
                <div className="score-bar-bg" style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
                  <div className="score-bar-fill" style={{
                    height: '100%',
                    width: `${stats.securityScore}%`,
                    background: `linear-gradient(90deg, ${stats.securityScore > 40 ? '#4facfe' : '#ef4444'} 0%, #00f2fe 100%)`,
                    borderRadius: '4px',
                    transition: 'width 1s ease-in-out'
                  }}></div>
                </div>
              </div>
              <p className="text-dim" style={{ fontSize: '0.85rem' }}>
                {stats.securityScore === 100 ? 'All systems optimal. No immediate threats detected.' : 'Some credentials have low rotation or restricted access coverage.'}
              </p>
              <div className="security-check">
                <div className="check-item" style={{ color: stats.securityScore > 90 ? '#10b981' : '#94a3b8' }}>
                  <CheckCircle2 size={16} /> <span>SSL Active</span>
                </div>
                <div className="check-item" style={{ color: stats.expiredKeys === 0 ? '#10b981' : '#ef4444' }}>
                  <CheckCircle2 size={16} /> <span>Rotation Sync</span>
                </div>
                <div className="check-item" style={{ color: '#10b981' }}>
                  <CheckCircle2 size={16} /> <span>Threat Detection</span>
                </div>
              </div>
            </div>
          </div>

          <div className="simulation-section glass animate-fade-in">
            <div className="sim-info">
              <h3><Play size={20} className="icon-primary" style={{ verticalAlign: 'middle', marginRight: '8px' }} /> API Simulator</h3>
              <p>Test your credentials with different security scenarios.</p>

              <div className="sim-key-selector">
                <select
                  className="input-field"
                  style={{ width: '100%', marginTop: '10px', background: 'rgba(0,0,0,0.3)', padding: '8px 12px' }}
                  onChange={(e) => setLatestKey(stats.allKeys.find(k => k._id === e.target.value))}
                  value={latestKey?._id}
                >
                  <option value="">Select a Key to test</option>
                  {stats.allKeys?.map(k => (
                    <option key={k._id} value={k._id}>
                      {k.name} ({k.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="scenario-selector" style={{ marginTop: '10px' }}>
                <select
                  id="sim-scenario"
                  className="input-field"
                  style={{ background: 'rgba(0,0,0,0.3)', padding: '8px' }}
                >
                  <option value="success">Normal (Success)</option>
                  <option value="inactive">Key Inactive (Security Event)</option>
                  <option value="expired">Key Expired (Security Event)</option>
                  <option value="high">Force High Usage (Security Alert)</option>
                </select>
              </div>
            </div>

            <button
              className="btn-primary"
              onClick={() => {
                const scenario = document.getElementById('sim-scenario').value;
                simulateApiCall(scenario);
              }}
              disabled={simulating || !latestKey}
              style={{ minWidth: '160px' }}
            >
              {simulating ? 'Processing...' : 'Run Simulation'}
              {!simulating && <Play size={16} fill="black" />}
            </button>
          </div>

        </div>

        <div className="main-right">
          <div className="activity-card glass">
            <div className="card-header">
              <h3><ShieldAlert size={20} /> Security Alerts</h3>
              <Link to="/security" className="view-link">See all</Link>
            </div>
            <div className="alerts-summary">
              {stats.recentAlerts.length === 0 ? (
                <div className="empty-alerts">
                  <CheckCircle2 color="#10b981" size={32} />
                  <p>No recent security alerts</p>
                </div>
              ) : (
                stats.recentAlerts.map(alert => (
                  <div key={alert._id} className="mini-alert">
                    <div className={`alert-dot ${alert.severity}`}></div>
                    <div className="mini-alert-text">
                      <p>{alert.message}</p>
                      <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="quick-links glass">
            <h3>Quick Navigation</h3>
            <div className="links-grid">
              <Link to="/analytics" className="q-link">
                <Activity size={20} />
                <span>Real-time Usage</span>
              </Link>
              <Link to="/logs" className="q-link">
                <History size={20} />
                <span>Audit Logs</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
