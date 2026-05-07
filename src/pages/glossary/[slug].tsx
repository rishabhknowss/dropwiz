import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SEOHead, PageLayout } from "@/components/seo";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/seo/constants";
import {
  getGlossaryTermBySlug,
  getAllGlossaryTerms,
  getRelatedGlossaryTerms,
  type GlossaryTerm,
} from "@/lib/seo/glossary-data";

type GlossaryTermPageProps = {
  term: GlossaryTerm;
  relatedTerms: GlossaryTerm[];
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

const GlossaryTermPage = ({ term, relatedTerms }: GlossaryTermPageProps) => {
  return (
    <>
      <SEOHead
        meta={{
          title: `What is ${term.term}? Definition & Guide | Dropwiz Glossary`,
          description: term.definition,
          canonical: `${SITE_URL}/glossary/${term.slug}`,
          keywords: [
            term.term.toLowerCase(),
            `${term.term.toLowerCase()} definition`,
            `what is ${term.term.toLowerCase()}`,
            "ecommerce terms",
          ],
        }}
        schemas={[
          breadcrumbSchema([
            { name: "Glossary", url: `${SITE_URL}/glossary` },
            { name: term.term, url: `${SITE_URL}/glossary/${term.slug}` },
          ]),
          faqSchema([
            {
              question: `What is ${term.term}?`,
              answer: term.definition,
            },
          ]),
        ]}
      />
      <PageLayout breadcrumbs={[{ label: "Glossary", href: "/glossary" }]}>
        <article>
          <header className="not-prose mb-10">
            <Link
              href={`/glossary?category=${term.category}`}
              className="mb-4 inline-block rounded-full bg-[color:var(--dw-accent)]/10 px-3 py-1 text-sm font-medium text-[color:var(--dw-accent)] transition-colors hover:bg-[color:var(--dw-accent)]/20"
            >
              {categoryLabels[term.category] || term.category}
            </Link>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              What is {term.term}?
            </h1>
            <p className="mt-4 text-xl text-[color:var(--dw-text-muted)]">
              {term.definition}
            </p>
          </header>

          <div className="not-prose mb-10 rounded-xl border border-[color:var(--dw-accent)]/20 bg-[color:var(--dw-accent)]/5 p-6">
            <h2 className="mb-2 font-semibold">Quick Definition</h2>
            <p className="text-[color:var(--dw-text-muted)]">{term.definition}</p>
          </div>

          <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-a:text-[color:var(--dw-accent)] prose-code:rounded prose-code:bg-[color:var(--dw-surface)] prose-code:px-1.5 prose-code:py-0.5 prose-pre:bg-[color:var(--dw-surface)] prose-table:border-collapse prose-th:border prose-th:border-[color:var(--dw-border)] prose-th:bg-[color:var(--dw-surface)] prose-th:p-2 prose-td:border prose-td:border-[color:var(--dw-border)] prose-td:p-2">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {term.extendedDefinition}
            </ReactMarkdown>
          </div>
        </article>

        {relatedTerms.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-2xl font-bold">Related Terms</h2>
            <div className="not-prose grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedTerms.map((related) => (
                <Link
                  key={related.slug}
                  href={`/glossary/${related.slug}`}
                  className="group rounded-xl border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-4 transition-all hover:border-[color:var(--dw-accent)]/40 hover:shadow-lg"
                >
                  <h3 className="font-semibold transition-colors group-hover:text-[color:var(--dw-accent)]">
                    {related.term}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-[color:var(--dw-text-muted)]">
                    {related.definition}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="not-prose mt-12 rounded-xl border border-[color:var(--dw-accent)]/20 bg-gradient-to-r from-[color:var(--dw-accent)]/5 to-transparent p-8 text-center">
          <h3 className="text-2xl font-bold">Learn More in Our Guides</h3>
          <p className="mt-2 text-[color:var(--dw-text-muted)]">
            Go deeper with our comprehensive guides and tutorials.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link
              href="/guides"
              className="rounded-full border border-[color:var(--dw-border)] px-5 py-2 font-medium transition-colors hover:border-[color:var(--dw-accent)] hover:text-[color:var(--dw-accent)]"
            >
              Browse Guides
            </Link>
            <Link
              href="/build/new"
              className="rounded-full bg-[color:var(--dw-accent)] px-5 py-2 font-medium text-white transition-opacity hover:opacity-90"
            >
              Build Your Store →
            </Link>
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  const terms = getAllGlossaryTerms();
  return {
    paths: terms.map((term) => ({ params: { slug: term.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<GlossaryTermPageProps> = ({
  params,
}) => {
  const slug = params?.slug as string;
  const term = getGlossaryTermBySlug(slug);

  if (!term) {
    return { notFound: true };
  }

  return {
    props: {
      term,
      relatedTerms: getRelatedGlossaryTerms(slug),
    },
  };
};

export default GlossaryTermPage;
