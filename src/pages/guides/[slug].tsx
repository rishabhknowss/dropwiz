import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { SEOHead, PageLayout, RelatedLinks, CTASidebar } from "@/components/seo";
import { guidesMetadata } from "@/lib/seo/metadata";
import { articleSchema, faqSchema, breadcrumbSchema, howToSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/seo/constants";
import {
  type Guide,
  getAllGuides,
  getGuideBySlug,
  getRelatedGuides,
} from "@/lib/seo/guides-data";

type GuidePageProps = {
  guide: Guide;
  relatedGuides: Guide[];
};

const GuidePage = ({ guide, relatedGuides }: GuidePageProps) => {
  const schemas = [
    articleSchema({
      title: guide.title,
      description: guide.description,
      url: `${SITE_URL}/guides/${guide.slug}`,
      image: `${SITE_URL}/og-guides/${guide.slug}.png`,
      datePublished: guide.lastUpdated,
      dateModified: guide.lastUpdated,
    }),
    breadcrumbSchema([
      { name: "Guides", url: `${SITE_URL}/guides` },
      { name: guide.title, url: `${SITE_URL}/guides/${guide.slug}` },
    ]),
    faqSchema(guide.faqs),
    howToSchema({
      name: guide.title,
      description: guide.description,
      steps: guide.sections.map((s) => ({ name: s.title, text: s.content.slice(0, 200) })),
    }),
  ];

  const sidebar = (
    <div className="space-y-6">
      <CTASidebar />
      <RelatedLinks
        title="Related Guides"
        links={relatedGuides.map((g) => ({
          title: g.title.replace(/ 2026.*/, ""),
          href: `/guides/${g.slug}`,
          description: g.readTime,
        }))}
      />
      <div className="rounded-xl border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-5">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[color:var(--dw-text-muted)]">
          Table of Contents
        </h3>
        <ul className="space-y-2 text-sm">
          {guide.sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="text-[color:var(--dw-text-muted)] transition-colors hover:text-[color:var(--dw-accent)]"
              >
                {section.title}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#faq"
              className="text-[color:var(--dw-text-muted)] transition-colors hover:text-[color:var(--dw-accent)]"
            >
              FAQ
            </a>
          </li>
        </ul>
      </div>
    </div>
  );

  return (
    <>
      <SEOHead
        meta={guidesMetadata(guide.slug, guide.title, guide.description)}
        schemas={schemas}
      />
      <PageLayout
        breadcrumbs={[
          { label: "Guides", href: "/guides" },
          { label: guide.category, href: `/guides?category=${guide.category}` },
        ]}
        sidebar={sidebar}
      >
        <header className="not-prose mb-10">
          <div className="mb-4 flex items-center gap-3 text-sm text-[color:var(--dw-text-muted)]">
            <span className="rounded-full bg-[color:var(--dw-accent)]/10 px-3 py-1 text-xs font-medium text-[color:var(--dw-accent)]">
              {guide.category}
            </span>
            <span>{guide.readTime} read</span>
            <span>Updated {guide.lastUpdated}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            {guide.title}
          </h1>
          <p className="mt-4 text-lg text-[color:var(--dw-text-muted)]">
            {guide.description}
          </p>
        </header>

        {guide.sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-20">
            <h2>{section.title}</h2>
            <div
              className="whitespace-pre-line"
              dangerouslySetInnerHTML={{
                __html: section.content
                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                  .replace(/\n- /g, "\n• ")
                  .split("\n\n")
                  .map((p) => `<p>${p}</p>`)
                  .join(""),
              }}
            />
          </section>
        ))}

        <section id="faq" className="scroll-mt-20">
          <h2>Frequently Asked Questions</h2>
          <div className="not-prose space-y-4">
            {guide.faqs.map((faq, i) => (
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

        <div className="not-prose mt-12 rounded-xl border border-[color:var(--dw-accent)]/20 bg-gradient-to-r from-[color:var(--dw-accent)]/5 to-transparent p-8 text-center">
          <h3 className="text-2xl font-bold">Ready to Build Your Store?</h3>
          <p className="mt-2 text-[color:var(--dw-text-muted)]">
            Generate professional product pages with AI in seconds.
          </p>
          <Link
            href="/build/new"
            className="mt-4 inline-block whitespace-nowrap rounded-full bg-[color:var(--dw-accent)] px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
          >
            Start Free with Dropwiz →
          </Link>
        </div>
      </PageLayout>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  const guides = getAllGuides();
  const paths = guides.map((guide) => ({
    params: { slug: guide.slug },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<GuidePageProps> = ({ params }) => {
  const slug = params?.slug as string;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return { notFound: true };
  }

  const relatedGuides = getRelatedGuides(slug);

  return {
    props: {
      guide,
      relatedGuides,
    },
  };
};

export default GuidePage;
