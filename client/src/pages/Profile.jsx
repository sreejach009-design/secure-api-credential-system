import React, { useState } from 'react';
import { User, Mail, Lock, Shield, Save, LogOut, Camera, Bell, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useAlert } from '../context/AlertContext';


const Profile = ({ user, logout }) => {
    const { showAlert } = useAlert();
    const [activeTab, setActiveTab] = useState('profile');

    const [profileData, setProfileData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        // In a real app, send to API
        setMessage({ type: 'success', text: 'Profile updated successfully (Simulator)' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        if (profileData.newPassword !== profileData.confirmPassword) {
            showAlert('Passwords do not match', 'error');
            return;
        }
        showAlert('Password changed successfully (Simulator)', 'success');
        setProfileData({ ...profileData, currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    const [notificationSettings, setNotificationSettings] = useState({
        emailAlerts: true,
        securityAlerts: true,
        usageReports: false,
        newFeatures: true
    });

    const handleNotificationToggle = (setting) => {
        setNotificationSettings(prev => ({
            ...prev,
            [setting]: !prev[setting]
        }));
    };

    const saveNotificationSettings = () => {
        showAlert('Notification preferences saved locally', 'success');
    };

    const [syncing, setSyncing] = useState(false);
    const handleSyncPreferences = () => {
        setSyncing(true);
        showAlert('Connecting to central notification node...', 'info');

        // Simulate a real-time sync action
        setTimeout(() => {
            setSyncing(false);
            showAlert('Notification preferences synchronized across all authorized system nodes.', 'success');
        }, 1500);
    };


    return (
        <div className="profile-page">
            <div className="page-header">
                <div>
                    <h1>Account Settings</h1>
                    <p className="text-dim">Manage your profile and security preferences</p>
                </div>
                <button onClick={logout} className="btn-outline-danger">
                    <LogOut size={18} /> Logout
                </button>
            </div>

            <div className="profile-content">
                <div className="profile-sidebar">
                    <div className="profile-card glass">
                        <div className="avatar-section">
                            <div className="avatar-placeholder">
                                {user?.username?.charAt(0).toUpperCase()}
                                <div className="avatar-edit"><Camera size={14} /></div>
                            </div>
                            <h3>{user?.username}</h3>
                            <p className="text-dim">{user?.email}</p>
                        </div>
                        <div className="profile-nav">
                            <button
                                className={`p-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                                onClick={() => setActiveTab('profile')}
                            >
                                <User size={18} /> Profile
                            </button>
                            <button
                                className={`p-nav-item ${activeTab === 'security' ? 'active' : ''}`}
                                onClick={() => setActiveTab('security')}
                            >
                                <Shield size={18} /> Security
                            </button>
                            <button
                                className={`p-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
                                onClick={() => setActiveTab('notifications')}
                            >
                                <Bell size={18} /> Notifications
                            </button>
                        </div>

                    </div>
                </div>

                <div className="profile-forms">
                    {activeTab === 'profile' && (
                        <div className="animate-fade-in">
                            <div className="form-section glass">
                                <h3><User size={20} /> Personal Information</h3>
                                <form onSubmit={handleUpdateProfile}>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>Username</label>
                                            <input
                                                type="text"
                                                name="username"
                                                value={profileData.username}
                                                onChange={handleChange}
                                                className="input-field"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={profileData.email}
                                                onChange={handleChange}
                                                className="input-field"
                                            />
                                        </div>
                                    </div>
                                    <button type="submit" className="btn-primary">
                                        <Save size={18} /> Save Changes
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="animate-fade-in">
                            <div className="form-section glass">
                                <h3><Lock size={20} /> Change Password</h3>
                                <form onSubmit={handleChangePassword}>
                                    <div className="form-group">
                                        <label>Current Password</label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={profileData.currentPassword}
                                            onChange={handleChange}
                                            className="input-field"
                                        />
                                    </div>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>New Password</label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={profileData.newPassword}
                                                onChange={handleChange}
                                                className="input-field"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Confirm Password</label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={profileData.confirmPassword}
                                                onChange={handleChange}
                                                className="input-field"
                                            />
                                        </div>
                                    </div>
                                    <button type="submit" className="btn-primary">
                                        <Shield size={18} /> Update Security Settings
                                    </button>
                                </form>
                            </div>

                            <div className="form-section glass" style={{ marginTop: '20px' }}>
                                <h3><ShieldCheck size={20} /> Two-Factor Authentication</h3>
                                <p className="text-dim" style={{ marginBottom: '20px' }}>Add an extra layer of security to your account.</p>
                                <button className="btn-outline" onClick={() => showAlert('2FA Setup coming soon', 'info')}>
                                    Enable 2FA
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="animate-fade-in">
                            <div className="form-section glass">
                                <h3><Bell size={20} /> Notification Preferences</h3>
                                <p className="text-dim" style={{ marginBottom: '25px' }}>Choose how you want to be notified about your API activity.</p>

                                <div className="settings-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {Object.keys(notificationSettings).map((setting) => (
                                        <div key={setting} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', borderBottom: '1px solid var(--border)' }}>

                                            <div>
                                                <h4 style={{ textTransform: 'capitalize' }}>{setting.replace(/([A-Z])/g, ' $1')}</h4>
                                                <p className="text-dim" style={{ fontSize: '0.85rem' }}>Receive alerts related to {setting.toLowerCase()}.</p>
                                            </div>
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    checked={notificationSettings[setting]}
                                                    onChange={() => handleNotificationToggle(setting)}
                                                />
                                                <span className="slider round"></span>
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                <div className="modal-actions" style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
                                    <button
                                        className="btn-primary"
                                        onClick={saveNotificationSettings}
                                    >
                                        <Save size={18} /> Save Settings
                                    </button>
                                    <button
                                        className="btn-outline"
                                        disabled={syncing}
                                        onClick={handleSyncPreferences}
                                    >
                                        {syncing ? 'Synchronizing...' : 'Sync Preferences Across Cloud'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </div>

        </div>
    );
};

export default Profile;
