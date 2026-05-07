import type { GetStaticProps } from "next";
import Link from "next/link";
import { SEOHead, PageLayout } from "@/components/seo";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/seo/constants";
import { getAllSuppliers, type Supplier } from "@/lib/seo/suppliers-data";

type SuppliersIndexProps = {
  suppliers: Supplier[];
};

const SuppliersIndex = ({ suppliers }: SuppliersIndexProps) => {
  const featured = suppliers.filter((s) => s.rating >= 4.4);
  const others = suppliers.filter((s) => s.rating < 4.4);

  return (
    <>
      <SEOHead
        meta={{
          title: "Best Dropshipping Suppliers 2026 - Verified Directory | Dropwiz",
          description:
            "Compare 30+ verified dropshipping suppliers for 2026. Find the best suppliers for Shopify, Amazon, and eBay with shipping times, pricing, and reviews.",
          canonical: `${SITE_URL}/suppliers`,
          keywords: [
            "dropshipping suppliers",
            "best dropshipping suppliers 2026",
            "wholesale suppliers",
            "aliexpress alternatives",
          ],
        }}
        schemas={[
          breadcrumbSchema([{ name: "Suppliers", url: `${SITE_URL}/suppliers` }]),
        ]}
      />
      <PageLayout breadcrumbs={[]}>
        <header className="not-prose mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-sm text-green-600">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            {suppliers.length}+ Verified Suppliers
          </div>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Dropshipping Suppliers Directory 2026
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[color:var(--dw-text-muted)]">
            Find the perfect suppliers for your dropshipping business. Compare shipping
            times, pricing, integrations, and real reviews.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold">Top Rated Suppliers</h2>
          <div className="not-prose grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((supplier) => (
              <Link
                key={supplier.slug}
                href={`/suppliers/${supplier.slug}`}
                className="group rounded-xl border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-5 transition-all hover:border-[color:var(--dw-accent)]/40 hover:shadow-lg"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-[color:var(--dw-text-muted)]">
                    {supplier.headquarters}
                  </span>
                  <span className="rounded-full bg-[color:var(--dw-accent)]/10 px-2 py-0.5 text-xs font-medium text-[color:var(--dw-accent)]">
                    ★ {supplier.rating}
                  </span>
                </div>
                <h3 className="text-lg font-semibold transition-colors group-hover:text-[color:var(--dw-accent)]">
                  {supplier.name}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-[color:var(--dw-text-muted)]">
                  {supplier.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {supplier.categories.slice(0, 3).map((cat) => (
                    <span
                      key={cat}
                      className="rounded bg-[color:var(--dw-bg)] px-2 py-0.5 text-xs capitalize"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-[color:var(--dw-text-muted)]">
                    {supplier.shippingTime}
                  </span>
                  <span className="font-medium text-[color:var(--dw-accent)]">
                    View details →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-bold">All Suppliers</h2>
          <div className="not-prose grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {others.map((supplier) => (
              <Link
                key={supplier.slug}
                href={`/suppliers/${supplier.slug}`}
                className="group rounded-xl border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-5 transition-all hover:border-[color:var(--dw-accent)]/40 hover:shadow-lg"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-[color:var(--dw-text-muted)]">
                    {supplier.headquarters}
                  </span>
                  <span className="text-xs">★ {supplier.rating}</span>
                </div>
                <h3 className="font-semibold transition-colors group-hover:text-[color:var(--dw-accent)]">
                  {supplier.name}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-[color:var(--dw-text-muted)]">
                  {supplier.description}
                </p>
                <div className="mt-3 text-sm text-[color:var(--dw-text-muted)]">
                  {supplier.shippingTime}
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="not-prose mt-12 rounded-xl border border-[color:var(--dw-accent)]/20 bg-gradient-to-r from-[color:var(--dw-accent)]/5 to-transparent p-8 text-center">
          <h3 className="text-2xl font-bold">Found Your Supplier?</h3>
          <p className="mt-2 text-[color:var(--dw-text-muted)]">
            Build your store in seconds with AI-powered product pages.
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

export const getStaticProps: GetStaticProps<SuppliersIndexProps> = () => {
  return {
    props: {
      suppliers: getAllSuppliers(),
    },
  };
};

export default SuppliersIndex;
