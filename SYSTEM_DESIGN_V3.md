# SecureKey V3.0: Detailed System Design & Architecture

This document provides the technical diagrams and schema definitions required for high-level documentation and research papers.

---

## 1. System Architecture (Enterprise Layout)

The diagram below illustrates the proposed V3.0 architecture, transitioning to a high-availability, micro-services ready structure.

```mermaid
graph TD
    subgraph "External World"
        SDK["Client App / SDK"]
        WAF["Cloudflare WAF / Load Balancer"]
    end

    subgraph "SecureKey Application Layer"
        Proxy["Proxy Bridge (Node.js/Go)"]
        API["Admin API (RBAC)"]
        ML["ML Anomaly Engine (Python/Flask)"]
    end

    subgraph "SecureKey Data & Security"
        Redis[("Redis - Cache & Rate Limits")]
        DB[("MongoDB - Vault & Logs")]
        Vault["Hardware Security Module (HSM)"]
    end

    subgraph "External Providers"
        OpenAI["OpenAI / Anthropic"]
        AWS["AWS / GCP"]
        Logs["ELK Stack / Grafana"]
    end

    SDK --> WAF
    WAF --> Proxy
    Proxy --> Redis
    Proxy --> Vault
    Proxy --> OpenAI
    Proxy --> AWS
    Proxy --> DB
    API --> DB
    API --> ML
    ML --> DB
    DB -.-> Logs
```

---

## 2. Data Flow Diagram (DFD Level 2: Proxy Request)

This DFD shows the granular flow of data during a "Secure Proxy Request".

```mermaid
flowchart LR
    A[App Request] --> B{Rate Limiter}
    B -- "Limit Exceeded" --> C[429 Error]
    B -- "Allow" --> D{Cache Check}
    D -- "Miss" --> E[Access Vault]
    D -- "Hit" --> F[Get Decrypted Secret]
    E --> G[HSM / KMS Decryption]
    G --> F
    F --> H[Request Modifier]
    H -- "Inject API Key" --> I[Provider API]
    I --> J[Response Handler]
    J --> K[Usage Logger]
    K -- "Async" --> L[(MongoDB / logs)]
    J --> M[App Response]
```

---

## 3. UML Class Diagram (Updated)

Expanded classes to include ML Anomaly detection and Rate Limit configurations.

```mermaid
classDiagram
    class User {
        +String id
        +String email
        +Enum role
        +linkAccount(provider)
    }
    class Credential {
        +String id
        +String name
        +String provider
        +String apiKeyEncrypted
        +Config rateLimits
        +encrypt()
        +decrypt()
    }
    class UsageLog {
        +ObjectId credentialId
        +Float responseTime
        +Int statusCode
        +String ipAddress
        +calculateLatency()
    }
    class Anomaly {
        +ObjectId userId
        +Float confidenceScore
        +String reason
        +triggerAlert()
    }

    User "1" *-- "many" Credential
    Credential "1" *-- "many" UsageLog
    UsageLog --|> Anomaly : "analyzed by"
```

---

## 4. Sequence Diagram: Threat Detection Flow

How the system detects and reacts to a potential credential leak.

```mermaid
sequenceDiagram
    participant GH as GitHub Webhook
    participant SK as SecureKey Monitor
    participant DB as MongoDB
    participant NT as Notification Service
    participant EM as Admin/User

    GH->>SK: Commit Event (Token Detected)
    SK->>DB: Search for Matching Hash
    DB-->>SK: Found (Key ID: 123)
    SK->>DB: Set Status to 'REVOKED'
    SK->>NT: Trigger Urgent Alert
    NT->>EM: Email/SMS: Key Compromised & Revoked
    EM->>SK: Log in to Rotate Key
```

---

## 5. New Database Collections (V3.0 Schema)

To support advanced features, add these collections to your MongoDB:

### `anomalies`
```javascript
{
  userId: ObjectId,
  credentialId: ObjectId,
  severity: ["low", "medium", "critical"],
  score: 0.98, // ML Confidence
  patternDetected: "Geographic Jump",
  metadata: { prevIp: "1.1.1.1", newIp: "8.8.8.8" },
  createdAt: ISODate
}
```

### `ip_whitelists`
```javascript
{
  credentialId: ObjectId,
  allowedIps: [String],
  allowedDomains: [String],
  enforced: Boolean
}
```

### `cost_mapping`
```javascript
{
  provider: "openai",
  model: "gpt-4o",
  pricePer1kTokens: 0.005,
  currency: "USD"
}
```

---

## 6. Research Focus Suggestions
If using this for a **Research Paper**, focus on these specific sections:
1.  **Quantitative Analysis**: Compare latency overhead between a Direct Request vs. SecureKey Proxy Request (Goal: <50ms overhead).
2.  **Privacy Preservation**: Discuss why "Runtime Decryption" is superior to "Developer-side Decryption."
3.  **Machine Learning Accuracy**: Measure the False Positive Rate (FPR) of the Isolation Forest model in detecting unauthorized users.
