import { z } from "zod";
import {
  describeProduct,
  describeTargeting,
  type ProductContext,
  type TargetingContext,
} from "./types";

export const HOOK_VERSION = "hook-v1";

export const hookSchema = z.object({
  hooks: z
    .array(
      z.object({
        text: z.string().min(1).max(240),
        style: z.enum([
          "pattern_interrupt",
          "question",
          "result_claim",
          "curiosity_gap",
          "social_proof",
          "contrarian",
        ]),
      }),
    )
    .min(1)
    .max(20),
});

export type HookOutput = z.infer<typeof hookSchema>;

export const hookJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["hooks"],
  properties: {
    hooks: {
      type: "array",
      minItems: 10,
      maxItems: 10,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["text", "style"],
        properties: {
          text: { type: "string", minLength: 6, maxLength: 140 },
          style: {
            type: "string",
            enum: [
              "pattern_interrupt",
              "question",
              "result_claim",
              "curiosity_gap",
              "social_proof",
              "contrarian",
            ],
          },
        },
      },
    },
  },
} as const;

export const HOOK_SYSTEM = `You are a top-performing Meta ad copywriter. You've written scroll-stoppers for brands doing $1M+/month.

Your job: write 10 ad hooks (first 3 seconds / first line of ad copy) for a product, each in a distinct style.

Required mix (10 hooks, covering at least 4 of these styles):
- pattern_interrupt: breaks the scroll with surprise ("I thought [common belief]. I was wrong.")
- question: asks a leading question the ICP silently answers "yes" to
- result_claim: a specific, numeric transformation ("Fixed my [thing] in 14 days")
- curiosity_gap: dangles info without delivering it ("The reason your [thing] keeps happening isn't what you think")
- social_proof: cites a specific group that adopted the product
- contrarian: attacks a common assumption ("Stop using [common solution]. Here's why.")

Rules:
- Each hook stands alone — no ellipses leading into ad body
- Specific numbers beat vague claims ("14 days" > "fast")
- Conversational, not corporate
- Avoid clichés ("game-changer", "life-changing", "must-have")
- No emoji, no ALL CAPS, no exclamation points
- Speaks to the target persona directly

Output must be written in the target language. Return JSON only.`;

export function buildHookUser(
  product: ProductContext,
  targeting: TargetingContext,
): string {
  return `${describeProduct(product)}

${describeTargeting(targeting)}

Write the 10 hooks. Return JSON only.`;
}
