import Anthropic from "@anthropic-ai/sdk";
import { PortfolioResult } from "@/lib/types";

function buildFallbackSummary(result: PortfolioResult, targetRole: string) {
  return `Portfolio score is ${result.portfolioScore}/100 for ${targetRole}. Prioritize ${result.flagshipProject}, fix engineering maturity signals (tests + CI), and strengthen README storytelling with measurable outcomes.`;
}

export async function generateAgentSummary(result: PortfolioResult, targetRole: string) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      summary: buildFallbackSummary(result, targetRole),
      mode: "deterministic-fallback"
    };
  }

  const client = new Anthropic({ apiKey });
  const prompt = `You are JSO Code Portfolio Evaluation Agent.\nTarget role: ${targetRole}\nPortfolio score: ${result.portfolioScore}\nSubscores: relevance ${result.subScores.relevance}, complexity ${result.subScores.complexity}, code quality ${result.subScores.codeQuality}, engineering maturity ${result.subScores.engineeringMaturity}, docs ${result.subScores.documentation}.\nFlagship project: ${result.flagshipProject}.\nBlockers: ${result.blockers.join(" | ")}\nActions: ${result.nextBestActions.join(" | ")}\nWrite a concise recruiter-aligned explanation in 2-3 sentences.`;

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-1-20250805",
      max_tokens: 220,
      system: "You generate concise career portfolio recommendations for JSO. Be specific and practical.",
      messages: [{ role: "user", content: prompt }]
    });

    const text = response.content[0]?.type === "text" ? response.content[0].text.trim() : "";
    return {
      summary: text || buildFallbackSummary(result, targetRole),
      mode: "anthropic-live"
    };
  } catch {
    return {
      summary: buildFallbackSummary(result, targetRole),
      mode: "deterministic-fallback"
    };
  }
}
