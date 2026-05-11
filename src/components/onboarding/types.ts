import type { RouterOutputs } from "@/utils/api";

export type OnboardingSource = "supplier" | "competitor" | "shopify" | "ai";

export type OnboardingStep = "source" | "details" | "building" | "complete";

export type ScrapedProduct = RouterOutputs["scrape"]["preview"];

export type OnboardingData = {
  source: OnboardingSource | null;
  url: string;
  aiPrompt: string;
  country: string;
  currency: string;
  targetAudience: string;
  targetLanguage: string;
  scrapedProduct: ScrapedProduct | null;
};

export const ONBOARDING_STORAGE_KEY = "dropwiz_onboarding";

export const COUNTRIES = [
  { code: "US", label: "United States" },
  { code: "GB", label: "United Kingdom" },
  { code: "CA", label: "Canada" },
  { code: "AU", label: "Australia" },
  { code: "DE", label: "Germany" },
  { code: "FR", label: "France" },
  { code: "IN", label: "India" },
  { code: "BR", label: "Brazil" },
  { code: "MX", label: "Mexico" },
  { code: "JP", label: "Japan" },
];

export const CURRENCIES = [
  { code: "USD", label: "USD ($)" },
  { code: "EUR", label: "EUR (€)" },
  { code: "GBP", label: "GBP (£)" },
  { code: "CAD", label: "CAD ($)" },
  { code: "AUD", label: "AUD ($)" },
  { code: "INR", label: "INR (₹)" },
];

export const TARGET_AUDIENCES = [
  { id: "general", label: "General consumers", description: "Broad appeal for everyday shoppers" },
  { id: "premium", label: "Premium buyers", description: "Quality-focused, higher price tolerance" },
  { id: "budget", label: "Budget-conscious", description: "Price-sensitive deal seekers" },
  { id: "tech", label: "Tech enthusiasts", description: "Early adopters, gadget lovers" },
  { id: "parents", label: "Parents & families", description: "Family-oriented purchases" },
  { id: "fitness", label: "Health & fitness", description: "Active lifestyle focused" },
];

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "de", label: "Deutsch" },
  { code: "pt", label: "Português" },
  { code: "zh-CN", label: "简体中文" },
  { code: "ja", label: "日本語" },
];

export const defaultOnboardingData: OnboardingData = {
  source: null,
  url: "",
  aiPrompt: "",
  country: "US",
  currency: "USD",
  targetAudience: "general",
  targetLanguage: "en",
  scrapedProduct: null,
};
