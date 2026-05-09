import type { Store, StoreSection } from "@/db/schema";
import type {
  HeaderData,
  HeroData,
  HeroBundle,
  ProductData,
  BundleData,
  TrustData,
  FaqData,
  FooterData,
  VideoData,
  LifestyleData,
  GalleryData,
  TestimonialsData,
  ValuePropsData,
  AnnouncementData,
  FeatureMarqueeData,
  ReviewStatsData,
  HowItWorksData,
  Bundle,
} from "@/types/store-sections";
import { HeaderSection } from "./HeaderSection";
import { HeroSection } from "./HeroSection";
import { ProductSection } from "./ProductSection";
import { BundlesSection } from "./BundlesSection";
import { TrustSection } from "./TrustSection";
import { FaqSection } from "./FaqSection";
import { FooterSection } from "./FooterSection";
import { LifestyleSection } from "./LifestyleSection";
import { GallerySection } from "./GallerySection";
import { TestimonialsSection } from "./TestimonialsSection";
import { ValuePropsSection } from "./ValuePropsSection";
import { AnnouncementSection } from "./AnnouncementSection";
import { FeatureMarqueeSection } from "./FeatureMarqueeSection";
import { ReviewStatsSection } from "./ReviewStatsSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { VideoSection } from "./VideoSection";

const getBundlesFromStore = (store: Store, sections: StoreSection[]): HeroBundle[] | null => {
  const bundlesSection = sections.find((s) => s.type === "bundles");
  if (!bundlesSection) return null;

  const bundleData = bundlesSection.data as BundleData;
  if (!bundleData?.bundles?.length || !bundleData.basePriceCents) return null;

  return bundleData.bundles.map((b: Bundle) => {
    const totalUnits = b.quantity + (b.freeQuantity ?? 0);
    const fullPrice = bundleData.basePriceCents * totalUnits;
    const discountedPrice = Math.round(fullPrice * (1 - b.discountPercent / 100));
    return {
      name: b.name,
      quantity: b.quantity,
      freeQuantity: b.freeQuantity,
      priceCents: discountedPrice,
      originalPriceCents: fullPrice,
      savings: b.savings,
      badge: b.badge,
    };
  });
};

export const Section = ({
  section,
  store,
  allSections,
}: {
  section: StoreSection;
  store: Store;
  allSections?: StoreSection[];
}) => {
  switch (section.type) {
    case "header":
      return <HeaderSection data={section.data as HeaderData} />;
    case "hero": {
      const heroData = section.data as HeroData;
      const hasExistingBundles = heroData.bundles && heroData.bundles.length > 0;
      if (!hasExistingBundles && allSections) {
        const storeBundles = getBundlesFromStore(store, allSections);
        const bundlesSection = allSections.find((s) => s.type === "bundles");
        const bundleData = bundlesSection?.data as BundleData | undefined;
        if (storeBundles) {
          const mergedData: HeroData = {
            ...heroData,
            bundles: storeBundles,
            currency: heroData.currency ?? bundleData?.currency ?? "USD",
            trustBadges: heroData.trustBadges ?? ["Free Shipping", "30-Day Guarantee", "Secure Checkout"],
          };
          return <HeroSection data={mergedData} />;
        }
      }
      return <HeroSection data={heroData} />;
    }
    case "product":
      return <ProductSection data={section.data as ProductData} />;
    case "bundles":
      return <BundlesSection data={section.data as BundleData} />;
    case "trust":
      return <TrustSection data={section.data as TrustData} />;
    case "faq":
      return <FaqSection data={section.data as FaqData} />;
    case "footer":
      return <FooterSection data={section.data as FooterData} store={store} />;
    case "lifestyle":
      return <LifestyleSection data={section.data as LifestyleData} />;
    case "gallery":
      return <GallerySection data={section.data as GalleryData} />;
    case "testimonials":
      return <TestimonialsSection data={section.data as TestimonialsData} />;
    case "valueProps":
      return <ValuePropsSection data={section.data as ValuePropsData} />;
    case "announcement":
      return <AnnouncementSection data={section.data as AnnouncementData} />;
    case "featureMarquee":
      return <FeatureMarqueeSection data={section.data as FeatureMarqueeData} />;
    case "reviewStats":
      return <ReviewStatsSection data={section.data as ReviewStatsData} />;
    case "howItWorks":
      return <HowItWorksSection data={section.data as HowItWorksData} />;
    case "video":
      return <VideoSection data={section.data as VideoData} />;
    default:
      return null;
  }
};

export {
  HeaderSection,
  HeroSection,
  ProductSection,
  BundlesSection,
  TrustSection,
  FaqSection,
  FooterSection,
  VideoSection,
  LifestyleSection,
  GallerySection,
  TestimonialsSection,
  ValuePropsSection,
  AnnouncementSection,
  FeatureMarqueeSection,
  ReviewStatsSection,
  HowItWorksSection,
};
