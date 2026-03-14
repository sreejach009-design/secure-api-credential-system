import React, { useState, useEffect } from 'react';
import api from '../api';
import { 
    Shield, Users, Key, AlertTriangle, ShieldCheck, 
    UserCheck, ShieldOff, History, Database, 
    Trash2, Globe, Activity, BarChart3, AlertCircle,
    Zap, Settings, RefreshCw, Lock, Unlock, Eye,
    CheckCircle, XCircle, RotateCw, Server, Clock,
    TrendingUp, ChevronRight
} from 'lucide-react';
import { useAlert } from '../context/AlertContext';

const AdminDashboard = ({ defaultTab = 'overview' }) => {
    const [activeTab, setActiveTab] = useState(defaultTab);
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [allKeys, setAllKeys] = useState([]);
    const [extKeys, setExtKeys] = useState([]);
    const [telemetry, setTelemetry] = useState(null);
    const [auditLogs, setAuditLogs] = useState([]);
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showAlert } = useAlert();

    useEffect(() => {
        setActiveTab(defaultTab);
    }, [defaultTab]);

    useEffect(() => {
        fetchAdminData();
    }, [activeTab]);

    const fetchAdminData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'overview') {
                const res = await api.get('/admin/stats');
                setStats(res.data);
            } else if (activeTab === 'users') {
                const res = await api.get('/admin/users');
                setUsers(res.data);
            } else if (activeTab === 'credentials') {
                const res = await api.get('/admin/credentials');
                setAllKeys(res.data);
            } else if (activeTab === 'external') {
                const res = await api.get('/admin/external-credentials');
                setExtKeys(res.data);
            } else if (activeTab === 'telemetry') {
                const res = await api.get('/admin/telemetry');
                setTelemetry(res.data);
            } else if (activeTab === 'logs') {
                const res = await api.get('/admin/audit-logs');
                setAuditLogs(res.data);
            } else if (activeTab === 'config') {
                const res = await api.get('/admin/config');
                setConfig(res.data);
            }
        } catch (err) {
            console.error('Admin Data Fetch Error:', err);
            showAlert('Failed to fetch admin data', 'error');
        } finally {
            setLoading(false);
        }
    };

    /* ─── Action Handlers ─── */
    const handleConfigUpdate = async (newConfig) => {
        try {
            const res = await api.post('/admin/config', newConfig);
            setConfig(res.data.config);
            showAlert('Configuration updated successfully', 'success');
        } catch (err) {
            showAlert('Failed to update config', 'error');
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await api.put(`/admin/users/${userId}/role`, { role: newRole });
            setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
            showAlert('User role updated', 'success');
        } catch (err) {
            showAlert('Failed to update role', 'error');
        }
    };

    const handleUserDelete = async (userId) => {
        if (!window.confirm("Permanently delete this user and all their data?")) return;
        try {
            await api.delete(`/admin/users/${userId}`);
            setUsers(users.filter(u => u._id !== userId));
            showAlert('User deleted from platform', 'info');
        } catch (err) {
            showAlert(err.response?.data?.message || 'Delete failed', 'error');
        }
    };
    
    const handleUserStatusToggle = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
        try {
            await api.patch(`/admin/users/${userId}/status`, { status: newStatus });
            setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u));
            showAlert(`Account ${newStatus === 'blocked' ? 'suspended' : 'restored'}`, 'info');
        } catch (err) {
            showAlert('Failed to update account status', 'error');
        }
    };

    const handleKeyStatusUpdate = async (keyId, newStatus) => {
        try {
            await api.patch(`/admin/credentials/${keyId}/status`, { status: newStatus });
            setAllKeys(allKeys.map(k => k._id === keyId ? { ...k, status: newStatus } : k));
            showAlert(`Credential status changed to ${newStatus}`, 'success');
        } catch (err) {
            showAlert('Failed to update key status', 'error');
        }
    };

    const handleExtKeyStatusUpdate = async (keyId, newStatus) => {
        try {
            await api.patch(`/admin/external-credentials/${keyId}/status`, { status: newStatus });
            setExtKeys(extKeys.map(k => k._id === keyId ? { ...k, status: newStatus } : k));
            showAlert(`External credential ${newStatus}`, 'success');
        } catch (err) {
            showAlert('Failed to update external status', 'error');
        }
    };

    const handleForceRotate = async (keyId) => {
        if (!window.confirm("Force rotate this key? The owner must update their integrations.")) return;
        try {
            const res = await api.post(`/admin/credentials/${keyId}/rotate`);
            setAllKeys(allKeys.map(k => k._id === keyId ? { ...k, apiKeyMasked: res.data.apiKeyMasked, lastRotatedAt: new Date() } : k));
            showAlert(`Key rotated. New key: ${res.data.newKey}`, 'success', 10000);
        } catch (err) {
            showAlert('Failed to force rotation', 'error');
        }
    };

    /* ─── Shared Sub-components ─── */
    const StatusDot = ({ status }) => (
        <div className={`adm-status-pill ${status}`}>
            <div className="adm-status-dot"></div>
            <span>{(status || 'active').toUpperCase()}</span>
        </div>
    );

    const SectionHeader = ({ icon, title, subtitle, count }) => (
        <div className="adm-section-header">
            <div className="adm-section-left">
                {icon}
                <div>
                    <h2 className="adm-section-title">{title}</h2>
                    {subtitle && <p className="adm-section-sub">{subtitle}</p>}
                </div>
            </div>
            {count !== undefined && <div className="adm-section-count">{count} records</div>}
        </div>
    );

    /* ═══════════ OVERVIEW ═══════════ */
    const renderOverview = () => (
        <div className="adm-overview animate-fade-in">
            {/* Stat Cards */}
            <div className="adm-stat-grid">
                <div className="adm-stat-card">
                    <div className="adm-stat-icon"><Users size={24} /></div>
                    <div className="adm-stat-body">
                        <span className="adm-stat-label">Total Users</span>
                        <span className="adm-stat-value">{stats?.totalUsers || 0}</span>
                    </div>
                    <div className="adm-stat-footer">
                        <span className="adm-stat-detail danger">{stats?.blockedUsers || 0} blocked</span>
                    </div>
                </div>

                <div className="adm-stat-card accent-purple">
                    <div className="adm-stat-icon purple"><Key size={24} /></div>
                    <div className="adm-stat-body">
                        <span className="adm-stat-label">Active Keys</span>
                        <span className="adm-stat-value">{stats?.activeKeys || 0}</span>
                    </div>
                    <div className="adm-stat-footer">
                        <span className="adm-stat-detail">{stats?.totalKeys || 0} total issued</span>
                    </div>
                </div>

                <div className="adm-stat-card accent-green">
                    <div className="adm-stat-icon green"><ShieldCheck size={24} /></div>
                    <div className="adm-stat-body">
                        <span className="adm-stat-label">Unread Alerts</span>
                        <span className="adm-stat-value">{stats?.alertsCount || 0}</span>
                    </div>
                    <div className="adm-stat-footer">
                        <span className="adm-stat-detail">security events</span>
                    </div>
                </div>

                <div className="adm-stat-card accent-red">
                    <div className="adm-stat-icon red"><AlertTriangle size={24} /></div>
                    <div className="adm-stat-body">
                        <span className="adm-stat-label">Anomalies</span>
                        <span className="adm-stat-value">{stats?.anomalyCount || 0}</span>
                    </div>
                    <div className="adm-stat-footer">
                        <span className="adm-stat-detail danger">last 24 hours</span>
                    </div>
                </div>
            </div>

            {/* System Status Bar */}
            <div className="adm-system-bar">
                <div className="adm-sys-indicator">
                    <div className="adm-sys-dot online"></div>
                    <span>Core Kernel</span>
                </div>
                <div className="adm-sys-indicator">
                    <div className="adm-sys-dot online"></div>
                    <span>Network Mesh</span>
                </div>
                <div className="adm-sys-indicator">
                    <div className="adm-sys-dot online"></div>
                    <span>Encryption: AES-256-GCM</span>
                </div>
                <div className="adm-sys-indicator">
                    <div className="adm-sys-dot online"></div>
                    <span>Uptime: 99.99%</span>
                </div>
            </div>

            {/* Two Column: Alerts + Resources */}
            <div className="adm-two-col">
                <div className="adm-panel">
                    <div className="adm-panel-header">
                        <AlertTriangle size={16} />
                        <h3>Recent Security Alerts</h3>
                        <span className="adm-panel-badge">{stats?.recentAlerts?.length || 0}</span>
                    </div>
                    <div className="adm-console">
                        {stats?.recentAlerts?.length > 0 ? stats.recentAlerts.map((alert) => (
                            <div className={`adm-console-row ${alert.severity}`} key={alert._id}>
                                <span className="adm-console-time">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                                <span className={`adm-console-sev ${alert.severity}`}>{alert.severity?.toUpperCase()}</span>
                                <span className="adm-console-user">@{alert.userId?.username || 'system'}</span>
                                <span className="adm-console-msg">{alert.message}</span>
                            </div>
                        )) : (
                            <div className="adm-console-empty">
                                <CheckCircle size={20} />
                                <span>No active threats detected</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="adm-panel">
                    <div className="adm-panel-header">
                        <Server size={16} />
                        <h3>Service Health</h3>
                    </div>
                    <div className="adm-service-list">
                        {[
                            { name: 'Vault Cluster', status: 'Healthy', load: '12%' },
                            { name: 'Auth Gateway', status: 'Synced', load: '4%' },
                            { name: 'API Proxy', status: 'Optimal', load: '28%' },
                            { name: 'Audit Engine', status: 'Healthy', load: '15%' }
                        ].map((svc, i) => (
                            <div className="adm-service-row" key={i}>
                                <div className="adm-svc-left">
                                    <div className="adm-sys-dot online"></div>
                                    <span className="adm-svc-name">{svc.name}</span>
                                </div>
                                <span className="adm-svc-status">{svc.status}</span>
                                <span className="adm-svc-load">{svc.load}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    /* ═══════════ USERS ═══════════ */
    const renderUsers = () => (
        <div className="adm-section animate-fade-in">
            <SectionHeader 
                icon={<Users size={20} className="icon-blue" />}
                title="User Management"
                subtitle="Manage all platform user accounts, roles, and access permissions"
                count={users.length}
            />
            <div className="adm-table-wrap">
                <table className="adm-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Role</th>
                            <th>Registered</th>
                            <th>Last Login</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className={user.status === 'blocked' ? 'row-dimmed' : ''}>
                                <td>
                                    <div className="adm-user-cell">
                                        <div className="adm-avatar">{user.username.charAt(0).toUpperCase()}</div>
                                        <div>
                                            <div className="adm-user-name">{user.username}</div>
                                            <div className="adm-user-email">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className={`adm-role-badge role-${user.role}`}>{user.role}</span>
                                </td>
                                <td className="adm-td-dim">{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td className="adm-td-dim">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : '—'}</td>
                                <td><StatusDot status={user.status || 'active'} /></td>
                                <td>
                                    <div className="adm-action-row">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                            className="adm-select"
                                        >
                                            <option value="viewer">Viewer</option>
                                            <option value="developer">Developer</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                        <button 
                                            className={`adm-icon-btn ${user.status === 'blocked' ? 'btn-green' : 'btn-amber'}`}
                                            onClick={() => handleUserStatusToggle(user._id, user.status || 'active')}
                                            title={user.status === 'blocked' ? "Restore access" : "Suspend access"}
                                        >
                                            {user.status === 'blocked' ? <Unlock size={14} /> : <Lock size={14} />}
                                        </button>
                                        <button 
                                            className="adm-icon-btn btn-red"
                                            onClick={() => handleUserDelete(user._id)}
                                            title="Delete user"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && <div className="adm-empty">No users found</div>}
            </div>
        </div>
    );

    /* ═══════════ CREDENTIALS ═══════════ */
    const renderCredentials = () => (
        <div className="adm-section animate-fade-in">
            <SectionHeader 
                icon={<Key size={20} className="icon-purple" />}
                title="Global Key Registry"
                subtitle="View and manage all internal API credentials across the platform"
                count={allKeys.length}
            />
            <div className="adm-table-wrap">
                <table className="adm-table">
                    <thead>
                        <tr>
                            <th>Credential</th>
                            <th>Owner</th>
                            <th>Masked Key</th>
                            <th>Status</th>
                            <th>Usage</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allKeys.map((key) => (
                            <tr key={key._id}>
                                <td>
                                    <div className="adm-key-cell">
                                        <span className="adm-key-name">{key.name}</span>
                                        <span className="adm-key-id">ID: {key._id.slice(-8)}</span>
                                    </div>
                                </td>
                                <td className="adm-td-dim">{key.userId?.username || 'Unknown'}</td>
                                <td><code className="adm-code">{key.apiKeyMasked}</code></td>
                                <td><StatusDot status={key.status} /></td>
                                <td>
                                    <div className="adm-usage-cell">
                                        <span>{key.usageCount || 0} calls</span>
                                        <span className="adm-td-dim">{key.lastUsedAt ? new Date(key.lastUsedAt).toLocaleDateString() : 'Never used'}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="adm-action-row">
                                        {key.status === 'active' ? (
                                            <button 
                                                className="adm-icon-btn btn-amber"
                                                onClick={() => handleKeyStatusUpdate(key._id, 'inactive')}
                                                title="Deactivate"
                                            >
                                                <XCircle size={14} />
                                            </button>
                                        ) : (
                                            <button 
                                                className="adm-icon-btn btn-green"
                                                onClick={() => handleKeyStatusUpdate(key._id, 'active')}
                                                title="Activate"
                                            >
                                                <CheckCircle size={14} />
                                            </button>
                                        )}
                                        <button 
                                            className="adm-action-btn btn-accent"
                                            onClick={() => handleForceRotate(key._id)}
                                            title="Force rotate key"
                                        >
                                            <RotateCw size={14} />
                                            <span>Rotate</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {allKeys.length === 0 && <div className="adm-empty">No credentials found</div>}
            </div>
        </div>
    );

    /* ═══════════ EXTERNAL VAULT ═══════════ */
    const renderExternalKeys = () => (
        <div className="adm-section animate-fade-in">
            <SectionHeader 
                icon={<Globe size={20} className="icon-blue" />}
                title="External Vault Oversight"
                subtitle="Manage third-party API credentials stored in encrypted user vaults"
                count={extKeys.length}
            />
            <div className="adm-table-wrap">
                <table className="adm-table">
                    <thead>
                        <tr>
                            <th>Provider</th>
                            <th>Name</th>
                            <th>Owner</th>
                            <th>Status</th>
                            <th>Usage</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {extKeys.map((key) => (
                            <tr key={key._id}>
                                <td>
                                    <span className={`adm-provider-badge prov-${key.provider}`}>
                                        {key.provider?.toUpperCase()}
                                    </span>
                                </td>
                                <td>{key.name}</td>
                                <td className="adm-td-dim">{key.userId?.username || '—'}</td>
                                <td><StatusDot status={key.status} /></td>
                                <td className="adm-td-dim">{key.usageCount || 0} calls</td>
                                <td>
                                    {key.status !== 'revoked' ? (
                                        <button 
                                            className="adm-action-btn btn-red"
                                            onClick={() => handleExtKeyStatusUpdate(key._id, 'revoked')}
                                        >
                                            <AlertCircle size={14} />
                                            <span>Revoke</span>
                                        </button>
                                    ) : (
                                        <span className="adm-td-dim">Permanently revoked</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {extKeys.length === 0 && <div className="adm-empty">No external credentials found</div>}
            </div>
        </div>
    );

    /* ═══════════ TELEMETRY ═══════════ */
    const renderTelemetry = () => (
        <div className="adm-section animate-fade-in">
            <SectionHeader 
                icon={<BarChart3 size={20} className="icon-blue" />}
                title="Platform Telemetry"
                subtitle="Real-time traffic metrics, provider analytics, and anomaly detection"
            />

            {/* Telemetry Stat Cards */}
            <div className="adm-tele-grid">
                <div className="adm-tele-card">
                    <Activity size={20} className="icon-blue" />
                    <div className="adm-tele-body">
                        <span className="adm-tele-label">Total API Calls</span>
                        <span className="adm-tele-value">{telemetry?.totalCalls?.toLocaleString() || 0}</span>
                    </div>
                </div>
                <div className="adm-tele-card card-green">
                    <TrendingUp size={20} />
                    <div className="adm-tele-body">
                        <span className="adm-tele-label">Success Rate</span>
                        <span className="adm-tele-value">{telemetry?.successRate || 100}%</span>
                    </div>
                </div>
                <div className="adm-tele-card card-red">
                    <AlertTriangle size={20} />
                    <div className="adm-tele-body">
                        <span className="adm-tele-label">Total Errors</span>
                        <span className="adm-tele-value">{telemetry?.errorCalls?.toLocaleString() || 0}</span>
                    </div>
                </div>
            </div>

            <div className="adm-two-col">
                {/* Provider Distribution */}
                <div className="adm-panel">
                    <div className="adm-panel-header">
                        <Globe size={16} />
                        <h3>Provider Distribution</h3>
                    </div>
                    <div className="adm-provider-list">
                        {telemetry?.providerStats?.map(ps => (
                            <div className="adm-prov-row" key={ps._id}>
                                <span className="adm-prov-name">{ps._id || 'Internal'}</span>
                                <div className="adm-prov-bar-bg">
                                    <div 
                                        className="adm-prov-bar-fill" 
                                        style={{ width: `${Math.min((ps.count / (telemetry.totalCalls || 1)) * 100, 100)}%` }}
                                    ></div>
                                </div>
                                <span className="adm-prov-count">{ps.count}</span>
                            </div>
                        ))}
                    </div>

                    {/* Anomalies */}
                    <div className="adm-panel-divider"></div>
                    <div className="adm-panel-header">
                        <Zap size={16} />
                        <h3>Active Anomalies</h3>
                    </div>
                    {telemetry?.anomalies?.length > 0 ? telemetry.anomalies.map((anom, i) => (
                        <div className="adm-anomaly-row" key={i}>
                            <div className="adm-anomaly-info">
                                <span className="adm-anomaly-user">{anom.userId?.username || 'Unknown'}</span>
                                <span className="adm-anomaly-detail">{anom.errorRate.toFixed(1)}% error rate · {anom.total} calls</span>
                            </div>
                            <button 
                                className="adm-action-btn btn-red small"
                                onClick={() => handleUserStatusToggle(anom.userId?._id, 'active')}
                            >
                                <Lock size={12} />
                                <span>Block</span>
                            </button>
                        </div>
                    )) : (
                        <div className="adm-empty-inline">
                            <CheckCircle size={16} />
                            <span>No anomalies in the last hour</span>
                        </div>
                    )}
                </div>

                {/* Recent Errors */}
                <div className="adm-panel">
                    <div className="adm-panel-header">
                        <XCircle size={16} />
                        <h3>Recent Errors</h3>
                    </div>
                    <div className="adm-error-list">
                        {telemetry?.recentErrors?.map((err, i) => (
                            <div className="adm-error-row" key={i}>
                                <div className="adm-error-left">
                                    <span className="adm-error-code">{err.statusCode}</span>
                                    <div className="adm-error-info">
                                        <span className="adm-error-user">{err.userId?.username || 'Guest'}</span>
                                        <span className="adm-error-endpoint">{err.endpoint}</span>
                                    </div>
                                </div>
                                <span className="adm-error-time">{new Date(err.timestamp).toLocaleTimeString()}</span>
                            </div>
                        ))}
                        {!telemetry?.recentErrors?.length && (
                            <div className="adm-empty-inline">
                                <CheckCircle size={16} />
                                <span>No recent errors</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    /* ═══════════ AUDIT LOGS ═══════════ */
    const renderLogs = () => (
        <div className="adm-section animate-fade-in">
            <SectionHeader 
                icon={<History size={20} className="icon-blue" />}
                title="Audit Trail"
                subtitle="Complete log of all administrative and system events across the platform"
                count={auditLogs.length}
            />
            <div className="adm-log-stream">
                {auditLogs.map((log) => (
                    <div className="adm-log-entry" key={log._id}>
                        <div className="adm-log-left">
                            <div className="adm-log-dot"></div>
                            <div className="adm-log-content">
                                <div className="adm-log-top">
                                    <span className="adm-log-user">{log.userId?.username || 'System'}</span>
                                    <span className="adm-log-action-tag">{log.action?.replace(/_/g, ' ')}</span>
                                </div>
                                <div className="adm-log-detail">
                                    <span>{log.resourceType}</span>
                                    <ChevronRight size={12} />
                                    <span className="adm-log-resource-id">{log.resourceId?.slice(-8) || '—'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="adm-log-right">
                            <span className="adm-log-time">{new Date(log.timestamp).toLocaleString()}</span>
                            <span className="adm-log-ip">{log.ipAddress || '127.0.0.1'}</span>
                        </div>
                    </div>
                ))}
                {auditLogs.length === 0 && <div className="adm-empty">No audit entries found</div>}
            </div>
        </div>
    );

    /* ═══════════ CONFIG ═══════════ */
    const renderConfig = () => (
        <div className="adm-section animate-fade-in">
            <SectionHeader 
                icon={<Settings size={20} className="icon-blue" />}
                title="Platform Configuration"
                subtitle="Manage global system settings, security policies, and rate limits"
            />
            <div className="adm-config-grid">
                {/* Maintenance Mode */}
                <div className="adm-config-card">
                    <div className="adm-config-top">
                        <div>
                            <h4>Maintenance Mode</h4>
                            <p>Reject all non-admin API traffic with 503 status</p>
                        </div>
                        <button 
                            className={`adm-toggle ${config?.maintenanceMode ? 'on' : ''}`}
                            onClick={() => handleConfigUpdate({ maintenanceMode: !config?.maintenanceMode })}
                        >
                            <div className="adm-toggle-knob"></div>
                        </button>
                    </div>
                </div>

                {/* Open Registration */}
                <div className="adm-config-card">
                    <div className="adm-config-top">
                        <div>
                            <h4>Open Registration</h4>
                            <p>Allow new developers to register accounts</p>
                        </div>
                        <button 
                            className={`adm-toggle ${config?.registrationOpen ? 'on' : ''}`}
                            onClick={() => handleConfigUpdate({ registrationOpen: !config?.registrationOpen })}
                        >
                            <div className="adm-toggle-knob"></div>
                        </button>
                    </div>
                </div>

                {/* Rate Limit */}
                <div className="adm-config-card">
                    <div className="adm-config-top">
                        <div>
                            <h4>Global Rate Limit</h4>
                            <p>Maximum requests per minute across all endpoints</p>
                        </div>
                    </div>
                    <div className="adm-config-input-row">
                        <input 
                            type="number" 
                            className="adm-input"
                            value={config?.globalRateLimit || 5000}
                            onChange={(e) => setConfig({ ...config, globalRateLimit: parseInt(e.target.value) })}
                        />
                        <button className="adm-save-btn" onClick={() => handleConfigUpdate({ globalRateLimit: config?.globalRateLimit })}>
                            Save
                        </button>
                    </div>
                </div>

                {/* Security Policies */}
                <div className="adm-config-card full-width">
                    <div className="adm-config-top">
                        <div>
                            <h4>Security Policies</h4>
                            <p>Configure authentication, rotation, and session requirements</p>
                        </div>
                    </div>
                    <div className="adm-policy-grid">
                        <div className="adm-policy-item">
                            <label>Auto-Rotate Interval (days)</label>
                            <input 
                                type="number" 
                                className="adm-input small"
                                value={config?.rotationDays || 30} 
                                onChange={(e) => setConfig({ ...config, rotationDays: parseInt(e.target.value) })}
                            />
                        </div>
                        <div className="adm-policy-item">
                            <label>Min Password Length</label>
                            <input 
                                type="number" 
                                className="adm-input small"
                                value={config?.minPasswordLength || 12} 
                                onChange={(e) => setConfig({ ...config, minPasswordLength: parseInt(e.target.value) })}
                            />
                        </div>
                        <div className="adm-policy-item">
                            <label>Session Timeout (sec)</label>
                            <input 
                                type="number" 
                                className="adm-input small"
                                value={config?.sessionTimeout || 3600} 
                                onChange={(e) => setConfig({ ...config, sessionTimeout: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>
                    <button 
                        className="adm-save-btn full-width" 
                        onClick={() => handleConfigUpdate(config)}
                        style={{ marginTop: '16px' }}
                    >
                        Update All Policies
                    </button>
                </div>
            </div>
        </div>
    );

    /* ═══════════ TAB TITLES ═══════════ */
    const TAB_TITLES = {
        overview: 'System Overview',
        users: 'User Management',
        credentials: 'Key Registry',
        external: 'External Vaults',
        telemetry: 'Platform Telemetry',
        logs: 'Audit Trail',
        config: 'Configuration'
    };

    const TAB_DESCRIPTIONS = {
        overview: 'Platform-wide system health and security monitoring',
        users: 'Manage users, roles, and access control',
        credentials: 'Global view of all issued API credentials',
        external: 'Third-party vault credentials oversight',
        telemetry: 'Traffic analytics and anomaly detection',
        logs: 'System-wide activity and audit history',
        config: 'Global settings and security policies'
    };

    return (
        <div className="admin-command-center">
            <header className="adm-page-header">
                <div className="adm-page-header-left">
                    <h1>{TAB_TITLES[activeTab]}</h1>
                    <p>{TAB_DESCRIPTIONS[activeTab]}</p>
                </div>
                <div className="adm-page-header-right">
                    <button className="adm-refresh-btn" onClick={fetchAdminData} title="Refresh data">
                        <RefreshCw size={16} />
                    </button>
                    <div className="adm-header-badge">
                        <div className="adm-sys-dot online"></div>
                        <span>System Online</span>
                    </div>
                </div>
            </header>

            <div className="adm-viewport">
                {loading ? (
                    <div className="adm-loading">
                        <div className="adm-loading-spinner"></div>
                        <span>Loading data...</span>
                    </div>
                ) : (
                    <>
                        {activeTab === 'overview' && renderOverview()}
                        {activeTab === 'users' && renderUsers()}
                        {activeTab === 'credentials' && renderCredentials()}
                        {activeTab === 'external' && renderExternalKeys()}
                        {activeTab === 'telemetry' && renderTelemetry()}
                        {activeTab === 'logs' && renderLogs()}
                        {activeTab === 'config' && renderConfig()}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
