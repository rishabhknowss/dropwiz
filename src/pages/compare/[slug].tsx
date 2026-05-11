import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { SEOHead, PageLayout } from "@/components/seo";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/seo/constants";
import {
  getComparisonBySlug,
  getAllComparisons,
  type Comparison,
} from "@/lib/seo/comparisons-data";

type ComparisonPageProps = {
  comparison: Comparison;
};

const ComparisonPage = ({ comparison }: ComparisonPageProps) => {
  const { itemA, itemB } = comparison;

  return (
    <>
      <SEOHead
        meta={{
          title: `${comparison.title} | Dropwiz`,
          description: comparison.description,
          canonical: `${SITE_URL}/compare/${comparison.slug}`,
          keywords: comparison.keywords,
        }}
        schemas={[
          breadcrumbSchema([
            { name: "Compare", url: `${SITE_URL}/compare` },
            {
              name: `${itemA.name} vs ${itemB.name}`,
              url: `${SITE_URL}/compare/${comparison.slug}`,
            },
          ]),
          faqSchema(comparison.faqs),
        ]}
      />
      <PageLayout breadcrumbs={[{ label: "Compare", href: "/compare" }]}>
        <article>
          <header className="not-prose mb-10 text-center">
            <p className="mb-4 text-sm font-medium uppercase tracking-wide text-[color:var(--dw-accent)]">
              {comparison.category} Comparison
            </p>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {comparison.title}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-[color:var(--dw-text-muted)]">
              {comparison.description}
            </p>
            <p className="mt-2 text-sm text-[color:var(--dw-text-muted)]">
              Last updated:{" "}
              {new Date(comparison.lastUpdated).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </header>

          <div className="not-prose mb-10 flex items-center justify-center gap-6">
            <div className="flex-1 rounded-xl border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-6 text-center">
              <h2 className="text-2xl font-bold">{itemA.name}</h2>
              {itemA.rating && (
                <div className="mt-2 text-[color:var(--dw-accent)]">
                  {"★".repeat(Math.floor(itemA.rating))} {itemA.rating}/5
                </div>
              )}
            </div>
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-[color:var(--dw-accent)] text-lg font-bold text-[#0A0A0A]">
              VS
            </div>
            <div className="flex-1 rounded-xl border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-6 text-center">
              <h2 className="text-2xl font-bold">{itemB.name}</h2>
              {itemB.rating && (
                <div className="mt-2 text-[color:var(--dw-accent)]">
                  {"★".repeat(Math.floor(itemB.rating))} {itemB.rating}/5
                </div>
              )}
            </div>
          </div>

          <section className="not-prose mb-10 rounded-xl border border-[color:var(--dw-accent)]/20 bg-[color:var(--dw-accent)]/5 p-6">
            <h2 className="mb-3 text-xl font-bold">Quick Verdict</h2>
            <p className="text-[color:var(--dw-text-muted)]">
              {comparison.verdict}
            </p>
          </section>

          <section className="not-prose mb-10">
            <h2 className="mb-6 text-2xl font-bold">Comparison at a Glance</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-[color:var(--dw-border)]">
                    <th className="p-4 text-left font-semibold">Criteria</th>
                    <th className="p-4 text-center font-semibold">{itemA.name}</th>
                    <th className="p-4 text-center font-semibold">{itemB.name}</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.criteria.map((criterion, i) => (
                    <tr
                      key={i}
                      className="border-b border-[color:var(--dw-border)]"
                    >
                      <td className="p-4">
                        <div className="font-medium">{criterion.name}</div>
                        <div className="mt-1 text-sm text-[color:var(--dw-text-muted)]">
                          {criterion.notes}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <div
                              key={j}
                              className={`h-2 w-6 rounded ${
                                j < criterion.itemAScore
                                  ? "bg-[color:var(--dw-accent)]"
                                  : "bg-[color:var(--dw-border)]"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="mt-1 text-sm font-medium">
                          {criterion.itemAScore}/5
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <div
                              key={j}
                              className={`h-2 w-6 rounded ${
                                j < criterion.itemBScore
                                  ? "bg-[color:var(--dw-accent)]"
                                  : "bg-[color:var(--dw-border)]"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="mt-1 text-sm font-medium">
                          {criterion.itemBScore}/5
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="not-prose mb-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-6">
              <h3 className="mb-4 text-xl font-bold">{itemA.name}</h3>
              <p className="mb-4 text-[color:var(--dw-text-muted)]">
                {itemA.description}
              </p>

              <h4 className="mb-2 font-semibold text-green-600">Pros</h4>
              <ul className="mb-4 space-y-1">
                {itemA.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    {pro}
                  </li>
                ))}
              </ul>

              <h4 className="mb-2 font-semibold text-red-600">Cons</h4>
              <ul className="mb-4 space-y-1">
                {itemA.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-red-500">✗</span>
                    {con}
                  </li>
                ))}
              </ul>

              <div className="border-t border-[color:var(--dw-border)] pt-4">
                <p className="text-sm">
                  <strong>Best for:</strong> {itemA.bestFor}
                </p>
                {itemA.pricing && (
                  <p className="mt-1 text-sm">
                    <strong>Pricing:</strong> {itemA.pricing}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-6">
              <h3 className="mb-4 text-xl font-bold">{itemB.name}</h3>
              <p className="mb-4 text-[color:var(--dw-text-muted)]">
                {itemB.description}
              </p>

              <h4 className="mb-2 font-semibold text-green-600">Pros</h4>
              <ul className="mb-4 space-y-1">
                {itemB.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    {pro}
                  </li>
                ))}
              </ul>

              <h4 className="mb-2 font-semibold text-red-600">Cons</h4>
              <ul className="mb-4 space-y-1">
                {itemB.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-red-500">✗</span>
                    {con}
                  </li>
                ))}
              </ul>

              <div className="border-t border-[color:var(--dw-border)] pt-4">
                <p className="text-sm">
                  <strong>Best for:</strong> {itemB.bestFor}
                </p>
                {itemB.pricing && (
                  <p className="mt-1 text-sm">
                    <strong>Pricing:</strong> {itemB.pricing}
                  </p>
                )}
              </div>
            </div>
          </div>

          <section className="mb-10">
            <h2>Frequently Asked Questions</h2>
            <div className="not-prose space-y-4">
              {comparison.faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)]"
                >
                  <summary className="cursor-pointer list-none p-4 font-medium">
                    <span className="flex items-center justify-between">
                      {faq.question}
                      <span className="ml-2 transition-transform group-open:rotate-180">
                        ↓
                      </span>
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

        <div className="not-prose mt-12 rounded-xl border border-[color:var(--dw-accent)]/20 bg-gradient-to-r from-[color:var(--dw-accent)]/5 to-transparent p-8 text-center">
          <h3 className="text-2xl font-bold">Made Your Decision?</h3>
          <p className="mt-2 text-[color:var(--dw-text-muted)]">
            Start building your store today with AI-powered tools.
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

export const getStaticPaths: GetStaticPaths = () => {
  const comparisons = getAllComparisons();
  return {
    paths: comparisons.map((c) => ({ params: { slug: c.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<ComparisonPageProps> = ({
  params,
}) => {
  const slug = params?.slug as string;
  const comparison = getComparisonBySlug(slug);

  if (!comparison) {
    return { notFound: true };
  }

  return {
    props: {
      comparison,
    },
  };
};

export default ComparisonPage;
