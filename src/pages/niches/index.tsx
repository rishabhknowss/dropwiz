import type { GetStaticProps } from "next";
import Link from "next/link";
import { SEOHead, PageLayout } from "@/components/seo";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE_URL, NICHES } from "@/lib/seo/constants";

const nicheData: Record<
  string,
  { icon: string; products: number; growth: string }
> = {
  "pet-supplies": { icon: "🐕", products: 2500, growth: "+18%" },
  "home-decor": { icon: "🏠", products: 3200, growth: "+12%" },
  fitness: { icon: "💪", products: 1800, growth: "+25%" },
  beauty: { icon: "💄", products: 4100, growth: "+15%" },
  fashion: { icon: "👗", products: 5500, growth: "+8%" },
  electronics: { icon: "📱", products: 2100, growth: "+22%" },
  kitchen: { icon: "🍳", products: 1900, growth: "+14%" },
  outdoor: { icon: "⛺", products: 1400, growth: "+20%" },
  baby: { icon: "👶", products: 1600, growth: "+16%" },
  automotive: { icon: "🚗", products: 900, growth: "+10%" },
  jewelry: { icon: "💍", products: 2800, growth: "+19%" },
  sports: { icon: "⚽", products: 1700, growth: "+13%" },
  toys: { icon: "🧸", products: 2200, growth: "+17%" },
  health: { icon: "🏥", products: 1500, growth: "+28%" },
  gardening: { icon: "🌱", products: 800, growth: "+21%" },
};

type NichesIndexProps = {
  niches: typeof NICHES;
};

const NichesIndex = ({ niches }: NichesIndexProps) => {
  return (
    <>
      <SEOHead
        meta={{
          title: "Dropshipping Niches 2026 - Find Your Profitable Niche | Dropwiz",
          description:
            "Explore the best dropshipping niches in 2026. Find trending products, suppliers, and build your store in any niche with AI.",
          canonical: `${SITE_URL}/niches`,
          keywords: [
            "dropshipping niches",
            "profitable niches 2026",
            "best niches for dropshipping",
            "niche products",
          ],
        }}
        schemas={[
          breadcrumbSchema([{ name: "Niches", url: `${SITE_URL}/niches` }]),
        ]}
      />
      <PageLayout breadcrumbs={[]}>
        <header className="not-prose mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Dropshipping Niches 2026
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[color:var(--dw-text-muted)]">
            Explore profitable niches for your dropshipping business. Each niche includes
            trending products, supplier recommendations, and store templates.
          </p>
        </header>

        <div className="not-prose grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {niches.map((niche) => {
            const data = nicheData[niche] ?? {
              icon: "📦",
              products: 1000,
              growth: "+10%",
            };
            const nicheTitle = niche
              .split("-")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ");

            return (
              <Link
                key={niche}
                href={`/niches/${niche}`}
                className="group rounded-xl border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-6 transition-all hover:border-[color:var(--dw-accent)]/40 hover:shadow-lg"
              >
                <div className="mb-4 text-4xl">{data.icon}</div>
                <h2 className="text-xl font-semibold transition-colors group-hover:text-[color:var(--dw-accent)]">
                  {nicheTitle}
                </h2>
                <div className="mt-3 flex items-center gap-4 text-sm text-[color:var(--dw-text-muted)]">
                  <span>{data.products.toLocaleString()} products</span>
                  <span className="text-green-500">{data.growth} growth</span>
                </div>
                <p className="mt-3 text-sm text-[color:var(--dw-text-muted)]">
                  Trending products, suppliers, and store templates for {nicheTitle.toLowerCase()}.
                </p>
              </Link>
            );
          })}
        </div>

        <div className="not-prose mt-12 rounded-xl border border-[color:var(--dw-accent)]/20 bg-gradient-to-r from-[color:var(--dw-accent)]/5 to-transparent p-8 text-center">
          <h3 className="text-2xl font-bold">Can&apos;t Decide on a Niche?</h3>
          <p className="mt-2 text-[color:var(--dw-text-muted)]">
            Test multiple niches quickly with AI-generated stores. No inventory risk.
          </p>
          <Link
            href="/build/new"
            className="mt-4 inline-block whitespace-nowrap rounded-full bg-[color:var(--dw-accent)] px-6 py-3 font-medium text-[#0A0A0A] transition-opacity hover:opacity-90"
          >
            Build a Store in Any Niche →
          </Link>
        </div>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps<NichesIndexProps> = () => {
  return {
    props: {
      niches: NICHES,
    },
  };
};

export default NichesIndex;
