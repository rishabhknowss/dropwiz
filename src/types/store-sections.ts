export type SectionType =
  | "header"
  | "hero"
  | "product"
  | "bundles"
  | "trust"
  | "faq"
  | "footer"
  | "video"
  | "countdown"
  | "comparison"
  | "lifestyle"
  | "gallery"
  | "testimonials"
  | "valueProps"
  | "announcement"
  | "featureMarquee"
  | "reviewStats"
  | "howItWorks";

export type HeaderData = {
  logoUrl?: string;
  storeName?: string;
  showCartIcon?: boolean;
  showNameWithLogo?: boolean;
};

export type HeroVariant =
  | "split"
  | "full-bleed"
  | "centered"
  | "minimal"
  | "magazine"
  | "product-hero";

export type HeroCtaMode = "cart" | "navigate";

export type BundlesVariant = "tiers" | "compact" | "showcase";
export type FaqVariant = "accordion" | "two-column" | "cards";
export type TestimonialsVariant = "grid" | "marquee" | "feature";
export type ValuePropsVariant = "grid" | "alternating" | "list";

export type HeroNavLink = { label: string; href: string };

export type FeatureBadge = { icon: string; label: string };

export type HeroBundle = {
  name: string;
  quantity: number;
  freeQuantity?: number;
  priceCents: number;
  originalPriceCents?: number;
  savings?: string;
  badge?: string | null;
};

export type HeroImageBadge = {
  icon?: string;
  text: string;
};

export type HeroBenefit = {
  icon?: string;
  text: string;
};

export type HeroQuickFeature = {
  text: string;
};

export type HeroInlineFaq = {
  question: string;
  answer: string;
};

export type HeroTrustCard = {
  icon?: string;
  title: string;
  description: string;
};

export type HeroSideFeature = {
  icon: string;
  label: string;
  description?: string;
};

export type HeroData = {
  headline: string;
  subheadline: string;
  primaryCta: string;
  secondaryCta?: string | null;
  urgencyBadge?: string | null;
  socialProof?: string | null;
  imageUrl?: string;
  variant?: HeroVariant;
  brandName?: string;
  navLinks?: HeroNavLink[];
  overlayDarkness?: number;
  featureBadges?: FeatureBadge[];
  trustBadges?: string[];
  rating?: number;
  reviewCount?: number;
  ratingSource?: string;
  priceCents?: number;
  originalPriceCents?: number;
  currency?: string;
  productBadge?: string | null;
  bundles?: HeroBundle[];
  sideFeatures?: (FeatureBadge | HeroSideFeature)[];
  additionalImages?: string[];
  imageBadge?: HeroImageBadge;
  stockBadge?: string;
  benefits?: HeroBenefit[];
  quickFeatures?: HeroQuickFeature[];
  inlineFaqs?: HeroInlineFaq[];
  trustCards?: HeroTrustCard[];
  bottomMessage?: { icon?: string; text: string };
  showHeader?: boolean;
  showBundleSelector?: boolean;
  galleryImages?: string[];
  showPaymentBadges?: boolean;
  paymentMethods?: PaymentMethod[];
  ctaMode?: HeroCtaMode;
  ctaLink?: string;
};

export type ProductVariant = "default" | "gallery" | "compact" | "rich";

export type ProductSideFeature = {
  icon: string;
  label: string;
};

export type ProductData = {
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl: string;
  images?: string[];
  priceCents: number;
  originalPriceCents?: number;
  currency: string;
  badge?: string | null;
  rating?: number;
  reviewCount?: number;
  features?: Array<{ icon: string; label: string }>;
  variant?: ProductVariant;
  showPaymentBadges?: boolean;
  paymentMethods?: PaymentMethod[];
  sideFeatures?: ProductSideFeature[];
  galleryImages?: string[];
};

export type Bundle = {
  name: string;
  description: string;
  quantity: number;
  freeQuantity?: number;
  discountPercent: number;
  badge?: string | null;
  savings: string;
  recommended: boolean;
};

export type BundleData = {
  bundles: Bundle[];
  basePriceCents: number;
  originalPriceCents?: number;
  currency: string;
  variant?: BundlesVariant;
  productImage?: string;
};

export type TrustBadge = {
  icon?: string;
  title: string;
  description?: string;
};

export type ShippingStep = {
  icon: string;
  label: string;
  date?: string;
};

export type TrustVariant = "simple" | "detailed" | "timeline";

export type TrustData = {
  badges: (string | TrustBadge)[];
  showPaymentBadges?: boolean;
  shippingTimeline?: ShippingStep[];
  variant?: TrustVariant;
};

export type FaqItem = { question: string; answer: string };
export type FaqData = { faqs: FaqItem[]; variant?: FaqVariant };

export type PaymentMethod =
  | "visa"
  | "mastercard"
  | "amex"
  | "paypal"
  | "applepay"
  | "googlepay"
  | "discover"
  | "stripe";

export type FooterData = {
  storeName: string;
  logoUrl?: string;
  tagline?: string;
  showPayments?: boolean;
  paymentMethods?: PaymentMethod[];
  showPoweredBy?: boolean;
  copyrightText?: string;
};

export type VideoData = { videoUrl: string; caption?: string };

export type CountdownData = { endsAt: string; label?: string };

export type ComparisonData = {
  rows: Array<{ label: string; ours: string; theirs: string }>;
};

export type LifestyleData = {
  headline: string;
  body: string;
  imageUrl: string;
  imagePosition?: "left" | "right";
  galleryImages?: string[];
};

export type GalleryImage = { url: string; caption?: string };

export type GalleryData = {
  title?: string;
  images: GalleryImage[];
};

export type Testimonial = {
  quote: string;
  name: string;
  role?: string;
  avatarUrl?: string;
  rating?: number;
};

export type TestimonialsData = {
  title?: string;
  testimonials: Testimonial[];
  variant?: TestimonialsVariant;
};

export type ValueProp = {
  title: string;
  description: string;
  icon?: string;
};

export type ValuePropsData = {
  title?: string;
  props: ValueProp[];
  variant?: ValuePropsVariant;
};

export type AnnouncementData = {
  badges: Array<{ icon?: string; text: string }>;
  variant?: "bar" | "pills" | "marquee";
};

export type FeatureMarqueeData = {
  items: Array<{ icon: string; label: string }>;
  speed?: "slow" | "normal" | "fast";
};

export type ReviewStatsData = {
  rating: number;
  reviewCount: number;
  source?: string;
  showStars?: boolean;
};

export type HowItWorksStep = {
  title: string;
  description: string;
  icon?: string;
  imageUrl?: string;
};

export type HowItWorksVariant = "cards" | "timeline" | "numbered";

export type HowItWorksData = {
  title?: string;
  steps: HowItWorksStep[];
  variant?: HowItWorksVariant;
};

export const ADDABLE_SECTION_TYPES: Array<{
  type: SectionType;
  label: string;
}> = [
  { type: "header", label: "Header" },
  { type: "hero", label: "Hero" },
  { type: "product", label: "Product card" },
  { type: "bundles", label: "Bundle offers" },
  { type: "announcement", label: "Announcement bar" },
  { type: "reviewStats", label: "Review stats" },
  { type: "featureMarquee", label: "Feature marquee" },
  { type: "lifestyle", label: "Lifestyle" },
  { type: "gallery", label: "Image gallery" },
  { type: "testimonials", label: "Testimonials" },
  { type: "valueProps", label: "Value props" },
  { type: "trust", label: "Trust badges" },
  { type: "faq", label: "FAQ" },
  { type: "video", label: "Video" },
  { type: "countdown", label: "Countdown" },
  { type: "comparison", label: "Comparison" },
  { type: "howItWorks", label: "How it works" },
  { type: "footer", label: "Footer" },
];

export const DEDUPABLE_SECTION_TYPES = new Set<SectionType>([
  "bundles",
  "faq",
  "trust",
  "video",
  "countdown",
  "comparison",
  "lifestyle",
  "gallery",
  "testimonials",
  "valueProps",
  "howItWorks",
]);
