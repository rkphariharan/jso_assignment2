export default function LicensingDashboardPage() {
  const usedScans = 8;
  const quota = 10;
  const remaining = quota - usedScans;

  return (
    <main className="container grid" style={{ gap: 16 }}>
      <section className="panel">
        <span className="pill">Licensing</span>
        <h1>Plan Usage Dashboard</h1>
        <p className="muted">
          Transparent tracking for advanced portfolio evaluations and exports.
        </p>
      </section>

      <section className="panel grid grid-2">
        <div>
          <p className="muted">Advanced re-evaluations used</p>
          <div className="kpi">
            {usedScans}/{quota}
          </div>
        </div>
        <div>
          <p className="muted">Remaining this month</p>
          <div className="kpi">{remaining}</div>
        </div>
      </section>

      <section className="panel">
        <h3>Upgrade value preview</h3>
        <ul className="list">
          <li>Monthly re-scoring with trend lines</li>
          <li>Recruiter-view export PDF summary</li>
          <li>Extended consultant handoff briefing templates</li>
        </ul>
      </section>
    </main>
  );
}
