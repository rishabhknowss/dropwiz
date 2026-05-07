import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { SEOHead, PageLayout } from "@/components/seo";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";
import { SITE_URL, NICHES, type Niche } from "@/lib/seo/constants";
import {
  getAllProductPaths,
  getProductBySlug,
  getProductsByNiche,
  type ProductSubcategory,
} from "@/lib/seo/products-data";

type ProductPageProps = {
  niche: Niche;
  nicheTitle: string;
  product: ProductSubcategory;
  relatedProducts: ProductSubcategory[];
};

const competitionColors = {
  Low: "bg-green-500/10 text-green-600 border-green-500/20",
  Medium: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  High: "bg-red-500/10 text-red-600 border-red-500/20",
};

const ProductPage = ({ niche, nicheTitle, product, relatedProducts }: ProductPageProps) => {
  const faqs = [
    {
      question: `Is ${product.name} good for dropshipping in 2026?`,
      answer: `${product.name} has ${product.searchVolume} monthly searches and ${product.competition.toLowerCase()} competition. With ${product.profitMargin} profit margins, ${product.name.toLowerCase()} can be profitable for dropshippers who ${product.targetAudience.toLowerCase()}.`,
    },
    {
      question: `What is the profit margin for ${product.name}?`,
      answer: `${product.name} typically offers ${product.profitMargin} profit margins with average selling prices of ${product.averagePrice}. Key suppliers include ${product.suppliers.join(", ")}.`,
    },
    {
      question: `Where to find suppliers for ${product.name}?`,
      answer: `The best suppliers for ${product.name} include ${product.suppliers.join(", ")}. ${product.shippingNotes}`,
    },
  ];

  return (
    <>
      <SEOHead
        meta={{
          title: `${product.name} Dropshipping 2026 - ${product.profitMargin} Profit | Dropwiz`,
          description: `Dropship ${product.name}: ${product.searchVolume} monthly searches, ${product.profitMargin} profit margin. Find suppliers, pricing, and market data for ${nicheTitle.toLowerCase()}.`,
          canonical: `${SITE_URL}/products/${niche}/${product.slug}`,
          keywords: [
            `${product.name.toLowerCase()} dropshipping`,
            `dropship ${product.name.toLowerCase()}`,
            `${product.name.toLowerCase()} suppliers`,
            `${nicheTitle.toLowerCase()} products`,
          ],
        }}
        schemas={[
          breadcrumbSchema([
            { name: "Products", url: `${SITE_URL}/products` },
            { name: nicheTitle, url: `${SITE_URL}/niches/${niche}` },
            { name: product.name, url: `${SITE_URL}/products/${niche}/${product.slug}` },
          ]),
          faqSchema(faqs),
        ]}
      />
      <PageLayout
        breadcrumbs={[
          { label: "Products", href: "/products" },
          { label: nicheTitle, href: `/niches/${niche}` },
        ]}
      >
        <article>
          <header className="not-prose mb-10">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full border px-3 py-1 text-sm font-medium ${competitionColors[product.competition]}`}
              >
                {product.competition} Competition
              </span>
              <span className="rounded-full bg-[color:var(--dw-accent)]/10 px-3 py-1 text-sm font-medium text-[color:var(--dw-accent)]">
                {product.searchVolume} searches/mo
              </span>
              <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm font-medium text-green-600">
                {product.profitMargin} margin
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {product.name} Dropshipping 2026
            </h1>
            <p className="mt-4 text-lg text-[color:var(--dw-text-muted)]">{product.description}</p>
          </header>

          <div className="not-prose mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-4">
              <div className="text-sm text-[color:var(--dw-text-muted)]">Avg. Price</div>
              <div className="mt-1 text-xl font-bold">{product.averagePrice}</div>
            </div>
            <div className="rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-4">
              <div className="text-sm text-[color:var(--dw-text-muted)]">Profit Margin</div>
              <div className="mt-1 text-xl font-bold text-green-600">{product.profitMargin}</div>
            </div>
            <div className="rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-4">
              <div className="text-sm text-[color:var(--dw-text-muted)]">Trending Score</div>
              <div className="mt-1 text-xl font-bold">{product.trendingScore}/100</div>
            </div>
            <div className="rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-4">
              <div className="text-sm text-[color:var(--dw-text-muted)]">Seasonality</div>
              <div className="mt-1 text-sm font-medium">{product.seasonality}</div>
            </div>
          </div>

          <section className="mb-10">
            <h2>Target Audience</h2>
            <p>{product.targetAudience}</p>
          </section>

          <section className="mb-10">
            <h2>Top Products to Sell</h2>
            <div className="not-prose grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {product.topProducts.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-3"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--dw-accent)]/10 text-sm font-bold text-[color:var(--dw-accent)]">
                    {i + 1}
                  </span>
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2>Recommended Suppliers</h2>
            <div className="not-prose flex flex-wrap gap-2">
              {product.suppliers.map((supplier, i) => (
                <Link
                  key={i}
                  href={`/suppliers/${supplier.toLowerCase().replace(/ /g, "-")}`}
                  className="rounded-full bg-[color:var(--dw-accent)]/10 px-4 py-2 text-sm font-medium text-[color:var(--dw-accent)] transition-colors hover:bg-[color:var(--dw-accent)]/20"
                >
                  {supplier}
                </Link>
              ))}
            </div>
            <p className="mt-4 text-sm text-[color:var(--dw-text-muted)]">{product.shippingNotes}</p>
          </section>

          <section id="faq">
            <h2>Frequently Asked Questions</h2>
            <div className="not-prose space-y-4">
              {faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)]"
                >
                  <summary className="cursor-pointer list-none p-4 font-medium">
                    <span className="flex items-center justify-between">
                      {faq.question}
                      <span className="ml-2 transition-transform group-open:rotate-180">↓</span>
                    </span>
                  </summary>
                  <div className="border-t border-[color:var(--dw-border)] p-4 text-sm text-[color:var(--dw-text-muted)]">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        </article>

        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-2xl font-bold">Related {nicheTitle} Products</h2>
            <div className="not-prose grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/products/${niche}/${related.slug}`}
                  className="group rounded-xl border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-4 transition-all hover:border-[color:var(--dw-accent)]/40"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        related.competition === "Low"
                          ? "bg-green-500/10 text-green-600"
                          : related.competition === "Medium"
                            ? "bg-yellow-500/10 text-yellow-600"
                            : "bg-red-500/10 text-red-600"
                      }`}
                    >
                      {related.competition}
                    </span>
                    <span className="text-xs text-[color:var(--dw-text-muted)]">
                      {related.searchVolume}
                    </span>
                  </div>
                  <h3 className="font-semibold transition-colors group-hover:text-[color:var(--dw-accent)]">
                    {related.name}
                  </h3>
                  <div className="mt-2 text-sm text-green-600">{related.profitMargin}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="not-prose mt-12 rounded-xl border border-[color:var(--dw-accent)]/20 bg-gradient-to-r from-[color:var(--dw-accent)]/5 to-transparent p-8 text-center">
          <h3 className="text-2xl font-bold">Start Selling {product.name}</h3>
          <p className="mt-2 text-[color:var(--dw-text-muted)]">
            Create a high-converting product page in seconds with AI.
          </p>
          <Link
            href="/build/new"
            className="mt-4 inline-block whitespace-nowrap rounded-full bg-[color:var(--dw-accent)] px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
          >
            Build Your Store →
          </Link>
        </div>
      </PageLayout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  const paths = getAllProductPaths().map(({ niche, product }) => ({
    params: { niche, product },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<ProductPageProps> = ({ params }) => {
  const niche = params?.niche as Niche;
  const productSlug = params?.product as string;

  if (!NICHES.includes(niche)) {
    return { notFound: true };
  }

  const product = getProductBySlug(niche, productSlug);

  if (!product) {
    return { notFound: true };
  }

  const nicheTitle = niche
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const allProducts = getProductsByNiche(niche);
  const relatedProducts = allProducts.filter((p) => p.slug !== productSlug).slice(0, 4);

  return {
    props: {
      niche,
      nicheTitle,
      product,
      relatedProducts,
    },
  };
};

export default ProductPage;
