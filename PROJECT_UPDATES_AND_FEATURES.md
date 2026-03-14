# 🛡️ SecureKey — Secure API Credential Lifecycle & Usage Monitoring Platform

## Complete Project Updates & Integrated Features

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Technology Stack](#-technology-stack)
3. [Architecture Overview](#-architecture-overview)
4. [Backend Features](#-backend-features)
5. [Frontend Features](#-frontend-features)
6. [Security Features](#-security-features)
7. [Admin Dashboard — Command Center](#-admin-dashboard--command-center)
8. [API Endpoints Reference](#-api-endpoints-reference)
9. [Database Models](#-database-models)
10. [Recent Updates & Changelog](#-recent-updates--changelog)

---

## 🌐 Project Overview

**SecureKey** is a full-stack MERN (MongoDB, Express.js, React, Node.js) platform designed for the **secure lifecycle management** of API credentials. It enables developers and administrators to generate, store, rotate, monitor, and audit API keys — both internal platform keys and external third-party provider keys (OpenAI, Google, Groq, etc.) — from a single unified dashboard.

### Core Objectives

- **Generate & Manage** API keys with hashing, masking, and expiration controls
- **Monitor Usage** in real time with analytics, telemetry, and anomaly detection
- **Enforce Security** through RBAC, rate limiting, IP whitelisting/blacklisting, and encryption
- **Provide Admin Oversight** through a dedicated, visually distinct Command Center
- **Audit Everything** with comprehensive logging of all system and user activities

---

## 🧰 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19, Vite 7, React Router 7 | SPA with client-side routing |
| **UI/UX** | Vanilla CSS (Glassmorphism + Cyber HUD), Lucide React Icons, Framer Motion | Premium design system |
| **Backend** | Node.js, Express.js | RESTful API server |
| **Database** | MongoDB with Mongoose ODM | Document-based storage |
| **Authentication** | JWT (JSON Web Tokens), bcryptjs | Stateless auth with password hashing |
| **Encryption** | AES-256-GCM (Node.js `crypto`) | Vault-grade encryption for external keys |
| **Security** | Helmet.js, express-rate-limit, CORS | HTTP hardening and rate limiting |
| **Scheduling** | node-cron | Automated key rotation and anomaly scans |
| **Charts** | Recharts | Data visualization for analytics |
| **External APIs** | Groq, OpenAI, Google, Gemini (via Proxy) | Multi-provider AI integration |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)           │
│  ┌──────────┐ ┌──────────┐ ┌─────────────────────┐  │
│  │ User     │ │ Provider │ │ Admin Command Center│  │
│  │ Dashboard│ │ Manager  │ │ (HUD Interface)     │  │
│  └────┬─────┘ └────┬─────┘ └──────────┬──────────┘  │
│       │             │                  │             │
│       └─────────────┴──────────────────┘             │
│                     │ Axios API Calls                │
├─────────────────────┼───────────────────────────────├
│                     ▼                                │
│             EXPRESS.JS API SERVER                     │
│  ┌──────────────────────────────────────────────┐    │
│  │  Middleware Stack:                            │    │
│  │  Helmet → Rate Limiter → CORS → Auth (JWT)   │    │
│  │  → RBAC → API Security → Route Handlers      │    │
│  └──────────────────────────────────────────────┘    │
│         │            │              │                │
│    ┌────▼────┐  ┌────▼────┐  ┌─────▼──────┐        │
│    │ MongoDB │  │  Vault  │  │ Scheduler  │        │
│    │ (Data)  │  │ (AES)   │  │ (node-cron)│        │
│    └─────────┘  └─────────┘  └────────────┘        │
└─────────────────────────────────────────────────────┘
```

---

## ⚙️ Backend Features

### 1. Authentication & Authorization

| Feature | Description | File |
|---------|-------------|------|
| **User Registration** | Create accounts with username, email, password, and role | `routes/auth.js` |
| **User Login** | JWT-based stateless authentication with 24h token expiry | `routes/auth.js` |
| **Password Hashing** | bcryptjs with salt rounds of 10 | `models/User.js` |
| **JWT Middleware** | Token verification on all protected routes | `middleware/auth.js` |
| **RBAC (Role-Based Access Control)** | Restricts endpoints by role: `admin`, `developer`, `viewer` | `middleware/rbac.js` |
| **Account Status Verification** | Blocked users are denied access in real time on every request | `middleware/auth.js` |
| **Last Login Tracking** | Records the timestamp of each successful login | `routes/auth.js` |
| **Blocked Account Rejection** | Blocked users receive a `403 Forbidden` on login attempts | `routes/auth.js` |

### 2. Internal Credential Management

| Feature | Description | File |
|---------|-------------|------|
| **Key Generation** | Creates `sk_` prefixed UUID-based API keys | `routes/credentials.js` |
| **SHA-256 Hashing** | API keys are stored as hashes; plain keys shown only once | `routes/credentials.js` |
| **Key Masking** | Display format: `sk_....xxxx` (last 4 chars only) | `routes/credentials.js` |
| **Key Rotation** | Regenerates keys with new hash and masked values | `routes/credentials.js` |
| **Status Control** | Activate / Deactivate / Expire credentials | `routes/credentials.js` |
| **Key Deletion** | Permanent removal of credentials | `routes/credentials.js` |
| **Expiration Dates** | Optional expiry timestamps on keys | `models/Credential.js` |
| **Usage Tracking** | Tracks `usageCount` and `lastUsedAt` per key | `models/Credential.js` |
| **Rate Limiting (Per Key)** | Configurable `rateLimitPerMinute` and `rateLimitPerHour` | `models/Credential.js` |
| **IP Whitelisting** | Allow-list of IPs that can use each key | `models/Credential.js` |
| **IP Blacklisting** | Block-list of IPs denied from using each key | `models/Credential.js` |
| **Rotation Interval** | Configurable auto-rotation period (default: 30 days) | `models/Credential.js` |

### 3. External Provider Credential Vault

| Feature | Description | File |
|---------|-------------|------|
| **Multi-Provider Support** | OpenAI, Google, Gemini, Groq, AWS, Custom | `models/ExternalCredential.js` |
| **AES-256-GCM Encryption** | External API keys are encrypted at rest | `utils/encryption.js` |
| **Vault Service Layer** | Abstracted CRUD with encryption/decryption | `services/vaultService.js` |
| **Key Access Auditing** | Every vault key access is logged | `services/vaultService.js` |
| **Key Revocation** | Mark compromised keys as `revoked` | `services/vaultService.js` |
| **Masked Display** | Keys shown as `sk-...abcd` in the UI | `services/vaultService.js` |
| **Provider Analytics** | Track usage per external provider | `routes/externalUsage.js` |
| **Proxy Test** | Test external keys against provider APIs | `routes/externalProviders.js` |

### 4. API Security Middleware

| Feature | Description | File |
|---------|-------------|------|
| **API Key Validation** | Accepts keys via `X-API-KEY` header, query param, or body | `middleware/apiSecurity.js` |
| **Hash-First Lookup** | Searches by hash first; falls back to plain key for legacy support | `middleware/apiSecurity.js` |
| **IP Enforcement** | Validates against both whitelist and blacklist per credential | `middleware/apiSecurity.js` |
| **Status Enforcement** | Rejects inactive and expired keys with security alerts | `middleware/apiSecurity.js` |
| **Per-Minute Rate Limiting** | MongoDB-based rate limiting per credential | `middleware/apiSecurity.js` |
| **Per-Hour Rate Limiting** | Secondary rate limit with hourly window | `middleware/apiSecurity.js` |
| **Automatic Usage Logging** | Logs every API call with response time on `res.finish` | `middleware/apiSecurity.js` |
| **Auto Notification** | Generates notifications for security events | `middleware/apiSecurity.js` |

### 5. Usage Analytics & Monitoring

| Feature | Description | File |
|---------|-------------|------|
| **Usage Statistics** | Aggregated daily request counts and avg response times | `routes/usage.js` |
| **Top Endpoints** | Ranked list of most-called endpoints | `routes/usage.js` |
| **Status Code Breakdown** | Distribution of 2xx, 4xx, 5xx responses | `routes/usage.js` |
| **Latency Metrics** | Average and max response times | `routes/usage.js` |
| **API Simulator** | Mock endpoint for testing credentials with various scenarios | `routes/usage.js` |
| **Scenario Testing** | Simulate: success, inactive key, expired key, high usage | `routes/usage.js` |
| **Groq API Integration** | Real AI API calls through the simulator | `routes/usage.js` |

### 6. Audit Logging & Notifications

| Feature | Description | File |
|---------|-------------|------|
| **Comprehensive Audit Trail** | Logs every CRUD action with user, resource, and IP | `models/AuditLog.js` |
| **User-Scoped Audit Logs** | Users see their own activity; admins can view globally | `routes/usage.js` |
| **In-App Notifications** | Info, warning, and error notifications per user | `models/Notification.js` |
| **Mark as Read** | Users can dismiss notifications | `routes/usage.js` |

### 7. Automated Scheduler (Cron Jobs)

| Feature | Description | File |
|---------|-------------|------|
| **Auto Key Rotation** | Rotates keys that exceed their rotation interval | `utils/scheduler.js` |
| **Expiry Reminders** | Sends notifications for keys expiring within 7 days | `utils/scheduler.js` |
| **Anomaly Detection** | Detects volumetric spikes (>10,000 req/24h) and error rate anomalies (>20%) | `utils/scheduler.js` |
| **Daily Execution** | Runs at midnight daily via `node-cron` | `utils/scheduler.js` |

### 8. Global Security Hardening

| Feature | Description | File |
|---------|-------------|------|
| **Helmet.js** | Sets secure HTTP headers (X-Frame-Options, CSP, etc.) | `index.js` |
| **Global Rate Limiter** | 1000 req/15min across all `/api/` routes | `index.js` |
| **Request Size Limiting** | JSON body limited to 10KB | `index.js` |
| **CORS Configuration** | Configurable origins with credentials support | `index.js` |
| **Morgan Logging** | HTTP request logging in dev mode | `index.js` |

---

## 🖥️ Frontend Features

### Pages & Components

| Page | Route | Description |
|------|-------|-------------|
| **Home** | `/` | Full-screen landing portal with "Get Started" call-to-action |
| **Login** | `/login` | User authentication with JWT storage |
| **Admin Login** | `/admin-login` | Dedicated admin login portal |
| **Register** | `/register` | New user signup with role selection |
| **Dashboard** | `/dashboard` | System overview: security score, stats, API simulator |
| **Internal Keys** | `/credentials` | CRUD for platform-generated API keys |
| **External APIs** | `/external-providers` | Manage third-party provider keys (OpenAI, Groq, etc.) |
| **Secure Vault** | `/vault` | Encrypted vault for sensitive external keys |
| **Internal Analytics** | `/analytics` | Charts for internal API usage (Recharts) |
| **External Analytics** | `/external-analytics` | Charts for external provider usage |
| **Linked Accounts** | `/oauth-connections` | OAuth connection management |
| **Security** | `/security` | Security alerts and threat notifications |
| **Activity Logs** | `/logs` | Dual-tab: API traffic logs + system audit logs |
| **Settings / Profile** | `/profile` | User profile, password change, preferences |
| **API Documentation** | `/docs` | Built-in API reference documentation |
| **Admin Panel** | `/admin` | Admin-only Command Center (role-protected) |

### Shared Components

| Component | Description |
|-----------|-------------|
| **Navbar** | Sidebar navigation with role-based menu items |
| **Notification** | Toast notification system with auto-dismiss |
| **AlertContext** | Global alert provider for cross-component notifications |

### Design System

| Design Element | Implementation |
|----------------|----------------|
| **Dark Theme** | Custom CSS variables with deep navy/black tones |
| **Glassmorphism** | `backdrop-filter: blur()` with translucent backgrounds |
| **Gradient Typography** | Headings use `linear-gradient` text fills |
| **Micro-Animations** | Fade-in, pulse, shine, and hover transitions |
| **Responsive Layout** | CSS Grid and Flexbox for all viewports |
| **Premium Buttons** | Shine effect on hover with gradient backgrounds |
| **Status Indicators** | Color-coded badges (green/amber/red) for all statuses |

---

## 🔒 Security Features

### Authentication & Access Control

- [x] JWT-based stateless authentication (24h expiry)
- [x] bcryptjs password hashing (salt rounds: 10)
- [x] Role-Based Access Control (Admin / Developer / Viewer)
- [x] Real-time account status verification (blocked users evicted immediately)
- [x] Separate admin login portal
- [x] Protected routes on both frontend and backend

### Credential Security

- [x] SHA-256 hashed internal API keys (plain key shown only once at creation)
- [x] AES-256-GCM encrypted external provider keys
- [x] Key masking for all display contexts (`sk_....xxxx`)
- [x] Configurable key expiration dates
- [x] Automatic and manual key rotation
- [x] Admin force-rotate capability for incident response

### API Security

- [x] Per-key rate limiting (minute and hourly windows)
- [x] IP whitelisting per credential
- [x] IP blacklisting per credential
- [x] Inactive/expired key rejection with alerts
- [x] Global rate limiting (Helmet + express-rate-limit)
- [x] Request body size limiting (10KB)

### Monitoring & Detection

- [x] Real-time anomaly detection (volumetric spikes, error rate anomalies)
- [x] Automated daily anomaly scans via cron scheduler
- [x] Security alert generation for all threat events
- [x] Comprehensive audit logging for every system action
- [x] User notification system for security events

---

## 🎮 Admin Dashboard — Command Center

The Admin Dashboard is a **completely separate, visually distinct interface** designed exclusively for administrators. It uses a "Cyber Command Center" (HUD) theme that is architecturally different from the standard user experience.

### Visual Distinction from User Pages

| Aspect | User Dashboard | Admin Command Center |
|--------|---------------|---------------------|
| **Theme** | Glassmorphism (dark navy, soft glows) | Cyber HUD (pure black, neon cyan `#00f2fe`) |
| **Typography** | Standard gradient headings | Monospace `JetBrains Mono`, ALL_CAPS labels |
| **Layout** | Card-based grid | HUD grid with corner brackets and scanlines |
| **Tables** | `admin-table` with rounded rows | `cyber-table` with hard edges and glow borders |
| **Buttons** | Rounded glass buttons | Clipped `clip-path` buttons with edge cuts |
| **Status Indicators** | Badge pills | Dot indicators with box-shadow glow |
| **Background** | Navy gradient with orbs | Pure black with scanline animation overlay |
| **Font** | Inter / System | Orbitron / JetBrains Mono |

### Admin-Only Features

#### 👥 User Management Tab
- View all registered users with metadata (email, role, join date, last login)
- Change user roles: `Admin` / `Developer` / `Viewer`
- Block / Unblock user accounts (immediate session termination)
- Permanently delete user accounts (with admin-count safety check)

#### 🔑 Global Key Management Tab
- View **all** API keys across the entire platform
- Override credential status (activate/deactivate/expire)
- **Force Rotate** any credential (generates new key, audits the action)
- View key owner, usage count, and last rotation date

#### 🌍 External Vault Oversight Tab
- View all external provider credentials across all users
- Override external credential status (activate/revoke)
- Monitor vault health across OpenAI, Google, Groq, and custom providers

#### 📡 Telemetry & Anomaly Detection Tab
- Platform-wide API traffic metrics (total calls, success rate, error rate)
- Provider distribution analytics
- **Real-time anomaly detection**: Users with >50% error rate in the last hour
- Recent error log stream
- Ability to block anomalous users directly from the telemetry view

#### 📜 Audit Logs Tab
- Global audit trail (last 100 entries)
- Shows: user, action, resource type, timestamp, IP address
- Tracks: logins, key operations, role changes, admin overrides

#### ⚙️ Platform Configuration Tab
- Toggle maintenance mode
- Set global rate limits
- Enable/disable user registration
- Configure security policies:
  - Auto-rotation interval (days)
  - Minimum password length
  - Session timeout
  - Enforce rotation toggle

### Admin Overview — System Core Monitoring
- **HUD Stats Grid**: Total users, active platform keys, anomalies detected
- **Threat Log Stream**: Real-time console showing security events
- **Node Resources**: Health status of Vault Cluster, Auth Gateway, Proxy Metadata, Audit Index
- **Security Ticker**: Scrolling system status banner

---

## 📡 API Endpoints Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/register` | Register a new user |
| `POST` | `/login` | Authenticate and receive JWT |

### Credentials (`/api/credentials`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | List user's credentials |
| `POST` | `/` | Create a new API key |
| `PUT` | `/:id/rotate` | Rotate/regenerate a key |
| `PATCH` | `/:id/status` | Update key status |
| `DELETE` | `/:id` | Delete a credential |

### Usage & Analytics (`/api/usage`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/stats` | User's usage statistics |
| `GET` | `/analytics` | Detailed analytics (endpoints, status codes, latency) |
| `GET` | `/audit` | User or global audit logs |
| `GET` | `/notifications` | User's notifications |
| `PUT` | `/notifications/:id` | Mark notification as read |
| `POST` | `/simulate` | Simulate API calls with scenarios |

### Security (`/api/security`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Fetch security alerts |

### External Providers (`/api/external-providers`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/list` | List user's external credentials |
| `POST` | `/add` | Add a new external key (encrypted) |
| `PATCH` | `/:id/status` | Update external key status |

### External Usage (`/api/external-usage`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/stats` | External provider usage stats |

### OAuth (`/api/oauth-connections`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | List OAuth connections |

### Admin (`/api/admin`) — *Requires Admin Role*
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/stats` | Platform-wide statistics with anomaly count |
| `GET` | `/users` | List all users |
| `PUT` | `/users/:id/role` | Change user role |
| `PATCH` | `/users/:id/status` | Block/unblock user |
| `DELETE` | `/users/:id` | Delete user account |
| `GET` | `/credentials` | List all platform credentials |
| `PATCH` | `/credentials/:id/status` | Override credential status |
| `POST` | `/credentials/:id/rotate` | Force-rotate a credential |
| `GET` | `/audit-logs` | Global audit trail |
| `GET` | `/external-credentials` | List all external credentials |
| `PATCH` | `/external-credentials/:id/status` | Override external credential status |
| `GET` | `/telemetry` | Platform telemetry and anomaly detection |
| `GET` | `/config` | Get platform configuration |
| `POST` | `/config` | Update platform configuration |

---

## 🗄️ Database Models

### User
| Field | Type | Description |
|-------|------|-------------|
| `username` | String (unique) | User's display name |
| `email` | String (unique) | Login email |
| `password` | String (hashed) | bcrypt-hashed password |
| `role` | Enum: admin, developer, viewer | Access level |
| `status` | Enum: active, blocked | Account status |
| `lastLogin` | Date | Last successful login timestamp |
| `createdAt` | Date | Registration date |

### Credential (Internal API Keys)
| Field | Type | Description |
|-------|------|-------------|
| `userId` | ObjectId (ref: User) | Key owner |
| `name` | String | Human-readable key name |
| `apiKeyHash` | String (SHA-256) | Hashed API key for lookup |
| `apiKeyMasked` | String | Display-safe masked key |
| `status` | Enum: active, inactive, expired | Current status |
| `expiresAt` | Date | Optional expiration |
| `usageCount` | Number | Total API calls made |
| `lastUsedAt` | Date | Last usage timestamp |
| `rateLimitPerMinute` | Number | Per-minute rate limit |
| `rateLimitPerHour` | Number | Per-hour rate limit |
| `allowedIps` | [String] | IP whitelist |
| `blockedIps` | [String] | IP blacklist |
| `rotationIntervalDays` | Number | Auto-rotation period |
| `lastRotatedAt` | Date | Last rotation timestamp |

### ExternalCredential (Vault Keys)
| Field | Type | Description |
|-------|------|-------------|
| `userId` | ObjectId (ref: User) | Key owner |
| `name` | String | Human-readable name |
| `provider` | Enum: openai, google, gemini, groq, aws, custom | API provider |
| `apiKeyEncrypted` | String (AES-256-GCM) | Encrypted key data |
| `apiKeyMasked` | String | Display-safe masked key |
| `status` | Enum: active, inactive, revoked | Current status |
| `rateLimits` | Object | Per-minute and per-day limits |
| `allowedIps` | [String] | IP restrictions |
| `usageCount` | Number | Total calls made |

### AuditLog
| Field | Type | Description |
|-------|------|-------------|
| `userId` | ObjectId (ref: User) | Who performed the action |
| `action` | String | Action identifier (e.g., `create_credential`) |
| `resourceType` | String | What was affected (credential, user, vault, auth) |
| `resourceId` | ObjectId | ID of the affected resource |
| `details` | Object | Additional metadata |
| `ipAddress` | String | Requester's IP address |
| `timestamp` | Date | When the action occurred |

### SecurityAlert
| Field | Type | Description |
|-------|------|-------------|
| `userId` | ObjectId (ref: User) | Affected user |
| `type` | String | Alert type (high_usage, revoked_key_usage, etc.) |
| `message` | String | Human-readable description |
| `severity` | Enum: low, medium, high, critical | Threat level |
| `status` | Enum: read, unread | Alert acknowledgment |
| `ipAddress` | String | Source IP |
| `apiKey` | String | Related API key |

### UsageLog
| Field | Type | Description |
|-------|------|-------------|
| `credentialId` | ObjectId (ref: Credential) | Which key was used |
| `userId` | ObjectId (ref: User) | Who used it |
| `endpoint` | String | Requested endpoint |
| `method` | String | HTTP method |
| `statusCode` | Number | Response status code |
| `responseTime` | Number | Response time in ms |
| `ipAddress` | String | Requester's IP |
| `timestamp` | Date | When the call was made |

### Notification
| Field | Type | Description |
|-------|------|-------------|
| `userId` | ObjectId (ref: User) | Notification recipient |
| `type` | Enum: info, warning, error | Notification severity |
| `title` | String | Notification heading |
| `message` | String | Notification body |
| `isRead` | Boolean | Read status |
| `metadata` | Object | Additional context |

---

## 🔄 Recent Updates & Changelog

### Session: March 12, 2026 — Admin Dashboard Enhancement

#### ✅ New Features Added

1. **User Status Management**
   - Added `status` (active/blocked) and `lastLogin` fields to User model
   - Created `PATCH /admin/users/:id/status` endpoint
   - Blocked users are immediately evicted from all API access

2. **Auth Middleware Enhancement**
   - Made auth middleware `async` to support real-time DB lookups
   - Added account status check on **every authenticated request**
   - Blocked users get `403 Forbidden` even with valid JWT

3. **Login Route Updates**
   - Added blocked account check before allowing login
   - `lastLogin` timestamp is now recorded on each successful login

4. **Admin Force Rotation**
   - Created `POST /admin/credentials/:id/rotate` endpoint
   - Generates new key pair, updates hash and mask
   - Full audit trail for incident response

5. **Anomaly Detection System**
   - Stats endpoint includes anomaly count (users with >1000 calls/24h)
   - Telemetry endpoint detects users with >50% error rates in the last hour
   - Scheduler runs daily volumetric and error-rate anomaly scans

6. **Platform Security Policies**
   - Extended config with `enforceRotation`, `rotationDays`, `minPasswordLength`, `sessionTimeout`
   - Admin can configure these from the Config tab

7. **Admin Command Center UI Redesign**
   - Completely redesigned with "Cyber HUD" theme
   - Scanline overlay animation
   - System Console for real-time threat monitoring
   - Node Resource Matrix for infrastructure health
   - Cyber-tables with glow borders and status indicators
   - Clip-path tab buttons with edge-cut styling
   - Distinct fonts: Orbitron for headers, JetBrains Mono for data

#### 📁 Files Modified

| File | Changes |
|------|---------|
| `server/models/User.js` | Added `status` and `lastLogin` fields |
| `server/routes/auth.js` | Added blocked check, lastLogin update |
| `server/middleware/auth.js` | Made async, added status verification |
| `server/routes/admin.js` | Added status toggle, force rotation, anomaly detection, expanded config |
| `client/src/pages/AdminDashboard.jsx` | Complete HUD redesign with cyber-table, console, and matrix components |
| `client/src/index.css` | Added 200+ lines of Command Center CSS |

### Session: March 12, 2026 (Evening) — API Simulator & Monitoring Robustness

#### ✅ Fixes & Enhancements

1. **Simulation Redirect Fix**
   - Modified Axios interceptors to prevent unintended logouts during 401/429 simulation results.
   - Users remain on the Dashboard while receiving security event feedback.

2. **Unified Simulation Logging**
   - Rewrote the `/simulate` backend route to **always** create a `UsageLog` for every attempt (success, inactive, expired, rate-limited).
   - This ensures the **Total Cloud Requests** counter increments reliably on every click.
   - Credential usage counts are now updated for both successful and failed attempts.

3. **Secure Lookup for Simulator**
   - Switched from raw API key lookups to reliable `credentialId` (_id) lookups in the simulation route.
   - This fixed the "Invalid API key" error caused by SHA-256 hashing (where plain keys aren't stored).

4. **Security Alert Visibility**
   - Fixed a `userId` type mismatch that prevented simulated alerts from appearing on the Security page.
   - Enhanced the Dashboard toast notifications to direct users to the Security page when an alert is generated.
   - Added `inactive` status keys to the non-functional key count on the Dashboard.

5. **Simulated Anomaly Tracking**
   - Simulated security events (Key Inactive/Expired) now correctly populate the audit trail and security dashboards.

#### 📁 Files Modified

| File | Changes |
|------|---------|
| `server/routes/usage.js` | Unified logging/alert logic, auth added to simulate, fixed userId mapping |
| `client/src/pages/Dashboard.jsx` | Label updates, improved simulation feedback, robust key counting |
| `client/src/api/index.js` | Response interceptor redirect exclusion for simulate/proxy |

---

## 🚀 How to Run

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm

### Backend
```bash
cd server
npm install
# Create .env with: MONGODB_URI, JWT_SECRET, ENCRYPTION_KEY (32 chars), GROQ_API_KEY
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

### Access
- **User Interface**: http://localhost:5173
- **Admin Command Center**: http://localhost:5173/admin (requires admin role)
- **API Server**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

---

> **Document Version**: 3.1  
> **Last Updated**: March 12, 2026 (23:25)  
> **Author**: SecureKey Development Team
