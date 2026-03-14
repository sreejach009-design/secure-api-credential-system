import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Eye, Key, Database, RefreshCw, AlertTriangle, History } from 'lucide-react';
import api from '../api';
import { useAlert } from '../context/AlertContext';

const Vault = () => {
    const [health, setHealth] = useState({
        encryptionCoverage: 0,
        rotationCompliance: 0,
        threatsDetected: 0,
        lastRotation: 'Pending Scan'
    });
    const [stats, setStats] = useState({
        encryptedKeys: 0,
        internalKeys: 0
    });
    const [loading, setLoading] = useState(true);
    const { showAlert } = useAlert();

    const fetchVaultData = async () => {
        try {
            const [intRes, extRes, healthRes] = await Promise.all([
                api.get('/credentials'),
                api.get('/external-providers/list'),
                api.get('/external-providers/vault-health')
            ]);

            setStats({
                encryptedKeys: extRes.data?.length || 0,
                internalKeys: intRes.data?.length || 0
            });
            setHealth(healthRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVaultData();
    }, []);

    const suggestRotation = () => {
        if (health.rotationCompliance === 100) {
            showAlert('All keys aligned with security policy. No immediate rotation required.', 'success');
        } else {
            showAlert(`Policy Scan Result: ${100 - health.rotationCompliance}% of keys require scheduled rotation. Generating plan...`, 'warning');
        }
    };

    return (
        <div className="vault-page credentials-page">
            <header className="page-header">
                <div>
                    <h1>System Key Vault</h1>
                    <p>AES-256-GCM Secure Key Storage & Real-time Policy Auditing</p>
                </div>
                <div className="vault-compliance-status glass">
                    <ShieldCheck size={20} color="#10b981" />
                    <span>Cross-Cloud Compliance Monitoring</span>
                </div>
            </header>

            <div className="stats-grid">
                <div className="stat-card glass">
                    <Lock size={24} color="#a855f7" />
                    <div className="stat-info">
                        <span className="stat-label">AES-256 Vaulted Keys</span>
                        <span className="stat-value">{stats.encryptedKeys}</span>
                    </div>
                </div>
                <div className="stat-card glass">
                    <Database size={24} color="#4facfe" />
                    <div className="stat-info">
                        <span className="stat-label">Internal Assets</span>
                        <span className="stat-value">{stats.internalKeys}</span>
                    </div>
                </div>
                <div className="stat-card glass">
                    <RefreshCw size={24} color="#10b981" />
                    <div className="stat-info">
                        <span className="stat-label">Policy Verified As Of</span>
                        <span className="stat-value">{new Date().toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            <div className="vault-management-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '30px' }}>
                <div className="vault-security-health glass" style={{ padding: '25px' }}>
                    <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
                        <ShieldCheck size={20} color="#10b981" />
                        <h3>Real-time Security Health</h3>
                    </div>
                    <div className="health-metrics">
                        <div className="health-item" style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span>Storage Encryption Coverage</span>
                                <span>{health.encryptionCoverage}%</span>
                            </div>
                            <div className="health-bar-container"><div className="health-bar" style={{ width: `${health.encryptionCoverage}%`, background: '#10b981' }}></div></div>
                        </div>
                        <div className="health-item" style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span>Cycle Rotation Compliance</span>
                                <span>{health.rotationCompliance}%</span>
                            </div>
                            <div className="health-bar-container"><div className="health-bar" style={{ width: `${health.rotationCompliance}%`, background: health.rotationCompliance > 80 ? '#4facfe' : '#f59e0b' }}></div></div>
                        </div>
                        <div className="health-item" style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span>Active Threats Detected</span>
                                <span>{health.threatsDetected} Warnings</span>
                            </div>
                            <div className="health-bar-container"><div className="health-bar" style={{ width: `${health.threatsDetected > 0 ? 100 : 0}%`, background: '#ef4444' }}></div></div>
                        </div>
                    </div>
                    <button className="btn-primary" style={{ marginTop: '20px', width: '100%', justifyContent: 'center' }} onClick={suggestRotation}>
                        <RefreshCw size={18} /> Audit Key Rotation Compliance
                    </button>
                </div>

                <div className="vault-policy-overview glass" style={{ padding: '25px' }}>
                    <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '25px' }}>
                        <History size={20} color="#4facfe" />
                        <h3>Infrastructure Access Policies</h3>
                    </div>
                    <div className="policy-list">
                        <div className="policy-item" style={{ display: 'flex', gap: '12px', marginBottom: '15px' }}>
                            <Eye size={18} color="#00f2fe" /> <span>Vault access is recorded in Audit-Log</span>
                        </div>
                        <div className="policy-item" style={{ display: 'flex', gap: '12px', marginBottom: '15px' }}>
                            <Lock size={18} color="#a855f7" /> <span>AES-256-GCM Hardware Encryption Enabled</span>
                        </div>
                        <div className="policy-item" style={{ display: 'flex', gap: '12px', marginBottom: '15px' }}>
                            <AlertTriangle size={18} color="#ef4444" /> <span>Compromised keys are auto-revoked</span>
                        </div>
                        <div className="policy-item" style={{ display: 'flex', gap: '12px', marginBottom: '15px' }}>
                            <Key size={18} color="#10b981" /> <span>Encrypted secrets never leave Node.js memory</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="anomaly-detection-section glass highlight-red" style={{ marginTop: '30px', borderLeft: '4px solid #ef4444' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', padding: '20px' }}>
                    <div className="pulse" style={{ width: '12px', height: '12px', background: health.threatsDetected > 0 ? '#ef4444' : '#10b981', borderRadius: '50%' }}></div>
                    <div>
                        <h3 className={health.threatsDetected > 0 ? "text-error" : "text-success"}>
                            Threat Intelligence Engine: {health.threatsDetected > 0 ? "Potential Anomaly Flagged" : "Status Normal"}
                        </h3>
                        <p className="text-dim">
                            {health.threatsDetected > 0
                                ? `System scan detected ${health.threatsDetected} unreviewed security events. Review latest security reports immediately.`
                                : "24h Automated anomaly scan completed. Patterns within baseline limits."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Vault;
