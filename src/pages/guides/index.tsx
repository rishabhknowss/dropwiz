import type { GetStaticProps } from "next";
import Link from "next/link";
import { SEOHead, PageLayout } from "@/components/seo";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/seo/constants";
import { type Guide, getAllGuides } from "@/lib/seo/guides-data";

type GuidesIndexProps = {
  guides: Guide[];
};

const GuidesIndex = ({ guides }: GuidesIndexProps) => {
  const categories = [...new Set(guides.map((g) => g.category))];

  return (
    <>
      <SEOHead
        meta={{
          title: "Dropshipping & E-commerce Guides 2026 | Dropwiz",
          description:
            "Free guides on dropshipping, print on demand, Shopify, and e-commerce. Learn how to start and scale your online business in 2026.",
          canonical: `${SITE_URL}/guides`,
          keywords: [
            "dropshipping guides",
            "ecommerce tutorials",
            "shopify guides",
            "how to start dropshipping",
          ],
        }}
        schemas={[
          breadcrumbSchema([{ name: "Guides", url: `${SITE_URL}/guides` }]),
        ]}
      />
      <PageLayout breadcrumbs={[]}>
        <header className="not-prose mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            E-commerce Guides 2026
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[color:var(--dw-text-muted)]">
            Free, comprehensive guides to help you start and scale your online business.
            Learn dropshipping, print on demand, Shopify, and more.
          </p>
        </header>

        {categories.map((category) => {
          const categoryGuides = guides.filter((g) => g.category === category);
          return (
            <section key={category} className="not-prose mb-12">
              <h2 className="mb-6 text-2xl font-bold capitalize">{category}</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {categoryGuides.map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/guides/${guide.slug}`}
                    className="group rounded-xl border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-6 transition-all hover:border-[color:var(--dw-accent)]/40 hover:shadow-lg"
                  >
                    <div className="mb-3 flex items-center gap-3 text-xs text-[color:var(--dw-text-muted)]">
                      <span>{guide.readTime} read</span>
                      <span>•</span>
                      <span>Updated {guide.lastUpdated}</span>
                    </div>
                    <h3 className="text-lg font-semibold transition-colors group-hover:text-[color:var(--dw-accent)]">
                      {guide.title.replace(/ 2026.*/, "")}
                    </h3>
                    <p className="mt-2 text-sm text-[color:var(--dw-text-muted)] line-clamp-2">
                      {guide.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {guide.keywords.slice(0, 3).map((keyword) => (
                        <span
                          key={keyword}
                          className="rounded-full bg-[color:var(--dw-bg)] px-2 py-1 text-xs text-[color:var(--dw-text-muted)]"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        <div className="not-prose mt-12 rounded-xl border border-[color:var(--dw-accent)]/20 bg-gradient-to-r from-[color:var(--dw-accent)]/5 to-transparent p-8 text-center">
          <h3 className="text-2xl font-bold">Skip the Learning Curve</h3>
          <p className="mt-2 text-[color:var(--dw-text-muted)]">
            Let AI build your store while you focus on marketing and sales.
          </p>
          <Link
            href="/build/new"
            className="mt-4 inline-block whitespace-nowrap rounded-full bg-[color:var(--dw-accent)] px-6 py-3 font-medium text-[#0A0A0A] transition-opacity hover:opacity-90"
          >
            Build Your Store with AI →
          </Link>
        </div>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps<GuidesIndexProps> = () => {
  const guides = getAllGuides();

  return {
    props: {
      guides,
    },
  };
};

export default GuidesIndex;
