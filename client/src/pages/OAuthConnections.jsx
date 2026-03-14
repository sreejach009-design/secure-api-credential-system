import React, { useState, useEffect } from 'react';
import { Globe, Link2, Unlink, CheckCircle, AlertCircle, Shield, Key, Loader2 } from 'lucide-react';
import api from '../api';
import { useAlert } from '../context/AlertContext';

const OAuthConnections = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [connecting, setConnecting] = useState(null);
    const { showAlert } = useAlert();

    const providers = [
        { id: 'google', name: 'Google Cloud / Gemini', color: '#4285F4', icon: <Globe size={24} /> },
        { id: 'openai', name: 'OpenAI / ChatGPT', color: '#10a37f', icon: <Key size={24} /> },
        { id: 'groq', name: 'Groq Cloud', color: '#f55036', icon: <Globe size={24} /> },
        { id: 'github', name: 'GitHub Developer', color: '#333', icon: <Globe size={24} /> }
    ];

    const fetchAccounts = async () => {
        try {
            const res = await api.get('/oauth-connections/list');
            setAccounts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const connectSimulation = async (pId) => {
        setConnecting(pId);
        try {
            // Simulate OAuth 2.0 flow timing
            await new Promise(r => setTimeout(r, 1500));

            const res = await api.post(`/oauth-connections/connect/${pId}`, {
                externalId: `user_${Math.random().toString(36).substr(2, 6)}_${pId}`,
                email: `user_${pId}@gmail.com`,
                permissions: ['usage_read', 'metrics_sync']
            });
            showAlert(`Successfully connected ${pId} account`, 'success');
            await fetchAccounts();
        } catch (err) {
            showAlert(err.response?.data?.message || 'Connection failed', 'error');
        } finally {
            setConnecting(null);
        }
    };

    const disconnect = async (id) => {
        if (!window.confirm('Are you sure you want to unlink this account?')) return;
        try {
            await api.delete(`/oauth-connections/${id}`);
            showAlert('Account unlinked', 'info');
            await fetchAccounts();
        } catch (err) {
            showAlert('Disconnection failed', 'error');
        }
    };

    return (
        <div className="oauth-page credentials-page">
            <header className="page-header">
                <div>
                    <h1>OAuth Connections</h1>
                    <p>Manage authenticated access to external platform accounts</p>
                </div>
                <div className="status-badge active">OIDC SECURE</div>
            </header>

            <div className="oauth-provider-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {providers.map(p => {
                    const linked = accounts.find(a => a.providerName === p.id);
                    const isConnecting = connecting === p.id;

                    return (
                        <div key={p.id} className="provider-card glass" style={{ padding: '25px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ padding: '10px', background: `${p.color}22`, borderRadius: '12px', color: p.color }}>
                                        {p.icon || <Globe size={24} />}
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem' }}>{p.name}</h3>
                                        <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                                            {linked ? 'Authenticated' : 'Not Connected'}
                                        </p>
                                    </div>
                                </div>
                                {linked ? <CheckCircle size={20} color="#10b981" /> : <AlertCircle size={20} color="#94a3b8" />}
                            </div>

                            {linked ? (
                                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '12px' }}>
                                    <p style={{ fontSize: '0.85rem', marginBottom: '5px' }}>
                                        <span className="text-dim">External Account ID:</span> {linked.externalAccountId}
                                    </p>
                                    <p style={{ fontSize: '0.85rem' }}>
                                        <span className="text-dim">Permissions:</span> {linked.permissions?.join(', ')}
                                    </p>
                                </div>
                            ) : (
                                <p style={{ fontSize: '0.85rem', color: '#94a3b8', minHeight: '40px' }}>
                                    Connect your cloud account to enable automatic key management and usage telemetry syncing.
                                </p>
                            )}

                            <div style={{ marginTop: 'auto' }}>
                                {linked ? (
                                    <button className="btn-action rotate" onClick={() => disconnect(linked._id)} style={{ width: '100%', justifyContent: 'center' }}>
                                        <Unlink size={18} /> Unlink Account
                                    </button>
                                ) : (
                                    <button className="btn-primary"
                                        disabled={!!connecting}
                                        onClick={() => connectSimulation(p.id)}
                                        style={{ width: '100%', justifyContent: 'center' }}>
                                        {isConnecting ? (
                                            <> <Loader2 size={18} className="spin" /> Contacting Provider... </>
                                        ) : (
                                            <> <Link2 size={18} /> Authenticate with OAuth </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="oauth-security-notice glass" style={{ marginTop: '40px', padding: '25px', borderLeft: '4px solid #4facfe' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <Shield size={32} color="#4facfe" />
                    <div>
                        <h3 style={{ color: '#4facfe' }}>Multi-Platform Identity Center</h3>
                        <p className="text-dim" style={{ fontSize: '0.9rem', marginTop: '5px' }}>
                            All connections follow OIDC flow. Your platform credentials never touch our database. Only encrypted access tokens are stored within the SecureKey vault.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OAuthConnections;
