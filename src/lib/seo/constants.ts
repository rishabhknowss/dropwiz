export const SITE_URL = "https://www.dropwiz.ai";
export const SITE_NAME = "Dropwiz";
export const SITE_DESCRIPTION =
  "AI-powered Shopify store builder. Generate high-converting product pages, landing pages, and store copy in seconds.";
export const TWITTER_HANDLE = "@dropwiz_ai";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`;

export const NICHES = [
  "pet-supplies",
  "home-decor",
  "fitness",
  "beauty",
  "fashion",
  "electronics",
  "kitchen",
  "outdoor",
  "baby",
  "automotive",
  "jewelry",
  "sports",
  "toys",
  "health",
  "gardening",
] as const;

export const PLATFORMS = [
  "amazon",
  "aliexpress",
  "alibaba",
  "etsy",
  "ebay",
  "shopify",
  "tiktok-shop",
] as const;

export const GUIDE_CATEGORIES = [
  "dropshipping",
  "print-on-demand",
  "ecommerce",
  "product-research",
  "store-design",
  "marketing",
] as const;

export type Niche = (typeof NICHES)[number];
export type Platform = (typeof PLATFORMS)[number];
export type GuideCategory = (typeof GUIDE_CATEGORIES)[number];
