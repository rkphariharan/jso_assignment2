export default function AdminDashboardPage() {
  return (
    <main className="container grid" style={{ gap: 16 }}>
      <section className="panel">
        <span className="pill">Governance & Operations</span>
        <h1>Super Admin Dashboard</h1>
        <p className="muted">
          Audit-first prototype view for model safety, confidence, and
          recommendation performance.
        </p>
      </section>

      <section className="grid grid-2">
        <article className="panel">
          <p className="muted">Recommendation completion rate</p>
          <div className="kpi">72%</div>
        </article>
        <article className="panel">
          <p className="muted">Avg portfolio score lift (14 days)</p>
          <div className="kpi">+11.4</div>
        </article>
        <article className="panel">
          <p className="muted">Low-confidence evaluations</p>
          <div className="kpi">4.8%</div>
        </article>
        <article className="panel">
          <p className="muted">Consultant escalations</p>
          <div className="kpi">19</div>
        </article>
      </section>

      <section className="panel">
        <h3>Audit log sample</h3>
        <ul className="list">
          <li>Model Version: cpea-v0.2.1</li>
          <li>Safety Rule Pack: deterministic-checks-v1</li>
          <li>Decision Trace: README missing + CI absent + stale repo signal</li>
          <li>Override events: 2 consultant overrides this week</li>
        </ul>
      </section>
    </main>
  );
}
