import { createHash } from "crypto";
import axios, { AxiosError } from "axios";
import { env } from "@/env";
import type { NewProduct } from "@/db/schema";
import type { ScrapedProduct } from "./index";

const FIRECRAWL_API = "https://api.firecrawl.dev/v2";

const EXTRACT_PROMPT = `Extract product information from this page for a dropshipping store.

Required:
- title: short product name (max 120 chars), no SKU codes
- description: 2-4 sentences describing what the product does, materials, key features. Plain prose, no bullet lists, no marketing fluff.
- priceCents: current selling price in smallest currency unit (cents/paise). Convert "$24.99" to 2499. If sale price exists, use that.
- currency: ISO 4217 code uppercase (USD/INR/EUR/GBP)
- images: array of 1-6 product image URLs, hi-res, in display order. Skip logos and unrelated images.
- features: array of 3-6 short bullet phrases (max 80 chars each) summarizing key features/benefits. Empty array if none found.
- reviewCount: total number of reviews/ratings if visible, 0 if not shown.
- rating: average rating out of 5 (e.g. 4.6) if shown, 0 if not shown.
- brand: brand or seller name if shown, empty string otherwise.

Skip ads and related products. Focus only on the main product on the page.`;

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
  } catch (err) {
    const axErr = err as AxiosError<{ error?: string }>;
    const msg =
      axErr.response?.data?.error ?? axErr.message ?? "Firecrawl request failed";
    throw new Error(`Firecrawl scrape failed: ${msg}`);
  }

  if (!response.success || !response.data?.json) {
    throw new Error(response.error ?? "Firecrawl returned no structured data");
  }

  const extracted = response.data.json;
  const platform = detectPlatform(sourceUrl);
  const images = (extracted.images ?? []).filter(
    (u) => typeof u === "string" && /^https?:\/\//i.test(u),
  );

  if (images.length === 0 && response.data.metadata?.ogImage) {
    images.push(response.data.metadata.ogImage);
  }

  const priceCents = Math.max(0, Math.round(extracted.priceCents ?? 0));

  return {
    sourceUrl,
    sourceUrlHash: hashUrl(sourceUrl),
    sourcePlatform: platform,
    title: extracted.title?.slice(0, 200) ?? "Untitled product",
    description: extracted.description ?? "",
    priceCents,
    estCostCents: estimateCost(priceCents, platform),
    currency: (extracted.currency ?? "USD").toUpperCase(),
    originalImages: images.slice(0, 6),
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
