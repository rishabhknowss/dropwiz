import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { SEOHead, PageLayout } from "@/components/seo";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";
import { SITE_URL, NICHES, type Niche } from "@/lib/seo/constants";
import {
  getAllProductPaths,
  getProductBySlug,
  type ProductSubcategory,
} from "@/lib/seo/products-data";
import {
  getAllCountries,
  getCountryBySlug,
  type Country,
} from "@/lib/seo/countries-data";

type ProductCountryPageProps = {
  niche: Niche;
  nicheTitle: string;
  product: ProductSubcategory;
  country: Country;
};

const tierColors = {
  S: "bg-green-500/10 text-green-600 border-green-500/20",
  A: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  B: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  C: "bg-red-500/10 text-red-600 border-red-500/20",
};

const ProductCountryPage = ({ niche, nicheTitle, product, country }: ProductCountryPageProps) => {
  const shippingTime = country.region === "North America" ? "5-10 days" :
    country.region === "Europe" ? "7-15 days" :
    country.region === "Oceania" ? "10-20 days" :
    country.region === "Asia" ? "7-15 days" : "15-25 days";

  const marketPotential = country.tier === "S" ? "Very High" :
    country.tier === "A" ? "High" :
    country.tier === "B" ? "Moderate" : "Growing";

  const faqs = [
    {
      question: `Is ${product.name} a good product to dropship to ${country.name}?`,
      answer: `${product.name} has ${product.searchVolume} monthly searches globally with ${product.competition.toLowerCase()} competition. ${country.name} is a ${country.tier}-tier market with ${country.ecommerceGrowth} annual ecommerce growth, making it ${country.tier === "S" || country.tier === "A" ? "an excellent" : "a viable"} market for this product.`,
    },
    {
      question: `What are the shipping times for ${product.name} to ${country.name}?`,
      answer: `Typical shipping times for ${product.name} to ${country.name} are ${shippingTime} depending on the supplier and shipping method. ${country.shippingConsiderations}`,
    },
    {
      question: `What payment methods should I accept for ${country.name}?`,
      answer: `In ${country.name}, the most popular payment methods are ${country.paymentMethods.slice(0, 3).join(", ")}. Offering these options will help maximize conversions.`,
    },
  ];

  return (
    <>
      <SEOHead
        meta={{
          title: `Dropship ${product.name} to ${country.name} 2026 - Market Guide | Dropwiz`,
          description: `Dropship ${product.name} to ${country.name}: ${product.profitMargin} profit margin, ${country.ecommerceRevenue} market. Suppliers, shipping times, and strategies.`,
          canonical: `${SITE_URL}/products/${niche}/${product.slug}/${country.slug}`,
          keywords: [
            `dropship ${product.name.toLowerCase()} to ${country.name.toLowerCase()}`,
            `${product.name.toLowerCase()} ${country.name.toLowerCase()}`,
            `sell ${product.name.toLowerCase()} in ${country.name.toLowerCase()}`,
            `${country.name.toLowerCase()} dropshipping`,
          ],
        }}
        schemas={[
          breadcrumbSchema([
            { name: "Products", url: `${SITE_URL}/products` },
            { name: nicheTitle, url: `${SITE_URL}/niches/${niche}` },
            { name: product.name, url: `${SITE_URL}/products/${niche}/${product.slug}` },
            { name: country.name, url: `${SITE_URL}/products/${niche}/${product.slug}/${country.slug}` },
          ]),
          faqSchema(faqs),
        ]}
      />
      <PageLayout
        breadcrumbs={[
          { label: "Products", href: "/products" },
          { label: nicheTitle, href: `/niches/${niche}` },
          { label: product.name, href: `/products/${niche}/${product.slug}` },
        ]}
      >
        <article>
          <header className="not-prose mb-10">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className={`rounded-full border px-3 py-1 text-sm font-medium ${tierColors[country.tier]}`}>
                {country.tier}-Tier Market
              </span>
              <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm font-medium text-green-600">
                {product.profitMargin} Margin
              </span>
              <span className="rounded-full bg-[color:var(--dw-accent)]/10 px-3 py-1 text-sm font-medium text-[color:var(--dw-accent)]">
                {product.searchVolume} searches/mo
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Dropship {product.name} to {country.name} 2026
            </h1>
            <p className="mt-4 text-lg text-[color:var(--dw-text-muted)]">
              Complete guide to selling {product.name.toLowerCase()} in {country.name}. {country.ecommerceRevenue} market
              with {country.ecommerceGrowth} annual growth.
            </p>
          </header>

          <div className="not-prose mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-4">
              <div className="text-sm text-[color:var(--dw-text-muted)]">Market Size</div>
              <div className="mt-1 text-xl font-bold">{country.ecommerceRevenue}</div>
            </div>
            <div className="rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-4">
              <div className="text-sm text-[color:var(--dw-text-muted)]">Market Growth</div>
              <div className="mt-1 text-xl font-bold text-green-600">{country.ecommerceGrowth}</div>
            </div>
            <div className="rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-4">
              <div className="text-sm text-[color:var(--dw-text-muted)]">Shipping Time</div>
              <div className="mt-1 text-xl font-bold">{shippingTime}</div>
            </div>
            <div className="rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-4">
              <div className="text-sm text-[color:var(--dw-text-muted)]">Market Potential</div>
              <div className="mt-1 text-xl font-bold">{marketPotential}</div>
            </div>
          </div>

          <section className="mb-10">
            <h2>Product Overview</h2>
            <p>{product.description}</p>
            <div className="not-prose mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-4">
                <div className="text-sm font-medium">Average Price</div>
                <div className="mt-1 text-lg">{product.averagePrice}</div>
              </div>
              <div className="rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-4">
                <div className="text-sm font-medium">Competition Level</div>
                <div className="mt-1 text-lg">{product.competition}</div>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2>{country.name} Market Insights</h2>
            <p>{country.consumerBehavior}</p>

            <h3>Payment Methods in {country.name}</h3>
            <div className="not-prose flex flex-wrap gap-2">
              {country.paymentMethods.map((method, i) => (
                <span
                  key={i}
                  className={`rounded-full border px-3 py-1 text-sm ${i === 0 ? "border-[color:var(--dw-accent)] bg-[color:var(--dw-accent)]/10 text-[color:var(--dw-accent)]" : "border-[color:var(--dw-border)]"}`}
                >
                  {method}
                  {i === 0 && " (Primary)"}
                </span>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2>Top Products to Sell</h2>
            <div className="not-prose grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {product.topProducts.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-3"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--dw-accent)]/10 text-sm font-bold text-[color:var(--dw-accent)]">
                    {i + 1}
                  </span>
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2>Recommended Suppliers</h2>
            <div className="not-prose flex flex-wrap gap-2">
              {product.suppliers.map((supplier, i) => (
                <Link
                  key={i}
                  href={`/suppliers/${supplier.toLowerCase().replace(/ /g, "-")}`}
                  className="rounded-full bg-[color:var(--dw-accent)]/10 px-4 py-2 text-sm font-medium text-[color:var(--dw-accent)] transition-colors hover:bg-[color:var(--dw-accent)]/20"
                >
                  {supplier}
                </Link>
              ))}
            </div>
            <p className="mt-4 text-sm text-[color:var(--dw-text-muted)]">{product.shippingNotes}</p>
          </section>

          <section className="mb-10">
            <h2>Shipping to {country.name}</h2>
            <p>{country.shippingConsiderations}</p>
            <div className="not-prose mt-4 rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <div className="text-sm text-[color:var(--dw-text-muted)]">Currency</div>
                  <div className="font-medium">{country.currency}</div>
                </div>
                <div>
                  <div className="text-sm text-[color:var(--dw-text-muted)]">Language</div>
                  <div className="font-medium">{country.language}</div>
                </div>
                <div>
                  <div className="text-sm text-[color:var(--dw-text-muted)]">VAT/Tax</div>
                  <div className="font-medium">{country.vatTax}</div>
                </div>
              </div>
            </div>
          </section>

          <div className="not-prose mb-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-6">
              <h3 className="mb-4 font-semibold text-green-600">Opportunities in {country.name}</h3>
              <ul className="space-y-2">
                {country.opportunities.slice(0, 4).map((opp, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    {opp}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6">
              <h3 className="mb-4 font-semibold text-red-600">Challenges</h3>
              <ul className="space-y-2">
                {country.challenges.slice(0, 4).map((challenge, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-red-500">!</span>
                    {challenge}
                  </li>
                ))}
              </ul>
            </div>
          </div>

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
                      <span className="ml-2 transition-transform group-open:rotate-180">↓</span>
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

        <div className="not-prose mt-12 flex gap-4">
          <Link
            href={`/products/${niche}/${product.slug}`}
            className="flex-1 rounded-xl border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-4 text-center transition-all hover:border-[color:var(--dw-accent)]/40"
          >
            <div className="text-sm text-[color:var(--dw-text-muted)]">Product Details</div>
            <div className="font-semibold">{product.name}</div>
          </Link>
          <Link
            href={`/markets/${country.slug}`}
            className="flex-1 rounded-xl border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-4 text-center transition-all hover:border-[color:var(--dw-accent)]/40"
          >
            <div className="text-sm text-[color:var(--dw-text-muted)]">Market Guide</div>
            <div className="font-semibold">{country.name}</div>
          </Link>
        </div>

        <div className="not-prose mt-8 rounded-xl border border-[color:var(--dw-accent)]/20 bg-gradient-to-r from-[color:var(--dw-accent)]/5 to-transparent p-8 text-center">
          <h3 className="text-2xl font-bold">Start Selling {product.name} in {country.name}</h3>
          <p className="mt-2 text-[color:var(--dw-text-muted)]">
            Create a localized, high-converting product page in seconds with AI.
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

export const getStaticPaths: GetStaticPaths = () => {
  const productPaths = getAllProductPaths();
  const countries = getAllCountries();

  const paths: Array<{ params: { niche: string; product: string; country: string } }> = [];

  productPaths.forEach(({ niche, product }) => {
    countries.forEach((country) => {
      paths.push({
        params: { niche, product, country: country.slug },
      });
    });
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<ProductCountryPageProps> = ({ params }) => {
  const niche = params?.niche as Niche;
  const productSlug = params?.product as string;
  const countrySlug = params?.country as string;

  if (!NICHES.includes(niche)) {
    return { notFound: true };
  }

  const product = getProductBySlug(niche, productSlug);
  const country = getCountryBySlug(countrySlug);

  if (!product || !country) {
    return { notFound: true };
  }

  const nicheTitle = niche
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    props: {
      niche,
      nicheTitle,
      product,
      country,
    },
  };
};

export default ProductCountryPage;
