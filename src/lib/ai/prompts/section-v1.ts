import { z } from "zod";
import { runTemplate } from "../generate";
import { CLAUDE_HAIKU } from "../claude";
import {
  describeProduct,
  describeTargeting,
  type ProductContext,
  type TargetingContext,
} from "./types";

export const SECTION_VERSION = "section-v1";

const testimonialsSchema = z.object({
  title: z.string().min(1).max(100),
  testimonials: z.array(
    z.object({
      quote: z.string().min(10).max(300),
      name: z.string().min(2).max(50),
      role: z.string().max(50),
      rating: z.number().int().min(1).max(5),
    })
  ).min(3).max(5),
});

const valuePropsSchema = z.object({
  title: z.string().min(1).max(100),
  props: z.array(
    z.object({
      icon: z.string().min(1).max(10),
      title: z.string().min(1).max(50),
      description: z.string().min(10).max(150),
    })
  ).min(3).max(4),
});

const comparisonSchema = z.object({
  rows: z.array(
    z.object({
      label: z.string().min(1).max(80),
      ours: z.string().min(1).max(40),
      theirs: z.string().min(1).max(40),
    })
  ).min(3).max(6),
});

const lifestyleSchema = z.object({
  headline: z.string().min(1).max(100),
  body: z.string().min(20).max(300),
});

const howItWorksSchema = z.object({
  title: z.string().min(1).max(100),
  steps: z.array(
    z.object({
      title: z.string().min(1).max(60),
      description: z.string().min(10).max(150),
      icon: z.string().max(10).optional(),
    })
  ).min(3).max(4),
});

const trustSchema = z.object({
  badges: z.array(
    z.object({
      icon: z.string().min(1).max(10),
      title: z.string().min(1).max(60),
      description: z.string().min(10).max(150),
    })
  ).min(3).max(4),
});

const announcementSchema = z.object({
  badges: z.array(
    z.object({
      icon: z.string().min(1).max(10),
      text: z.string().min(5).max(60),
    })
  ).min(2).max(4),
});

const featureCardsSchema = z.object({
  features: z.array(
    z.object({
      icon: z.string().min(1).max(10),
      label: z.string().min(2).max(30),
    })
  ).min(2).max(4),
});

const productSectionSchema = z.object({
  title: z.string().min(1).max(100),
  subtitle: z.string().max(100),
  description: z.string().min(20).max(400),
  badge: z.string().max(30).nullable(),
  features: z.array(
    z.object({
      icon: z.string().min(1).max(10),
      label: z.string().min(2).max(30),
    })
  ).min(3).max(5),
});

const gallerySectionSchema = z.object({
  title: z.string().min(1).max(100),
});

const featureMarqueeSchema = z.object({
  items: z.array(
    z.object({
      icon: z.string().min(1).max(10),
      label: z.string().min(2).max(30),
    })
  ).min(4).max(6),
});

export type TestimonialsOutput = z.infer<typeof testimonialsSchema>;
export type ValuePropsOutput = z.infer<typeof valuePropsSchema>;
export type ComparisonOutput = z.infer<typeof comparisonSchema>;
export type LifestyleOutput = z.infer<typeof lifestyleSchema>;
export type HowItWorksOutput = z.infer<typeof howItWorksSchema>;
export type TrustOutput = z.infer<typeof trustSchema>;
export type AnnouncementOutput = z.infer<typeof announcementSchema>;
export type FeatureCardsOutput = z.infer<typeof featureCardsSchema>;
export type ProductSectionOutput = z.infer<typeof productSectionSchema>;
export type GallerySectionOutput = z.infer<typeof gallerySectionSchema>;
export type FeatureMarqueeOutput = z.infer<typeof featureMarqueeSchema>;

const SECTION_SYSTEM = `You are a world-class direct-response copywriter for DTC e-commerce brands.

Your job: write section copy that converts browsers into buyers.

Rules:
- Write for the target persona, speaking to their desires and pain points
- Be specific and concrete, avoid vague claims
- Use social proof where appropriate
- Keep copy concise and scannable
- Use emojis only for icons, not in text
- Avoid exclamation points
- Write in the target language specified

Never do:
- Generic filler text
- Overly salesy language
- Unsubstantiated claims
- Mention competitors by name in a negative way

Output must be written in the target language. Always return JSON only.`;

const testimonialsJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "testimonials"],
  properties: {
    title: { type: "string" },
    testimonials: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["quote", "name", "role", "rating"],
        properties: {
          quote: { type: "string" },
          name: { type: "string" },
          role: { type: "string" },
          rating: { type: "integer" },
        },
      },
    },
  },
} as const;

const valuePropsJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "props"],
  properties: {
    title: { type: "string" },
    props: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["icon", "title", "description"],
        properties: {
          icon: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
        },
      },
    },
  },
} as const;

const comparisonJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["rows"],
  properties: {
    rows: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "ours", "theirs"],
        properties: {
          label: { type: "string" },
          ours: { type: "string" },
          theirs: { type: "string" },
        },
      },
    },
  },
} as const;

const lifestyleJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["headline", "body"],
  properties: {
    headline: { type: "string" },
    body: { type: "string" },
  },
} as const;

const howItWorksJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "steps"],
  properties: {
    title: { type: "string" },
    steps: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "description"],
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          icon: { type: "string" },
        },
      },
    },
  },
} as const;

const trustJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["badges"],
  properties: {
    badges: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["icon", "title", "description"],
        properties: {
          icon: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
        },
      },
    },
  },
} as const;

const announcementJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["badges"],
  properties: {
    badges: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["icon", "text"],
        properties: {
          icon: { type: "string" },
          text: { type: "string" },
        },
      },
    },
  },
} as const;

const featureCardsJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["features"],
  properties: {
    features: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["icon", "label"],
        properties: {
          icon: { type: "string" },
          label: { type: "string" },
        },
      },
    },
  },
} as const;

const productSectionJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "subtitle", "description", "badge", "features"],
  properties: {
    title: { type: "string" },
    subtitle: { type: "string" },
    description: { type: "string" },
    badge: { type: ["string", "null"] },
    features: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["icon", "label"],
        properties: {
          icon: { type: "string" },
          label: { type: "string" },
        },
      },
    },
  },
} as const;

const gallerySectionJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title"],
  properties: {
    title: { type: "string" },
  },
} as const;

const featureMarqueeJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["items"],
  properties: {
    items: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["icon", "label"],
        properties: {
          icon: { type: "string" },
          label: { type: "string" },
        },
      },
    },
  },
} as const;

export type SectionGenerateContext = {
  product: ProductContext;
  targeting: TargetingContext;
  storeId?: string | null;
  userId?: string | null;
};

function buildSectionPrompt(sectionType: string, product: ProductContext, targeting: TargetingContext): string {
  const productInfo = describeProduct(product);
  const targetInfo = describeTargeting(targeting);

  const sectionInstructions: Record<string, string> = {
    testimonials: `Generate 3 realistic customer testimonials for this product. Each testimonial should:
- Have a believable quote (not over-the-top, focus on specific results)
- Include a realistic name (first name and last initial)
- Include a role like "Verified Buyer" or specific context
- Have a rating of 4-5 stars
The title should be engaging like "What customers are saying" or similar.`,

    valueProps: `Generate 3-4 value propositions that explain why customers should buy this product. Each value prop should:
- Have an emoji icon that represents the benefit
- Have a short, catchy title (3-5 words)
- Have a brief description (1 sentence) explaining the benefit
The section title should be engaging like "Why choose us" or similar.`,

    comparison: `Generate 4-5 comparison rows that contrast this product with typical competitors. Each row should:
- Have a feature/benefit label
- Show what "ours" offers (can use ✓ or specific text)
- Show what "theirs" (competitors) offer (can use ✗ or specific text)
Be fair but highlight genuine differentiators.`,

    lifestyle: `Generate lifestyle copy that paints a picture of the customer using the product. Include:
- A headline that speaks to aspirational outcomes
- Body copy that describes the experience/transformation (2-3 sentences)`,

    howItWorks: `Generate 3-4 steps explaining how to use this product or how it works. Each step should:
- Have a clear, action-oriented title
- Have a brief description explaining what happens
- Optionally include an emoji icon`,

    trust: `Generate 3-4 trust badges/guarantees that reassure customers. Each badge should:
- Have an emoji icon (❤️, 🚛, 🔒, ⭐, etc.)
- Have a short title (e.g., "30-Day Guarantee", "Free Shipping")
- Have a description explaining the promise`,

    announcement: `Generate 2-3 announcement badges for an announcement bar. Each badge should:
- Have an emoji icon
- Have short, punchy text (e.g., "Free Shipping on all orders", "30-Day Money Back")`,

    featureCards: `Generate 3-4 feature cards that highlight key product features. Each card should:
- Have a single emoji icon that represents the feature
- Have a short label (2-3 words, e.g., "Pure Sound", "Fine Craft", "Deep Tone")
Focus on what makes this product special.`,

    product: `Generate copy for a product section. Include:
- A compelling title (the product name or a catchy variation)
- A subtitle (short tagline, 5-8 words)
- A description (2-3 sentences about the product)
- A badge text (like "Best Seller", "Limited Edition", or null if not applicable)
- 3-4 feature badges with emoji icons and short labels`,

    gallery: `Generate a title for a product gallery section. Should be something like "See it from every angle" or similar engaging text.`,

    featureMarquee: `Generate 4-6 feature items for a scrolling marquee. Each item should:
- Have an emoji icon
- Have a short label (2-3 words like "Fast Results", "Premium Quality")`,
  };

  const instruction = sectionInstructions[sectionType] ?? `Generate copy for a ${sectionType} section.`;

  return `${productInfo}

${targetInfo}

${instruction}

Return JSON only.`;
}

export async function generateTestimonials(ctx: SectionGenerateContext): Promise<TestimonialsOutput> {
  const result = await runTemplate({
    kind: "copy",
    promptVersion: SECTION_VERSION,
    model: CLAUDE_HAIKU,
    system: SECTION_SYSTEM,
    user: buildSectionPrompt("testimonials", ctx.product, ctx.targeting),
    schema: testimonialsSchema,
    jsonSchema: testimonialsJsonSchema as unknown as Record<string, unknown>,
    logInput: {
      sectionType: "testimonials",
      title: ctx.product.title,
      persona: ctx.targeting.persona,
      targetLanguage: ctx.targeting.targetLanguage,
    },
    storeId: ctx.storeId,
    userId: ctx.userId,
  });
  return result.output;
}

export async function generateValueProps(ctx: SectionGenerateContext): Promise<ValuePropsOutput> {
  const result = await runTemplate({
    kind: "copy",
    promptVersion: SECTION_VERSION,
    model: CLAUDE_HAIKU,
    system: SECTION_SYSTEM,
    user: buildSectionPrompt("valueProps", ctx.product, ctx.targeting),
    schema: valuePropsSchema,
    jsonSchema: valuePropsJsonSchema as unknown as Record<string, unknown>,
    logInput: {
      sectionType: "valueProps",
      title: ctx.product.title,
      persona: ctx.targeting.persona,
      targetLanguage: ctx.targeting.targetLanguage,
    },
    storeId: ctx.storeId,
    userId: ctx.userId,
  });
  return result.output;
}

export async function generateComparison(ctx: SectionGenerateContext): Promise<ComparisonOutput> {
  const result = await runTemplate({
    kind: "copy",
    promptVersion: SECTION_VERSION,
    model: CLAUDE_HAIKU,
    system: SECTION_SYSTEM,
    user: buildSectionPrompt("comparison", ctx.product, ctx.targeting),
    schema: comparisonSchema,
    jsonSchema: comparisonJsonSchema as unknown as Record<string, unknown>,
    logInput: {
      sectionType: "comparison",
      title: ctx.product.title,
      persona: ctx.targeting.persona,
      targetLanguage: ctx.targeting.targetLanguage,
    },
    storeId: ctx.storeId,
    userId: ctx.userId,
  });
  return result.output;
}

export async function generateLifestyle(ctx: SectionGenerateContext): Promise<LifestyleOutput> {
  const result = await runTemplate({
    kind: "copy",
    promptVersion: SECTION_VERSION,
    model: CLAUDE_HAIKU,
    system: SECTION_SYSTEM,
    user: buildSectionPrompt("lifestyle", ctx.product, ctx.targeting),
    schema: lifestyleSchema,
    jsonSchema: lifestyleJsonSchema as unknown as Record<string, unknown>,
    logInput: {
      sectionType: "lifestyle",
      title: ctx.product.title,
      persona: ctx.targeting.persona,
      targetLanguage: ctx.targeting.targetLanguage,
    },
    storeId: ctx.storeId,
    userId: ctx.userId,
  });
  return result.output;
}

export async function generateHowItWorks(ctx: SectionGenerateContext): Promise<HowItWorksOutput> {
  const result = await runTemplate({
    kind: "copy",
    promptVersion: SECTION_VERSION,
    model: CLAUDE_HAIKU,
    system: SECTION_SYSTEM,
    user: buildSectionPrompt("howItWorks", ctx.product, ctx.targeting),
    schema: howItWorksSchema,
    jsonSchema: howItWorksJsonSchema as unknown as Record<string, unknown>,
    logInput: {
      sectionType: "howItWorks",
      title: ctx.product.title,
      persona: ctx.targeting.persona,
      targetLanguage: ctx.targeting.targetLanguage,
    },
    storeId: ctx.storeId,
    userId: ctx.userId,
  });
  return result.output;
}

export async function generateTrust(ctx: SectionGenerateContext): Promise<TrustOutput> {
  const result = await runTemplate({
    kind: "copy",
    promptVersion: SECTION_VERSION,
    model: CLAUDE_HAIKU,
    system: SECTION_SYSTEM,
    user: buildSectionPrompt("trust", ctx.product, ctx.targeting),
    schema: trustSchema,
    jsonSchema: trustJsonSchema as unknown as Record<string, unknown>,
    logInput: {
      sectionType: "trust",
      title: ctx.product.title,
      persona: ctx.targeting.persona,
      targetLanguage: ctx.targeting.targetLanguage,
    },
    storeId: ctx.storeId,
    userId: ctx.userId,
  });
  return result.output;
}

export async function generateAnnouncement(ctx: SectionGenerateContext): Promise<AnnouncementOutput> {
  const result = await runTemplate({
    kind: "copy",
    promptVersion: SECTION_VERSION,
    model: CLAUDE_HAIKU,
    system: SECTION_SYSTEM,
    user: buildSectionPrompt("announcement", ctx.product, ctx.targeting),
    schema: announcementSchema,
    jsonSchema: announcementJsonSchema as unknown as Record<string, unknown>,
    logInput: {
      sectionType: "announcement",
      title: ctx.product.title,
      persona: ctx.targeting.persona,
      targetLanguage: ctx.targeting.targetLanguage,
    },
    storeId: ctx.storeId,
    userId: ctx.userId,
  });
  return result.output;
}

export async function generateFeatureCards(ctx: SectionGenerateContext): Promise<FeatureCardsOutput> {
  const result = await runTemplate({
    kind: "copy",
    promptVersion: SECTION_VERSION,
    model: CLAUDE_HAIKU,
    system: SECTION_SYSTEM,
    user: buildSectionPrompt("featureCards", ctx.product, ctx.targeting),
    schema: featureCardsSchema,
    jsonSchema: featureCardsJsonSchema as unknown as Record<string, unknown>,
    logInput: {
      sectionType: "featureCards",
      title: ctx.product.title,
      persona: ctx.targeting.persona,
      targetLanguage: ctx.targeting.targetLanguage,
    },
    storeId: ctx.storeId,
    userId: ctx.userId,
  });
  return result.output;
}

export async function generateProductSection(ctx: SectionGenerateContext): Promise<ProductSectionOutput> {
  const result = await runTemplate({
    kind: "copy",
    promptVersion: SECTION_VERSION,
    model: CLAUDE_HAIKU,
    system: SECTION_SYSTEM,
    user: buildSectionPrompt("product", ctx.product, ctx.targeting),
    schema: productSectionSchema,
    jsonSchema: productSectionJsonSchema as unknown as Record<string, unknown>,
    logInput: {
      sectionType: "product",
      title: ctx.product.title,
      persona: ctx.targeting.persona,
      targetLanguage: ctx.targeting.targetLanguage,
    },
    storeId: ctx.storeId,
    userId: ctx.userId,
  });
  return result.output;
}

export async function generateGallerySection(ctx: SectionGenerateContext): Promise<GallerySectionOutput> {
  const result = await runTemplate({
    kind: "copy",
    promptVersion: SECTION_VERSION,
    model: CLAUDE_HAIKU,
    system: SECTION_SYSTEM,
    user: buildSectionPrompt("gallery", ctx.product, ctx.targeting),
    schema: gallerySectionSchema,
    jsonSchema: gallerySectionJsonSchema as unknown as Record<string, unknown>,
    logInput: {
      sectionType: "gallery",
      title: ctx.product.title,
      persona: ctx.targeting.persona,
      targetLanguage: ctx.targeting.targetLanguage,
    },
    storeId: ctx.storeId,
    userId: ctx.userId,
  });
  return result.output;
}

export async function generateFeatureMarquee(ctx: SectionGenerateContext): Promise<FeatureMarqueeOutput> {
  const result = await runTemplate({
    kind: "copy",
    promptVersion: SECTION_VERSION,
    model: CLAUDE_HAIKU,
    system: SECTION_SYSTEM,
    user: buildSectionPrompt("featureMarquee", ctx.product, ctx.targeting),
    schema: featureMarqueeSchema,
    jsonSchema: featureMarqueeJsonSchema as unknown as Record<string, unknown>,
    logInput: {
      sectionType: "featureMarquee",
      title: ctx.product.title,
      persona: ctx.targeting.persona,
      targetLanguage: ctx.targeting.targetLanguage,
    },
    storeId: ctx.storeId,
    userId: ctx.userId,
  });
  return result.output;
}
