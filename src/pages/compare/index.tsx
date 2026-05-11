import type { GetStaticProps } from "next";
import Link from "next/link";
import { SEOHead, PageLayout } from "@/components/seo";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/seo/constants";
import { getAllComparisons, type Comparison } from "@/lib/seo/comparisons-data";

type CompareIndexProps = {
  comparisons: Comparison[];
};

const CompareIndex = ({ comparisons }: CompareIndexProps) => {
  return (
    <>
      <SEOHead
        meta={{
          title: "E-commerce Comparisons: Platforms, Tools & Strategies | Dropwiz",
          description:
            "Compare dropshipping platforms, tools, and strategies. Side-by-side comparisons to help you make the right choice for your e-commerce business.",
          canonical: `${SITE_URL}/compare`,
          keywords: [
            "dropshipping comparisons",
            "ecommerce platform comparison",
            "shopify vs woocommerce",
            "aliexpress vs alibaba",
          ],
        }}
        schemas={[
          breadcrumbSchema([{ name: "Compare", url: `${SITE_URL}/compare` }]),
        ]}
      />
      <PageLayout breadcrumbs={[]}>
        <header className="not-prose mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            E-commerce Comparisons
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[color:var(--dw-text-muted)]">
            Make informed decisions with our detailed side-by-side comparisons of
            platforms, tools, and strategies.
          </p>
        </header>

        <div className="not-prose grid gap-6 md:grid-cols-2">
          {comparisons.map((comparison) => (
            <Link
              key={comparison.slug}
              href={`/compare/${comparison.slug}`}
              className="group rounded-xl border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-6 transition-all hover:border-[color:var(--dw-accent)]/40 hover:shadow-lg"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-[color:var(--dw-text-muted)]">
                  {comparison.category}
                </span>
                <span className="text-xs text-[color:var(--dw-text-muted)]">
                  Updated{" "}
                  {new Date(comparison.lastUpdated).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="mb-4 flex items-center justify-center gap-4">
                <div className="flex-1 rounded-lg bg-[color:var(--dw-bg)] p-3 text-center">
                  <div className="font-semibold">{comparison.itemA.name}</div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--dw-accent)]/10 text-sm font-bold text-[color:var(--dw-accent)]">
                  VS
                </div>
                <div className="flex-1 rounded-lg bg-[color:var(--dw-bg)] p-3 text-center">
                  <div className="font-semibold">{comparison.itemB.name}</div>
                </div>
              </div>

              <h2 className="text-lg font-semibold transition-colors group-hover:text-[color:var(--dw-accent)]">
                {comparison.title}
              </h2>
              <p className="mt-2 text-sm text-[color:var(--dw-text-muted)]">
                {comparison.description}
              </p>

              <div className="mt-4 text-sm font-medium text-[color:var(--dw-accent)]">
                Read comparison →
              </div>
            </Link>
          ))}
        </div>

        <div className="not-prose mt-12 rounded-xl border border-[color:var(--dw-accent)]/20 bg-gradient-to-r from-[color:var(--dw-accent)]/5 to-transparent p-8 text-center">
          <h3 className="text-2xl font-bold">Ready to Start Selling?</h3>
          <p className="mt-2 text-[color:var(--dw-text-muted)]">
            Build your store in seconds with AI. No design skills needed.
          </p>
          <Link
            href="/build/new"
            className="mt-4 inline-block whitespace-nowrap rounded-full bg-[color:var(--dw-accent)] px-6 py-3 font-medium text-[#0A0A0A] transition-opacity hover:opacity-90"
          >
            Build Your Store →
          </Link>
        </div>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps<CompareIndexProps> = () => {
  return {
    props: {
      comparisons: getAllComparisons(),
    },
  };
};

export default CompareIndex;
