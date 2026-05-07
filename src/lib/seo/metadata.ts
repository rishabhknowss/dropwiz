import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  TWITTER_HANDLE,
  DEFAULT_OG_IMAGE,
} from "./constants";

export type PageMetadata = {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "product";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  noIndex?: boolean;
  keywords?: string[];
};

export const generateMetaTags = (meta: PageMetadata) => {
  const title = meta.title.includes(SITE_NAME)
    ? meta.title
    : `${meta.title} | ${SITE_NAME}`;
  const canonical = meta.canonical ?? SITE_URL;
  const ogImage = meta.ogImage ?? DEFAULT_OG_IMAGE;

  return {
    title,
    description: meta.description,
    canonical,
    openGraph: {
      title,
      description: meta.description,
      url: canonical,
      siteName: SITE_NAME,
      type: meta.ogType ?? "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(meta.publishedTime && { publishedTime: meta.publishedTime }),
      ...(meta.modifiedTime && { modifiedTime: meta.modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      site: TWITTER_HANDLE,
      title,
      description: meta.description,
      images: [ogImage],
    },
    robots: meta.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    ...(meta.keywords && { keywords: meta.keywords.join(", ") }),
  };
};

export const homeMetadata: PageMetadata = {
  title: "Dropwiz - AI Shopify Store Builder | Generate Stores in Seconds",
  description:
    "Build high-converting Shopify stores with AI. Import any product URL, get instant landing pages, product descriptions, and professional copy. Start free.",
  keywords: [
    "ai shopify store builder",
    "shopify dropshipping",
    "ai product page generator",
    "dropshipping automation",
    "shopify store generator",
  ],
};

export const guidesMetadata = (
  slug: string,
  title: string,
  description: string,
): PageMetadata => ({
  title: `${title} (2026 Guide)`,
  description,
  canonical: `${SITE_URL}/guides/${slug}`,
  ogType: "article",
  keywords: [slug.replace(/-/g, " "), "2026", "guide", "tutorial"],
});

export const productsMetadata = (
  category: string,
  title: string,
  description: string,
): PageMetadata => ({
  title: `${title} | Trending Products 2026`,
  description,
  canonical: `${SITE_URL}/products/${category}`,
  ogType: "website",
  keywords: [category.replace(/-/g, " "), "trending products", "2026"],
});

export const toolMetadata = (
  slug: string,
  title: string,
  description: string,
): PageMetadata => ({
  title: `Free ${title} | Dropwiz Tools`,
  description,
  canonical: `${SITE_URL}/tools/${slug}`,
  ogType: "website",
  keywords: [slug.replace(/-/g, " "), "free tool", "generator"],
});

export const nicheMetadata = (niche: string): PageMetadata => {
  const nicheTitle = niche
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    title: `${nicheTitle} Dropshipping - Products, Suppliers & Guide 2026`,
    description: `Start a profitable ${nicheTitle.toLowerCase()} dropshipping business in 2026. Find trending products, reliable suppliers, and build your store with AI.`,
    canonical: `${SITE_URL}/niches/${niche}`,
    ogType: "website",
    keywords: [
      `${niche} dropshipping`,
      `${niche} products`,
      "trending products 2026",
    ],
  };
};

export const storeMetadata = (
  slug: string,
  name: string,
  description?: string,
): PageMetadata => ({
  title: name,
  description: description ?? `Check out ${name} - Built with Dropwiz AI`,
  canonical: `${SITE_URL}/p/${slug}`,
  ogType: "product",
});
