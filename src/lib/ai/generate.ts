import type { z } from "zod";
import type Anthropic from "@anthropic-ai/sdk";
import { db } from "@/db";
import { generations } from "@/db/schema";
import { CLAUDE_SONNET, getClaude, type ClaudeModel } from "./claude";
import { computeClaudeCostUsd } from "./pricing";
import { hashInput } from "./hash";

export type GenerationKind = "copy" | "image" | "ad" | "hook" | "chat";

export type RunTemplateOptions<Schema extends z.ZodTypeAny> = {
  kind: GenerationKind;
  promptVersion: string;
  model?: ClaudeModel;
  maxTokens?: number;
  system: string;
  user: string;
  schema: Schema;
  jsonSchema: Record<string, unknown>;
  logInput: Record<string, unknown>;
  storeId?: string | null;
  userId?: string | null;
};

export type RunTemplateResult<Schema extends z.ZodTypeAny> = {
  output: z.infer<Schema>;
  generationId: string;
  costUsd: number;
  latencyMs: number;
  cacheReadTokens: number;
};

function stripCodeFences(text: string): string {
  const trimmed = text.trim();
  if (!trimmed.startsWith("```")) return trimmed;
  return trimmed
    .replace(/^```(?:json)?\s*\n?/, "")
    .replace(/\n?```\s*$/, "")
    .trim();
}

const UNSUPPORTED_SCHEMA_KEYS = new Set([
  "minLength",
  "maxLength",
  "minimum",
  "maximum",
  "exclusiveMinimum",
  "exclusiveMaximum",
  "multipleOf",
  "minItems",
  "maxItems",
  "minProperties",
  "maxProperties",
  "pattern",
  "uniqueItems",
]);

function sanitizeJsonSchema(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(sanitizeJsonSchema);
  if (node && typeof node === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
      if (UNSUPPORTED_SCHEMA_KEYS.has(key)) continue;
      out[key] = sanitizeJsonSchema(value);
    }
    if (out.type === "object" && out.additionalProperties === undefined) {
      out.additionalProperties = false;
    }
    return out;
  }
  return node;
}

export async function runTemplate<Schema extends z.ZodTypeAny>(
  opts: RunTemplateOptions<Schema>,
): Promise<RunTemplateResult<Schema>> {
  const model: ClaudeModel = opts.model ?? CLAUDE_SONNET;
  const maxTokens = opts.maxTokens ?? 4096;
  const inputHash = hashInput({
    promptVersion: opts.promptVersion,
    model,
    input: opts.logInput,
  });
  const startedAt = Date.now();
  const client = getClaude();

  try {
    const params: Anthropic.MessageCreateParamsNonStreaming & {
      output_config?: { format: { type: "json_schema"; schema: Record<string, unknown> } };
    } = {
      model,
      max_tokens: maxTokens,
      system: [
        {
          type: "text",
          text: opts.system,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: opts.user }],
      output_config: {
        format: {
          type: "json_schema",
          schema: sanitizeJsonSchema(opts.jsonSchema) as Record<string, unknown>,
        },
      },
    };
    const response = await client.messages.create(params);

    const textBlock = response.content.find(
      (b: Anthropic.ContentBlock) => b.type === "text",
    );
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("Claude response contained no text block");
    }

    const jsonText = stripCodeFences(textBlock.text);
    const raw: unknown = JSON.parse(jsonText);
    const parsed = opts.schema.parse(raw) as z.infer<Schema>;

    const latencyMs = Date.now() - startedAt;
    const usage = response.usage;
    const inputTokens = usage?.input_tokens ?? 0;
    const outputTokens = usage?.output_tokens ?? 0;
    const cacheCreationTokens = usage?.cache_creation_input_tokens ?? 0;
    const cacheReadTokens = usage?.cache_read_input_tokens ?? 0;
    const costUsd = computeClaudeCostUsd(model, {
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      cache_creation_input_tokens: cacheCreationTokens,
      cache_read_input_tokens: cacheReadTokens,
    });

    const [gen] = await db
      .insert(generations)
      .values({
        storeId: opts.storeId ?? null,
        userId: opts.userId ?? null,
        kind: opts.kind,
        model,
        promptVersion: opts.promptVersion,
        inputHash,
        input: opts.logInput,
        output: parsed as Record<string, unknown>,
        inputTokens,
        outputTokens,
        cachedTokens: cacheReadTokens,
        costUsd: costUsd.toFixed(6),
        latencyMs,
        success: 1,
      })
      .returning({ id: generations.id });

    return {
      output: parsed,
      generationId: gen.id,
      costUsd,
      latencyMs,
      cacheReadTokens,
    };
  } catch (err) {
    const latencyMs = Date.now() - startedAt;
    const message = err instanceof Error ? err.message : String(err);
    try {
      await db.insert(generations).values({
        storeId: opts.storeId ?? null,
        userId: opts.userId ?? null,
        kind: opts.kind,
        model,
        promptVersion: opts.promptVersion,
        inputHash,
        input: opts.logInput,
        costUsd: "0",
        latencyMs,
        success: 0,
        error: message.slice(0, 1000),
      });
    } catch {}
    throw err;
  }
}
