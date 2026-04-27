import type { ClaudeModel } from "./claude";

type RateSheet = {
  input: number;
  output: number;
  cacheWrite: number;
  cacheRead: number;
};

const CLAUDE_RATES: Record<ClaudeModel, RateSheet> = {
  "claude-sonnet-4-6": { input: 3, output: 15, cacheWrite: 3.75, cacheRead: 0.3 },
  "claude-opus-4-7": { input: 5, output: 25, cacheWrite: 6.25, cacheRead: 0.5 },
  "claude-haiku-4-5": { input: 1, output: 5, cacheWrite: 1.25, cacheRead: 0.1 },
};

export type TokenUsage = {
  input_tokens?: number;
  output_tokens?: number;
  cache_creation_input_tokens?: number;
  cache_read_input_tokens?: number;
};

export function computeClaudeCostUsd(model: ClaudeModel, usage: TokenUsage): number {
  const rate = CLAUDE_RATES[model];
  const input = (usage.input_tokens ?? 0) * rate.input;
  const output = (usage.output_tokens ?? 0) * rate.output;
  const cacheWrite = (usage.cache_creation_input_tokens ?? 0) * rate.cacheWrite;
  const cacheRead = (usage.cache_read_input_tokens ?? 0) * rate.cacheRead;
  return (input + output + cacheWrite + cacheRead) / 1_000_000;
}

export function formatUsd(value: number, fractionDigits = 6): string {
  return `$${value.toFixed(fractionDigits)}`;
}
