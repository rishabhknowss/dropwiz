import { z } from "zod";
import {
  describeProduct,
  describeTargeting,
  type ProductContext,
  type TargetingContext,
} from "./types";

export const IMAGE_PROMPT_VERSION = "image-prompt-v1";

const imagePromptSchema = z.object({
  label: z.string(),
  prompt: z.string(),
  style: z.enum(["hero", "lifestyle", "studio", "editorial", "closeup"]),
});

export const imagePromptsSchema = z.object({
  prompts: z.array(imagePromptSchema),
});

export type ImagePromptOutput = z.infer<typeof imagePromptsSchema>;
export type SingleImagePrompt = z.infer<typeof imagePromptSchema>;

export const imagePromptsJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["prompts"],
  properties: {
    prompts: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "prompt", "style"],
        properties: {
          label: { type: "string" },
          prompt: { type: "string" },
          style: {
            type: "string",
            enum: ["hero", "lifestyle", "studio", "editorial", "closeup"],
          },
        },
      },
    },
  },
} as const;

export const IMAGE_PROMPT_SYSTEM = `You are an expert commercial product photographer and art director. Your job is to write detailed image generation prompts for AI image generators (like Stable Diffusion, Midjourney, Flux).

You will be given product information. Generate prompts that will create REALISTIC, HIGH-QUALITY product photography that could be used for a premium DTC e-commerce brand.

CRITICAL RULES:
- The AI will be given a reference image of the actual product - your prompts guide HOW to reshoot it
- NEVER describe what the product looks like (color, shape, material) - the AI sees the actual product
- Focus on: lighting, composition, background, mood, camera angle, setting
- Be SPECIFIC about photography techniques: rim light, soft diffused light, three-point lighting, etc.
- Include camera/lens language: shallow DOF, 85mm portrait lens, macro, wide angle, etc.
- Describe the SCENE and CONTEXT, not the product's physical appearance

STYLE GUIDELINES:
- "hero": Clean studio shot, centered composition, premium feel, ideal for main product image
- "lifestyle": Product in real-world use, natural lighting, aspirational setting
- "studio": Professional product photography, dramatic lighting, dark or minimal background
- "editorial": Magazine-quality, creative composition, artistic direction
- "closeup": Detail shot highlighting texture, craftsmanship, or key features

ALWAYS END prompts with: "photorealistic, ultra high resolution, 8K, crisp sharp details, professional product photography, studio quality, no text, no watermark, no artifacts"

BAD prompt: "A red water bottle on a white background"
GOOD prompt: "Premium studio product shot with soft three-point lighting, centered on seamless white cyclorama, subtle gradient shadow beneath product, shot with 85mm lens at f/4 for slight background blur, clean e-commerce hero aesthetic, photorealistic, ultra high resolution, 8K, crisp sharp details, professional product photography, studio quality, no text, no watermark, no artifacts"

BAD prompt: "Someone holding the product"
GOOD prompt: "Lifestyle scene of the product being used in a modern minimalist kitchen, warm natural morning light streaming through floor-to-ceiling windows, shallow depth of field with product in sharp focus, hands visible interacting with product, aspirational DTC brand aesthetic, photorealistic, ultra high resolution, 8K, crisp sharp details, professional product photography, studio quality, no text, no watermark, no artifacts"

Generate 8-12 diverse prompts covering different styles. Return JSON only.`;

export function buildImagePromptUser(
  product: ProductContext,
  targeting: TargetingContext,
  count: number = 10
): string {
  return `${describeProduct(product)}

${describeTargeting(targeting)}

Generate ${count} image prompts for this product. Include a mix of:
- 3-4 hero/studio shots (clean, premium, e-commerce ready)
- 2-3 lifestyle shots (product in use, real-world context)
- 2-3 editorial/creative shots (magazine quality, artistic)
- 1-2 closeup/detail shots

Return JSON only.`;
}
