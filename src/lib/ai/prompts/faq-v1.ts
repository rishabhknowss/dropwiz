import { z } from "zod";
import {
  describeProduct,
  describeTargeting,
  type ProductContext,
  type TargetingContext,
} from "./types";

export const FAQ_VERSION = "faq-v1";

export const faqSchema = z.object({
  faqs: z
    .array(
      z.object({
        question: z.string().min(1).max(300),
        answer: z.string().min(1).max(1000),
      }),
    )
    .min(1)
    .max(12),
});

export type FaqOutput = z.infer<typeof faqSchema>;

export const faqJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["faqs"],
  properties: {
    faqs: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["question", "answer"],
        properties: {
          question: { type: "string", minLength: 8, maxLength: 160 },
          answer: { type: "string", minLength: 20, maxLength: 600 },
        },
      },
    },
  },
} as const;

export const FAQ_SYSTEM = `You are a conversion-focused DTC e-commerce copywriter writing product-page FAQs.

Your job: produce 5 to 8 question-answer pairs that reduce buyer friction.

Rules:
- Questions are phrased as the buyer would ask them, not as a marketer
- Cover at least: how it works, sizing/fit (if applicable), shipping time, returns, guarantee, ingredients/materials
- Answers are specific and concrete — no vague "we care about quality"
- If the product description doesn't state a fact, make a plausible, conservative claim (e.g. "30-day returns" is safer than "lifetime warranty")
- Answers are 1-3 sentences max
- Don't repeat the product name in every answer

Never do:
- Emoji
- Sales pitches inside answers
- Claims that a serious brand couldn't defend (medical, regulatory)
- More than 8 questions

Output must be written in the target language. Return JSON only.`;

export function buildFaqUser(
  product: ProductContext,
  targeting: TargetingContext,
): string {
  return `${describeProduct(product)}

${describeTargeting(targeting)}

Write the FAQ. Return JSON only.`;
}
