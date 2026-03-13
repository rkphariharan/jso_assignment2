import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const completedTaskId = body.taskId ?? "unknown-task";

  return Response.json({
    status: "ok",
    completedTaskId,
    progressUpdate: {
      completedTasks: 4,
      totalTasks: 7,
      scoreLiftSoFar: "+6"
    },
    nextTask: "Set up GitHub Actions workflow for test and lint checks."
  });
}
