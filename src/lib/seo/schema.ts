import { SITE_URL, SITE_NAME } from "./constants";

export type SchemaType =
  | "Organization"
  | "WebSite"
  | "WebPage"
  | "Article"
  | "Product"
  | "FAQPage"
  | "BreadcrumbList"
  | "SoftwareApplication"
  | "HowTo";

export const organizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  sameAs: [
    "https://twitter.com/dropwiz_ai",
    "https://www.linkedin.com/company/dropwiz",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: "hello@dropwiz.ai",
    contactType: "customer service",
  },
});

export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
});

export const webPageSchema = (params: {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: params.title,
  description: params.description,
  url: params.url,
  isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  ...(params.datePublished && { datePublished: params.datePublished }),
  ...(params.dateModified && { dateModified: params.dateModified }),
});

export const articleSchema = (params: {
  title: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: params.title,
  description: params.description,
  url: params.url,
  image: params.image,
  datePublished: params.datePublished,
  dateModified: params.dateModified,
  author: {
    "@type": "Organization",
    name: params.author ?? SITE_NAME,
  },
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": params.url },
});

export const productSchema = (params: {
  name: string;
  description: string;
  image: string;
  url: string;
  price?: number;
  currency?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  brand?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: params.name,
  description: params.description,
  image: params.image,
  url: params.url,
  ...(params.brand && { brand: { "@type": "Brand", name: params.brand } }),
  ...(params.price && {
    offers: {
      "@type": "Offer",
      price: params.price,
      priceCurrency: params.currency ?? "USD",
      availability: `https://schema.org/${params.availability ?? "InStock"}`,
      url: params.url,
    },
  }),
});

export const faqSchema = (
  faqs: Array<{ question: string; answer: string }>,
) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
});

export const breadcrumbSchema = (
  items: Array<{ name: string; url: string }>,
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const softwareAppSchema = () => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE_NAME,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "2500",
  },
});

export const howToSchema = (params: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string; image?: string }>;
  totalTime?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: params.name,
  description: params.description,
  ...(params.totalTime && { totalTime: params.totalTime }),
  step: params.steps.map((step, index) => ({
    "@type": "HowToStep",
    position: index + 1,
    name: step.name,
    text: step.text,
    ...(step.image && { image: step.image }),
  })),
});
