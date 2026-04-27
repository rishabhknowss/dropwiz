import Anthropic from "@anthropic-ai/sdk";
import { env } from "@/env";

const globalForClaude = globalThis as unknown as { claude?: Anthropic };

export function getClaude(): Anthropic {
  if (!env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }
  if (globalForClaude.claude) return globalForClaude.claude;
  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  if (env.NODE_ENV !== "production") globalForClaude.claude = client;
  return client;
}

export const CLAUDE_SONNET = "claude-sonnet-4-6" as const;
export const CLAUDE_OPUS = "claude-opus-4-7" as const;
export const CLAUDE_HAIKU = "claude-haiku-4-5" as const;

export type ClaudeModel =
  | typeof CLAUDE_SONNET
  | typeof CLAUDE_OPUS
  | typeof CLAUDE_HAIKU;
