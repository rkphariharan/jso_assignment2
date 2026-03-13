import { PortfolioResult, RepoInput, SubScores } from "@/lib/types";

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function scoreRelevance(repo: RepoInput, targetRole: string) {
  const normalized = targetRole.toLowerCase();
  const matchesRole = repo.roleTags.some((tag) => normalized.includes(tag));
  const recencyBoost = repo.updatedDaysAgo <= 30 ? 10 : repo.updatedDaysAgo <= 90 ? 5 : 0;
  return Math.min(100, (matchesRole ? 70 : 45) + recencyBoost + Math.min(repo.stars, 20));
}

function scoreComplexity(repo: RepoInput) {
  const base = repo.hasDemo ? 55 : 40;
  const starBoost = Math.min(repo.stars * 1.6, 25);
  const freshness = repo.updatedDaysAgo <= 60 ? 15 : 5;
  return Math.min(100, base + starBoost + freshness);
}

function scoreCodeQuality(repo: RepoInput) {
  const readme = repo.hasReadme ? 35 : 10;
  const tests = repo.hasTests ? 35 : 5;
  const ci = repo.hasCi ? 20 : 5;
  return Math.min(100, readme + tests + ci + 10);
}

function scoreEngineeringMaturity(repo: RepoInput) {
  const tests = repo.hasTests ? 40 : 10;
  const ci = repo.hasCi ? 35 : 10;
  const runbook = repo.hasReadme ? 25 : 10;
  return Math.min(100, tests + ci + runbook);
}

function scoreDocumentation(repo: RepoInput) {
  const readme = repo.hasReadme ? 70 : 20;
  const demo = repo.hasDemo ? 20 : 0;
  const updateSignal = repo.updatedDaysAgo <= 45 ? 10 : 4;
  return Math.min(100, readme + demo + updateSignal);
}

export function evaluatePortfolio(repos: RepoInput[], targetRole: string): PortfolioResult {
  const relevanceScores = repos.map((repo) => scoreRelevance(repo, targetRole));
  const complexityScores = repos.map((repo) => scoreComplexity(repo));
  const qualityScores = repos.map((repo) => scoreCodeQuality(repo));
  const maturityScores = repos.map((repo) => scoreEngineeringMaturity(repo));
  const docsScores = repos.map((repo) => scoreDocumentation(repo));

  const subScores: SubScores = {
    relevance: Math.round(average(relevanceScores)),
    complexity: Math.round(average(complexityScores)),
    codeQuality: Math.round(average(qualityScores)),
    engineeringMaturity: Math.round(average(maturityScores)),
    documentation: Math.round(average(docsScores))
  };

  const weighted =
    subScores.relevance * 0.24 +
    subScores.complexity * 0.18 +
    subScores.codeQuality * 0.2 +
    subScores.engineeringMaturity * 0.22 +
    subScores.documentation * 0.16;

  const flagship = [...repos].sort((a, b) => {
    const aScore = scoreRelevance(a, targetRole) + scoreComplexity(a) + a.stars;
    const bScore = scoreRelevance(b, targetRole) + scoreComplexity(b) + b.stars;
    return bScore - aScore;
  })[0];

  const blockers: string[] = [];
  if (subScores.engineeringMaturity < 70) {
    blockers.push("Limited tests and CI signals reduce recruiter confidence.");
  }
  if (subScores.documentation < 75) {
    blockers.push("README storytelling and setup clarity are inconsistent across repos.");
  }
  if (subScores.complexity < 70) {
    blockers.push("Project depth appears demo-heavy versus production-oriented scope.");
  }

  const nextBestActions = [
    `Improve ${flagship.name} README with problem, architecture, and measurable outcomes.`,
    "Add test baseline for critical flows and publish test command output.",
    "Configure GitHub Actions for lint + test to prove engineering maturity."
  ];

  return {
    portfolioScore: Math.round(weighted),
    subScores,
    flagshipProject: flagship.name,
    blockers,
    nextBestActions,
    expectedLift: "+10 to +15 points over 1-2 weeks"
  };
}
