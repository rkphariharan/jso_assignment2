"use client";

import { FormEvent, useMemo, useState } from "react";

type EvalResponse = {
  portfolioScore: number;
  subScores: {
    relevance: number;
    complexity: number;
    codeQuality: number;
    engineeringMaturity: number;
    documentation: number;
  };
  blockers: string[];
  flagshipProject: string;
  nextBestActions: string[];
  expectedLift: string;
  source: string;
  explanationMode: string;
  agentSummary: string;
  repos: Array<{
    name: string;
    description: string;
    hasReadme: boolean;
    hasTests: boolean;
    hasCi: boolean;
    hasDemo: boolean;
    updatedDaysAgo: number;
    stars: number;
  }>;
};

const initialRepos = [
  "https://github.com/vercel/next.js",
  "https://github.com/facebook/react"
].join("\n");

export default function UserDashboardPage() {
  const [userId, setUserId] = useState("demo-user");
  const [targetRole, setTargetRole] = useState("Software Developer");
  const [repoInput, setRepoInput] = useState(initialRepos);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<EvalResponse | null>(null);
  const [taskMessage, setTaskMessage] = useState("");

  const repoUrls = useMemo(
    () => repoInput.split(/\r?\n|,/).map((value) => value.trim()).filter(Boolean),
    [repoInput]
  );

  async function runAgent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/agent/evaluate-portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, targetRole, repoUrls })
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Agent evaluation failed");
      }
      setResult(payload);
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function completeFirstTask() {
    if (!result?.nextBestActions?.length) {
      return;
    }
    const response = await fetch("/api/agent/complete-task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId: "priority-1" })
    });
    const payload = await response.json();
    setTaskMessage(`Task updated: ${payload.nextTask}`);
  }

  async function escalateConsultant() {
    const response = await fetch("/api/agent/escalate-consultant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: "Need senior consultant review for final interview narrative." })
    });
    const payload = await response.json();
    setTaskMessage(`Escalated: ${payload.prebrief.coachingFocus[0]}`);
  }

  return (
    <main className="container grid" style={{ gap: 16 }}>
      <section className="panel">
        <span className="pill">Live CPEA Agent</span>
        <h1>User Dashboard</h1>
        <p className="muted">Run real-time portfolio analysis from GitHub links.</p>
      </section>

      <section className="panel">
        <h3>Run Evaluation</h3>
        <form className="grid" style={{ gap: 12 }} onSubmit={runAgent}>
          <input
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            placeholder="User ID"
            className="field"
          />
          <input
            value={targetRole}
            onChange={(event) => setTargetRole(event.target.value)}
            placeholder="Target role"
            className="field"
          />
          <textarea
            value={repoInput}
            onChange={(event) => setRepoInput(event.target.value)}
            rows={5}
            placeholder="One GitHub URL per line"
            className="field"
          />
          <button disabled={loading} className="btn" type="submit">
            {loading ? "Running Agent..." : "Run Portfolio Agent"}
          </button>
        </form>
        {error ? <p style={{ color: "#b91c1c" }}>{error}</p> : null}
      </section>

      {result ? (
        <>
          <section className="panel grid grid-2">
            <div>
              <p className="muted">Portfolio Score</p>
              <div className="score">{result.portfolioScore}/100</div>
              <p className="muted">Source: {result.source}</p>
              <p className="muted">Mode: {result.explanationMode}</p>
            </div>
            <div>
              <h3>Flagship Project</h3>
              <p>{result.flagshipProject}</p>
              <p className="muted">Expected lift: {result.expectedLift}</p>
              <p>{result.agentSummary}</p>
            </div>
          </section>

          <section className="panel grid grid-2">
            <div>
              <h3>Sub-scores</h3>
              <ul className="list">
                <li>Relevance: {result.subScores.relevance}</li>
                <li>Complexity: {result.subScores.complexity}</li>
                <li>Code Quality: {result.subScores.codeQuality}</li>
                <li>Engineering Maturity: {result.subScores.engineeringMaturity}</li>
                <li>Documentation: {result.subScores.documentation}</li>
              </ul>
            </div>
            <div>
              <h3>Top Blockers</h3>
              <ul className="list">
                {result.blockers.map((blocker) => (
                  <li key={blocker}>{blocker}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="panel">
            <h3>Next Best Actions</h3>
            <ul className="list">
              {result.nextBestActions.map((action) => (
                <li key={action}>{action}</li>
              ))}
            </ul>
            <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
              <button className="btn" type="button" onClick={completeFirstTask}>Mark Priority 1 Complete</button>
              <button className="btn" type="button" onClick={escalateConsultant}>Escalate to Consultant</button>
            </div>
            {taskMessage ? <p className="muted">{taskMessage}</p> : null}
          </section>

          <section className="panel">
            <h3>Live Repo Signals ({repoUrls.length} links submitted)</h3>
            <div className="grid grid-2">
              {result.repos.map((repo) => (
                <article className="panel" key={repo.name}>
                  <h4>{repo.name}</h4>
                  <p className="muted">{repo.description}</p>
                  <ul className="list">
                    <li>Stars: {repo.stars}</li>
                    <li>Updated: {repo.updatedDaysAgo} days ago</li>
                    <li>README: {repo.hasReadme ? "Yes" : "No"}</li>
                    <li>Tests: {repo.hasTests ? "Yes" : "No"}</li>
                    <li>CI: {repo.hasCi ? "Yes" : "No"}</li>
                    <li>Demo: {repo.hasDemo ? "Yes" : "No"}</li>
                  </ul>
                </article>
              ))}
            </div>
          </section>
        </>
      ) : null}
    </main>
  );
}
