import { api } from "@/utils/api";
import {
  LandingNav,
  HeroSection,
  StatsBar,
  FeaturesSection,
  HowItWorks,
  TestimonialsSection,
  PricingSection,
  CTABanner,
  FAQSection,
  LandingFooter,
} from "@/components/landing";

const Home = () => {
  const me = api.auth.me.useQuery();
  const isLoggedIn = !!me.data;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--dw-bg)] text-[var(--dw-text)]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <LandingNav isLoggedIn={isLoggedIn} />
      <HeroSection />
      <StatsBar />
      <FeaturesSection />
      <HowItWorks />
      <TestimonialsSection />
      <PricingSection />
      <CTABanner />
      <FAQSection />
      <LandingFooter />
    </div>
  );
};

export default Home;
