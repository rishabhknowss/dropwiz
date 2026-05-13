import { api } from "@/utils/api";
import {
  LandingNav,
  HeroSection,
  StatsBar,
  FeaturesSection,
  TestimonialsSection,
  PricingSection,
  FAQSection,
  LandingFooter,
} from "@/components/landing";
import { SEOHead } from "@/components/seo";
import { homeMetadata } from "@/lib/seo/metadata";
import {
  organizationSchema,
  websiteSchema,
  softwareAppSchema,
  faqSchema,
} from "@/lib/seo/schema";

const homeFaqs = [
  {
    question: "What is Dropwiz?",
    answer:
      "Dropwiz is an AI-powered Shopify store builder that helps you create high-converting product pages and landing pages in seconds. Just paste a product URL and our AI generates professional copy, designs, and optimized layouts.",
  },
  {
    question: "How does Dropwiz work?",
    answer:
      "Simply paste any product URL from Amazon, AliExpress, or other platforms. Dropwiz automatically scrapes the product data and uses AI to generate a complete store page with optimized descriptions, headlines, FAQs, and professional design.",
  },
  {
    question: "Is Dropwiz free to use?",
    answer:
      "Yes! Dropwiz offers a free tier that lets you generate stores and see the results. Paid plans unlock additional features like Shopify publishing, unlimited stores, and AI image generation.",
  },
  {
    question: "Can I publish directly to Shopify?",
    answer:
      "Yes, Dropwiz integrates directly with Shopify. Connect your store and publish your AI-generated product pages with one click.",
  },
];

const Home = () => {
  const me = api.auth.me.useQuery();
  const isLoggedIn = !!me.data;

  return (
    <>
      <SEOHead
        meta={homeMetadata}
        schemas={[
          organizationSchema(),
          websiteSchema(),
          softwareAppSchema(),
          faqSchema(homeFaqs),
        ]}
      />
      <div
        className="relative min-h-screen overflow-x-hidden bg-[var(--dw-bg)] text-[var(--dw-text)]"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <div className="pointer-events-none fixed inset-0 z-[100] mx-auto hidden max-w-6xl lg:block">
          <div className="relative size-full">
            <div className="absolute bottom-0 left-4 top-0 w-px bg-[var(--dw-border)] lg:left-8" />
            <div className="absolute bottom-0 right-4 top-0 w-px bg-[var(--dw-border)] lg:right-8" />
          </div>
        </div>
        <LandingNav isLoggedIn={isLoggedIn} />
        <HeroSection />
        <StatsBar />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <LandingFooter />
      </div>
    </>
  );
};

export default Home;
