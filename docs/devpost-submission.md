# Devpost Submission Template for All Things Agentic Hackathon

## Project Title
**RepoSentinel – Autonomous AI Security Engineer**

## Tagline
Scan, investigate, remediate, and verify security issues in GitHub repositories using Google Gemini 3.5 and Google ADK Multi-Agent Architecture.

## Category
**Taskmaster** (Build a Complete Asynchronous Background Workflow, Not Just a Chatbot)

---

## Devpost Text Description (Copy & Paste Ready)

### Inspiration
Modern software engineering teams move fast, but security vulnerability triage remains a tedious, manual chore. Hardcoded API keys, SQL injection risks, and vulnerable dependencies slip into production codebases. Chatbots only output conversational text—they don't handle multi-step, background workflows. We built **RepoSentinel** to transform application security auditing into an autonomous, self-healing background system.

### What it does
RepoSentinel is an autonomous AI security engineer that operates beyond simple chat loops:
1. **FIND:** Scans source code and dependency manifests for hardcoded secrets (AWS keys, GitHub tokens, JWTs, DB connection strings) and AST security flaws (SQL injection, unsafe `eval()`, path traversal).
2. **INVESTIGATE:** Uses **Google Gemini 3.5** to analyze redacted code snippets and classify threat severity and context.
3. **FIX:** Generates automated code patches and unified side-by-side git diffs.
4. **HUMAN APPROVAL:** Mandates explicit user approval before creating GitHub branches and opening Pull Requests.
5. **VERIFY:** Re-runs automated security scanners post-remediation and verifies score recovery (e.g. 42 → 91 / 100).

### How we built it
- **AI Agent Framework:** Built on **Google ADK Agent Architecture** with specialized sub-agents: `SupervisorAgent`, `SecretDetectionAgent`, `CodeSecurityAgent`, `DependencyAgent`, `RiskAnalysisAgent`, `RemediationAgent`, and `VerificationAgent`.
- **AI Core:** **Google Gemini 3.5 API** (`gemini-3.5-flash`) for threat classification and patch creation, with **Google Gemma** model fallback (`gemma-2-9b-it`).
- **Google Cloud Infrastructure:** Deployed on **Google Cloud Run** with **Google Firestore** scan state persistence and **Cloud Pub/Sub** asynchronous event messaging.
- **Frontend Dashboard:** React.js, Vite, Tailwind CSS, Axios, and Lucide Icons.

### Challenges we ran into
Ensuring complete secret redaction before transmitting code snippets to AI endpoints to guarantee zero-leakage security, while maintaining precise line numbers and git diff accuracy.

### Accomplishments that we're proud of
Building a 100% functional full-stack application that executes the full `FIND → INVESTIGATE → FIX → VERIFY` security pipeline autonomously in seconds.

### What we learned
How to decouple multi-agent responsibilities cleanly, manage state transitions across background agent passes, and leverage Gemini 3.5 for automated code refactoring.

---

## 📢 Social Media Share Template (Bonus Contribution Points)

Include this post on X, LinkedIn, or Instagram to claim optional bonus points:

> 🚀 Just built **RepoSentinel** for the **#AllThingsAgenticHackathon** sponsored by @GoogleCloud and @Devpost! 🛡️  
>  
> RepoSentinel is an autonomous AI security engineer powered by Gemini 3.5, Google ADK agents, and Cloud Run that automatically detects, investigates, remediates, and verifies security flaws in GitHub repos!  
>  
> Check out the repo & demo here!  
> #AllThingsAgenticHackathon #GoogleCloud #Gemini #AIAgents
