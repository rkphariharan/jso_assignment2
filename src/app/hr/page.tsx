import { evaluatePortfolio } from "@/lib/evaluator";
import { rolePreference, sampleRepos } from "@/lib/mockData";

export default function HrDashboardPage() {
  const result = evaluatePortfolio(sampleRepos, rolePreference);

  return (
    <main className="container grid" style={{ gap: 16 }}>
      <section className="panel">
        <span className="pill">Consultant Pre-Brief</span>
        <h1>HR Consultant Dashboard</h1>
        <p className="muted">
          Flagship project: <strong>{result.flagshipProject}</strong>
        </p>
      </section>

      <section className="panel grid grid-2">
        <div>
          <h3>Top Risk Signals</h3>
          <ul className="list">
            {result.blockers.map((signal) => (
              <li key={signal}>{signal}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Coaching Focus</h3>
          <ul className="list">
            <li>Select one flagship repo and deepen evidence quality.</li>
            <li>Practice architecture tradeoff story for interviews.</li>
            <li>Convert project work into resume-ready impact bullets.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
