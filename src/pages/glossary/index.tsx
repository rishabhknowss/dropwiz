import type { GetStaticProps } from "next";
import Link from "next/link";
import { SEOHead, PageLayout } from "@/components/seo";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/seo/constants";
import {
  getAllGlossaryTermsForIndex,
  getGlossaryCategories,
  type GlossaryTermSummary,
} from "@/lib/seo/glossary-data";

type GlossaryIndexProps = {
  terms: GlossaryTermSummary[];
  categories: string[];
};

const categoryLabels: Record<string, string> = {
  "business-models": "Business Models",
  operations: "Operations",
  sourcing: "Sourcing",
  finance: "Finance",
  metrics: "Metrics",
  advertising: "Advertising",
  platforms: "Platforms",
  strategy: "Strategy",
  marketing: "Marketing",
};

const GlossaryIndex = ({ terms, categories }: GlossaryIndexProps) => {
  const termsByLetter = terms.reduce(
    (acc, term) => {
      const letter = term.term[0].toUpperCase();
      if (!acc[letter]) acc[letter] = [];
      acc[letter].push(term);
      return acc;
    },
    {} as Record<string, GlossaryTermSummary[]>
  );

  const letters = Object.keys(termsByLetter).sort();

  return (
    <>
      <SEOHead
        meta={{
          title: "E-commerce & Dropshipping Glossary | Dropwiz",
          description:
            "Complete glossary of e-commerce and dropshipping terms. Learn the definitions of AOV, ROAS, CPA, dropshipping, and 50+ more essential terms.",
          canonical: `${SITE_URL}/glossary`,
          keywords: [
            "ecommerce glossary",
            "dropshipping terms",
            "ecommerce definitions",
            "marketing terms",
          ],
        }}
        schemas={[
          breadcrumbSchema([{ name: "Glossary", url: `${SITE_URL}/glossary` }]),
        ]}
      />
      <PageLayout breadcrumbs={[]}>
        <header className="not-prose mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            E-commerce Glossary
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[color:var(--dw-text-muted)]">
            Your complete guide to e-commerce and dropshipping terminology.
            Learn the terms that matter for your online business.
          </p>
        </header>

        <div className="not-prose mb-8 flex flex-wrap justify-center gap-2">
          {letters.map((letter) => (
            <a
              key={letter}
              href={`#letter-${letter}`}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[color:var(--dw-border)] font-medium transition-colors hover:border-[color:var(--dw-accent)] hover:text-[color:var(--dw-accent)]"
            >
              {letter}
            </a>
          ))}
        </div>

        <div className="not-prose mb-10 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/glossary?category=${category}`}
              className="rounded-full border border-[color:var(--dw-border)] px-4 py-2 text-sm font-medium transition-colors hover:border-[color:var(--dw-accent)] hover:text-[color:var(--dw-accent)]"
            >
              {categoryLabels[category] || category}
            </Link>
          ))}
        </div>

        <div className="space-y-12">
          {letters.map((letter) => (
            <section key={letter} id={`letter-${letter}`}>
              <h2 className="mb-6 text-3xl font-bold">{letter}</h2>
              <div className="not-prose grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {termsByLetter[letter].map((term) => (
                  <Link
                    key={term.slug}
                    href={`/glossary/${term.slug}`}
                    className="group rounded-xl border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-5 transition-all hover:border-[color:var(--dw-accent)]/40 hover:shadow-lg"
                  >
                    <div className="mb-1 text-xs font-medium text-[color:var(--dw-accent)]">
                      {categoryLabels[term.category] || term.category}
                    </div>
                    <h3 className="font-semibold transition-colors group-hover:text-[color:var(--dw-accent)]">
                      {term.term}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-[color:var(--dw-text-muted)]">
                      {term.definition}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="not-prose mt-12 rounded-xl border border-[color:var(--dw-accent)]/20 bg-gradient-to-r from-[color:var(--dw-accent)]/5 to-transparent p-8 text-center">
          <h3 className="text-2xl font-bold">Ready to Start Your Store?</h3>
          <p className="mt-2 text-[color:var(--dw-text-muted)]">
            Put your knowledge into practice. Build a professional store in
            seconds with AI.
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

export const getStaticProps: GetStaticProps<GlossaryIndexProps> = () => {
  return {
    props: {
      terms: getAllGlossaryTermsForIndex(),
      categories: getGlossaryCategories(),
    },
  };
};

export default GlossaryIndex;
