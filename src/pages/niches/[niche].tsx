import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import { SEOHead, PageLayout, CTASidebar, RelatedLinks } from "@/components/seo";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";
import { nicheMetadata } from "@/lib/seo/metadata";
import { SITE_URL, NICHES, type Niche } from "@/lib/seo/constants";

type NichePageProps = {
  niche: Niche;
  nicheTitle: string;
  relatedNiches: Niche[];
};

const nicheFaqs: Record<string, Array<{ question: string; answer: string }>> = {
  "pet-supplies": [
    {
      question: "Is pet supplies a good dropshipping niche?",
      answer:
        "Yes, pet supplies is one of the best dropshipping niches in 2026. The pet industry is worth over $100 billion globally with consistent growth. Pet owners are passionate buyers willing to spend on their pets.",
    },
    {
      question: "What are the best pet products to dropship?",
      answer:
        "Top pet products include automatic feeders, GPS trackers, orthopedic beds, grooming tools, and unique toys. Focus on problem-solving products with good margins.",
    },
  ],
  fitness: [
    {
      question: "Is fitness a good dropshipping niche?",
      answer:
        "Fitness is an excellent dropshipping niche with high growth potential. The home fitness market continues to expand, and fitness enthusiasts are willing to invest in quality equipment and accessories.",
    },
    {
      question: "What fitness products sell best?",
      answer:
        "Top-selling fitness products include resistance bands, yoga mats, smart fitness trackers, portable exercise equipment, and recovery tools like massage guns.",
    },
  ],
};

const nicheProducts: Record<string, string[]> = {
  "pet-supplies": [
    "Automatic pet feeders",
    "Pet GPS trackers",
    "Orthopedic pet beds",
    "Pet grooming kits",
    "Interactive pet toys",
  ],
  "home-decor": [
    "LED strip lights",
    "Wall art and prints",
    "Decorative pillows",
    "Artificial plants",
    "Storage organizers",
  ],
  fitness: [
    "Resistance bands sets",
    "Yoga mats",
    "Massage guns",
    "Smart water bottles",
    "Fitness trackers",
  ],
  beauty: [
    "LED face masks",
    "Jade rollers",
    "Hair styling tools",
    "Makeup organizers",
    "Skincare devices",
  ],
  electronics: [
    "Wireless earbuds",
    "Phone accessories",
    "Smart home devices",
    "Portable chargers",
    "Desk gadgets",
  ],
};

const NichePage = ({ niche, nicheTitle, relatedNiches }: NichePageProps) => {
  const faqs = nicheFaqs[niche] ?? [
    {
      question: `Is ${nicheTitle.toLowerCase()} a good dropshipping niche?`,
      answer: `${nicheTitle} is a solid dropshipping niche with consistent demand. Success depends on finding unique products and targeting the right audience.`,
    },
  ];

  const products = nicheProducts[niche] ?? [
    "Trending products",
    "Best sellers",
    "New arrivals",
    "Seasonal items",
    "Gift ideas",
  ];

  const sidebar = (
    <div className="space-y-6">
      <CTASidebar />
      <RelatedLinks
        title="Related Niches"
        links={relatedNiches.map((n) => ({
          title: n
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" "),
          href: `/niches/${n}`,
        }))}
      />
    </div>
  );

  return (
    <>
      <SEOHead
        meta={nicheMetadata(niche)}
        schemas={[
          breadcrumbSchema([
            { name: "Niches", url: `${SITE_URL}/niches` },
            { name: nicheTitle, url: `${SITE_URL}/niches/${niche}` },
          ]),
          faqSchema(faqs),
        ]}
      />
      <PageLayout
        breadcrumbs={[{ label: "Niches", href: "/niches" }]}
        sidebar={sidebar}
      >
        <header className="not-prose mb-10">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            {nicheTitle} Dropshipping 2026
          </h1>
          <p className="mt-4 text-lg text-[color:var(--dw-text-muted)]">
            Start a profitable {nicheTitle.toLowerCase()} dropshipping business.
            Find trending products, reliable suppliers, and build your store with AI.
          </p>
        </header>

        <section>
          <h2>Why {nicheTitle}?</h2>
          <p>
            The {nicheTitle.toLowerCase()} market continues to grow in 2026, making it
            an excellent opportunity for dropshippers. This niche offers:
          </p>
          <ul>
            <li>Passionate, repeat customers</li>
            <li>Wide range of product options</li>
            <li>Good profit margins (30-50%)</li>
            <li>Year-round demand</li>
            <li>Social media marketing potential</li>
          </ul>
        </section>

        <section>
          <h2>Top {nicheTitle} Products to Sell</h2>
          <p>
            Here are the best-selling {nicheTitle.toLowerCase()} products for
            dropshipping in 2026:
          </p>
          <div className="not-prose grid gap-4 sm:grid-cols-2">
            {products.map((product, i) => (
              <div
                key={i}
                className="rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-4"
              >
                <div className="font-medium">{product}</div>
                <div className="mt-1 text-sm text-[color:var(--dw-text-muted)]">
                  High demand • Good margins
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2>Finding {nicheTitle} Suppliers</h2>
          <p>
            The best platforms to find {nicheTitle.toLowerCase()} suppliers include:
          </p>
          <ul>
            <li>
              <strong>AliExpress</strong> - Wide selection, good for testing
            </li>
            <li>
              <strong>CJ Dropshipping</strong> - Quality control, faster shipping
            </li>
            <li>
              <strong>Spocket</strong> - US/EU suppliers for faster delivery
            </li>
          </ul>
        </section>

        <section>
          <h2>Marketing Your {nicheTitle} Store</h2>
          <p>
            The most effective marketing strategies for {nicheTitle.toLowerCase()}{" "}
            dropshipping:
          </p>
          <ul>
            <li>
              <strong>TikTok & Instagram</strong> - Visual content performs well
            </li>
            <li>
              <strong>Facebook Ads</strong> - Target specific interests
            </li>
            <li>
              <strong>Influencer marketing</strong> - Partner with niche creators
            </li>
            <li>
              <strong>SEO</strong> - Build organic traffic over time
            </li>
          </ul>
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

        <div className="not-prose mt-12 rounded-xl border border-[color:var(--dw-accent)]/20 bg-gradient-to-r from-[color:var(--dw-accent)]/5 to-transparent p-8 text-center">
          <h3 className="text-2xl font-bold">
            Build Your {nicheTitle} Store Today
          </h3>
          <p className="mt-2 text-[color:var(--dw-text-muted)]">
            Generate professional product pages with AI. Just paste any product URL.
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
  const paths = NICHES.map((niche) => ({
    params: { niche },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<NichePageProps> = ({ params }) => {
  const niche = params?.niche as Niche;

  if (!NICHES.includes(niche)) {
    return { notFound: true };
  }

  const nicheTitle = niche
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const currentIndex = NICHES.indexOf(niche);
  const relatedNiches = NICHES.filter((_, i) => i !== currentIndex).slice(0, 5);

  return {
    props: {
      niche,
      nicheTitle,
      relatedNiches,
    },
  };
};

export default NichePage;
