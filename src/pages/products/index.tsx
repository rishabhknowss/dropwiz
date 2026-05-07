import type { GetStaticProps } from "next";
import Link from "next/link";
import { SEOHead, PageLayout } from "@/components/seo";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE_URL, NICHES } from "@/lib/seo/constants";
import { NICHE_PRODUCTS, type ProductSummary } from "@/lib/seo/products-data";

type ProductsIndexProps = {
  nicheData: Array<{
    niche: string;
    nicheTitle: string;
    productCount: number;
    topProducts: ProductSummary[];
  }>;
  totalProducts: number;
};

const nicheIcons: Record<string, string> = {
  "pet-supplies": "🐕",
  "home-decor": "🏠",
  fitness: "💪",
  beauty: "💄",
  fashion: "👗",
  electronics: "📱",
  kitchen: "🍳",
  outdoor: "⛺",
  baby: "👶",
  automotive: "🚗",
  jewelry: "💍",
  sports: "⚽",
  toys: "🧸",
  health: "🏥",
  gardening: "🌱",
};

const ProductsIndex = ({ nicheData, totalProducts }: ProductsIndexProps) => {
  return (
    <>
      <SEOHead
        meta={{
          title: "Dropshipping Products 2026 - Find Winning Products | Dropwiz",
          description: `Discover ${totalProducts}+ winning dropshipping products across ${nicheData.filter((n) => n.productCount > 0).length} niches. Find trending products with profit margins, suppliers, and market data.`,
          canonical: `${SITE_URL}/products`,
          keywords: [
            "dropshipping products",
            "winning products 2026",
            "best products to dropship",
            "trending products",
          ],
        }}
        schemas={[breadcrumbSchema([{ name: "Products", url: `${SITE_URL}/products` }])]}
      />
      <PageLayout breadcrumbs={[]}>
        <header className="not-prose mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-600">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            {totalProducts}+ Products Analyzed
          </div>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Winning Dropshipping Products 2026
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[color:var(--dw-text-muted)]">
            Data-driven product research for dropshippers. Find trending products with profit margins,
            supplier recommendations, and market demand analysis.
          </p>
        </header>

        <div className="not-prose space-y-12">
          {nicheData
            .filter((n) => n.productCount > 0)
            .map((nicheItem) => (
              <section key={nicheItem.niche}>
                <div className="mb-6 flex items-center gap-3">
                  <span className="text-3xl">{nicheIcons[nicheItem.niche] || "📦"}</span>
                  <div>
                    <h2 className="text-2xl font-bold">{nicheItem.nicheTitle}</h2>
                    <p className="text-sm text-[color:var(--dw-text-muted)]">
                      {nicheItem.productCount} product categories
                    </p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {nicheItem.topProducts.slice(0, 8).map((product) => (
                    <Link
                      key={product.slug}
                      href={`/products/${nicheItem.niche}/${product.slug}`}
                      className="group rounded-xl border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-4 transition-all hover:border-[color:var(--dw-accent)]/40 hover:shadow-lg"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            product.competition === "Low"
                              ? "bg-green-500/10 text-green-600"
                              : product.competition === "Medium"
                                ? "bg-yellow-500/10 text-yellow-600"
                                : "bg-red-500/10 text-red-600"
                          }`}
                        >
                          {product.competition}
                        </span>
                        <span className="text-xs text-[color:var(--dw-text-muted)]">
                          {product.searchVolume}
                        </span>
                      </div>
                      <h3 className="font-semibold transition-colors group-hover:text-[color:var(--dw-accent)]">
                        {product.name}
                      </h3>
                      <div className="mt-2 flex items-center justify-between text-sm">
                        <span className="text-green-600">{product.profitMargin}</span>
                        <span className="text-[color:var(--dw-text-muted)]">
                          {product.averagePrice}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
                {nicheItem.productCount > 8 && (
                  <Link
                    href={`/niches/${nicheItem.niche}`}
                    className="mt-4 inline-flex items-center text-sm text-[color:var(--dw-accent)] hover:underline"
                  >
                    View all {nicheItem.productCount} {nicheItem.nicheTitle.toLowerCase()} products →
                  </Link>
                )}
              </section>
            ))}
        </div>

        <div className="not-prose mt-12 rounded-xl border border-[color:var(--dw-accent)]/20 bg-gradient-to-r from-[color:var(--dw-accent)]/5 to-transparent p-8 text-center">
          <h3 className="text-2xl font-bold">Found Your Winning Product?</h3>
          <p className="mt-2 text-[color:var(--dw-text-muted)]">
            Build a high-converting product page in seconds with AI.
          </p>
          <Link
            href="/build/new"
            className="mt-4 inline-block whitespace-nowrap rounded-full bg-[color:var(--dw-accent)] px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
          >
            Start Building →
          </Link>
        </div>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps<ProductsIndexProps> = () => {
  const nicheData = NICHES.map((niche) => {
    const products = NICHE_PRODUCTS[niche] || [];
    const nicheTitle = niche
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    const topProducts = [...products]
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .map(({ slug, name, competition, searchVolume, profitMargin, averagePrice, trendingScore }) => ({
        slug,
        name,
        competition,
        searchVolume,
        profitMargin,
        averagePrice,
        trendingScore,
      }));

    return {
      niche,
      nicheTitle,
      productCount: products.length,
      topProducts,
    };
  });

  const totalProducts = nicheData.reduce((sum, n) => sum + n.productCount, 0);

  return {
    props: {
      nicheData,
      totalProducts,
    },
  };
};

export default ProductsIndex;
