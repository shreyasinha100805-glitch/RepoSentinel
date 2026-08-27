# RepoSentinel Architecture Documentation

## Overview
RepoSentinel is an autonomous AI security engineer built on Node.js, Express, React, Google Gemini AI, and Google Cloud infrastructure (Firestore, Cloud Run, Pub/Sub).

## Multi-Agent Pipeline Flow

```
┌─────────────────────────────────────────────────────────┐
│                     GitHub Repository                   │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│                    Express.js Backend                   │
└────────────────────────────┬────────────────────────────┘
                             │
                      Supervisor Agent
                             │
     ┌───────────────────────┼───────────────────────┐
     ▼                       ▼                       ▼
Secret Detection       Code Security         Dependency Scanner
    Agent                 Agent                   Agent
     │                       │                       │
     └───────────────────────┼───────────────────────┘
                             ▼
                     Gemini AI Service
                             │
                      Risk Analysis Agent
                             │
                     Remediation Agent
                             │
                    Verification Agent
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
     GitHub Pull Request             Google Firestore
```

## Agent Responsibilities
1. **Supervisor Agent**: Manages the scan lifecycle, state transitions, and step events.
2. **Secret Detection Agent**: Executes pattern matching for secrets (AWS, GitHub, JWT, Google API, DB URIs) and redacts raw values.
3. **Code Security Agent**: Performs static pattern matching for dangerous execution paths (eval, exec, SQL injection, path traversal).
4. **Dependency Agent**: Analyzes `package.json` for known vulnerable package versions.
5. **Gemini Service / AI Agent**: Provides contextual threat analysis, severity scoring, and automated patch creation.
6. **Risk Analysis Agent**: Calculates Security Score (0-100) using weighted vulnerability penalties.
7. **Remediation Agent**: Generates side-by-side git diffs for approved fixes.
8. **Verification Agent**: Re-runs scan logic on remediated code to confirm issue resolution and verify score recovery (e.g. 42 → 91).
