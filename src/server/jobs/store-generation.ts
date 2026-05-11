import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "@/db";
import {
  products,
  stores,
  users,
  type StoreSection,
  type StorePage,
  type ThemeTokens,
} from "@/db/schema";
import { scrapeProduct, analyzeProduct, type ScrapedProduct } from "@/lib/scraper";
import { getShopifyProduct } from "@/lib/shopify/import";
import { accounts } from "@/db/schema";
import { and, sql } from "drizzle-orm";
import { createHash } from "crypto";
import {
  uploadFromUrl,
  buildStoreAssetKey,
  publicUrlFor,
} from "@/lib/storage/r2";
import {
  generateHero,
  generateBundles,
  generateFaq,
  generateHooks,
  generateProductFromAI,
  generateImagePrompts,
  generateValueProps,
  generateTestimonials,
  generateHowItWorks,
  generateFeatureMarquee,
  generateLifestyle,
  generateFeatureCards,
} from "@/lib/ai/prompts";
import {
  generateImage,
  generateImageWithReference,
  generateProductImageBatch,
  type BatchImageResult,
  CREDITS_PER_IMAGE,
} from "@/lib/ai/wavespeed";
import type {
  HeroOutput,
  BundleOutput,
  FaqOutput,
  ValuePropsOutput,
  TestimonialsOutput,
  HowItWorksOutput,
  FeatureMarqueeOutput,
  LifestyleOutput,
  FeatureCardsOutput,
} from "@/lib/ai/prompts";
import { generateSecureToken } from "@/lib/auth/tokens";
import { THEME_PRESETS } from "@/lib/theme-presets";

const PRO_MONTHLY_CREDITS = 50;
const DEFAULT_IMAGE_COUNT = 12;

function slugifyTitle(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return `${base || "store"}-${nanoid(6).toLowerCase()}`;
}

function randomTheme(): ThemeTokens {
  const preset = THEME_PRESETS[Math.floor(Math.random() * THEME_PRESETS.length)];
  return {
    preset: preset.id,
    colors: {
      ...preset.colors,
      secondary: preset.colors.primary,
    },
    typography: { sans: "Geist Sans", display: "Geist Sans", mono: "Geist Mono" },
    radius: preset.radius,
    buttons: { shape: "rounded", size: "md" },
  };
}

function defaultTheme(): ThemeTokens {
  return {
    preset: "ink-warm",
    colors: {
      primary: "#0a0a0a",
      secondary: "#c7ff3d",
      accent: "#c7ff3d",
      background: "#fafaf7",
      text: "#0a0a0a",
    },
    typography: { sans: "Geist Sans", display: "Geist Sans", mono: "Geist Mono" },
    radius: 12,
    buttons: { shape: "rounded", size: "md" },
  };
}

export type CreateStoreInput = {
  url: string;
  aiPrompt?: string;
  persona: string;
  angle: string;
  targetLanguage: string;
  currency?: string;
  userId?: string | null;
};

const MAX_SLUG_RETRIES = 5;

const isUniqueConstraintError = (error: unknown): boolean => {
  if (error && typeof error === "object" && "code" in error) {
    return (error as { code: string }).code === "23505";
  }
  return false;
};

export async function createPendingStore(
  input: CreateStoreInput,
): Promise<{ storeId: string; slug: string; claimToken: string | null }> {
  const claimToken = input.userId ? null : generateSecureToken(24);
  const claimExpiry = claimToken ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null;

  let lastError: unknown;
  for (let attempt = 0; attempt < MAX_SLUG_RETRIES; attempt++) {
    const slug = slugifyTitle("new-store");

    try {
      const [store] = await db
        .insert(stores)
        .values({
          userId: input.userId ?? null,
          slug,
          persona: input.persona,
          angle: input.angle,
          targetLanguage: input.targetLanguage,
          currency: input.currency ?? "USD",
          themeTokens: randomTheme(),
          sections: [],
          copy: {},
          status: "scraping",
          claimToken,
          claimTokenExpiresAt: claimExpiry,
        })
        .returning({ id: stores.id, slug: stores.slug });

      return { storeId: store.id, slug: store.slug, claimToken };
    } catch (error) {
      lastError = error;
      if (!isUniqueConstraintError(error)) {
        throw error;
      }
    }
  }

  throw lastError;
}

export type RunStoreGenerationOptions = {
  shopifySource?: { shopDomain: string; productId: string } | null;
  aiPrompt?: string;
};

export async function runStoreGeneration(
  storeId: string,
  sourceUrl: string,
  options: RunStoreGenerationOptions = {},
): Promise<void> {
  const startTime = Date.now();
  console.log(`[store-gen] Starting generation for store ${storeId}`);
  console.log(`[store-gen] Source URL: ${sourceUrl}`);
  console.log(`[store-gen] Options:`, { isAI: !!options.aiPrompt, hasShopify: !!options.shopifySource });

  try {
    const isAIMode = !!options.aiPrompt;

    console.log(`[store-gen] Step 1: Scraping/loading product data (mode: ${isAIMode ? 'AI' : options.shopifySource ? 'Shopify' : 'Scrape'})`);
    const scrapeStart = Date.now();
    const scraped = isAIMode
      ? await generateProductFromPrompt(storeId, options.aiPrompt!, sourceUrl)
      : options.shopifySource
      ? await loadFromShopify(options.shopifySource, sourceUrl)
      : await scrapeProduct(sourceUrl);
    console.log(`[store-gen] Step 1 complete in ${Date.now() - scrapeStart}ms`);
    console.log(`[store-gen] Product: "${scraped.title}", Images: ${(scraped.originalImages as string[])?.length ?? 0}`);

    const sourceImages = (scraped.originalImages as string[] | null) ?? [];
    console.log(`[store-gen] Step 2: Rehosting ${sourceImages.length} images to R2`);
    const rehostStart = Date.now();
    const rehostedImages = await rehostImages(sourceImages, storeId);
    scraped.originalImages = rehostedImages;
    console.log(`[store-gen] Step 2 complete in ${Date.now() - rehostStart}ms, rehosted ${rehostedImages.length} images`);

    console.log(`[store-gen] Step 3: Analyzing product`);
    const analysis = analyzeProduct(scraped);
    scraped.rawPayload = {
      ...((scraped.rawPayload as Record<string, unknown> | null) ?? {}),
      analysis,
    };
    console.log(`[store-gen] Step 3 complete, score: ${analysis.score}`);

    const [product] = await db
      .insert(products)
      .values(scraped)
      .onConflictDoUpdate({
        target: products.sourceUrlHash,
        set: {
          title: scraped.title,
          description: scraped.description,
          priceCents: scraped.priceCents,
          estCostCents: scraped.estCostCents,
          currency: scraped.currency,
          originalImages: scraped.originalImages,
          variants: scraped.variants,
          rawPayload: scraped.rawPayload,
          scrapedAt: scraped.scrapedAt,
          updatedAt: new Date(),
        },
      })
      .returning({ id: products.id });

    const score = analysis.score;
    const betterSlug = slugifyTitle(scraped.title ?? "store");

    await db
      .update(stores)
      .set({
        productId: product.id,
        slug: betterSlug,
        name: scraped.title,
        score,
        status: "generating",
        currency: scraped.currency,
        updatedAt: new Date(),
      })
      .where(eq(stores.id, storeId));

    const [storeRow] = await db
      .select({
        persona: stores.persona,
        angle: stores.angle,
        targetLanguage: stores.targetLanguage,
        userId: stores.userId,
      })
      .from(stores)
      .where(eq(stores.id, storeId))
      .limit(1);

    const originalImages = scraped.originalImages as string[];
    const referenceImageUrl = originalImages.find(url => url.startsWith("https://assets.dropwiz.ai")) ?? originalImages[0];
    let generatedImages: BatchImageResult["images"] = [];

    console.log(`[store-gen] Step 4: AI Image Generation`);
    console.log(`[store-gen] Reference image: ${referenceImageUrl ? (referenceImageUrl.startsWith("https://assets.dropwiz.ai") ? 'R2' : 'original (no R2 available)') : 'NO'}`);
    console.log(`[store-gen] User ID: ${storeRow.userId ?? 'anonymous'}`);

    const hasValidR2Reference = referenceImageUrl?.startsWith("https://assets.dropwiz.ai") ?? false;

    const productContextForPrompts = {
      title: scraped.title ?? "Product",
      description: scraped.description ?? "",
      priceCents: scraped.priceCents ?? 4900,
      currency: scraped.currency ?? "USD",
    };
    const targetingForPrompts = {
      persona: storeRow.persona ?? "Busy consumer",
      angle: storeRow.angle ?? "Transformation",
      targetLanguage: storeRow.targetLanguage,
    };

    if (referenceImageUrl && storeRow.userId && hasValidR2Reference) {
      try {
        const [user] = await db
          .select({ tier: users.tier, imageCredits: users.imageCredits })
          .from(users)
          .where(eq(users.id, storeRow.userId))
          .limit(1);

        const availableCredits = user?.imageCredits ?? 0;
        let creditsNeeded = Math.min(availableCredits, DEFAULT_IMAGE_COUNT);
        if (creditsNeeded < 5) creditsNeeded = Math.min(availableCredits, 5);

        console.log(`[credits] User ${storeRow.userId}: checking credits - available: ${availableCredits}, tier: ${user?.tier ?? 'unknown'}`);
        console.log(`[store-gen] User tier: ${user?.tier ?? 'unknown'}, credits: ${availableCredits}`);
        console.log(`[store-gen] Credits needed for image generation: ${creditsNeeded}`);

        if (creditsNeeded > 0) {
          console.log(`[store-gen] Step 4a: Generating image prompts with Claude...`);
          const promptGenStart = Date.now();
          let customPrompts: { label: string; prompt: string; style: "hero" | "lifestyle" | "studio" | "editorial" | "closeup" }[] | undefined;

          try {
            const promptResult = await generateImagePrompts({
              product: productContextForPrompts,
              targeting: targetingForPrompts,
              count: creditsNeeded,
              storeId,
              userId: storeRow.userId,
            });
            customPrompts = promptResult.prompts;
            console.log(`[store-gen] Generated ${customPrompts.length} image prompts in ${Date.now() - promptGenStart}ms`);
          } catch (promptErr) {
            console.error("[store-gen] Prompt generation failed, using fallback:", promptErr);
          }

          console.log(`[store-gen] Step 4b: Starting AI image batch generation with ${creditsNeeded} images...`);
          const imageGenStart = Date.now();
          const imageResult = await generateProductImageBatch({
            referenceImageUrl,
            productTitle: scraped.title ?? "Product",
            storeId,
            userId: storeRow.userId,
            targetCount: creditsNeeded,
            customPrompts,
          });

          generatedImages = imageResult.images;
          console.log(`[store-gen] AI image generation complete in ${Date.now() - imageGenStart}ms`);
          console.log(`[store-gen] Generated ${generatedImages.length} images: hero=${generatedImages.filter(i => i.kind === 'hero').length}, lifestyle=${generatedImages.filter(i => i.kind === 'lifestyle').length}, product=${generatedImages.filter(i => i.kind === 'product').length}, feature=${generatedImages.filter(i => i.kind === 'feature').length}`);

          if (generatedImages.length > 0) {
            const remainingCredits = availableCredits - imageResult.creditsUsed;
            await db
              .update(users)
              .set({ imageCredits: sql`GREATEST(${users.imageCredits} - ${imageResult.creditsUsed}, 0)` })
              .where(eq(users.id, storeRow.userId));
            console.log(`[credits] User ${storeRow.userId}: deducted ${imageResult.creditsUsed} credits (${availableCredits} -> ${Math.max(0, remainingCredits)})`);
            console.log(`[store-gen] Deducted ${imageResult.creditsUsed} credits from user`);
          }
        } else {
          console.log(`[credits] User ${storeRow.userId}: skipped image generation (0 credits available)`);
          console.log(`[store-gen] SKIPPING AI image generation - no credits available`);
        }
      } catch (err) {
        console.error("[store-gen] batch image generation failed:", err);
        console.log(`[store-gen] Continuing with original images as fallback`);
      }
    } else if (referenceImageUrl && hasValidR2Reference && !storeRow.userId) {
      console.log(`[store-gen] SKIPPING AI image generation - anonymous user (login required for AI images)`);
    } else if (!hasValidR2Reference) {
      console.log(`[store-gen] SKIPPING AI image generation - no R2-hosted reference image available (source images could not be rehosted)`);
    } else {
      console.log(`[store-gen] SKIPPING AI image generation - no reference image available`);
    }

    const productContext = {
      title: scraped.title ?? "Product",
      description: scraped.description ?? "",
      priceCents: scraped.priceCents ?? 4900,
      currency: scraped.currency ?? "USD",
      originalImages: scraped.originalImages as string[],
    };
    const targeting = {
      persona: storeRow.persona ?? "Busy consumer",
      angle: storeRow.angle ?? "Transformation",
      targetLanguage: storeRow.targetLanguage,
    };
    const genCtx = {
      product: productContext,
      targeting,
      storeId,
      userId: storeRow.userId ?? null,
    };

    console.log(`[store-gen] Step 5: Generating AI copy (hero, bundles, faq, sections)`);
    const copyGenStart = Date.now();
    const [hero, bundles, faq, valueProps, testimonials, howItWorks, featureMarquee, lifestyle, featureCards] = await Promise.all([
      generateHero(genCtx),
      generateBundles(genCtx),
      generateFaq(genCtx),
      generateValueProps(genCtx),
      generateTestimonials(genCtx),
      generateHowItWorks(genCtx),
      generateFeatureMarquee(genCtx),
      generateLifestyle(genCtx),
      generateFeatureCards(genCtx),
    ]);
    console.log(`[store-gen] Step 5 complete in ${Date.now() - copyGenStart}ms`);
    console.log(`[store-gen] Generated: hero="${hero.headline?.slice(0, 50)}...", bundles=${bundles.bundles?.length ?? 0}, faqs=${faq.faqs?.length ?? 0}, testimonials=${testimonials.testimonials?.length ?? 0}`);

    generateHooks(genCtx).catch((err) => console.error("[store-gen] hooks failed:", err));

    const heroImages = generatedImages.filter((i) => i.kind === "hero").map((i) => i.imageUrl);
    const lifestyleImages = generatedImages.filter((i) => i.kind === "lifestyle").map((i) => i.imageUrl);
    const productGenImages = generatedImages.filter((i) => i.kind === "product").map((i) => i.imageUrl);
    const featureImages = generatedImages.filter((i) => i.kind === "feature").map((i) => i.imageUrl);

    console.log(`[store-gen] Step 6: Building pages`);
    console.log(`[store-gen] Image summary: AI hero=${heroImages.length}, lifestyle=${lifestyleImages.length}, product=${productGenImages.length}, feature=${featureImages.length}`);
    console.log(`[store-gen] Original/scraped images: ${originalImages.length}`);

    const heroImageUrl = heroImages[0] ?? referenceImageUrl;
    const lifestyleImageUrl = lifestyleImages[0] ?? referenceImageUrl;
    console.log(`[store-gen] Using heroImageUrl: ${heroImageUrl ? 'AI generated' : 'scraped fallback'}`);
    console.log(`[store-gen] Using lifestyleImageUrl: ${lifestyleImageUrl ? (lifestyleImages[0] ? 'AI generated' : 'scraped fallback') : 'none'}`);

    const { pages, sections } = buildPages({
      hero,
      bundles,
      faq,
      valueProps,
      testimonials,
      howItWorks,
      featureMarquee,
      lifestyle,
      featureCards,
      heroImageUrl,
      lifestyleImageUrl,
      productImageUrl: referenceImageUrl ?? heroImageUrl ?? "",
      productImages: originalImages,
      productTitle: scraped.title ?? "Product",
      productDescription: scraped.description ?? undefined,
      priceCents: scraped.priceCents ?? 4900,
      originalPriceCents: scraped.estCostCents
        ? Math.round((scraped.priceCents ?? 4900) * 1.4)
        : undefined,
      currency: scraped.currency ?? "USD",
      generatedImages: {
        hero: heroImages,
        lifestyle: lifestyleImages,
        product: productGenImages,
        feature: featureImages,
      },
    });

    console.log(`[store-gen] Step 6 complete: ${pages.length} pages, ${sections.length} sections`);

    console.log(`[store-gen] Step 7: Saving store to database`);
    await db
      .update(stores)
      .set({
        pages,
        sections,
        copy: { hero, bundles, faq },
        status: "ready",
        updatedAt: new Date(),
      })
      .where(eq(stores.id, storeId));

    const totalTime = Date.now() - startTime;
    console.log(`[store-gen] ✅ Store ${storeId} generation complete in ${totalTime}ms (${(totalTime / 1000).toFixed(1)}s)`);
    console.log(`[store-gen] Summary: AI images=${generatedImages.length}, pages=${pages.length}, sections=${sections.length}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await db
      .update(stores)
      .set({
        status: "failed",
        failureReason: message.slice(0, 500),
        updatedAt: new Date(),
      })
      .where(eq(stores.id, storeId));
    console.error("[store-gen] failed:", storeId, err);
  }
}

async function loadFromShopify(
  src: { shopDomain: string; productId: string },
  sourceUrl: string,
): Promise<ScrapedProduct> {
  const accountRows = await db
    .select()
    .from(accounts)
    .where(
      and(
        eq(accounts.provider, "shopify"),
        eq(accounts.providerAccountId, src.shopDomain),
      ),
    )
    .limit(1);
  const account = accountRows[0];
  if (!account?.accessToken) {
    throw new Error(`Shopify shop ${src.shopDomain} not connected`);
  }

  const productGid = src.productId.startsWith("gid://")
    ? src.productId
    : `gid://shopify/Product/${src.productId}`;
  const product = await getShopifyProduct(
    src.shopDomain,
    account.accessToken,
    productGid,
  );
  if (!product) {
    throw new Error(`Shopify product ${productGid} not found`);
  }

  const sourceUrlHash = createHash("sha256").update(sourceUrl).digest("hex");
  const estCostCents = Math.round(product.priceCents * 0.4);

  return {
    sourceUrl,
    sourceUrlHash,
    sourcePlatform: "shopify",
    title: product.title,
    description: product.description,
    priceCents: product.priceCents,
    estCostCents,
    currency: product.currency.toUpperCase(),
    originalImages: product.images.slice(0, 10),
    variants: product.variantId
      ? [
          {
            id: product.variantId,
            title: "Default",
            sku: product.sku,
            priceCents: product.priceCents,
          },
        ]
      : [],
    rawPayload: {
      provider: "shopify",
      shopDomain: src.shopDomain,
      productId: product.id,
      handle: product.handle,
      vendor: product.vendor,
      productType: product.productType,
      tags: product.tags,
      status: product.status,
    },
    scrapedAt: new Date(),
  };
}

async function generateProductFromPrompt(
  storeId: string,
  aiPrompt: string,
  sourceUrl: string,
): Promise<ScrapedProduct> {
  const [storeRow] = await db
    .select({
      persona: stores.persona,
      angle: stores.angle,
      targetLanguage: stores.targetLanguage,
      currency: stores.currency,
    })
    .from(stores)
    .where(eq(stores.id, storeId))
    .limit(1);

  const targeting = {
    persona: storeRow?.persona ?? "General consumer",
    angle: storeRow?.angle ?? "Problem-solution",
    targetLanguage: storeRow?.targetLanguage ?? "en",
  };

  const generated = await generateProductFromAI({
    aiPrompt,
    targeting,
    storeId,
    userId: null,
  });

  const sourceUrlHash = createHash("sha256").update(sourceUrl).digest("hex");

  return {
    sourceUrl,
    sourceUrlHash,
    sourcePlatform: "other",
    title: generated.title,
    description: generated.description,
    priceCents: generated.priceCents,
    estCostCents: Math.round(generated.priceCents * 0.3),
    currency: generated.currency,
    originalImages: [],
    variants: [],
    rawPayload: {
      provider: "ai",
      aiPrompt,
      features: generated.features,
      category: generated.category,
      imagePrompt: generated.imagePrompt,
    },
    scrapedAt: new Date(),
  };
}

async function rehostImages(
  urls: string[],
  storeId: string,
): Promise<string[]> {
  if (urls.length === 0) return [];
  const results = await Promise.all(
    urls.slice(0, 10).map(async (url) => {
      try {
        const ext = guessExtension(url);
        const key = buildStoreAssetKey(storeId, "product", ext);
        const uploaded = await uploadFromUrl(url, key);
        return uploaded.publicUrl ?? publicUrlFor(uploaded.key) ?? url;
      } catch (err) {
        console.warn("[store-gen] image rehost failed:", url, err);
        return url;
      }
    }),
  );
  return results;
}

function guessExtension(url: string): string {
  const m = url.toLowerCase().match(/\.(png|jpg|jpeg|webp|gif)(\?|$)/);
  return m ? (m[1] === "jpeg" ? "jpg" : m[1]) : "jpg";
}

function buildHeroImagePrompts(productTitle: string, persona: string): string[] {
  return [
    `Product hero shot of ${productTitle}, studio lighting, soft cream background, premium editorial photography, high contrast, centered composition, no text, no watermark. Target customer: ${persona}.`,
    `${productTitle}, moody cinematic lighting, deep shadow, dramatic rim light, dark neutral backdrop, premium DTC product shot, no text, no watermark.`,
    `${productTitle} floating on pastel gradient background with subtle drop shadow, editorial magazine cover style, airy composition, no text, no watermark.`,
    `Three-quarter angle product shot of ${productTitle}, natural window light, minimal styled surface, lifestyle-premium mood, no text, no watermark.`,
  ];
}

function buildLifestylePrompt(productTitle: string, persona: string): string {
  return `Candid lifestyle photograph showing ${productTitle} in use by the target customer (${persona}), natural golden-hour light, shallow depth of field, authentic documentary style, no text, no watermark, no logos.`;
}

function buildHeroImagePromptWithReference(productTitle: string, persona: string): string {
  return `Premium e-commerce hero shot of this exact product (${productTitle}), professional studio lighting, clean minimal background, editorial quality, high-end DTC brand aesthetic. Target customer: ${persona}. Preserve the product's exact appearance, colors, and details.`;
}

function buildLifestylePromptWithReference(productTitle: string, persona: string): string {
  return `Lifestyle product photograph showing this exact product (${productTitle}) in a real-world context for ${persona}. Natural lighting, authentic setting, premium brand feel. Keep the product's exact appearance while placing it in an aspirational scene.`;
}

function buildSections(input: {
  hero: HeroOutput;
  bundles: BundleOutput;
  faq: FaqOutput;
  heroImageUrl?: string;
  productImageUrl: string;
  productImages?: string[];
  productTitle: string;
  productDescription?: string;
  priceCents: number;
  originalPriceCents?: number;
  currency: string;
}): StoreSection[] {
  const originalPrice = input.originalPriceCents ?? Math.round(input.priceCents * 1.4);
  const productImages = input.productImages?.length
    ? input.productImages
    : [input.productImageUrl];

  const bundlesWithBogo = input.bundles.bundles.map((b, i) => ({
    ...b,
    freeQuantity: i === 0 ? 0 : b.quantity,
  }));

  return [
    {
      id: nanoid(8),
      type: "announcement",
      order: 0,
      data: {
        badges: [
          { icon: "DeliveryTruck01Icon", text: "Free Shipping on all orders" },
          { icon: "LockIcon", text: "Secure Checkout" },
          { icon: "HeartCheckIcon", text: "30-Day Money Back Guarantee" },
        ],
        variant: "marquee",
      },
    },
    {
      id: nanoid(8),
      type: "header",
      order: 1,
      data: {
        logoUrl: "",
        storeName: input.productTitle,
        showCartIcon: true,
      },
    },
    {
      id: nanoid(8),
      type: "hero",
      order: 2,
      data: {
        headline: input.hero.headline,
        subheadline: input.hero.subheadline,
        primaryCta: input.hero.primaryCta,
        secondaryCta: input.hero.secondaryCta,
        urgencyBadge: input.hero.urgencyBadge,
        socialProof: input.hero.socialProof,
        imageUrl: input.heroImageUrl ?? input.productImageUrl,
        rating: 4.8,
        reviewCount: 2500,
        currency: input.currency,
        trustBadges: ["Free Shipping", "30-Day Guarantee", "Secure Checkout"],
        featureBadges: [
          { icon: "ZapIcon", label: "Fast Results" },
          { icon: "CheckmarkCircle01Icon", label: "Premium Quality" },
          { icon: "SecurityCheckIcon", label: "Risk-Free" },
        ],
        bundles: bundlesWithBogo.map((b) => {
          const unitPrice = input.priceCents;
          const totalUnits = b.quantity + (b.freeQuantity ?? 0);
          const fullPrice = unitPrice * totalUnits;
          const discountedPrice = Math.round(fullPrice * (1 - b.discountPercent / 100));
          return {
            name: b.name,
            quantity: b.quantity,
            freeQuantity: b.freeQuantity,
            priceCents: discountedPrice,
            originalPriceCents: fullPrice,
            savings: b.savings,
            badge: b.badge,
          };
        }),
      },
    },
    {
      id: nanoid(8),
      type: "product",
      order: 3,
      data: {
        title: input.productTitle,
        subtitle: "The smart choice for modern living",
        description: input.productDescription ?? `Experience the difference with ${input.productTitle}. Designed for those who demand the best, this premium product delivers exceptional results every time.`,
        imageUrl: input.productImageUrl,
        images: productImages,
        priceCents: input.priceCents,
        originalPriceCents: originalPrice,
        currency: input.currency,
        badge: "Best Seller",
        rating: 4.8,
        reviewCount: 2500,
        features: [
          { icon: "ZapIcon", label: "Fast Acting" },
          { icon: "Leaf01Icon", label: "All Natural" },
          { icon: "CheckmarkBadge01Icon", label: "Clinically Tested" },
          { icon: "LockIcon", label: "Secure Purchase" },
        ],
      },
    },
    {
      id: nanoid(8),
      type: "bundles",
      order: 4,
      data: {
        bundles: bundlesWithBogo,
        basePriceCents: input.priceCents,
        originalPriceCents: originalPrice,
        currency: input.currency,
        productImage: input.productImageUrl,
      },
    },
    {
      id: nanoid(8),
      type: "trust",
      order: 5,
      data: {
        badges: [
          {
            icon: "HeartCheckIcon",
            title: "Try it risk-free",
            description: "Love it or your money back. No questions asked.",
          },
          {
            icon: "DeliveryTruck01Icon",
            title: "Fast, free shipping",
            description: "Get it delivered to your door in 3-5 business days.",
          },
          {
            icon: "LockIcon",
            title: "Secure checkout",
            description: "Your payment information is always protected.",
          },
        ],
        showPaymentBadges: true,
        shippingTimeline: [
          { icon: "CheckmarkCircle01Icon", label: "Order Confirmed", date: "Today" },
          { icon: "DeliveryTruck01Icon", label: "On Its Way", date: "1-2 days" },
          { icon: "StarIcon", label: "Delivered", date: "3-5 days" },
        ],
        variant: "detailed",
      },
    },
    {
      id: nanoid(8),
      type: "testimonials",
      order: 6,
      data: {
        title: "What customers are saying",
        testimonials: [
          {
            quote: "This actually works. Two weeks in and I'm already seeing results.",
            name: "Sarah K.",
            role: "Verified Buyer",
            rating: 5,
          },
          {
            quote: "Exceeded my expectations. Already ordered two more for my family.",
            name: "Marcus T.",
            role: "Verified Buyer",
            rating: 5,
          },
          {
            quote: "Worth every penny. The quality is outstanding.",
            name: "Priya S.",
            role: "Verified Buyer",
            rating: 5,
          },
        ],
        variant: "grid",
      },
    },
    {
      id: nanoid(8),
      type: "faq",
      order: 7,
      data: { faqs: input.faq.faqs, variant: "accordion" },
    },
    {
      id: nanoid(8),
      type: "footer",
      order: 8,
      data: { storeName: input.productTitle },
    },
  ];
}

type BuildPagesInput = {
  hero: HeroOutput;
  bundles: BundleOutput;
  faq: FaqOutput;
  valueProps: ValuePropsOutput;
  testimonials: TestimonialsOutput;
  howItWorks: HowItWorksOutput;
  featureMarquee: FeatureMarqueeOutput;
  lifestyle: LifestyleOutput;
  featureCards: FeatureCardsOutput;
  heroImageUrl?: string;
  lifestyleImageUrl?: string;
  productImageUrl: string;
  productImages?: string[];
  productTitle: string;
  productDescription?: string;
  priceCents: number;
  originalPriceCents?: number;
  currency: string;
  generatedImages?: {
    hero: string[];
    lifestyle: string[];
    product: string[];
    feature: string[];
  };
};

const buildPages = (input: BuildPagesInput): { pages: StorePage[]; sections: StoreSection[] } => {
  const originalPrice = input.originalPriceCents ?? Math.round(input.priceCents * 1.4);
  const productImages = input.productImages?.length
    ? input.productImages
    : [input.productImageUrl];

  const heroGalleryImages = [
    ...(input.generatedImages?.hero ?? []),
    ...productImages,
  ].slice(0, 10);

  const productGalleryImages = [
    ...(input.generatedImages?.product ?? []),
    ...productImages,
  ].slice(0, 8);

  const lifestyleGalleryImages = input.generatedImages?.lifestyle ?? [];

  const bundlesWithBogo = input.bundles.bundles.map((b, i) => ({
    ...b,
    freeQuantity: i === 0 ? 0 : b.quantity,
  }));

  const announcementData = {
    badges: [
      { icon: "DeliveryTruck01Icon", text: "Free Shipping on all orders" },
      { icon: "LockIcon", text: "Secure Checkout" },
      { icon: "HeartCheckIcon", text: "30-Day Money Back Guarantee" },
    ],
    variant: "marquee",
  };

  const headerData = {
    logoUrl: "",
    storeName: input.productTitle,
    showCartIcon: true,
  };

  const heroData = {
    variant: "centered" as const,
    headline: input.hero.headline,
    subheadline: input.hero.subheadline,
    primaryCta: "SHOP NOW",
    secondaryCta: input.hero.secondaryCta,
    urgencyBadge: input.hero.urgencyBadge,
    socialProof: input.hero.socialProof,
    imageUrl: input.heroImageUrl ?? input.productImageUrl,
    galleryImages: heroGalleryImages,
    rating: 4.8,
    reviewCount: 2500,
    currency: input.currency,
    priceCents: input.priceCents,
    originalPriceCents: originalPrice,
    trustBadges: ["Free Shipping", "30-Day Guarantee", "Secure Checkout"],
    featureBadges: input.featureCards.features.map((f) => ({
      icon: f.icon,
      label: f.label,
    })),
    sideFeatures: input.featureCards.features.slice(0, 4).map((f) => ({
      icon: f.icon,
      label: f.label,
    })),
    benefits: [
      input.featureCards.features[0]?.label ?? "Premium Quality",
      input.featureCards.features[1]?.label ?? "Fast Results",
      input.featureCards.features[2]?.label ?? "Satisfaction Guaranteed",
    ],
    inlineFaq: input.faq.faqs.slice(0, 3).map((f) => ({
      question: f.question,
      answer: f.answer,
    })),
    ctaMode: "navigate" as const,
    ctaLink: "/products",
    bundles: bundlesWithBogo.map((b) => {
      const unitPrice = input.priceCents;
      const totalUnits = b.quantity + (b.freeQuantity ?? 0);
      const fullPrice = unitPrice * totalUnits;
      const discountedPrice = Math.round(fullPrice * (1 - b.discountPercent / 100));
      return {
        name: b.name,
        quantity: b.quantity,
        freeQuantity: b.freeQuantity,
        priceCents: discountedPrice,
        originalPriceCents: fullPrice,
        savings: b.savings,
        badge: b.badge,
      };
    }),
  };

  const lifestyleData = {
    headline: input.lifestyle.headline,
    body: input.lifestyle.body,
    imageUrl: input.lifestyleImageUrl ?? input.productImageUrl,
    imagePosition: "right" as const,
    galleryImages: lifestyleGalleryImages,
    variant: "circular" as const,
    features: input.featureCards.features.slice(0, 4).map((f) => ({
      icon: f.icon,
      label: f.label,
    })),
  };

  const valuePropsData = {
    title: input.valueProps.title,
    props: input.valueProps.props.map((p) => ({
      title: p.title,
      description: p.description,
      icon: p.icon,
    })),
    variant: "grid",
  };

  const productData = {
    title: input.productTitle,
    subtitle: "The smart choice for modern living",
    description: input.productDescription ?? `Experience the difference with ${input.productTitle}. Designed for those who demand the best, this premium product delivers exceptional results every time.`,
    imageUrl: input.productImageUrl,
    images: productImages,
    galleryImages: productGalleryImages,
    priceCents: input.priceCents,
    originalPriceCents: originalPrice,
    currency: input.currency,
    badge: "Best Seller",
    rating: 4.8,
    reviewCount: 2500,
    features: [
      { icon: "ZapIcon", label: "Fast Acting" },
      { icon: "Leaf01Icon", label: "All Natural" },
      { icon: "CheckmarkBadge01Icon", label: "Clinically Tested" },
      { icon: "LockIcon", label: "Secure Purchase" },
    ],
  };

  const bundlesData = {
    bundles: bundlesWithBogo,
    basePriceCents: input.priceCents,
    originalPriceCents: originalPrice,
    currency: input.currency,
    productImage: input.productImageUrl,
  };

  const howItWorksStepImages = [
    ...(input.generatedImages?.product ?? []),
    ...productImages,
  ].slice(0, 4);

  const howItWorksData = {
    title: input.howItWorks.title,
    steps: input.howItWorks.steps.map((s, i) => ({
      title: s.title,
      description: s.description,
      icon: s.icon ?? "CheckmarkCircle01Icon",
      imageUrl: howItWorksStepImages[i] ?? undefined,
    })),
    variant: "cards" as const,
  };

  const trustData = {
    badges: [
      {
        icon: "HeartCheckIcon",
        title: "Try it risk-free",
        description: "Love it or your money back. No questions asked.",
      },
      {
        icon: "DeliveryTruck01Icon",
        title: "Fast, free shipping",
        description: "Get it delivered to your door in 3-5 business days.",
      },
      {
        icon: "LockIcon",
        title: "Secure checkout",
        description: "Your payment information is always protected.",
      },
    ],
    showPaymentBadges: true,
    shippingTimeline: [
      { icon: "CheckmarkCircle01Icon", label: "Order Confirmed", date: "Today" },
      { icon: "DeliveryTruck01Icon", label: "On Its Way", date: "1-2 days" },
      { icon: "StarIcon", label: "Delivered", date: "3-5 days" },
    ],
    variant: "detailed",
  };

  const testimonialsData = {
    title: input.testimonials.title,
    testimonials: input.testimonials.testimonials.map((t) => ({
      quote: t.quote,
      name: t.name,
      role: t.role,
      rating: t.rating,
    })),
    variant: "grid",
  };

  const faqData = { faqs: input.faq.faqs, variant: "accordion" };
  const footerData = { storeName: input.productTitle };

  const featureMarqueeData = {
    items: input.featureMarquee.items.map((item) => ({
      icon: item.icon,
      label: item.label,
    })),
    speed: "normal" as const,
  };

  const reviewStatsData = {
    rating: 4.8,
    reviewCount: 2500,
    showStars: true,
  };

  const galleryData = {
    title: "See It From Every Angle",
    images: [
      ...(input.generatedImages?.product ?? []),
      ...productImages,
    ].slice(0, 6).map((url) => ({ url })),
  };

  const landingPage: StorePage = {
    id: nanoid(10),
    type: "landing",
    name: "Home",
    slug: "",
    isDefault: true,
    order: 0,
    sections: [
      { id: nanoid(8), type: "announcement", order: 0, data: announcementData },
      { id: nanoid(8), type: "header", order: 1, data: headerData },
      { id: nanoid(8), type: "hero", order: 2, data: heroData },
      { id: nanoid(8), type: "featureMarquee", order: 3, data: featureMarqueeData },
      { id: nanoid(8), type: "howItWorks", order: 4, data: howItWorksData },
      { id: nanoid(8), type: "lifestyle", order: 5, data: lifestyleData },
      { id: nanoid(8), type: "valueProps", order: 6, data: valuePropsData },
      { id: nanoid(8), type: "testimonials", order: 7, data: testimonialsData },
      { id: nanoid(8), type: "reviewStats", order: 8, data: reviewStatsData },
      { id: nanoid(8), type: "trust", order: 9, data: trustData },
      { id: nanoid(8), type: "faq", order: 10, data: faqData },
      { id: nanoid(8), type: "footer", order: 11, data: footerData },
    ],
  };

  const productPage: StorePage = {
    id: nanoid(10),
    type: "product",
    name: "Product",
    slug: "product",
    isDefault: false,
    order: 1,
    sections: [
      { id: nanoid(8), type: "announcement", order: 0, data: announcementData },
      { id: nanoid(8), type: "header", order: 1, data: headerData },
      { id: nanoid(8), type: "product", order: 2, data: productData },
      { id: nanoid(8), type: "gallery", order: 3, data: galleryData },
      { id: nanoid(8), type: "bundles", order: 4, data: bundlesData },
      { id: nanoid(8), type: "featureMarquee", order: 5, data: featureMarqueeData },
      { id: nanoid(8), type: "lifestyle", order: 6, data: lifestyleData },
      { id: nanoid(8), type: "valueProps", order: 7, data: valuePropsData },
      { id: nanoid(8), type: "howItWorks", order: 8, data: howItWorksData },
      { id: nanoid(8), type: "testimonials", order: 9, data: testimonialsData },
      { id: nanoid(8), type: "reviewStats", order: 10, data: reviewStatsData },
      { id: nanoid(8), type: "trust", order: 11, data: trustData },
      { id: nanoid(8), type: "faq", order: 12, data: faqData },
      { id: nanoid(8), type: "footer", order: 13, data: footerData },
    ],
  };

  const allSections = [...landingPage.sections, ...productPage.sections];

  return {
    pages: [landingPage, productPage],
    sections: allSections,
  };
};

export type AddProductPageInput = {
  storeId: string;
  url?: string;
  aiPrompt?: string;
  shopifySource?: { shopDomain: string; productId: string } | null;
  targetLanguage: string;
  currency?: string;
  userId: string;
};

export async function addProductPageToStore(
  input: AddProductPageInput,
): Promise<{ pageId: string; pageName: string }> {
  const [storeRow] = await db
    .select()
    .from(stores)
    .where(and(eq(stores.id, input.storeId), eq(stores.userId, input.userId)))
    .limit(1);

  if (!storeRow) {
    throw new Error("Store not found");
  }

  const isAIMode = !!input.aiPrompt;
  const sourceUrl = input.shopifySource
    ? `https://${input.shopifySource.shopDomain}/products/${input.shopifySource.productId}`
    : isAIMode
    ? `ai://${Date.now()}`
    : input.url!;

  const scraped = isAIMode
    ? await generateProductFromPrompt(input.storeId, input.aiPrompt!, sourceUrl)
    : input.shopifySource
    ? await loadFromShopify(input.shopifySource, sourceUrl)
    : await scrapeProduct(sourceUrl);

  const sourceImages = (scraped.originalImages as string[] | null) ?? [];
  const rehostedImages = await rehostImages(sourceImages, input.storeId);
  scraped.originalImages = rehostedImages;

  const productContext = {
    title: scraped.title ?? "Product",
    description: scraped.description ?? "",
    priceCents: scraped.priceCents ?? 4900,
    currency: scraped.currency ?? input.currency ?? "USD",
    originalImages: scraped.originalImages as string[],
  };

  const targeting = {
    persona: storeRow.persona ?? "General consumer",
    angle: storeRow.angle ?? "Problem-solution",
    targetLanguage: input.targetLanguage,
  };

  const genCtx = {
    product: productContext,
    targeting,
    storeId: input.storeId,
    userId: input.userId,
  };

  const [hero, bundles, faq] = await Promise.all([
    generateHero(genCtx),
    generateBundles(genCtx),
    generateFaq(genCtx),
  ]);

  const productImageUrl = (scraped.originalImages as string[])[0] ?? "";

  const sections = buildSections({
    hero,
    bundles,
    faq,
    heroImageUrl: productImageUrl,
    productImageUrl,
    productImages: scraped.originalImages as string[],
    productTitle: scraped.title ?? "Product",
    productDescription: scraped.description ?? undefined,
    priceCents: scraped.priceCents ?? 4900,
    originalPriceCents: scraped.estCostCents
      ? Math.round((scraped.priceCents ?? 4900) * 1.4)
      : undefined,
    currency: scraped.currency ?? input.currency ?? "USD",
  });

  const pageId = nanoid(10);
  const pageName = scraped.title ?? "Product Page";
  const existingPages = storeRow.pages.length > 0 ? storeRow.pages : [];

  if (existingPages.length === 0 && storeRow.sections.length > 0) {
    existingPages.push({
      id: nanoid(10),
      type: "product" as const,
      name: "Product Page",
      slug: "",
      sections: storeRow.sections,
      order: 0,
      isDefault: true,
    });
  }

  const newPage = {
    id: pageId,
    type: "product" as const,
    name: pageName,
    slug: pageName.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40),
    sections,
    order: existingPages.length,
    isDefault: false,
  };

  const updatedPages = [...existingPages, newPage];

  await db
    .update(stores)
    .set({ pages: updatedPages, updatedAt: new Date() })
    .where(eq(stores.id, input.storeId));

  return { pageId, pageName };
}
