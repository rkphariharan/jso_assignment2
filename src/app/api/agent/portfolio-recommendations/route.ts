import { evaluatePortfolio } from "@/lib/evaluator";
import { recommendationBacklog, rolePreference, sampleRepos } from "@/lib/mockData";

export async function GET() {
  const result = evaluatePortfolio(sampleRepos, rolePreference);

  return Response.json({
    generatedAt: new Date().toISOString(),
    topPriorities: result.nextBestActions,
    backlog: recommendationBacklog,
    rationale: "Prioritized by impact on engineering maturity and recruiter scanability.",
    expectedLift: result.expectedLift
  });
}
