import { z } from "zod";
import {
  describeProduct,
  describeTargeting,
  type ProductContext,
  type TargetingContext,
} from "./types";

export const BUNDLE_VERSION = "bundle-v1";

export const bundleSchema = z.object({
  bundles: z
    .array(
      z.object({
        name: z.string().min(1).max(60),
        description: z.string().max(300),
        quantity: z.number().int().min(1).max(20),
        discountPercent: z.number().int().min(0).max(90),
        badge: z.string().max(40).nullable(),
        savings: z.string().max(60),
        recommended: z.boolean(),
      }),
    )
    .min(1)
    .max(6),
});

export type BundleOutput = z.infer<typeof bundleSchema>;

export const bundleJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["bundles"],
  properties: {
    bundles: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "name",
          "description",
          "quantity",
          "discountPercent",
          "badge",
          "savings",
          "recommended",
        ],
        properties: {
          name: { type: "string", minLength: 3, maxLength: 40 },
          description: { type: "string", minLength: 8, maxLength: 200 },
          quantity: { type: "integer", minimum: 1, maximum: 12 },
          discountPercent: { type: "integer", minimum: 0, maximum: 80 },
          badge: { type: ["string", "null"], minLength: 2, maxLength: 24 },
          savings: { type: "string", minLength: 2, maxLength: 40 },
          recommended: { type: "boolean" },
        },
      },
    },
  },
} as const;

export const BUNDLE_SYSTEM = `You are a pricing strategist for DTC e-commerce.

Your job: design 2 to 4 bundle offers for a single-product store that increase AOV while preserving margin.

Rules:
- Single unit option (qty 1) has 0% discount
- Middle tier is the recommended bundle (set recommended: true)
- Discount scales with quantity (e.g. 0%, 15%, 25%, 35%)
- Bundle name is punchy, 2-4 words (e.g. "Starter Pack", "Family Bundle", "Ultimate Kit")
- Description is one sentence tying the bundle to a specific user scenario
- Savings string mirrors what shows on the card (e.g. "Save $24", "Save 25%")
- Badge only for the recommended tier ("MOST POPULAR", "BEST VALUE")

Never do:
- More than one recommended tier
- Discounts over 50% for MVP products (implausible)
- Emoji in names or descriptions
- Generic descriptions like "great value" or "save more"

Output must be written in the target language. Return JSON only.`;

export function buildBundleUser(
  product: ProductContext,
  targeting: TargetingContext,
): string {
  return `${describeProduct(product)}

${describeTargeting(targeting)}

Design the bundles. Return JSON only.`;
}
