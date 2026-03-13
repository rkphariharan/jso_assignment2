import { evaluatePortfolio } from "@/lib/evaluator";
import { rolePreference, sampleRepos } from "@/lib/mockData";

export default function UserDashboardPage() {
  const result = evaluatePortfolio(sampleRepos, rolePreference);

  return (
    <main className="container grid" style={{ gap: 16 }}>
      <section className="panel">
        <span className="pill">Portfolio Intelligence Panel</span>
        <h1>User Dashboard</h1>
        <p className="muted">Target Role: {rolePreference}</p>
        <div className="score">{result.portfolioScore}/100</div>
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
          <p>
            <strong>Flagship Recommendation:</strong> {result.flagshipProject}
          </p>
        </div>
      </section>

      <section className="panel">
        <h3>Top 3 Priorities for this week</h3>
        <ul className="list">
          {result.nextBestActions.map((action) => (
            <li key={action}>{action}</li>
          ))}
        </ul>
        <p className="muted">Expected Lift: {result.expectedLift}</p>
      </section>

      <section className="panel">
        <h3>Repo Evidence Signals</h3>
        <div className="grid grid-2">
          {sampleRepos.map((repo) => (
            <article key={repo.name} className="panel">
              <h4>{repo.name}</h4>
              <p className="muted">{repo.description}</p>
              <ul className="list">
                <li>Readme: {repo.hasReadme ? "Yes" : "No"}</li>
                <li>Tests: {repo.hasTests ? "Yes" : "No"}</li>
                <li>CI: {repo.hasCi ? "Yes" : "No"}</li>
                <li>Demo: {repo.hasDemo ? "Yes" : "No"}</li>
              </ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
