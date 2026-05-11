import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { SEOHead, PageLayout } from "@/components/seo";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";
import { SITE_URL, NICHES, type Niche } from "@/lib/seo/constants";
import { getAllCountries, getCountryBySlug, type Country } from "@/lib/seo/countries-data";
import { getProductsByNiche, type ProductSubcategory } from "@/lib/seo/products-data";

type MarketNichePageProps = {
  country: Country;
  niche: Niche;
  nicheTitle: string;
  products: ProductSubcategory[];
  isTopNiche: boolean;
};

const nicheMarketInsights: Record<string, Record<string, string>> = {
  "pet-supplies": {
    "united-states": "Americans spend over $100 billion annually on pets. Premium pet products, subscription boxes, and health-focused items perform exceptionally well.",
    "united-kingdom": "UK pet ownership increased significantly. Focus on eco-friendly and premium products. British consumers prefer quality over price.",
    germany: "Germans are passionate pet owners with high standards for product quality. Organic and sustainable pet products see strong demand.",
    australia: "Outdoor-focused pet products excel. High demand for pet cooling products and travel accessories due to climate.",
  },
  fitness: {
    "united-states": "Home fitness remains strong post-pandemic. Smart fitness devices and recovery tools are trending. TikTok drives viral fitness products.",
    "united-kingdom": "Fitness culture is growing. Compact home gym equipment and athleisure crossover products perform well.",
    germany: "Germans value quality fitness equipment. Outdoor fitness and cycling gear have strong markets.",
    australia: "Outdoor fitness is huge. Swimming, surfing, and beach fitness products see high demand.",
  },
  beauty: {
    "united-states": "Clean beauty and skincare tech dominate. Influencer marketing is essential. K-beauty and J-beauty remain popular.",
    france: "French consumers expect high-quality cosmetics. Natural ingredients and luxury positioning work best.",
    "south-korea": "Cutting-edge skincare innovations. Local competition is fierce but export opportunities exist.",
    japan: "Quality-focused beauty market. Minimalist skincare and unique formulations resonate well.",
  },
  electronics: {
    "united-states": "Tech accessories and smart home devices lead. Fast shipping expectations. High return rates to manage.",
    germany: "Quality and durability expectations are high. Tech-savvy consumers do extensive research before buying.",
    japan: "Advanced tech adoption. Compact and innovative gadgets perform well. High standards for quality.",
    "south-korea": "Early adopters of new technology. Gaming peripherals and mobile accessories see strong demand.",
  },
  fashion: {
    "united-states": "Casual and athleisure dominate. Size inclusivity important. Fast shipping expectations.",
    "united-kingdom": "Fashion-forward market. Sustainable fashion growing. Street style and designer dupes popular.",
    france: "Quality and style paramount. Classic pieces over fast fashion. Brand reputation matters.",
    italy: "Design-conscious consumers. Quality materials expected. Accessories can outperform apparel.",
  },
};

const getMarketNicheInsight = (niche: string, countrySlug: string, countryName: string, nicheTitle: string): string => {
  const nicheInsights = nicheMarketInsights[niche];
  if (nicheInsights && nicheInsights[countrySlug]) {
    return nicheInsights[countrySlug];
  }
  return `${nicheTitle} products have growing demand in ${countryName}. Focus on understanding local preferences and optimizing for local payment methods and shipping expectations.`;
};

const MarketNichePage = ({ country, niche, nicheTitle, products, isTopNiche }: MarketNichePageProps) => {
  const insight = getMarketNicheInsight(niche, country.slug, country.name, nicheTitle);

  const faqs = [
    {
      question: `Is ${nicheTitle.toLowerCase()} dropshipping profitable in ${country.name}?`,
      answer: `${nicheTitle} ${isTopNiche ? "is one of the top-performing niches" : "shows good potential"} in ${country.name}. With ${country.ecommerceRevenue} in ecommerce revenue and ${country.ecommerceGrowth} annual growth, the market offers solid opportunities for dropshippers who understand local preferences.`,
    },
    {
      question: `What payment methods should I offer for ${nicheTitle.toLowerCase()} in ${country.name}?`,
      answer: `The most popular payment methods in ${country.name} are ${country.paymentMethods.slice(0, 3).join(", ")}. ${country.paymentMethods[0]} is particularly important for conversions in this market.`,
    },
    {
      question: `How long does shipping take to ${country.name}?`,
      answer: `${country.shippingConsiderations} Consider using local suppliers or fulfillment centers for faster delivery times in ${country.name}.`,
    },
  ];

  return (
    <>
      <SEOHead
        meta={{
          title: `${nicheTitle} Dropshipping in ${country.name} 2026 - Market Guide | Dropwiz`,
          description: `Start ${nicheTitle.toLowerCase()} dropshipping in ${country.name}: ${country.ecommerceGrowth} market growth, top payment methods, shipping tips, and winning products.`,
          canonical: `${SITE_URL}/markets/${country.slug}/${niche}`,
          keywords: [
            `${nicheTitle.toLowerCase()} dropshipping ${country.name.toLowerCase()}`,
            `dropship ${nicheTitle.toLowerCase()} to ${country.name.toLowerCase()}`,
            `${country.name.toLowerCase()} ${nicheTitle.toLowerCase()} market`,
            `sell ${nicheTitle.toLowerCase()} in ${country.name.toLowerCase()}`,
          ],
        }}
        schemas={[
          breadcrumbSchema([
            { name: "Markets", url: `${SITE_URL}/markets` },
            { name: country.name, url: `${SITE_URL}/markets/${country.slug}` },
            { name: nicheTitle, url: `${SITE_URL}/markets/${country.slug}/${niche}` },
          ]),
          faqSchema(faqs),
        ]}
      />
      <PageLayout
        breadcrumbs={[
          { label: "Markets", href: "/markets" },
          { label: country.name, href: `/markets/${country.slug}` },
        ]}
      >
        <article>
          <header className="not-prose mb-10">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="text-3xl">{country.code}</span>
              {isTopNiche && (
                <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm font-medium text-green-600">
                  Top Niche
                </span>
              )}
              <span className="rounded-full bg-[color:var(--dw-accent)]/10 px-3 py-1 text-sm font-medium text-[color:var(--dw-accent)]">
                {country.tier}-Tier Market
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {nicheTitle} Dropshipping in {country.name} 2026
            </h1>
            <p className="mt-4 text-lg text-[color:var(--dw-text-muted)]">
              Complete guide to selling {nicheTitle.toLowerCase()} products in {country.name}.
              {country.ecommerceRevenue} market with {country.ecommerceGrowth} annual growth.
            </p>
          </header>

          <div className="not-prose mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-4">
              <div className="text-sm text-[color:var(--dw-text-muted)]">Market Size</div>
              <div className="mt-1 text-xl font-bold">{country.ecommerceRevenue}</div>
            </div>
            <div className="rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-4">
              <div className="text-sm text-[color:var(--dw-text-muted)]">Growth Rate</div>
              <div className="mt-1 text-xl font-bold text-green-600">{country.ecommerceGrowth}</div>
            </div>
            <div className="rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-4">
              <div className="text-sm text-[color:var(--dw-text-muted)]">Currency</div>
              <div className="mt-1 text-xl font-bold">{country.currency}</div>
            </div>
            <div className="rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-4">
              <div className="text-sm text-[color:var(--dw-text-muted)]">Tax/VAT</div>
              <div className="mt-1 text-sm font-medium">{country.vatTax}</div>
            </div>
          </div>

          <section className="mb-10">
            <h2>{nicheTitle} Market Insights for {country.name}</h2>
            <p>{insight}</p>
            <p className="mt-4">{country.consumerBehavior}</p>
          </section>

          <section className="mb-10">
            <h2>Payment Methods for {country.name}</h2>
            <p>
              To maximize conversions when selling {nicheTitle.toLowerCase()} products in {country.name},
              ensure your store supports these payment methods:
            </p>
            <div className="not-prose mt-4 flex flex-wrap gap-2">
              {country.paymentMethods.map((method, i) => (
                <span
                  key={i}
                  className={`rounded-full border px-3 py-1 text-sm ${
                    i === 0
                      ? "border-[color:var(--dw-accent)] bg-[color:var(--dw-accent)]/10 text-[color:var(--dw-accent)]"
                      : "border-[color:var(--dw-border)]"
                  }`}
                >
                  {method}
                  {i === 0 && " (Essential)"}
                </span>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2>Shipping to {country.name}</h2>
            <p>{country.shippingConsiderations}</p>
            <div className="not-prose mt-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
              <div className="font-medium text-yellow-600">Shipping Tip</div>
              <p className="mt-1 text-sm text-[color:var(--dw-text-muted)]">
                For {nicheTitle.toLowerCase()} products, consider using regional suppliers or
                fulfillment centers to reduce delivery times and improve customer satisfaction.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2>Top Ecommerce Platforms in {country.name}</h2>
            <div className="not-prose flex flex-wrap gap-2">
              {country.topPlatforms.map((platform, i) => (
                <span
                  key={i}
                  className="rounded-lg bg-[color:var(--dw-surface)] px-3 py-2 text-sm font-medium"
                >
                  {platform}
                </span>
              ))}
            </div>
          </section>

          {products.length > 0 && (
            <section className="mb-10">
              <h2>Top {nicheTitle} Products for {country.name}</h2>
              <div className="not-prose grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {products.slice(0, 6).map((product) => (
                  <Link
                    key={product.slug}
                    href={`/products/${niche}/${product.slug}`}
                    className="group rounded-xl border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-4 transition-all hover:border-[color:var(--dw-accent)]/40"
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
                    <div className="mt-2 text-sm text-green-600">{product.profitMargin}</div>
                  </Link>
                ))}
              </div>
              <Link
                href={`/niches/${niche}`}
                className="mt-4 inline-flex items-center text-sm text-[color:var(--dw-accent)] hover:underline"
              >
                View all {nicheTitle.toLowerCase()} products →
              </Link>
            </section>
          )}

          <div className="not-prose mb-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-6">
              <h3 className="mb-4 font-semibold text-green-600">Opportunities</h3>
              <ul className="space-y-2">
                {country.opportunities.map((opp, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    {opp}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
              <h3 className="mb-4 font-semibold text-red-600">Challenges</h3>
              <ul className="space-y-2">
                {country.challenges.map((challenge, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-red-500">!</span>
                    {challenge}
                  </li>
                ))}
              </ul>
            </div>
          </div>

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

        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">More Niches in {country.name}</h2>
          <div className="not-prose grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {NICHES.filter((n) => n !== niche)
              .slice(0, 5)
              .map((otherNiche) => {
                const otherNicheTitle = otherNiche
                  .split("-")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ");
                const isTopForCountry = country.topNiches.some((tn) =>
                  tn.toLowerCase().includes(otherNiche.replace("-", " "))
                );
                return (
                  <Link
                    key={otherNiche}
                    href={`/markets/${country.slug}/${otherNiche}`}
                    className="group rounded-xl border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-4 transition-all hover:border-[color:var(--dw-accent)]/40"
                  >
                    <div className="font-semibold transition-colors group-hover:text-[color:var(--dw-accent)]">
                      {otherNicheTitle}
                    </div>
                    {isTopForCountry && (
                      <div className="mt-1 text-xs text-green-600">Top Niche</div>
                    )}
                  </Link>
                );
              })}
          </div>
        </section>

        <div className="not-prose mt-12 rounded-xl border border-[color:var(--dw-accent)]/20 bg-gradient-to-r from-[color:var(--dw-accent)]/5 to-transparent p-8 text-center">
          <h3 className="text-2xl font-bold">Start Selling {nicheTitle} in {country.name}</h3>
          <p className="mt-2 text-[color:var(--dw-text-muted)]">
            Build a localized, high-converting store with AI-powered product pages.
          </p>
          <Link
            href="/build/new"
            className="mt-4 inline-block whitespace-nowrap rounded-full bg-[color:var(--dw-accent)] px-6 py-3 font-medium text-[#0A0A0A] transition-opacity hover:opacity-90"
          >
            Start Building →
          </Link>
        </div>
      </PageLayout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  const countries = getAllCountries();
  const paths: Array<{ params: { slug: string; niche: string } }> = [];

  countries.forEach((country) => {
    NICHES.forEach((niche) => {
      paths.push({
        params: { slug: country.slug, niche },
      });
    });
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<MarketNichePageProps> = ({ params }) => {
  const slug = params?.slug as string;
  const niche = params?.niche as Niche;

  const country = getCountryBySlug(slug);

  if (!country || !NICHES.includes(niche)) {
    return { notFound: true };
  }

  const nicheTitle = niche
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const products = getProductsByNiche(niche);

  const isTopNiche = country.topNiches.some((tn) =>
    tn.toLowerCase().includes(niche.replace("-", " ")) ||
    niche.replace("-", " ").includes(tn.toLowerCase().split(" ")[0])
  );

  return {
    props: {
      country,
      niche,
      nicheTitle,
      products,
      isTopNiche,
    },
  };
};

export default MarketNichePage;
