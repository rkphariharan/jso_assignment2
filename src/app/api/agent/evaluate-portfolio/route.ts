import { NextRequest } from "next/server";
import { evaluatePortfolio } from "@/lib/evaluator";
import { rolePreference, sampleRepos } from "@/lib/mockData";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const repos = Array.isArray(body.repoUrls) && body.repoUrls.length > 0 ? sampleRepos : sampleRepos;
  const targetRole = typeof body.targetRole === "string" ? body.targetRole : rolePreference;
  const result = evaluatePortfolio(repos, targetRole);

  return Response.json({
    userId: body.userId ?? "demo-user",
    targetRole,
    evaluatedRepoCount: repos.length,
    ...result,
    explanationMode: "deterministic-signals-plus-llm-reasoning-ready"
  });
}
