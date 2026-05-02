import type { StorePage, StoreSection } from "@/db/schema";
import type { SectionType } from "@/types/store-sections";
import { nanoid } from "nanoid";

export type PageType = StorePage["type"];

export type PageTemplate = {
  type: PageType;
  name: string;
  description: string;
  icon: string;
  defaultSections: SectionType[];
};

export const PAGE_TEMPLATES: PageTemplate[] = [
  {
    type: "landing",
    name: "Landing Page",
    description: "Marketing landing page with value props and testimonials",
    icon: "🚀",
    defaultSections: ["hero", "valueProps", "testimonials", "trust", "footer"],
  },
  {
    type: "product",
    name: "Product Page",
    description: "Product detail page with pricing, bundles, and checkout",
    icon: "🛍️",
    defaultSections: ["hero", "product", "bundles", "comparison", "faq", "trust", "footer"],
  },
  {
    type: "about",
    name: "About Page",
    description: "Tell your brand story and mission",
    icon: "📖",
    defaultSections: ["hero", "lifestyle", "valueProps", "footer"],
  },
  {
    type: "faq",
    name: "FAQ Page",
    description: "Expanded frequently asked questions",
    icon: "❓",
    defaultSections: ["hero", "faq", "trust", "footer"],
  },
  {
    type: "gallery",
    name: "Gallery Page",
    description: "Showcase your product from every angle",
    icon: "🖼️",
    defaultSections: ["hero", "gallery", "testimonials", "footer"],
  },
  {
    type: "blog",
    name: "Blog Page",
    description: "Share updates, tips, and content",
    icon: "✍️",
    defaultSections: ["hero", "lifestyle", "footer"],
  },
];

export const getPageTemplate = (type: PageType): PageTemplate | undefined =>
  PAGE_TEMPLATES.find((t) => t.type === type);

export const createPageFromTemplate = (
  type: PageType,
  storeName: string,
  order: number,
  productImageUrl?: string,
): StorePage => {
  const template = getPageTemplate(type);
  if (!template) {
    throw new Error(`Unknown page type: ${type}`);
  }

  const sections: StoreSection[] = template.defaultSections.map(
    (sectionType, idx) => ({
      id: nanoid(8),
      type: sectionType,
      order: idx,
      data: getDefaultSectionData(sectionType, storeName, productImageUrl),
    }),
  );

  return {
    id: nanoid(10),
    type,
    name: template.name,
    slug: type === "landing" ? "" : type,
    sections,
    order,
    isDefault: type === "landing" && order === 0,
  };
};

const getDefaultSectionData = (
  type: SectionType,
  storeName: string,
  productImageUrl?: string,
): Record<string, unknown> => {
  switch (type) {
    case "hero":
      return {
        headline: "Your headline here",
        subheadline: "Tell the story in one line.",
        primaryCta: "Shop now",
        secondaryCta: null,
        urgencyBadge: null,
        socialProof: null,
        imageUrl: productImageUrl ?? "",
      };
    case "product":
      return {
        title: storeName,
        imageUrl: productImageUrl ?? "",
        priceCents: 4900,
        currency: "USD",
      };
    case "bundles":
      return {
        bundles: [
          {
            name: "Single",
            description: "One item",
            quantity: 1,
            discountPercent: 0,
            badge: null,
            savings: "Full price",
            recommended: false,
          },
          {
            name: "Popular",
            description: "The most-picked bundle",
            quantity: 3,
            discountPercent: 20,
            badge: "MOST POPULAR",
            savings: "Save 20%",
            recommended: true,
          },
        ],
        basePriceCents: 4900,
        currency: "USD",
      };
    case "trust":
      return {
        badges: [
          "30-day money-back guarantee",
          "Ships in 1-2 business days",
          "Secure checkout",
        ],
      };
    case "faq":
      return {
        faqs: [{ question: "New question?", answer: "Write the answer here." }],
      };
    case "footer":
      return { storeName };
    case "video":
      return { videoUrl: "", caption: "Product video" };
    case "countdown":
      return {
        endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        label: "Launch offer",
      };
    case "comparison":
      return {
        rows: [
          { label: "Our product", ours: "✓", theirs: "✗" },
          { label: "Competitor", ours: "✓", theirs: "✓" },
        ],
      };
    case "lifestyle":
      return {
        headline: "Made for the way you actually use it",
        body: "Real people, real results. Tell the story here.",
        imageUrl: productImageUrl ?? "",
        imagePosition: "right",
      };
    case "gallery":
      return {
        title: "See it from every angle",
        images: [
          { url: productImageUrl ?? "", caption: "" },
          { url: "", caption: "" },
          { url: "", caption: "" },
          { url: "", caption: "" },
        ],
      };
    case "testimonials":
      return {
        title: "What customers are saying",
        testimonials: [
          {
            quote: "This actually works. 14 days and I'm a different person.",
            name: "Sarah K.",
            role: "Verified buyer",
            rating: 5,
          },
          {
            quote: "Exceeded expectations. Ordering two more for my family.",
            name: "Marcus T.",
            role: "Verified buyer",
            rating: 5,
          },
          {
            quote: "Worth every penny. The learning course is a nice touch.",
            name: "Priya S.",
            role: "Verified buyer",
            rating: 5,
          },
        ],
      };
    case "valueProps":
      return {
        title: "Why this one",
        props: [
          {
            icon: "⚡",
            title: "Ships fast",
            description: "Out the door in 1–2 business days.",
          },
          {
            icon: "🛡",
            title: "30-day guarantee",
            description: "Love it or send it back — no questions.",
          },
          {
            icon: "★",
            title: "Rated 4.9/5",
            description: "Backed by thousands of verified reviews.",
          },
        ],
      };
    default:
      return {};
  }
};
