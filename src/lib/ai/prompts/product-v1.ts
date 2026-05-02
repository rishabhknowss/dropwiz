import { z } from "zod";
import type { TargetingContext } from "./types";

export const PRODUCT_VERSION = "product-v1";

export const PRODUCT_SYSTEM = `You are a creative e-commerce product developer. Given a product idea or description, you generate complete, realistic product details that could be used for a DTC (direct-to-consumer) store.

Your output must be compelling, market-ready, and optimized for conversion. Think like a successful Shopify store owner.

Guidelines:
- Create a catchy, benefit-driven product title (not generic)
- Write a compelling description that sells the product
- Set a realistic price point for the target market
- Suggest relevant product features and benefits
- The product should feel premium and desirable`;

export function buildProductUser(
  aiPrompt: string,
  targeting: TargetingContext,
): string {
  return `Create a complete product listing based on this idea:

"${aiPrompt}"

Target customer: ${targeting.persona}
Marketing angle: ${targeting.angle}
Language: ${targeting.targetLanguage}

Generate realistic, market-ready product details.`;
}

export const productSchema = z.object({
  title: z.string().describe("Catchy product title, 3-8 words"),
  description: z.string().describe("Compelling product description, 2-4 sentences"),
  priceCents: z.number().describe("Price in cents (e.g., 4999 for $49.99)"),
  currency: z.string().describe("Currency code (USD, EUR, etc.)"),
  features: z.array(z.string()).describe("3-5 key product features/benefits"),
  category: z.string().describe("Product category (e.g., Health, Beauty, Tech, Home)"),
  imagePrompt: z.string().describe("Detailed prompt to generate a product image with AI"),
});

export type ProductOutput = z.infer<typeof productSchema>;

export const productJsonSchema = {
  type: "object",
  properties: {
    title: { type: "string", description: "Catchy product title, 3-8 words" },
    description: { type: "string", description: "Compelling product description, 2-4 sentences" },
    priceCents: { type: "number", description: "Price in cents (e.g., 4999 for $49.99)" },
    currency: { type: "string", description: "Currency code (USD, EUR, etc.)" },
    features: {
      type: "array",
      items: { type: "string" },
      description: "3-5 key product features/benefits",
    },
    category: { type: "string", description: "Product category" },
    imagePrompt: { type: "string", description: "Detailed prompt to generate a product image with AI" },
  },
  required: ["title", "description", "priceCents", "currency", "features", "category", "imagePrompt"],
  additionalProperties: false,
};
