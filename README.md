# JSO Assignment 2 – Code Portfolio Evaluation Agent (Live Prototype)

This repo implements the **Code Portfolio Evaluation Agent** as a live Next.js app (Assignment 2), aligned with the Assignment 1 deployment style.

## What is live now

- Interactive `User Dashboard` at `/user` with:
  - Target role + GitHub repo URL input
  - **Run Portfolio Agent** action
  - Real-time scorecard + blockers + top actions
  - Task completion and consultant escalation actions
- Live backend orchestration:
  - GitHub repo ingestion from submitted URLs
  - Deterministic scoring engine (relevance, complexity, code quality, engineering maturity, documentation)
  - Optional Anthropic summary generation with deterministic fallback

## API routes

- `POST /api/agent/evaluate-portfolio`
- `GET /api/agent/portfolio-recommendations`
- `POST /api/agent/complete-task`
- `POST /api/agent/escalate-consultant`

## Tech stack

- Next.js 14 (App Router)
- TypeScript
- React 18
- `@anthropic-ai/sdk` (optional live model summary)

## Environment variables (optional)

Create `.env.local` only if you want model-backed + higher-rate GitHub analysis:

```env
ANTHROPIC_API_KEY=your_key_here
GITHUB_TOKEN=optional_github_token
```

If not provided, the app still works with deterministic fallback behavior.

## Run locally

```powershell
Set-Location "C:\Users\h19\OneDrive - Capgemini\Desktop\vscode\jso_assignment2"
npm install
npm run dev
```

Open `http://localhost:3000/user`.

## Build check

```powershell
Set-Location "C:\Users\h19\OneDrive - Capgemini\Desktop\vscode\jso_assignment2"
npm run build
```

## Deploy to Vercel

- `vercel.json` is included (same style as Assignment 1).
- Import the repo in Vercel and deploy with defaults.