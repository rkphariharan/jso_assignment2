import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));

  return Response.json({
    status: "escalated",
    reason: body.reason ?? "Low confidence score with ambiguous ownership signals",
    prebrief: {
      coachingFocus: [
        "Select one flagship project and deepen evidence signals",
        "Create interview narrative around architecture and tradeoffs",
        "Convert repo outcomes to resume-ready bullet points"
      ],
      riskSignals: ["No CI workflow", "No test baseline", "Unclear setup steps"]
    }
  });
}
