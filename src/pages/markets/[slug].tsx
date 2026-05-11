import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { SEOHead, PageLayout } from "@/components/seo";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/seo/constants";
import {
  getCountryBySlug,
  getAllCountries,
  getCountriesByRegion,
  type Country,
} from "@/lib/seo/countries-data";

type MarketPageProps = {
  country: Country;
  regionCountries: Country[];
};

const tierLabels = {
  S: "Top Market",
  A: "Excellent",
  B: "Growing",
  C: "Challenging",
};

const MarketPage = ({ country, regionCountries }: MarketPageProps) => {
  const faqs = [
    {
      question: `Is ${country.name} good for dropshipping in 2026?`,
      answer: `${country.name} is rated ${country.tier}-tier for dropshipping. With ${country.ecommerceRevenue} in ecommerce revenue and ${country.ecommerceGrowth} growth, ${country.opportunities[0]?.toLowerCase() || "it offers various opportunities"}.`,
    },
    {
      question: `What payment methods are used in ${country.name}?`,
      answer: `Popular payment methods in ${country.name} include ${country.paymentMethods.slice(0, 4).join(", ")}. ${country.paymentMethods[0]} is particularly important for success in this market.`,
    },
    {
      question: `What are the best niches for dropshipping in ${country.name}?`,
      answer: `Top performing niches in ${country.name} include ${country.topNiches.slice(0, 4).join(", ")}. ${country.consumerBehavior}`,
    },
  ];

  return (
    <>
      <SEOHead
        meta={{
          title: `Dropshipping in ${country.name} 2026 - Complete Market Guide | Dropwiz`,
          description: `Start dropshipping in ${country.name}: ${country.ecommerceRevenue} market, ${country.ecommerceGrowth} growth. Learn payment methods, shipping, top niches, and strategies.`,
          canonical: `${SITE_URL}/markets/${country.slug}`,
          keywords: [
            `dropshipping ${country.name.toLowerCase()}`,
            `ecommerce ${country.name.toLowerCase()}`,
            `sell to ${country.name.toLowerCase()}`,
            `${country.name.toLowerCase()} market 2026`,
          ],
        }}
        schemas={[
          breadcrumbSchema([
            { name: "Markets", url: `${SITE_URL}/markets` },
            { name: country.name, url: `${SITE_URL}/markets/${country.slug}` },
          ]),
          faqSchema(faqs),
        ]}
      />
      <PageLayout breadcrumbs={[{ label: "Markets", href: "/markets" }]}>
        <article>
          <header className="not-prose mb-10">
            <div className="mb-4 flex items-center gap-3">
              <span className="text-4xl">{country.code}</span>
              <span className="rounded-full bg-[color:var(--dw-accent)]/10 px-3 py-1 text-sm font-medium text-[color:var(--dw-accent)]">
                {country.tier}-Tier · {tierLabels[country.tier]}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Dropshipping in {country.name} 2026
            </h1>
            <p className="mt-4 text-lg text-[color:var(--dw-text-muted)]">
              Complete guide to selling in {country.name}. {country.ecommerceRevenue} ecommerce market
              growing at {country.ecommerceGrowth} annually.
            </p>
          </header>

          <div className="not-prose mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-4">
              <div className="text-sm text-[color:var(--dw-text-muted)]">Ecommerce Revenue</div>
              <div className="mt-1 text-xl font-bold">{country.ecommerceRevenue}</div>
            </div>
            <div className="rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-4">
              <div className="text-sm text-[color:var(--dw-text-muted)]">YoY Growth</div>
              <div className="mt-1 text-xl font-bold text-green-600">{country.ecommerceGrowth}</div>
            </div>
            <div className="rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-4">
              <div className="text-sm text-[color:var(--dw-text-muted)]">Population</div>
              <div className="mt-1 text-xl font-bold">{country.population}</div>
            </div>
            <div className="rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-4">
              <div className="text-sm text-[color:var(--dw-text-muted)]">Currency</div>
              <div className="mt-1 text-xl font-bold">{country.currency}</div>
            </div>
          </div>

          <section className="mb-10">
            <h2>Market Overview</h2>
            <div className="not-prose grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-4">
                <div className="text-sm font-medium">Region</div>
                <div className="mt-1 text-[color:var(--dw-text-muted)]">{country.region}</div>
              </div>
              <div className="rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-4">
                <div className="text-sm font-medium">Language</div>
                <div className="mt-1 text-[color:var(--dw-text-muted)]">{country.language}</div>
              </div>
              <div className="rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-4">
                <div className="text-sm font-medium">VAT/Tax</div>
                <div className="mt-1 text-[color:var(--dw-text-muted)]">{country.vatTax}</div>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2>Consumer Behavior</h2>
            <p>{country.consumerBehavior}</p>
          </section>

          <section className="mb-10">
            <h2>Top Ecommerce Platforms</h2>
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

          <section className="mb-10">
            <h2>Payment Methods</h2>
            <div className="not-prose flex flex-wrap gap-2">
              {country.paymentMethods.map((method, i) => (
                <span
                  key={i}
                  className={`rounded-full border px-3 py-1 text-sm ${i === 0 ? "border-[color:var(--dw-accent)] bg-[color:var(--dw-accent)]/10 text-[color:var(--dw-accent)]" : "border-[color:var(--dw-border)]"}`}
                >
                  {method}
                  {i === 0 && " (Primary)"}
                </span>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2>Shipping Considerations</h2>
            <p>{country.shippingConsiderations}</p>
          </section>

          <section className="mb-10">
            <h2>Best Niches for {country.name}</h2>
            <div className="not-prose flex flex-wrap gap-2">
              {country.topNiches.map((niche, i) => (
                <Link
                  key={i}
                  href={`/niches/${niche.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
                  className="rounded-full bg-[color:var(--dw-accent)]/10 px-3 py-1 text-sm text-[color:var(--dw-accent)] transition-colors hover:bg-[color:var(--dw-accent)]/20"
                >
                  {niche}
                </Link>
              ))}
            </div>
          </section>

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

        {regionCountries.length > 1 && (
          <section className="mt-16">
            <h2 className="mb-6 text-2xl font-bold">Other Markets in {country.region}</h2>
            <div className="not-prose grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {regionCountries
                .filter((c) => c.slug !== country.slug)
                .slice(0, 4)
                .map((c) => (
                  <Link
                    key={c.slug}
                    href={`/markets/${c.slug}`}
                    className="group rounded-xl border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-4 transition-all hover:border-[color:var(--dw-accent)]/40"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-semibold transition-colors group-hover:text-[color:var(--dw-accent)]">
                        {c.name}
                      </span>
                      <span className="text-xs text-[color:var(--dw-text-muted)]">{c.tier}-Tier</span>
                    </div>
                    <div className="text-sm text-[color:var(--dw-text-muted)]">
                      {c.ecommerceRevenue}
                    </div>
                  </Link>
                ))}
            </div>
          </section>
        )}

        <div className="not-prose mt-12 rounded-xl border border-[color:var(--dw-accent)]/20 bg-gradient-to-r from-[color:var(--dw-accent)]/5 to-transparent p-8 text-center">
          <h3 className="text-2xl font-bold">Start Selling in {country.name}</h3>
          <p className="mt-2 text-[color:var(--dw-text-muted)]">
            Build localized, high-converting product pages with AI.
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
  return {
    paths: countries.map((c) => ({ params: { slug: c.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<MarketPageProps> = ({ params }) => {
  const slug = params?.slug as string;
  const country = getCountryBySlug(slug);

  if (!country) {
    return { notFound: true };
  }

  return {
    props: {
      country,
      regionCountries: getCountriesByRegion(country.region),
    },
  };
};

export default MarketPage;
