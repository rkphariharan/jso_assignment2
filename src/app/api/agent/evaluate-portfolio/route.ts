import { NextRequest } from "next/server";
import { generateAgentSummary } from "@/lib/agentSummary";
import { evaluatePortfolio } from "@/lib/evaluator";
import { collectRepoSignals } from "@/lib/github";
import { rolePreference, sampleRepos } from "@/lib/mockData";

export async function POST(request: NextRequest) {
  try {
    const body: { userId?: string; targetRole?: string; repoUrls?: string[] | string } = await request
      .json()
      .catch(() => ({}));
    const repoUrls = Array.isArray(body.repoUrls)
      ? body.repoUrls.map(String).filter(Boolean)
      : typeof body.repoUrls === "string"
        ? body.repoUrls
            .split(/\r?\n|,/) 
          .map((value: string) => value.trim())
            .filter(Boolean)
        : [];

    const targetRole = typeof body.targetRole === "string" && body.targetRole.trim().length > 0
      ? body.targetRole.trim()
      : rolePreference;

    const liveRepos = repoUrls.length > 0 ? await collectRepoSignals(repoUrls) : [];
    const repos = liveRepos.length > 0 ? liveRepos : sampleRepos;
    const result = evaluatePortfolio(repos, targetRole);
    const summary = await generateAgentSummary(result, targetRole);

    return Response.json({
      userId: body.userId ?? "demo-user",
      targetRole,
      evaluatedRepoCount: repos.length,
      source: liveRepos.length > 0 ? "live-github" : "demo-fallback",
      agentSummary: summary.summary,
      explanationMode: summary.mode,
      repos,
      ...result
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Evaluation failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
