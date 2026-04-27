import type { Store, StoreSection } from "@/db/schema";
import type {
  HeroData,
  ProductData,
  BundleData,
  TrustData,
  FaqData,
  FooterData,
  LifestyleData,
  GalleryData,
  TestimonialsData,
  ValuePropsData,
} from "@/types/store-sections";
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

export const Section = ({
  section,
  store,
}: {
  section: StoreSection;
  store: Store;
}) => {
  switch (section.type) {
    case "hero":
      return <HeroSection data={section.data as HeroData} />;
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
    default:
      return null;
  }
};

export {
  HeroSection,
  ProductSection,
  BundlesSection,
  TrustSection,
  FaqSection,
  FooterSection,
  LifestyleSection,
  GallerySection,
  TestimonialsSection,
  ValuePropsSection,
};
