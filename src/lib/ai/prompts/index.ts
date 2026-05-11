import { runTemplate } from "../generate";
import {
  HERO_SYSTEM,
  HERO_VERSION,
  buildHeroUser,
  heroJsonSchema,
  heroSchema,
  type HeroOutput,
} from "./hero-v1";
import {
  BUNDLE_SYSTEM,
  BUNDLE_VERSION,
  buildBundleUser,
  bundleJsonSchema,
  bundleSchema,
  type BundleOutput,
} from "./bundle-v1";
import {
  FAQ_SYSTEM,
  FAQ_VERSION,
  buildFaqUser,
  faqJsonSchema,
  faqSchema,
  type FaqOutput,
} from "./faq-v1";
import {
  HOOK_SYSTEM,
  HOOK_VERSION,
  buildHookUser,
  hookJsonSchema,
  hookSchema,
  type HookOutput,
} from "./hook-v1";
import {
  PRODUCT_SYSTEM,
  PRODUCT_VERSION,
  buildProductUser,
  productJsonSchema,
  productSchema,
  type ProductOutput,
} from "./product-v1";
import {
  IMAGE_PROMPT_SYSTEM,
  IMAGE_PROMPT_VERSION,
  buildImagePromptUser,
  imagePromptsJsonSchema,
  imagePromptsSchema,
  type ImagePromptOutput,
  type SingleImagePrompt,
} from "./image-prompt-v1";
import type { ProductContext, TargetingContext } from "./types";
export {
  generateTestimonials,
  generateValueProps,
  generateComparison,
  generateLifestyle,
  generateHowItWorks,
  generateTrust,
  generateAnnouncement,
  generateFeatureCards,
  generateProductSection,
  generateGallerySection,
  generateFeatureMarquee,
  type SectionGenerateContext,
  type TestimonialsOutput,
  type ValuePropsOutput,
  type ComparisonOutput,
  type LifestyleOutput,
  type HowItWorksOutput,
  type TrustOutput,
  type AnnouncementOutput,
  type FeatureCardsOutput,
  type ProductSectionOutput,
  type GallerySectionOutput,
  type FeatureMarqueeOutput,
} from "./section-v1";

export type GenerateContext = {
  product: ProductContext;
  targeting: TargetingContext;
  storeId?: string | null;
  userId?: string | null;
};

export async function generateHero(ctx: GenerateContext): Promise<HeroOutput> {
  const result = await runTemplate({
    kind: "copy",
    promptVersion: HERO_VERSION,
    system: HERO_SYSTEM,
    user: buildHeroUser(ctx.product, ctx.targeting),
    schema: heroSchema,
    jsonSchema: heroJsonSchema as unknown as Record<string, unknown>,
    logInput: {
      title: ctx.product.title,
      priceCents: ctx.product.priceCents,
      currency: ctx.product.currency,
      persona: ctx.targeting.persona,
      angle: ctx.targeting.angle,
      targetLanguage: ctx.targeting.targetLanguage,
    },
    storeId: ctx.storeId,
    userId: ctx.userId,
  });
  return result.output;
}

export async function generateBundles(ctx: GenerateContext): Promise<BundleOutput> {
  const result = await runTemplate({
    kind: "copy",
    promptVersion: BUNDLE_VERSION,
    system: BUNDLE_SYSTEM,
    user: buildBundleUser(ctx.product, ctx.targeting),
    schema: bundleSchema,
    jsonSchema: bundleJsonSchema as unknown as Record<string, unknown>,
    logInput: {
      title: ctx.product.title,
      priceCents: ctx.product.priceCents,
      persona: ctx.targeting.persona,
      angle: ctx.targeting.angle,
      targetLanguage: ctx.targeting.targetLanguage,
    },
    storeId: ctx.storeId,
    userId: ctx.userId,
  });
  return result.output;
}

export async function generateFaq(ctx: GenerateContext): Promise<FaqOutput> {
  const result = await runTemplate({
    kind: "copy",
    promptVersion: FAQ_VERSION,
    system: FAQ_SYSTEM,
    user: buildFaqUser(ctx.product, ctx.targeting),
    schema: faqSchema,
    jsonSchema: faqJsonSchema as unknown as Record<string, unknown>,
    logInput: {
      title: ctx.product.title,
      persona: ctx.targeting.persona,
      angle: ctx.targeting.angle,
      targetLanguage: ctx.targeting.targetLanguage,
    },
    storeId: ctx.storeId,
    userId: ctx.userId,
  });
  return result.output;
}

export async function generateHooks(ctx: GenerateContext): Promise<HookOutput> {
  const result = await runTemplate({
    kind: "hook",
    promptVersion: HOOK_VERSION,
    system: HOOK_SYSTEM,
    user: buildHookUser(ctx.product, ctx.targeting),
    schema: hookSchema,
    jsonSchema: hookJsonSchema as unknown as Record<string, unknown>,
    logInput: {
      title: ctx.product.title,
      persona: ctx.targeting.persona,
      angle: ctx.targeting.angle,
      targetLanguage: ctx.targeting.targetLanguage,
    },
    storeId: ctx.storeId,
    userId: ctx.userId,
  });
  return result.output;
}

export type AIProductContext = {
  aiPrompt: string;
  targeting: TargetingContext;
  storeId?: string | null;
  userId?: string | null;
};

export async function generateProductFromAI(ctx: AIProductContext): Promise<ProductOutput> {
  const result = await runTemplate({
    kind: "copy",
    promptVersion: PRODUCT_VERSION,
    system: PRODUCT_SYSTEM,
    user: buildProductUser(ctx.aiPrompt, ctx.targeting),
    schema: productSchema,
    jsonSchema: productJsonSchema as unknown as Record<string, unknown>,
    logInput: {
      aiPrompt: ctx.aiPrompt,
      persona: ctx.targeting.persona,
      angle: ctx.targeting.angle,
      targetLanguage: ctx.targeting.targetLanguage,
    },
    storeId: ctx.storeId,
    userId: ctx.userId,
  });
  return result.output;
}

export type ImagePromptContext = {
  product: ProductContext;
  targeting: TargetingContext;
  count?: number;
  storeId?: string | null;
  userId?: string | null;
};

export async function generateImagePrompts(
  ctx: ImagePromptContext
): Promise<ImagePromptOutput> {
  const result = await runTemplate({
    kind: "image",
    promptVersion: IMAGE_PROMPT_VERSION,
    system: IMAGE_PROMPT_SYSTEM,
    user: buildImagePromptUser(ctx.product, ctx.targeting, ctx.count ?? 10),
    schema: imagePromptsSchema,
    jsonSchema: imagePromptsJsonSchema as unknown as Record<string, unknown>,
    logInput: {
      title: ctx.product.title,
      description: ctx.product.description?.slice(0, 200),
      persona: ctx.targeting.persona,
      angle: ctx.targeting.angle,
      count: ctx.count ?? 10,
    },
    storeId: ctx.storeId,
    userId: ctx.userId,
  });
  return result.output;
}

export type { HeroOutput, BundleOutput, FaqOutput, HookOutput, ProductOutput, ImagePromptOutput, SingleImagePrompt };
export type { ProductContext, TargetingContext };
