import { createHash } from "crypto";
import axios, { AxiosError } from "axios";
import { env } from "@/env";
import type { NewProduct } from "@/db/schema";
import type { ScrapedProduct } from "./index";

const FIRECRAWL_API = "https://api.firecrawl.dev/v2";

const EXTRACT_PROMPT = `Extract product information from this page for a premium e-commerce store.

Required:
- title: short product name (max 120 chars), no SKU codes
- description: 2-4 sentences describing what the product does, materials, key features. Plain prose, no bullet lists, no marketing fluff.
- priceCents: current selling price in smallest currency unit (cents/paise). Convert "$24.99" to 2499. If sale price exists, use that.
- currency: ISO 4217 code uppercase (USD/INR/EUR/GBP)
- images: array of 6-12 HIGH RESOLUTION product image URLs. CRITICAL IMAGE REQUIREMENTS:
  * For Amazon: Look for URLs containing "_AC_SL1500_" or higher - these are full resolution
  * NEVER use URLs with "_SS40_", "_SS100_", "_SX38_", "_SY355_" etc - these are tiny thumbnails
  * Transform Amazon URLs: replace "_AC_SL300_" with "_AC_SL1500_" to get high-res version
  * For AliExpress: Remove size suffixes like "_640x640" from URLs
  * Include: main product shots, alternate angles, lifestyle/in-use images, detail shots
  * Extract from BOTH main image gallery AND "A+ content" / "enhanced brand content" sections
  * Skip logos, icons, size charts, and unrelated images
  * Order: main image first, then variations, then lifestyle shots
- features: array of 3-6 short bullet phrases (max 80 chars each) summarizing key features/benefits. Empty array if none found.
- reviewCount: total number of reviews/ratings if visible, 0 if not shown.
- rating: average rating out of 5 (e.g. 4.6) if shown, 0 if not shown.
- brand: brand or seller name if shown, empty string otherwise.

Skip ads and related products. Focus only on the main product on the page.
For Amazon products, extract from BOTH the main image gallery and the A+ content section.`;

type FirecrawlExtractSchema = {
  title: string;
  description: string;
  priceCents: number;
  currency: string;
  images: string[];
  features?: string[];
  reviewCount?: number;
  rating?: number;
  brand?: string;
};

const EXTRACT_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    priceCents: { type: "integer" },
    currency: { type: "string" },
    images: { type: "array", items: { type: "string" } },
    features: { type: "array", items: { type: "string" } },
    reviewCount: { type: "integer" },
    rating: { type: "number" },
    brand: { type: "string" },
  },
  required: ["title", "description", "priceCents", "currency", "images"],
};

type FirecrawlScrapeResponse = {
  success: boolean;
  data?: {
    json?: FirecrawlExtractSchema;
    markdown?: string;
    metadata?: {
      title?: string;
      description?: string;
      ogImage?: string;
      sourceURL?: string;
    };
  };
  error?: string;
};

function hashUrl(url: string): string {
  return createHash("sha256").update(url).digest("hex");
}

function detectPlatform(url: string): NewProduct["sourcePlatform"] {
  const u = url.toLowerCase();
  if (u.includes("aliexpress")) return "aliexpress";
  if (u.includes("amazon")) return "amazon";
  if (u.includes("etsy")) return "etsy";
  if (u.includes("myshopify") || u.includes("shopify")) return "shopify";
  if (u.includes("tiktok")) return "tiktok_shop";
  return "other";
}

function estimateCost(priceCents: number, platform: NewProduct["sourcePlatform"]): number {
  const ratio =
    platform === "aliexpress"
      ? 0.18
      : platform === "amazon"
        ? 0.35
        : platform === "shopify"
          ? 0.4
          : 0.3;
  return Math.round(priceCents * ratio);
}

export async function scrapeWithFirecrawl(sourceUrl: string): Promise<ScrapedProduct> {
  console.log(`[firecrawl] Starting scrape for: ${sourceUrl.slice(0, 100)}...`);
  const startTime = Date.now();
  let response: FirecrawlScrapeResponse;

  try {
    const result = await axios.post<FirecrawlScrapeResponse>(
      `${FIRECRAWL_API}/scrape`,
      {
        url: sourceUrl,
        formats: [
          {
            type: "json",
            prompt: EXTRACT_PROMPT,
            schema: EXTRACT_SCHEMA,
          },
        ],
        onlyMainContent: true,
        waitFor: 1500,
        timeout: 30000,
      },
      {
        headers: {
          Authorization: `Bearer ${env.FIRECRAWL_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 60000,
      },
    );
    response = result.data;
    const elapsed = Date.now() - startTime;
    console.log(`[firecrawl] Scrape completed in ${elapsed}ms, success=${response.success}`);
  } catch (err) {
    const elapsed = Date.now() - startTime;
    const axErr = err as AxiosError<{ error?: string }>;
    const msg =
      axErr.response?.data?.error ?? axErr.message ?? "Firecrawl request failed";
    console.error(`[firecrawl] Scrape FAILED after ${elapsed}ms: ${msg}`);
    throw new Error(`Firecrawl scrape failed: ${msg}`);
  }

  if (!response.success || !response.data?.json) {
    console.error(`[firecrawl] No structured data: ${response.error ?? "unknown error"}`);
    throw new Error(response.error ?? "Firecrawl returned no structured data");
  }

  const extracted = response.data.json;
  const platform = detectPlatform(sourceUrl);
  const rawImages = (extracted.images ?? []).filter(
    (u) => typeof u === "string" && /^https?:\/\//i.test(u),
  );

  if (rawImages.length === 0 && response.data.metadata?.ogImage) {
    rawImages.push(response.data.metadata.ogImage);
  }

  const priceCents = Math.max(0, Math.round(extracted.priceCents ?? 0));

  console.log(`[firecrawl] Extracted: "${extracted.title?.slice(0, 50)}...", platform=${platform}, images=${rawImages.length}, price=${priceCents} ${extracted.currency}`);

  return {
    sourceUrl,
    sourceUrlHash: hashUrl(sourceUrl),
    sourcePlatform: platform,
    title: extracted.title?.slice(0, 200) ?? "Untitled product",
    description: extracted.description ?? "",
    priceCents,
    estCostCents: estimateCost(priceCents, platform),
    currency: (extracted.currency ?? "USD").toUpperCase(),
    originalImages: rawImages.slice(0, 10),
    variants: [],
    rawPayload: {
      provider: "firecrawl",
      metadata: response.data.metadata ?? {},
      features: extracted.features ?? [],
      reviewCount: Math.max(0, Math.round(extracted.reviewCount ?? 0)),
      rating: Math.max(0, Math.min(5, extracted.rating ?? 0)),
      brand: extracted.brand ?? "",
    },
    scrapedAt: new Date(),
  };
}
