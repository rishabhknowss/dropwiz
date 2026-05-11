import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db";
import { stores, curatedProducts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { SITE_URL, NICHES, PLATFORMS } from "@/lib/seo/constants";
import { getAllGuides } from "@/lib/seo/guides-data";
import { getAllBlogPosts } from "@/lib/seo/blog-data";
import { getAllGlossaryTerms } from "@/lib/seo/glossary-data";
import { getAllComparisons } from "@/lib/seo/comparisons-data";

const staticPages = [
  { url: "/", changefreq: "daily", priority: 1.0 },
  { url: "/terms", changefreq: "monthly", priority: 0.3 },
  { url: "/privacy", changefreq: "monthly", priority: 0.3 },
  { url: "/guides", changefreq: "weekly", priority: 0.9 },
  { url: "/blog", changefreq: "daily", priority: 0.9 },
  { url: "/glossary", changefreq: "weekly", priority: 0.8 },
  { url: "/compare", changefreq: "weekly", priority: 0.8 },
  { url: "/tools", changefreq: "weekly", priority: 0.8 },
  { url: "/tools/profit-calculator", changefreq: "monthly", priority: 0.7 },
  { url: "/products", changefreq: "daily", priority: 0.9 },
  { url: "/niches", changefreq: "weekly", priority: 0.8 },
];

const generateSitemapXml = (urls: Array<{ loc: string; lastmod?: string; changefreq?: string; priority?: number }>) => {
  const urlset = urls
    .map(
      (url) => `
    <url>
      <loc>${url.loc}</loc>
      ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ""}
      ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ""}
      ${url.priority !== undefined ? `<priority>${url.priority}</priority>` : ""}
    </url>`,
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>`;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  try {
    const urls: Array<{ loc: string; lastmod?: string; changefreq?: string; priority?: number }> = [];

    staticPages.forEach((page) => {
      urls.push({
        loc: `${SITE_URL}${page.url}`,
        changefreq: page.changefreq,
        priority: page.priority,
      });
    });

    NICHES.forEach((niche) => {
      urls.push({
        loc: `${SITE_URL}/niches/${niche}`,
        changefreq: "weekly",
        priority: 0.7,
      });
    });

    getAllGuides().forEach((guide) => {
      urls.push({
        loc: `${SITE_URL}/guides/${guide.slug}`,
        lastmod: guide.lastUpdated,
        changefreq: "weekly",
        priority: 0.8,
      });
    });

    getAllBlogPosts().forEach((post) => {
      urls.push({
        loc: `${SITE_URL}/blog/${post.slug}`,
        lastmod: post.updatedAt,
        changefreq: "weekly",
        priority: 0.7,
      });
    });

    getAllGlossaryTerms().forEach((term) => {
      urls.push({
        loc: `${SITE_URL}/glossary/${term.slug}`,
        changefreq: "monthly",
        priority: 0.6,
      });
    });

    getAllComparisons().forEach((comparison) => {
      urls.push({
        loc: `${SITE_URL}/compare/${comparison.slug}`,
        lastmod: comparison.lastUpdated,
        changefreq: "weekly",
        priority: 0.7,
      });
    });

    const publishedStores = await db
      .select({ slug: stores.slug, updatedAt: stores.updatedAt })
      .from(stores)
      .where(eq(stores.status, "published"))
      .orderBy(desc(stores.updatedAt))
      .limit(10000);

    publishedStores.forEach((store) => {
      urls.push({
        loc: `${SITE_URL}/p/${store.slug}`,
        lastmod: store.updatedAt.toISOString().split("T")[0],
        changefreq: "weekly",
        priority: 0.6,
      });
    });

    const products = await db
      .select({ id: curatedProducts.id, niche: curatedProducts.niche, publishedAt: curatedProducts.publishedAt })
      .from(curatedProducts)
      .orderBy(desc(curatedProducts.publishedAt))
      .limit(10000);

    products.forEach((product) => {
      urls.push({
        loc: `${SITE_URL}/products/${product.id}`,
        lastmod: product.publishedAt.toISOString().split("T")[0],
        changefreq: "weekly",
        priority: 0.5,
      });
    });

    const xml = generateSitemapXml(urls);

    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).send(xml);
  } catch (error) {
    console.error("Sitemap generation error:", error);
    res.status(500).end();
  }
};

export default handler;
