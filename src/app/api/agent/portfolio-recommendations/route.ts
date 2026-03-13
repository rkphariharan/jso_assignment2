import { evaluatePortfolio } from "@/lib/evaluator";
import { collectRepoSignals } from "@/lib/github";
import { recommendationBacklog, rolePreference, sampleRepos } from "@/lib/mockData";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetRole = searchParams.get("targetRole")?.trim() || rolePreference;
  const repoUrls = searchParams
    .getAll("repoUrl")
    .map((value) => value.trim())
    .filter(Boolean);

  const liveRepos = repoUrls.length > 0 ? await collectRepoSignals(repoUrls) : [];
  const repos = liveRepos.length > 0 ? liveRepos : sampleRepos;
  const result = evaluatePortfolio(repos, targetRole);

  return Response.json({
    generatedAt: new Date().toISOString(),
    source: liveRepos.length > 0 ? "live-github" : "demo-fallback",
    topPriorities: result.nextBestActions,
    backlog: recommendationBacklog,
    rationale: "Prioritized by impact on engineering maturity and recruiter scanability.",
    expectedLift: result.expectedLift
  });
}
