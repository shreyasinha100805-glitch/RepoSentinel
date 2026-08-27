# RepoSentinel Security & Safety Guarantees

## 1. Zero Secret Leakage Policy
- All secret scanners perform regex matching and immediately replace raw secret strings with redacted placeholders (`AKIA****************`, `ghp_****************`) BEFORE storing findings or transmitting code snippets to Gemini AI APIs.
- Full raw secrets are NEVER logged to stdout, persisted in Firestore, or stored in browser state.

## 2. Human-in-the-Loop PR Approval
- RepoSentinel will NEVER automatically alter external GitHub repositories or push commits autonomously without explicit user confirmation.
- The workflow mandates `User Approval` → `Branch Creation` → `Commit Fix` → `Create Pull Request`.

## 3. Sandboxed Demo Mode
- When `DEMO_MODE=true`, all GitHub API calls, Firestore reads/writes, and Pub/Sub events are safely simulated in-memory using synthetic demo files.
