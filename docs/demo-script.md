# RepoSentinel - All Things Agentic Hackathon Demo Script (3-4 Minutes)

> **Mandatory Rule Requirement:** Video must demonstrate backend running on Google Cloud (Google Cloud Console, Cloud Run dashboard, Vertex AI logs, URL of .run).

---

## 0:00 - Problem & Solution Overview
"Hi everyone! Modern software teams push code fast, but hardcoded secrets, SQL injection, and vulnerable dependencies routinely sneak into production repositories. Chatbots don't fix code in background workflows—they just output text.

Meet **RepoSentinel** – an autonomous AI security engineer built with **Gemini 3.5**, **Google ADK Agent Architecture**, and deployed on **Google Cloud Run**. It doesn't just find security problems—it investigates them, fixes them, and verifies the fix autonomously."

## 0:45 - Google Cloud Infrastructure Proof
*(Screen switch to Google Cloud Console)*
"Here in our **Google Cloud Console**, you can see our backend deployed live on **Google Cloud Run** (`reposentinel-backend.run.app`), connected to **Google Firestore** and **Cloud Pub/Sub** for state persistence and asynchronous event streaming."

## 1:15 - Live Agent Execution & Mission HUD
*(Screen switch to RepoSentinel Dashboard)*
"Let's launch a security scan on our demo repository.
1. We click **START SECURITY SCAN**.
2. Notice our **Autonomous Security Mission HUD** activates.
3. The **Supervisor Agent** coordinates 6 specialized agents:
   - **Secret Detection Agent:** Scans source files with zero-leakage redaction.
   - **Code Security Agent:** Analyzes SQL injection and `eval()` execution paths.
   - **Dependency Agent:** Audits `package.json`.
   - **Risk Analysis Agent:** Calculates repository score."

## 2:15 - AI Threat Investigation & Remediation
"The scan completes!
- Initial Security Score: **42 / 100**.
- We inspect the Critical finding: AWS key exposed in `config.js`.
- Click **Generate Fix** → RepoSentinel invokes **Gemini 3.5** to generate a safe code patch replacing credentials with `process.env.AWS_KEY`.
- A clean side-by-side Git diff is presented."

## 3:00 - Human Approval, PR Creation & Verification
"RepoSentinel mandates human approval before modifying code:
1. We click **Approve Fix** → **Create Pull Request**.
2. RepoSentinel commits and opens a GitHub PR automatically.
3. The **Verification Agent** re-scans the remediated codebase:
   - Secret Removed: ✓
   - Syntax Valid: ✓
   - Security Pass: ✓
- Security Score jumps from **42 → 91 / 100**!"

## 3:40 - Closing Statement
"RepoSentinel proves the power of autonomous Google Cloud AI Agents. It investigates, fixes, and verifies security threats end-to-end. Thank you!"
