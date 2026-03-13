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

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const initialRepos = ["https://github.com/vercel/next.js", "https://github.com/facebook/react"].join("\n");

export default function UserDashboardPage() {
  const [userId, setUserId] = useState("demo-user");
  const [targetRole, setTargetRole] = useState("Software Developer");
  const [repoInput, setRepoInput] = useState(initialRepos);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<EvalResponse | null>(null);
  const [taskMessage, setTaskMessage] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMode, setChatMode] = useState("not-started");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "I’m your CPEA agent. Run evaluation and I’ll guide your top improvements." }
  ]);

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
      setChatMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: `Analysis complete. Flagship repo: ${payload.flagshipProject}. Ask me for a 7-day execution plan.`
        }
      ]);
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

  async function sendChatMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = chatInput.trim();
    if (!message) {
      return;
    }

    const nextMessages: ChatMessage[] = [...chatMessages, { role: "user", content: message }];
    setChatMessages(nextMessages);
    setChatInput("");
    setChatLoading(true);

    try {
      const response = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: message,
          messages: nextMessages,
          targetRole,
          portfolioScore: result?.portfolioScore,
          blockers: result?.blockers ?? [],
          actions: result?.nextBestActions ?? []
        })
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Agent chat failed");
      }

      setChatMode(payload.mode ?? "unknown");
      setChatMessages((current) => [...current, { role: "assistant", content: payload.reply }]);
    } catch (caughtError) {
      const errorMessage = caughtError instanceof Error ? caughtError.message : "Chat failed";
      setChatMessages((current) => [
        ...current,
        { role: "assistant", content: `I hit an issue: ${errorMessage}. Please retry.` }
      ]);
    } finally {
      setChatLoading(false);
    }
  }

  return (
    <main className="container cpea-layout">
      <section className="cpea-main">
        <article className="panel hero-card">
          <span className="pill">User Dashboard</span>
          <h1>Code Portfolio Evaluation Agent</h1>
          <p className="muted">
            Evaluate GitHub repositories for code quality, project complexity, and recruiter readiness.
          </p>
        </article>

        <article className="panel">
          <h3>Portfolio Input</h3>
          <form className="grid" style={{ gap: 10 }} onSubmit={runAgent}>
            <div className="input-row">
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
            </div>
            <textarea
              value={repoInput}
              onChange={(event) => setRepoInput(event.target.value)}
              rows={5}
              placeholder="Paste GitHub URLs (one per line)"
              className="field"
            />
            <button disabled={loading} className="btn" type="submit">
              {loading ? "Evaluating..." : "Run Agent Evaluation"}
            </button>
            {error ? <p className="error-text">{error}</p> : null}
          </form>
        </article>

        {result ? (
          <>
            <article className="metrics-grid">
              <div className="metric-card">
                <p className="muted">Portfolio Score</p>
                <div className="score">{result.portfolioScore}</div>
              </div>
              <div className="metric-card">
                <p className="muted">Flagship Repo</p>
                <h3>{result.flagshipProject}</h3>
                <p className="muted">{result.expectedLift}</p>
              </div>
              <div className="metric-card">
                <p className="muted">Agent Mode</p>
                <h3>{result.explanationMode}</h3>
                <p className="muted">Source: {result.source}</p>
              </div>
            </article>

            <article className="panel">
              <h3>Agent Insight</h3>
              <p>{result.agentSummary}</p>
            </article>

            <article className="panel grid grid-2">
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
            </article>

            <article className="panel">
              <h3>Next Best Actions</h3>
              <ul className="list">
                {result.nextBestActions.map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ul>
              <div className="action-row">
                <button className="btn" type="button" onClick={completeFirstTask}>
                  Mark Priority 1 Complete
                </button>
                <button className="btn btn-secondary" type="button" onClick={escalateConsultant}>
                  Escalate to Consultant
                </button>
              </div>
              {taskMessage ? <p className="muted">{taskMessage}</p> : null}
            </article>

            <article className="panel">
              <h3>Repository Signals</h3>
              <div className="repo-grid">
                {result.repos.map((repo) => (
                  <div className="repo-card" key={repo.name}>
                    <h4>{repo.name}</h4>
                    <p className="muted">{repo.description}</p>
                    <div className="repo-tags">
                      <span>⭐ {repo.stars}</span>
                      <span>Updated {repo.updatedDaysAgo}d</span>
                      <span>README {repo.hasReadme ? "Yes" : "No"}</span>
                      <span>Tests {repo.hasTests ? "Yes" : "No"}</span>
                      <span>CI {repo.hasCi ? "Yes" : "No"}</span>
                      <span>Demo {repo.hasDemo ? "Yes" : "No"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </>
        ) : null}
      </section>

      <aside className="cpea-chat panel">
        <h3>Agent Chat</h3>
        <p className="muted">Ask for weekly plans, repo prioritization, and interview talking points.</p>
        <p className="muted">Chat mode: {chatMode}</p>

        <div className="chat-window">
          {chatMessages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`chat-bubble ${message.role}`}>
              <strong>{message.role === "assistant" ? "Agent" : "You"}: </strong>
              {message.content}
            </div>
          ))}
        </div>

        <form onSubmit={sendChatMessage} className="chat-form">
          <input
            className="field"
            value={chatInput}
            onChange={(event) => setChatInput(event.target.value)}
            placeholder="Ask your agent..."
          />
          <button className="btn" type="submit" disabled={chatLoading}>
            {chatLoading ? "Thinking..." : "Send"}
          </button>
        </form>
      </aside>
    </main>
  );
}
