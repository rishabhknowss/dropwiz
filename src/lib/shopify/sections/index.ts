import type { StoreSection, ThemeTokens } from "@/db/schema";
import type { SectionOutput, SectionGeneratorContext } from "./types";

import { generateHeaderSection } from "./header";
import { generateFooterSection } from "./footer";
import { generateHeroSection } from "./hero";
import { generateProductSection } from "./product";
import { generateBundlesSection } from "./bundles";
import { generateTestimonialsSection } from "./testimonials";
import { generateFaqSection } from "./faq";
import { generateAnnouncementSection } from "./announcement";
import { generateLifestyleSection } from "./lifestyle";
import { generateValuePropsSection } from "./value-props";
import { generateTrustSection } from "./trust";
import { generateHowItWorksSection } from "./how-it-works";
import { generateFeatureMarqueeSection } from "./feature-marquee";
import { generateVideoSection } from "./video";
import { generateGallerySection } from "./gallery";
import { generateReviewStatsSection } from "./review-stats";

export * from "./types";
export * from "./utils";

const SECTION_GENERATORS: Record<
  string,
  (ctx: SectionGeneratorContext) => SectionOutput | null
> = {
  header: generateHeaderSection,
  footer: generateFooterSection,
  hero: generateHeroSection,
  product: generateProductSection,
  bundles: generateBundlesSection,
  testimonials: generateTestimonialsSection,
  faq: generateFaqSection,
  announcement: generateAnnouncementSection,
  lifestyle: generateLifestyleSection,
  valueProps: generateValuePropsSection,
  trust: generateTrustSection,
  howItWorks: generateHowItWorksSection,
  featureMarquee: generateFeatureMarqueeSection,
  video: generateVideoSection,
  gallery: generateGallerySection,
  reviewStats: generateReviewStatsSection,
};

export const generateSection = (
  section: StoreSection,
  themeTokens: ThemeTokens,
  storeId: string,
  storeName?: string
): SectionOutput | null => {
  const generator = SECTION_GENERATORS[section.type];
  if (!generator) {
    console.warn(`[sections] No generator for section type: ${section.type}`);
    return null;
  }

  return generator({
    section,
    themeTokens,
    storeId,
    storeName,
  });
};

export const generateAllSections = (
  sections: StoreSection[],
  themeTokens: ThemeTokens,
  storeId: string,
  storeName?: string
): Map<string, SectionOutput> => {
  const outputs = new Map<string, SectionOutput>();
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  for (const section of sortedSections) {
    const output = generateSection(section, themeTokens, storeId, storeName);
    if (output) {
      outputs.set(section.type, output);
    }
  }

  return outputs;
};

export {
  generateHeaderSection,
  generateFooterSection,
  generateHeroSection,
  generateProductSection,
  generateBundlesSection,
  generateTestimonialsSection,
  generateFaqSection,
  generateAnnouncementSection,
  generateLifestyleSection,
  generateValuePropsSection,
  generateTrustSection,
  generateHowItWorksSection,
  generateFeatureMarqueeSection,
  generateVideoSection,
  generateGallerySection,
  generateReviewStatsSection,
};
