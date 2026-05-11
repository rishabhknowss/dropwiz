import type { GetStaticProps } from "next";
import Link from "next/link";
import { SEOHead, PageLayout } from "@/components/seo";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/seo/constants";
import { getAllCountries, type Country } from "@/lib/seo/countries-data";

type MarketsIndexProps = {
  countries: Country[];
};

const tierColors = {
  S: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  A: "bg-green-500/10 text-green-600 border-green-500/20",
  B: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  C: "bg-gray-500/10 text-gray-600 border-gray-500/20",
};

const MarketsIndex = ({ countries }: MarketsIndexProps) => {
  const tierS = countries.filter((c) => c.tier === "S");
  const tierA = countries.filter((c) => c.tier === "A");
  const tierB = countries.filter((c) => c.tier === "B");
  const tierC = countries.filter((c) => c.tier === "C");

  return (
    <>
      <SEOHead
        meta={{
          title: "Best Countries for Dropshipping 2026 - Market Guide | Dropwiz",
          description:
            "Discover the best countries for dropshipping in 2026. Compare 45+ markets by ecommerce revenue, growth rate, payment methods, and shipping considerations.",
          canonical: `${SITE_URL}/markets`,
          keywords: [
            "best countries for dropshipping",
            "dropshipping markets 2026",
            "ecommerce by country",
            "international dropshipping",
          ],
        }}
        schemas={[
          breadcrumbSchema([{ name: "Markets", url: `${SITE_URL}/markets` }]),
        ]}
      />
      <PageLayout breadcrumbs={[]}>
        <header className="not-prose mb-12 text-center">
          <div className="mb-4 inline-block whitespace-nowrap rounded-full bg-[color:var(--dw-accent)]/10 px-3 py-1 text-sm text-[color:var(--dw-accent)]">
            {countries.length}+ Markets Analyzed
          </div>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Best Markets for Dropshipping 2026
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[color:var(--dw-text-muted)]">
            Data-driven analysis of global ecommerce markets. Find the best countries
            to target based on revenue, growth, and opportunity.
          </p>
        </header>

        <div className="not-prose mb-8 flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2">
            <span className={`rounded-full border px-3 py-1 text-xs font-medium ${tierColors.S}`}>
              S-Tier
            </span>
            <span className="text-sm text-[color:var(--dw-text-muted)]">Top Markets</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full border px-3 py-1 text-xs font-medium ${tierColors.A}`}>
              A-Tier
            </span>
            <span className="text-sm text-[color:var(--dw-text-muted)]">Excellent</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full border px-3 py-1 text-xs font-medium ${tierColors.B}`}>
              B-Tier
            </span>
            <span className="text-sm text-[color:var(--dw-text-muted)]">Growing</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`rounded-full border px-3 py-1 text-xs font-medium ${tierColors.C}`}>
              C-Tier
            </span>
            <span className="text-sm text-[color:var(--dw-text-muted)]">Challenging</span>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">S-Tier Markets (Top Priority)</h2>
          <div className="not-prose grid gap-4 md:grid-cols-3">
            {tierS.map((country) => (
              <Link
                key={country.slug}
                href={`/markets/${country.slug}`}
                className="group rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5 transition-all hover:border-yellow-500/40 hover:shadow-lg"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-2xl">{country.code}</span>
                  <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${tierColors.S}`}>
                    S-Tier
                  </span>
                </div>
                <h3 className="text-lg font-semibold">{country.name}</h3>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-[color:var(--dw-text-muted)]">Revenue:</span>
                    <div className="font-medium">{country.ecommerceRevenue}</div>
                  </div>
                  <div>
                    <span className="text-[color:var(--dw-text-muted)]">Growth:</span>
                    <div className="font-medium text-green-600">{country.ecommerceGrowth}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">A-Tier Markets (Excellent Opportunity)</h2>
          <div className="not-prose grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tierA.map((country) => (
              <Link
                key={country.slug}
                href={`/markets/${country.slug}`}
                className="group rounded-xl border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-4 transition-all hover:border-[color:var(--dw-accent)]/40 hover:shadow-lg"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium">{country.name}</span>
                  <span className="text-xs text-[color:var(--dw-text-muted)]">{country.code}</span>
                </div>
                <div className="text-sm text-[color:var(--dw-text-muted)]">
                  {country.ecommerceRevenue} · {country.ecommerceGrowth} growth
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">B-Tier Markets (Growing Fast)</h2>
          <div className="not-prose grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tierB.map((country) => (
              <Link
                key={country.slug}
                href={`/markets/${country.slug}`}
                className="group rounded-xl border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-4 transition-all hover:border-[color:var(--dw-accent)]/40 hover:shadow-lg"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium">{country.name}</span>
                  <span className="text-xs text-[color:var(--dw-text-muted)]">{country.code}</span>
                </div>
                <div className="text-sm text-[color:var(--dw-text-muted)]">
                  {country.ecommerceRevenue} · {country.ecommerceGrowth} growth
                </div>
              </Link>
            ))}
          </div>
        </section>

        {tierC.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-bold">C-Tier Markets (Challenging)</h2>
            <div className="not-prose grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {tierC.map((country) => (
                <Link
                  key={country.slug}
                  href={`/markets/${country.slug}`}
                  className="group rounded-xl border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-4 transition-all hover:border-[color:var(--dw-accent)]/40"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium">{country.name}</span>
                    <span className="text-xs text-[color:var(--dw-text-muted)]">{country.code}</span>
                  </div>
                  <div className="text-sm text-[color:var(--dw-text-muted)]">
                    {country.ecommerceRevenue}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="not-prose mt-12 rounded-xl border border-[color:var(--dw-accent)]/20 bg-gradient-to-r from-[color:var(--dw-accent)]/5 to-transparent p-8 text-center">
          <h3 className="text-2xl font-bold">Ready to Go Global?</h3>
          <p className="mt-2 text-[color:var(--dw-text-muted)]">
            Build localized store pages for any market with AI.
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

export const getStaticProps: GetStaticProps<MarketsIndexProps> = () => {
  return {
    props: {
      countries: getAllCountries(),
    },
  };
};

export default MarketsIndex;
