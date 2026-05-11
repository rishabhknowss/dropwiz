import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { SEOHead, PageLayout } from "@/components/seo";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/seo/constants";
import {
  getSupplierBySlug,
  getAllSuppliers,
  type Supplier,
} from "@/lib/seo/suppliers-data";

type SupplierPageProps = {
  supplier: Supplier;
  relatedSuppliers: Supplier[];
};

const SupplierPage = ({ supplier, relatedSuppliers }: SupplierPageProps) => {
  const faqs = [
    {
      question: `Is ${supplier.name} good for dropshipping?`,
      answer: `${supplier.name} is rated ${supplier.rating}/5 by dropshippers. ${supplier.bestFor}. Key strengths include ${supplier.pros.slice(0, 3).join(", ")}.`,
    },
    {
      question: `What is ${supplier.name}'s shipping time?`,
      answer: `${supplier.name} offers ${supplier.shippingTime} shipping. They support platforms including ${supplier.platforms.slice(0, 3).join(", ")}.`,
    },
    {
      question: `Does ${supplier.name} have minimum order requirements?`,
      answer: `${supplier.name}'s minimum order policy: ${supplier.minOrder}. Pricing: ${supplier.pricing}.`,
    },
  ];

  return (
    <>
      <SEOHead
        meta={{
          title: `${supplier.name} Review 2026 - Dropshipping Supplier Guide | Dropwiz`,
          description: `${supplier.name} dropshipping review: ${supplier.shippingTime} shipping, ${supplier.pricing}. ${supplier.description}`,
          canonical: `${SITE_URL}/suppliers/${supplier.slug}`,
          keywords: [
            `${supplier.name.toLowerCase()} review`,
            `${supplier.name.toLowerCase()} dropshipping`,
            "dropshipping supplier",
            "supplier review 2026",
          ],
        }}
        schemas={[
          breadcrumbSchema([
            { name: "Suppliers", url: `${SITE_URL}/suppliers` },
            { name: supplier.name, url: `${SITE_URL}/suppliers/${supplier.slug}` },
          ]),
          faqSchema(faqs),
        ]}
      />
      <PageLayout breadcrumbs={[{ label: "Suppliers", href: "/suppliers" }]}>
        <article>
          <header className="not-prose mb-10">
            <div className="mb-4 flex items-center gap-3">
              <span className="rounded-full bg-[color:var(--dw-accent)]/10 px-3 py-1 text-sm font-medium text-[color:var(--dw-accent)]">
                ★ {supplier.rating}/5
              </span>
              <span className="text-sm text-[color:var(--dw-text-muted)]">
                Founded {supplier.founded} · {supplier.headquarters}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {supplier.name} Review 2026
            </h1>
            <p className="mt-4 text-lg text-[color:var(--dw-text-muted)]">
              {supplier.description}
            </p>
          </header>

          <div className="not-prose mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-4">
              <div className="text-sm text-[color:var(--dw-text-muted)]">Shipping</div>
              <div className="mt-1 font-semibold">{supplier.shippingTime}</div>
            </div>
            <div className="rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-4">
              <div className="text-sm text-[color:var(--dw-text-muted)]">Min Order</div>
              <div className="mt-1 font-semibold">{supplier.minOrder}</div>
            </div>
            <div className="rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-4">
              <div className="text-sm text-[color:var(--dw-text-muted)]">Pricing</div>
              <div className="mt-1 font-semibold">{supplier.pricing}</div>
            </div>
            <div className="rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-4">
              <div className="text-sm text-[color:var(--dw-text-muted)]">Website</div>
              <div className="mt-1 font-semibold text-[color:var(--dw-accent)]">
                {supplier.website}
              </div>
            </div>
          </div>

          <section className="mb-10">
            <h2>Best For</h2>
            <p>{supplier.bestFor}</p>
          </section>

          <div className="not-prose mb-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-6">
              <h3 className="mb-4 font-semibold text-green-600">Pros</h3>
              <ul className="space-y-2">
                {supplier.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
              <h3 className="mb-4 font-semibold text-red-600">Cons</h3>
              <ul className="space-y-2">
                {supplier.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-red-500">✗</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <section className="mb-10">
            <h2>Key Features</h2>
            <div className="not-prose flex flex-wrap gap-2">
              {supplier.features.map((feature, i) => (
                <span
                  key={i}
                  className="rounded-full border border-[color:var(--dw-border)] px-3 py-1 text-sm"
                >
                  {feature}
                </span>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2>Supported Platforms</h2>
            <div className="not-prose flex flex-wrap gap-2">
              {supplier.platforms.map((platform, i) => (
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
            <h2>Product Categories</h2>
            <div className="not-prose flex flex-wrap gap-2">
              {supplier.categories.map((category, i) => (
                <Link
                  key={i}
                  href={`/niches/${category}`}
                  className="rounded-full bg-[color:var(--dw-accent)]/10 px-3 py-1 text-sm capitalize text-[color:var(--dw-accent)] transition-colors hover:bg-[color:var(--dw-accent)]/20"
                >
                  {category}
                </Link>
              ))}
            </div>
          </section>

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

        {relatedSuppliers.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-2xl font-bold">Similar Suppliers</h2>
            <div className="not-prose grid gap-4 sm:grid-cols-3">
              {relatedSuppliers.map((related) => (
                <Link
                  key={related.slug}
                  href={`/suppliers/${related.slug}`}
                  className="group rounded-xl border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-5 transition-all hover:border-[color:var(--dw-accent)]/40"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-[color:var(--dw-text-muted)]">
                      {related.headquarters}
                    </span>
                    <span className="text-xs">★ {related.rating}</span>
                  </div>
                  <h3 className="font-semibold transition-colors group-hover:text-[color:var(--dw-accent)]">
                    {related.name}
                  </h3>
                  <p className="mt-1 text-sm text-[color:var(--dw-text-muted)]">
                    {related.shippingTime}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="not-prose mt-12 rounded-xl border border-[color:var(--dw-accent)]/20 bg-gradient-to-r from-[color:var(--dw-accent)]/5 to-transparent p-8 text-center">
          <h3 className="text-2xl font-bold">Ready to Start Selling?</h3>
          <p className="mt-2 text-[color:var(--dw-text-muted)]">
            Build professional product pages in seconds with AI.
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
  const suppliers = getAllSuppliers();
  return {
    paths: suppliers.map((s) => ({ params: { slug: s.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<SupplierPageProps> = ({ params }) => {
  const slug = params?.slug as string;
  const supplier = getSupplierBySlug(slug);

  if (!supplier) {
    return { notFound: true };
  }

  const allSuppliers = getAllSuppliers();
  const relatedSuppliers = allSuppliers
    .filter(
      (s) =>
        s.slug !== slug &&
        s.categories.some((c) => supplier.categories.includes(c))
    )
    .slice(0, 3);

  return {
    props: {
      supplier,
      relatedSuppliers,
    },
  };
};

export default SupplierPage;
