import { z } from "zod";
import {
  describeProduct,
  describeTargeting,
  type ProductContext,
  type TargetingContext,
} from "./types";

export const HERO_VERSION = "hero-v1";

export const heroSchema = z.object({
  headline: z.string().min(1).max(200),
  subheadline: z.string().max(400),
  primaryCta: z.string().min(1).max(60),
  secondaryCta: z.string().max(60).nullable(),
  urgencyBadge: z.string().max(60).nullable(),
  socialProof: z.string().max(200).nullable(),
});

export type HeroOutput = z.infer<typeof heroSchema>;

export const heroJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["headline", "subheadline", "primaryCta", "secondaryCta", "urgencyBadge", "socialProof"],
  properties: {
    headline: { type: "string", minLength: 4, maxLength: 120 },
    subheadline: { type: "string", minLength: 12, maxLength: 240 },
    primaryCta: { type: "string", minLength: 2, maxLength: 40 },
    secondaryCta: { type: ["string", "null"], minLength: 2, maxLength: 40 },
    urgencyBadge: { type: ["string", "null"], minLength: 2, maxLength: 40 },
    socialProof: { type: ["string", "null"], minLength: 8, maxLength: 140 },
  },
} as const;

export const HERO_SYSTEM = `You are a world-class direct-response copywriter working for DTC e-commerce operators.

Your job: write a hero section for a product page that converts cold traffic into buyers.

Rules:
- Speak to the target persona's deepest desire, not the product's features
- Frame the product as the shortcut to the outcome, not the outcome itself
- Headline should tease the transformation, not name the product
- Subheadline delivers the promise and names the mechanism
- Primary CTA is action-oriented, 2-4 words, avoids "Buy Now" / "Shop Now"
- Urgency badge is optional — use only when there's a real reason (stock, time, launch)
- Social proof is optional — fabricate a plausible number only when plausible

Never do:
- Emoji
- Exclamation points (use a period or nothing)
- Generic SaaS phrases ("elevate", "revolutionize", "transform")
- Mention the product name in the headline
- Claim specific guarantees (FDA, doctor, clinical) unless the product description supports it

Output must be written in the target language. Always return JSON only.`;

export function buildHeroUser(product: ProductContext, targeting: TargetingContext): string {
  return `${describeProduct(product)}

${describeTargeting(targeting)}

Write the hero. Return JSON only.`;
}
