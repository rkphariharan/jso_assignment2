export default function HomePage() {
  return (
    <main className="container grid" style={{ gap: 20 }}>
      <section className="panel">
        <span className="pill">Assignment 2 Prototype</span>
        <h1>Code Portfolio Evaluation Agent</h1>
        <p className="muted">
          Deploy-ready Next.js prototype for JSO Phase2 with 4 dashboards and
          agent APIs for portfolio scoring, recommendations, task completion, and
          consultant escalation.
        </p>
      </section>

      <section className="panel grid grid-2">
        <div>
          <h3>Core Dashboards</h3>
          <ul className="list">
            <li>User Portfolio Intelligence Panel</li>
            <li>HR Consultant Pre-Brief View</li>
            <li>Super Admin Governance & Audit KPIs</li>
            <li>Licensing Usage and Quota View</li>
          </ul>
        </div>
        <div>
          <h3>Prototype APIs</h3>
          <ul className="list">
            <li>POST /api/agent/evaluate-portfolio</li>
            <li>GET /api/agent/portfolio-recommendations</li>
            <li>POST /api/agent/complete-task</li>
            <li>POST /api/agent/escalate-consultant</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
