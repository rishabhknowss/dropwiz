import { createHash } from "crypto";
import type { ScrapedProduct } from "./index";

export type AnalysisDimension = {
  score: number;
  label: string;
  detail: string;
};

export type ProductAnalysis = {
  score: number;
  margin: AnalysisDimension;
  perceivedValue: AnalysisDimension;
  reviews: AnalysisDimension;
  trend: AnalysisDimension;
};

const TREND_KEYWORDS = [
  "smart",
  "led",
  "wireless",
  "rechargeable",
  "eco",
  "organic",
  "portable",
  "compact",
  "ergonomic",
  "bluetooth",
  "usb-c",
  "tiktok",
  "viral",
  "minimalist",
  "premium",
  "self-",
  "auto-",
  "ai",
];

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(n)));
}

function deterministicNoise(seed: string, range: number): number {
  const h = createHash("md5").update(seed).digest();
  return (h[0] / 255) * range;
}

function analyzeMargin(product: ScrapedProduct): AnalysisDimension {
  const price = product.priceCents ?? 0;
  const cost = product.estCostCents ?? 0;
  if (!price || !cost) {
    return {
      score: 60,
      label: "Margin constraints",
      detail: "Estimated — couldn't read cost",
    };
  }
  const marginPct = ((price - cost) / price) * 100;
  let score: number;
  if (marginPct >= 70) score = 95;
  else if (marginPct >= 55) score = 85;
  else if (marginPct >= 40) score = 70;
  else if (marginPct >= 25) score = 55;
  else score = 40;
  return {
    score,
    label: "Margin constraints",
    detail: `${Math.round(marginPct)}% est. margin`,
  };
}

function analyzePerceivedValue(product: ScrapedProduct): AnalysisDimension {
  const imageCount = (product.originalImages as string[] | null)?.length ?? 0;
  const descLen = (product.description ?? "").length;
  const features =
    ((product.rawPayload as { features?: string[] } | null)?.features ?? []).length;
  const brand = (product.rawPayload as { brand?: string } | null)?.brand ?? "";

  let score = 40;
  if (imageCount >= 4) score += 20;
  else if (imageCount >= 2) score += 12;
  else if (imageCount >= 1) score += 6;

  if (descLen >= 400) score += 15;
  else if (descLen >= 180) score += 10;
  else if (descLen >= 80) score += 5;

  if (features >= 4) score += 15;
  else if (features >= 2) score += 8;

  if (brand) score += 5;

  return {
    score: clamp(score),
    label: "Perceived value",
    detail: `${imageCount} image${imageCount === 1 ? "" : "s"} · ${features} feature${features === 1 ? "" : "s"}`,
  };
}

function analyzeReviews(product: ScrapedProduct): AnalysisDimension {
  const raw = product.rawPayload as
    | { reviewCount?: number; rating?: number }
    | null;
  const count = raw?.reviewCount ?? 0;
  const rating = raw?.rating ?? 0;

  if (count === 0 && rating === 0) {
    return {
      score: 55,
      label: "Analyzing reviews",
      detail: "No public reviews found",
    };
  }

  let score = 40;
  if (count >= 5000) score += 35;
  else if (count >= 1000) score += 28;
  else if (count >= 300) score += 20;
  else if (count >= 50) score += 12;
  else if (count >= 10) score += 6;

  if (rating >= 4.7) score += 25;
  else if (rating >= 4.4) score += 18;
  else if (rating >= 4.0) score += 10;
  else if (rating >= 3.5) score += 4;

  const detail =
    rating > 0 && count > 0
      ? `${rating.toFixed(1)}★ · ${count.toLocaleString()} reviews`
      : count > 0
        ? `${count.toLocaleString()} reviews`
        : `${rating.toFixed(1)}★`;

  return { score: clamp(score), label: "Analyzing reviews", detail };
}

function analyzeTrend(product: ScrapedProduct): AnalysisDimension {
  const text = `${product.title ?? ""} ${product.description ?? ""}`.toLowerCase();
  const matches = TREND_KEYWORDS.filter((k) => text.includes(k)).length;

  let score = 55;
  if (matches >= 4) score = 92;
  else if (matches >= 3) score = 85;
  else if (matches >= 2) score = 75;
  else if (matches >= 1) score = 65;

  score += deterministicNoise(product.sourceUrlHash, 6) - 3;

  return {
    score: clamp(score),
    label: "Trend analysis",
    detail:
      matches > 0
        ? `${matches} trending signal${matches === 1 ? "" : "s"}`
        : "Niche evergreen",
  };
}

export function analyzeProduct(product: ScrapedProduct): ProductAnalysis {
  const margin = analyzeMargin(product);
  const perceivedValue = analyzePerceivedValue(product);
  const reviews = analyzeReviews(product);
  const trend = analyzeTrend(product);

  const score = clamp(
    margin.score * 0.32 +
      perceivedValue.score * 0.22 +
      reviews.score * 0.28 +
      trend.score * 0.18,
  );

  return { score, margin, perceivedValue, reviews, trend };
}
