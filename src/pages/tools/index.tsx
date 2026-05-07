import type { GetStaticProps } from "next";
import Link from "next/link";
import { SEOHead, PageLayout } from "@/components/seo";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/seo/constants";

const tools = [
  {
    slug: "profit-calculator",
    title: "Dropshipping Profit Calculator",
    description:
      "Calculate your profit margins, break-even point, and ROI for any product.",
    icon: "💰",
    badge: "Free",
  },
];

type ToolsIndexProps = {
  tools: typeof tools;
};

const ToolsIndex = ({ tools }: ToolsIndexProps) => {
  return (
    <>
      <SEOHead
        meta={{
          title: "Free E-commerce Tools | AI Generators & Calculators | Dropwiz",
          description:
            "Free tools for e-commerce entrepreneurs. AI product description generator, store name generator, profit calculator, and more.",
          canonical: `${SITE_URL}/tools`,
          keywords: [
            "product description generator",
            "store name generator",
            "dropshipping calculator",
            "ecommerce tools",
          ],
        }}
        schemas={[
          breadcrumbSchema([{ name: "Tools", url: `${SITE_URL}/tools` }]),
        ]}
      />
      <PageLayout breadcrumbs={[]}>
        <header className="not-prose mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Free E-commerce Tools
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[color:var(--dw-text-muted)]">
            Powerful AI-powered tools to help you build and grow your online business.
            100% free, no signup required.
          </p>
        </header>

        <div className="not-prose grid gap-6 md:grid-cols-2">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group relative rounded-xl border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-6 transition-all hover:border-[color:var(--dw-accent)]/40 hover:shadow-lg"
            >
              {tool.badge && (
                <span className="absolute right-4 top-4 rounded-full bg-[color:var(--dw-accent)]/10 px-2 py-1 text-xs font-medium text-[color:var(--dw-accent)]">
                  {tool.badge}
                </span>
              )}
              <div className="mb-4 text-4xl">{tool.icon}</div>
              <h2 className="text-xl font-semibold transition-colors group-hover:text-[color:var(--dw-accent)]">
                {tool.title}
              </h2>
              <p className="mt-2 text-sm text-[color:var(--dw-text-muted)]">
                {tool.description}
              </p>
              <div className="mt-4 inline-flex items-center text-sm font-medium text-[color:var(--dw-accent)]">
                Try it free →
              </div>
            </Link>
          ))}
        </div>

        <div className="not-prose mt-12 rounded-xl border border-[color:var(--dw-accent)]/20 bg-gradient-to-r from-[color:var(--dw-accent)]/5 to-transparent p-8 text-center">
          <h3 className="text-2xl font-bold">Want the Full Experience?</h3>
          <p className="mt-2 text-[color:var(--dw-text-muted)]">
            Build complete, high-converting stores with our AI store builder.
          </p>
          <Link
            href="/build/new"
            className="mt-4 inline-block whitespace-nowrap rounded-full bg-[color:var(--dw-accent)] px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
          >
            Build Your Store →
          </Link>
        </div>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps<ToolsIndexProps> = () => {
  return {
    props: {
      tools,
    },
  };
};

export default ToolsIndex;
