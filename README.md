# JSO Assignment 2 – Code Portfolio Evaluation Agent Prototype

This repository contains a deploy-ready **Next.js prototype** for Assignment 2.

## What is implemented

- 4 dashboards:
	- User Dashboard (`/user`)
	- HR Consultant Dashboard (`/hr`)
	- Super Admin Dashboard (`/admin`)
	- Licensing Dashboard (`/licensing`)
- Portfolio Intelligence scorecard with sub-scores:
	- Relevance
	- Complexity
	- Code Quality
	- Engineering Maturity
	- Documentation/Storytelling
- Agent API endpoints:
	- `POST /api/agent/evaluate-portfolio`
	- `GET /api/agent/portfolio-recommendations`
	- `POST /api/agent/complete-task`
	- `POST /api/agent/escalate-consultant`

## Tech stack

- Next.js 14 (App Router)
- React 18
- TypeScript

## Run locally

```powershell
Set-Location "C:\Users\h19\OneDrive - Capgemini\Desktop\vscode\jso_assignment2"
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build check

```powershell
Set-Location "C:\Users\h19\OneDrive - Capgemini\Desktop\vscode\jso_assignment2"
npm run build
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import repository in Vercel.
3. Framework preset: **Next.js**.
4. Build command: `npm run build`
5. Output: `.next` (default for Next.js)

No environment variables are required for this prototype version.