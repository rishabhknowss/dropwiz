import type { SectionType } from "@/types/store-sections";

export type VariantPreview = "split-img-r" | "stack-center" | "fullbleed" | "minimal-grid"
  | "magazine-cover" | "tier-grid" | "radio-list" | "feature-card"
  | "single-col" | "two-col-text" | "card-grid"
  | "grid-3" | "horizontal-strip" | "feature-quote"
  | "icon-grid" | "alt-rows" | "list-with-header"
  | "single-product" | "product-with-images" | "trust-row" | "footer-min"
  | "video-block" | "countdown-block" | "comparison-table"
  | "gallery-masonry" | "lifestyle-split"
  | "announcement-bar" | "announcement-marquee" | "how-it-works-cards" | "how-it-works-timeline"
  | "header-simple";

export type Variant = {
  id: string;
  label: string;
  description: string;
  preview: VariantPreview;
};

export type SectionCategory = {
  type: SectionType;
  label: string;
  description: string;
  variants: Variant[];
};

export const SECTION_CATALOG: SectionCategory[] = [
  {
    type: "header",
    label: "Header",
    description: "Logo and navigation",
    variants: [
      { id: "default", label: "Simple", description: "Logo left, cart right", preview: "header-simple" },
    ],
  },
  {
    type: "hero",
    label: "Hero",
    description: "Above-the-fold opener",
    variants: [
      { id: "split", label: "Split", description: "Text left, image right", preview: "split-img-r" },
      { id: "centered", label: "Centered", description: "Stacked, image below copy", preview: "stack-center" },
      { id: "full-bleed", label: "Full image", description: "Full-bleed BG with navbar overlay", preview: "fullbleed" },
      { id: "minimal", label: "Minimal", description: "Tight grid, image at bottom", preview: "minimal-grid" },
      { id: "magazine", label: "Magazine", description: "Editorial cover with hero photo", preview: "magazine-cover" },
    ],
  },
  {
    type: "bundles",
    label: "Bundle offers",
    description: "Multi-pack pricing",
    variants: [
      { id: "tiers", label: "Tiers", description: "4-up grid with recommended", preview: "tier-grid" },
      { id: "compact", label: "Compact", description: "Radio list, single CTA", preview: "radio-list" },
      { id: "showcase", label: "Showcase", description: "Big featured + 3 alts", preview: "feature-card" },
    ],
  },
  {
    type: "faq",
    label: "FAQ",
    description: "Common questions",
    variants: [
      { id: "accordion", label: "Accordion", description: "Click to expand", preview: "single-col" },
      { id: "two-column", label: "Two column", description: "Header left, all answers", preview: "two-col-text" },
      { id: "cards", label: "Cards", description: "Expandable cards grid", preview: "card-grid" },
    ],
  },
  {
    type: "testimonials",
    label: "Testimonials",
    description: "Social proof",
    variants: [
      { id: "grid", label: "Grid", description: "3-up review cards", preview: "grid-3" },
      { id: "marquee", label: "Marquee", description: "Auto-scrolling row", preview: "horizontal-strip" },
      { id: "feature", label: "Feature", description: "Big quote + alternates", preview: "feature-quote" },
    ],
  },
  {
    type: "valueProps",
    label: "Value props",
    description: "Why customers buy",
    variants: [
      { id: "grid", label: "Grid", description: "3-up centered with icons", preview: "icon-grid" },
      { id: "alternating", label: "Alternating", description: "Zig-zag rows", preview: "alt-rows" },
      { id: "list", label: "List", description: "Sidebar header + rows", preview: "list-with-header" },
    ],
  },
  {
    type: "product",
    label: "Product",
    description: "Buy box",
    variants: [
      { id: "default", label: "Default", description: "Image + title + price + CTA", preview: "product-with-images" },
    ],
  },
  {
    type: "lifestyle",
    label: "Lifestyle",
    description: "Story image + copy",
    variants: [
      { id: "default", label: "Split image", description: "Image left or right + copy", preview: "lifestyle-split" },
    ],
  },
  {
    type: "gallery",
    label: "Gallery",
    description: "Image showcase",
    variants: [
      { id: "default", label: "Masonry", description: "Multi-image grid", preview: "gallery-masonry" },
    ],
  },
  {
    type: "trust",
    label: "Trust badges",
    description: "Logos, guarantees",
    variants: [
      { id: "default", label: "Row", description: "Centered badge row", preview: "trust-row" },
    ],
  },
  {
    type: "video",
    label: "Video",
    description: "Embedded clip",
    variants: [
      { id: "default", label: "Full block", description: "16:9 video frame", preview: "video-block" },
    ],
  },
  {
    type: "countdown",
    label: "Countdown",
    description: "Urgency timer",
    variants: [
      { id: "default", label: "Block", description: "Big timer + label", preview: "countdown-block" },
    ],
  },
  {
    type: "comparison",
    label: "Comparison",
    description: "Vs competitor table",
    variants: [
      { id: "default", label: "Table", description: "Ours vs theirs rows", preview: "comparison-table" },
    ],
  },
  {
    type: "footer",
    label: "Footer",
    description: "Bottom of store",
    variants: [
      { id: "default", label: "Minimal", description: "Brand name + links", preview: "footer-min" },
    ],
  },
  {
    type: "announcement",
    label: "Announcement",
    description: "Top bar notification",
    variants: [
      { id: "bar", label: "Bar", description: "Static badges bar", preview: "announcement-bar" },
      { id: "pills", label: "Pills", description: "Rounded badge pills", preview: "announcement-bar" },
      { id: "marquee", label: "Marquee", description: "Scrolling ticker", preview: "announcement-marquee" },
    ],
  },
  {
    type: "howItWorks",
    label: "How it works",
    description: "Step-by-step guide",
    variants: [
      { id: "cards", label: "Cards", description: "Numbered step cards", preview: "how-it-works-cards" },
      { id: "timeline", label: "Timeline", description: "Vertical timeline", preview: "how-it-works-timeline" },
      { id: "numbered", label: "Numbered", description: "Simple numbered list", preview: "how-it-works-cards" },
    ],
  },
];

export const VARIANT_TOTAL = SECTION_CATALOG.reduce(
  (sum, cat) => sum + cat.variants.length,
  0,
);
