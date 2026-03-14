# SecureKey V2.0: Project Update & Integrated Features

SecureKey has been elevated from a local credential manager to a **Multi-Platform API Security & Monitoring Hub (V2.0)**. 

## 🚀 Newly Integrated Features

### 1. Multi-Platform Vaulting (AES-256-GCM)
*   **Encrypted Key Ingestion**: Securely add keys from OpenAI, Gemini, Groq, AWS, or any custom provider.
*   **Hardware-Grade Security**: Keys are encrypted at rest using AES-256-GCM. 
*   **Zero-Exposure Transit**: Decryption occurs only in Node.js volatile memory during proxy requests.

### 2. Live Monitoring Proxy Bridge
*   **Telemetry Proxy**: Route third-party API calls through `/api/external-usage/proxy/:id` to automatically track usage stats.
*   **Dynamic Usage Tracking**: Real-time logging of latency, status codes, and request volumes for external cloud providers.
*   **Proxy Test Tool**: Built-in verification tool in the dashboard to test cross-cloud connectivity.

### 3. Predictive Threat & Anomaly Detection
*   **Daily Heuristic Scanning**: Background scheduler analyzes usage patterns to flag volumetric spikes (>10k req/24h).
*   **Error Rate Surveillance**: Detects "degraded" provider states or potential misuse if failure rates exceed 20%.
*   **Rotation Compliance Engine**: Audits key ages against a 30-day security policy.

### 4. Consolidated Identity & Analytics
*   **OAuth Account Linking**: Authenticate and link multiple cloud platforms (Google, GitHub, OpenAI) via OIDC.
*   **Provider Telemetry Dashboard**: Comparative analytics showing distribution, absolute volume, and latency across all cloud nodes.
*   **Security Health Stats**: Dynamic compliance scoring (Encryption coverage, rotation adherence, active threat counts).

## 🛠 Project Components
*   **Frontend**: React (Vite) with Lucide Icons and customized dark-mode glassmorphism.
*   **Backend**: Node.js/Express with Mongoose.
*   **Security**: `crypto` (AES-GCM), `jsonwebtoken` (Auth), `helmet` (Headers).
*   **Scheduler**: `node-cron` for daily system-wide audits.

---
**SecureKey V2.0** - *Unifying Cloud Security and API Observability.*
