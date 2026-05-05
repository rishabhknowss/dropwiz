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
        primaryCta: "Add to Cart",
        secondaryCta: null,
        urgencyBadge: null,
        socialProof: null,
        imageUrl: productImageUrl ?? "",
        rating: 4.8,
        reviewCount: 2500,
        currency: "USD",
        trustBadges: ["Free Shipping", "30-Day Guarantee", "Secure Checkout"],
        featureBadges: [
          { icon: "⚡", label: "Fast Results" },
          { icon: "✓", label: "Premium Quality" },
          { icon: "🛡", label: "Risk-Free" },
        ],
        bundles: [
          {
            name: "Starter",
            quantity: 1,
            freeQuantity: 1,
            priceCents: 6998,
            originalPriceCents: 19800,
            savings: "65%",
            badge: null,
          },
          {
            name: "Best Value",
            quantity: 2,
            freeQuantity: 2,
            priceCents: 13997,
            originalPriceCents: 39600,
            savings: "65%",
            badge: "Most Popular",
          },
          {
            name: "Family Pack",
            quantity: 3,
            freeQuantity: 3,
            priceCents: 20996,
            originalPriceCents: 59400,
            savings: "65%",
            badge: null,
          },
        ],
      };
    case "product":
      return {
        title: storeName,
        subtitle: "The smart choice for modern living",
        description: `Experience the difference with ${storeName}. Designed for those who demand the best.`,
        imageUrl: productImageUrl ?? "",
        images: productImageUrl ? [productImageUrl] : [],
        priceCents: 4900,
        originalPriceCents: 6900,
        currency: "USD",
        badge: "Best Seller",
        rating: 4.8,
        reviewCount: 2500,
        features: [
          { icon: "⚡", label: "Fast Acting" },
          { icon: "🌿", label: "All Natural" },
          { icon: "✓", label: "Clinically Tested" },
          { icon: "🔒", label: "Secure Purchase" },
        ],
      };
    case "bundles":
      return {
        bundles: [
          {
            name: "Single",
            description: "Try it out",
            quantity: 1,
            freeQuantity: 0,
            discountPercent: 0,
            badge: null,
            savings: "Full price",
            recommended: false,
          },
          {
            name: "Popular",
            description: "Best value for most customers",
            quantity: 2,
            freeQuantity: 2,
            discountPercent: 50,
            badge: "MOST POPULAR",
            savings: "Save 50%",
            recommended: true,
          },
          {
            name: "Family Pack",
            description: "Stock up and save big",
            quantity: 3,
            freeQuantity: 3,
            discountPercent: 50,
            badge: null,
            savings: "Save 50%",
            recommended: false,
          },
        ],
        basePriceCents: 4900,
        originalPriceCents: 6900,
        currency: "USD",
        productImage: productImageUrl ?? "",
      };
    case "trust":
      return {
        badges: [
          {
            icon: "❤️",
            title: "Try it risk-free",
            description: "Love it or your money back. No questions asked.",
          },
          {
            icon: "🚛",
            title: "Fast, free shipping",
            description: "Get it delivered to your door in 3-5 business days.",
          },
          {
            icon: "🔒",
            title: "Secure checkout",
            description: "Your payment information is always protected.",
          },
        ],
        showPaymentBadges: true,
        shippingTimeline: [
          { icon: "✅", label: "Order Confirmed", date: "Today" },
          { icon: "🚛", label: "On Its Way", date: "1-2 days" },
          { icon: "⭐", label: "Delivered", date: "3-5 days" },
        ],
        variant: "detailed",
      };
    case "faq":
      return {
        faqs: [{ question: "New question?", answer: "Write the answer here." }],
        variant: "accordion",
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
            quote: "This actually works. Two weeks in and I'm already seeing results.",
            name: "Sarah K.",
            role: "Verified Buyer",
            rating: 5,
          },
          {
            quote: "Exceeded my expectations. Already ordered two more for my family.",
            name: "Marcus T.",
            role: "Verified Buyer",
            rating: 5,
          },
          {
            quote: "Worth every penny. The quality is outstanding.",
            name: "Priya S.",
            role: "Verified Buyer",
            rating: 5,
          },
        ],
        variant: "grid",
      };
    case "valueProps":
      return {
        title: "Why choose us",
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
        variant: "grid",
      };
    case "announcement":
      return {
        badges: [
          { icon: "🚀", text: "Free Shipping on all orders" },
          { icon: "🔒", text: "Secure Checkout" },
          { icon: "❤️", text: "30-Day Money Back Guarantee" },
        ],
        variant: "bar",
      };
    case "featureMarquee":
      return {
        items: [
          { icon: "⚡", label: "Fast Results" },
          { icon: "❤️", label: "Customer Favorite" },
          { icon: "💎", label: "Premium Quality" },
          { icon: "✅", label: "Satisfaction Guaranteed" },
        ],
        speed: "normal",
      };
    case "reviewStats":
      return {
        rating: 4.8,
        reviewCount: 2500,
        source: "trustpilot",
        showStars: true,
      };
    case "howItWorks":
      return {
        title: "How it works",
        steps: [
          {
            title: "Step 1",
            description: "Describe the first step of using your product.",
          },
          {
            title: "Step 2",
            description: "Explain the second step clearly.",
          },
          {
            title: "Step 3",
            description: "Show the final result or benefit.",
          },
        ],
        variant: "cards",
      };
    default:
      return {};
  }
};
