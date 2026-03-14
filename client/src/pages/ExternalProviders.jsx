import React, { useState, useEffect } from 'react';
import { Plus, Database, Shield, Globe, ExternalLink, Trash2, ShieldAlert } from 'lucide-react';
import api from '../api';
import { useAlert } from '../context/AlertContext';

const ExternalProviders = () => {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        provider: 'openai',
        apiKey: '',
        rpm: 0,
        allowedIps: '',
        expiresAt: '',
        description: ''
    });
    const { showAlert } = useAlert();

    const fetchProviders = async () => {
        try {
            const res = await api.get('/external-providers/list');
            setProviders(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProviders();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await api.post('/external-providers/add', {
                ...formData,
                rateLimits: { requestsPerMinute: parseInt(formData.rpm || 0, 10) },
                allowedIps: formData.allowedIps ? formData.allowedIps.split(',').map(ip => ip.trim()) : [],
                expiresAt: formData.expiresAt ? formData.expiresAt : undefined
            });
            showAlert('External API Securely Vaulted', 'success');
            setShowAdd(false);
            setFormData({ name: '', provider: 'openai', apiKey: '', rpm: 0, allowedIps: '', expiresAt: '', description: '' });
            fetchProviders();
        } catch (err) {
            console.error(err.response?.data || err);
            const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to connect provider';
            showAlert(`Failed to connect provider: ${msg}`, 'error');
        }
    };

    const testProxy = async (id) => {
        const confirm = window.confirm('Run a secure proxy test to this provider? This will decrypt the key in memory and make a telemetry-logged request.');
        if (!confirm) return;

        try {
            showAlert('Initiating secure proxy link...', 'info');
            // Testing via httpbin to ensure the encrypted key header is injected correctly
            await api.get(`/external-usage/proxy/${id}?targetUrl=https://httpbin.org/get`);
            showAlert('Proxy link verified. Telemetry recorded in vault.', 'success');
            fetchProviders(); // Refresh usage count
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Proxy test failed';
            showAlert(`Proxy Error: ${msg}`, 'error');
        }
    };

    const deleteProvider = async (id) => {
        if (!window.confirm('Are you sure you want to remove this provider? All keys will be permanently deleted from the vault.')) return;
        try {
            await api.delete(`/external-providers/${id}`);
            setProviders(providers.filter(p => p._id !== id));
            showAlert('Provider disconnected', 'info');
        } catch (err) {
            showAlert('Delete failed', 'error');
        }
    };

    return (
        <div className="external-api-page credentials-page">
            <header className="page-header">
                <div>
                    <h1>Multi-Platform APIs</h1>
                    <p>Connect and manage third-party provider credentials securely</p>
                </div>
                <button className="btn-primary" onClick={() => setShowAdd(true)}>
                    <Plus size={20} /> Connect Provider
                </button>
            </header>

            {showAdd && (
                <div className="modal-overlay">
                    <div className="modal-content glass scrollable-modal">
                        <h2>Add External API Provider</h2>
                        <form onSubmit={handleAdd}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Connection Name</label>
                                    <input
                                        className="input-field"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. GPT-4 Prod"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Platform</label>
                                    <select
                                        className="input-field"
                                        value={formData.provider}
                                        onChange={e => setFormData({ ...formData, provider: e.target.value })}
                                    >
                                        <option value="openai">OpenAI (ChatGPT)</option>
                                        <option value="google">Google Cloud</option>
                                        <option value="gemini">Google Gemini</option>
                                        <option value="groq">Groq Cloud</option>
                                        <option value="aws">AWS Management</option>
                                        <option value="custom">Other / Custom</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>API Secret Key (AES-256 encrypted)</label>
                                <input
                                    type="password"
                                    className="input-field"
                                    value={formData.apiKey}
                                    onChange={e => setFormData({ ...formData, apiKey: e.target.value })}
                                    placeholder="Paste API key here"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>IP Whitelist (Comma-separated)</label>
                                <input
                                    className="input-field"
                                    value={formData.allowedIps}
                                    onChange={e => setFormData({ ...formData, allowedIps: e.target.value })}
                                    placeholder="e.g. 192.168.1.1, 10.0.0.5"
                                />
                                <small style={{ color: '#888', marginTop: '4px', display: 'block' }}>Leave empty to allow all IPs (Not Recommended)</small>
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>RPM Limit</label>
                                    <input
                                        type="number"
                                        className="input-field"
                                        value={formData.rpm}
                                        onChange={e => setFormData({ ...formData, rpm: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Expiration Date</label>
                                    <input
                                        type="date"
                                        className="input-field"
                                        value={formData.expiresAt}
                                        onChange={e => setFormData({ ...formData, expiresAt: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Notes / Description</label>
                                <textarea
                                    className="input-field"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Secondary production key for..."
                                    rows="2"
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Vault & Connect</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="credentials-list">
                {loading ? (
                    <div className="loading">Loading providers...</div>
                ) : providers.length === 0 ? (
                    <div className="empty-state glass">
                        <Globe size={40} color="#4facfe" />
                        <p>No external APIs connected. Link your first provider to monitor usage.</p>
                    </div>
                ) : (
                    providers.map(p => (
                        <div key={p._id} className="credential-card glass border-blue">
                            <div className="card-top">
                                <div className="card-info">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div className={`platform-icon ${p.provider}`}></div>
                                        <h3>{p.name}</h3>
                                    </div>
                                    <span style={{ fontSize: '0.8rem', color: '#4facfe', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                        {p.provider} Platform
                                    </span>
                                </div>
                                <div className={`status-badge ${p.status}`}>
                                    {p.status}
                                </div>
                            </div>

                            <div className="vault-masked-key">
                                <Shield size={14} color="#10b981" />
                                <code>{p.apiKeyMasked}</code>
                                <span className="vault-tag">VAULTED</span>
                            </div>

                            <div className="card-meta">
                                <div className="meta-item">
                                    <Database size={14} />
                                    <span>{p.usageCount} Transfers</span>
                                </div>
                                <div className="meta-item">
                                    <Shield size={14} />
                                    <span>IPs: {p.allowedIps?.length > 0 ? `${p.allowedIps.length} Restricted` : 'Global'}</span>
                                </div>
                                {p.expiresAt && (
                                    <div className="meta-item warning">
                                        <ShieldAlert size={14} />
                                        <span>Rotates: {new Date(p.expiresAt).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>

                            {p.description && (
                                <p className="card-description">{p.description}</p>
                            )}

                            <div className="card-actions">
                                <button className="btn-action activate" onClick={() => testProxy(p._id)}>
                                    <ExternalLink size={16} /> Test Proxy
                                </button>
                                <button className="btn-action delete" onClick={() => deleteProvider(p._id)}>
                                    <Trash2 size={16} /> Disconnect
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ExternalProviders;
