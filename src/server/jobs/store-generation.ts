import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "@/db";
import {
  products,
  stores,
  type StoreSection,
  type ThemeTokens,
} from "@/db/schema";
import { scrapeProduct, analyzeProduct, type ScrapedProduct } from "@/lib/scraper";
import { getShopifyProduct } from "@/lib/shopify/import";
import { accounts } from "@/db/schema";
import { and } from "drizzle-orm";
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
} from "@/lib/ai/prompts";
import { generateImage } from "@/lib/ai/wavespeed";
import type { HeroOutput, BundleOutput, FaqOutput } from "@/lib/ai/prompts";
import { generateSecureToken } from "@/lib/auth/tokens";

function slugifyTitle(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return `${base || "store"}-${nanoid(6).toLowerCase()}`;
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

export async function createPendingStore(
  input: CreateStoreInput,
): Promise<{ storeId: string; slug: string; claimToken: string | null }> {
  const slug = slugifyTitle("new-store");
  const claimToken = input.userId ? null : generateSecureToken(24);
  const claimExpiry = claimToken ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null;

  const [store] = await db
    .insert(stores)
    .values({
      userId: input.userId ?? null,
      slug,
      persona: input.persona,
      angle: input.angle,
      targetLanguage: input.targetLanguage,
      currency: input.currency ?? "USD",
      themeTokens: defaultTheme(),
      sections: [],
      copy: {},
      status: "scraping",
      claimToken,
      claimTokenExpiresAt: claimExpiry,
    })
    .returning({ id: stores.id, slug: stores.slug });

  return { storeId: store.id, slug: store.slug, claimToken };
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
  try {
    const isAIMode = !!options.aiPrompt;

    const scraped = isAIMode
      ? await generateProductFromPrompt(storeId, options.aiPrompt!, sourceUrl)
      : options.shopifySource
      ? await loadFromShopify(options.shopifySource, sourceUrl)
      : await scrapeProduct(sourceUrl);

    const sourceImages = (scraped.originalImages as string[] | null) ?? [];
    const rehostedImages = await rehostImages(sourceImages, storeId);
    scraped.originalImages = rehostedImages;

    const analysis = analyzeProduct(scraped);
    scraped.rawPayload = {
      ...((scraped.rawPayload as Record<string, unknown> | null) ?? {}),
      analysis,
    };

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

    const [hero, bundles, faq] = await Promise.all([
      generateHero(genCtx),
      generateBundles(genCtx),
      generateFaq(genCtx),
    ]);

    let heroImageUrl: string | undefined;
    try {
      const heroPrompts = buildHeroImagePrompts(
        scraped.title ?? "product",
        targeting.persona,
      );
      const heroResults = await Promise.all(
        heroPrompts.map((prompt) =>
          generateImage({
            model: "flux_schnell",
            prompt,
            width: 1024,
            height: 1024,
            numImages: 1,
            storeId,
            userId: storeRow.userId ?? null,
            kind: "hero",
          }).catch(() => null),
        ),
      );
      heroImageUrl = heroResults.find((r) => r?.assets[0]?.publicUrl)?.assets[0]
        ?.publicUrl;

      generateImage({
        model: "flux_schnell",
        prompt: buildLifestylePrompt(scraped.title ?? "product", targeting.persona),
        width: 1024,
        height: 1024,
        numImages: 1,
        storeId,
        userId: storeRow.userId ?? null,
        kind: "lifestyle",
      }).catch(() => {});
    } catch {
      heroImageUrl = (scraped.originalImages as string[])[0];
    }

    generateHooks(genCtx).catch(() => {});

    const sections = buildSections({
      hero,
      bundles,
      faq,
      heroImageUrl,
      productImageUrl:
        (scraped.originalImages as string[])[0] ?? heroImageUrl ?? "",
      productTitle: scraped.title ?? "Product",
      priceCents: scraped.priceCents ?? 4900,
      currency: scraped.currency ?? "USD",
    });

    await db
      .update(stores)
      .set({
        sections,
        copy: { hero, bundles, faq },
        status: "ready",
        updatedAt: new Date(),
      })
      .where(eq(stores.id, storeId));
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
    originalImages: product.images.slice(0, 6),
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
    urls.slice(0, 6).map(async (url) => {
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

function buildSections(input: {
  hero: HeroOutput;
  bundles: BundleOutput;
  faq: FaqOutput;
  heroImageUrl?: string;
  productImageUrl: string;
  productTitle: string;
  priceCents: number;
  currency: string;
}): StoreSection[] {
  return [
    {
      id: nanoid(8),
      type: "hero",
      order: 0,
      data: {
        headline: input.hero.headline,
        subheadline: input.hero.subheadline,
        primaryCta: input.hero.primaryCta,
        secondaryCta: input.hero.secondaryCta,
        urgencyBadge: input.hero.urgencyBadge,
        socialProof: input.hero.socialProof,
        imageUrl: input.heroImageUrl ?? input.productImageUrl,
      },
    },
    {
      id: nanoid(8),
      type: "product",
      order: 1,
      data: {
        title: input.productTitle,
        imageUrl: input.productImageUrl,
        priceCents: input.priceCents,
        currency: input.currency,
      },
    },
    {
      id: nanoid(8),
      type: "bundles",
      order: 2,
      data: {
        bundles: input.bundles.bundles,
        basePriceCents: input.priceCents,
        currency: input.currency,
      },
    },
    {
      id: nanoid(8),
      type: "trust",
      order: 3,
      data: {
        badges: [
          "30-day money-back guarantee",
          "Ships in 1-2 business days",
          "Secure checkout",
        ],
      },
    },
    {
      id: nanoid(8),
      type: "faq",
      order: 4,
      data: { faqs: input.faq.faqs },
    },
    {
      id: nanoid(8),
      type: "footer",
      order: 5,
      data: { storeName: input.productTitle },
    },
  ];
}
