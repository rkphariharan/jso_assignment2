import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function buildFallbackReply(input: {
  userMessage: string;
  targetRole: string;
  portfolioScore?: number;
  blockers?: string[];
  actions?: string[];
}) {
  const actions = input.actions?.slice(0, 2).join("; ") || "add tests and CI, then improve README storytelling";
  const blockers = input.blockers?.slice(0, 2).join("; ") || "engineering maturity and unclear recruiter-facing narrative";

  return `For ${input.targetRole}, your main blockers are ${blockers}. Immediate next actions: ${actions}. If you share one flagship repo architecture decision, I can generate interview-ready talking points.`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const messages = Array.isArray(body.messages) ? (body.messages as ChatMessage[]) : [];
    const userMessage = typeof body.userMessage === "string" ? body.userMessage : "";
    const targetRole = typeof body.targetRole === "string" && body.targetRole.trim() ? body.targetRole : "Software Developer";
    const portfolioScore = typeof body.portfolioScore === "number" ? body.portfolioScore : undefined;
    const blockers = Array.isArray(body.blockers) ? body.blockers.map(String) : [];
    const actions = Array.isArray(body.actions) ? body.actions.map(String) : [];

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json({
        reply: buildFallbackReply({ userMessage, targetRole, portfolioScore, blockers, actions }),
        mode: "deterministic-fallback"
      });
    }

    const client = new Anthropic({ apiKey });
    const contextHeader = `JSO CPEA Context:\n- Target role: ${targetRole}\n- Portfolio score: ${portfolioScore ?? "unknown"}\n- Top blockers: ${blockers.join(" | ") || "unknown"}\n- Top actions: ${actions.join(" | ") || "unknown"}`;

    const conversation = messages
      .slice(-8)
      .map((message) => ({ role: message.role, content: message.content }))
      .filter((message) => message.content?.trim());

    const response = await client.messages.create({
      model: "claude-opus-4-1-20250805",
      max_tokens: 320,
      system:
        "You are the JSO Code Portfolio Evaluation Agent. Be concise, actionable, and recruiter-aligned. Give next best actions and explain trade-offs. Avoid generic advice.",
      messages: [
        { role: "user", content: contextHeader },
        ...conversation,
        { role: "user", content: userMessage || "Give my next best action." }
      ]
    });

    const reply = response.content[0]?.type === "text" ? response.content[0].text.trim() : "";

    return Response.json({
      reply: reply || buildFallbackReply({ userMessage, targetRole, portfolioScore, blockers, actions }),
      mode: "anthropic-live"
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Chat request failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
