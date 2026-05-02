export type SectionType =
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
  | "valueProps";

export type HeroVariant =
  | "split"
  | "full-bleed"
  | "centered"
  | "minimal"
  | "magazine";

export type BundlesVariant = "tiers" | "compact" | "showcase";
export type FaqVariant = "accordion" | "two-column" | "cards";
export type TestimonialsVariant = "grid" | "marquee" | "feature";
export type ValuePropsVariant = "grid" | "alternating" | "list";

export type HeroNavLink = { label: string; href: string };

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
};

export type ProductData = {
  title: string;
  imageUrl: string;
  priceCents: number;
  currency: string;
};

export type Bundle = {
  name: string;
  description: string;
  quantity: number;
  discountPercent: number;
  badge?: string | null;
  savings: string;
  recommended: boolean;
};

export type BundleData = {
  bundles: Bundle[];
  basePriceCents: number;
  currency: string;
  variant?: BundlesVariant;
};

export type TrustData = { badges: string[] };

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
  paymentMethods?: PaymentMethod[];
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

export const ADDABLE_SECTION_TYPES: Array<{
  type: SectionType;
  label: string;
}> = [
  { type: "hero", label: "Hero" },
  { type: "product", label: "Product card" },
  { type: "bundles", label: "Bundle offers" },
  { type: "lifestyle", label: "Lifestyle" },
  { type: "gallery", label: "Image gallery" },
  { type: "testimonials", label: "Testimonials" },
  { type: "valueProps", label: "Value props" },
  { type: "trust", label: "Trust badges" },
  { type: "faq", label: "FAQ" },
  { type: "video", label: "Video" },
  { type: "countdown", label: "Countdown" },
  { type: "comparison", label: "Comparison" },
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
]);
