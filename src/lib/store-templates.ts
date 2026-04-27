import type { ThemeTokens } from "@/db/schema";
import type { SectionType } from "@/types/store-sections";

export type StoreTemplate = {
  id: string;
  name: string;
  vibe: string;
  preview: { bg: string; primary: string; accent: string; text: string };
  tokens: ThemeTokens;
  layout: SectionType[];
};

const DEFAULT_LAYOUT: SectionType[] = [
  "hero",
  "product",
  "bundles",
  "trust",
  "faq",
  "footer",
];

const EDITORIAL_LAYOUT: SectionType[] = [
  "hero",
  "lifestyle",
  "product",
  "gallery",
  "valueProps",
  "testimonials",
  "faq",
  "footer",
];

const CONVERSION_LAYOUT: SectionType[] = [
  "hero",
  "trust",
  "product",
  "bundles",
  "valueProps",
  "testimonials",
  "faq",
  "footer",
];

const SHOWCASE_LAYOUT: SectionType[] = [
  "hero",
  "gallery",
  "product",
  "lifestyle",
  "testimonials",
  "footer",
];

export const STORE_TEMPLATES: StoreTemplate[] = [
  {
    id: "clean-dtc",
    name: "Clean DTC",
    vibe: "Cream + ink · universal safe bet",
    preview: {
      bg: "#fafaf7",
      primary: "#0a0a0a",
      accent: "#c7ff3d",
      text: "#0a0a0a",
    },
    tokens: {
      preset: "clean-dtc",
      colors: {
        background: "#fafaf7",
        primary: "#0a0a0a",
        accent: "#c7ff3d",
        text: "#0a0a0a",
      },
      typography: {
        display: "Geist Sans",
        sans: "Geist Sans",
        mono: "Geist Mono",
      },
      radius: 12,
      buttons: { shape: "rounded", size: "md" },
    },
    layout: DEFAULT_LAYOUT,
  },
  {
    id: "editorial-serif",
    name: "Editorial",
    vibe: "Serif display · magazine",
    preview: {
      bg: "#f8f6ef",
      primary: "#1a1a1a",
      accent: "#b8431c",
      text: "#1a1a1a",
    },
    tokens: {
      preset: "editorial-serif",
      colors: {
        background: "#f8f6ef",
        primary: "#1a1a1a",
        accent: "#b8431c",
        text: "#1a1a1a",
      },
      typography: {
        display: "Fraunces",
        sans: "Lora",
        mono: "JetBrains Mono",
      },
      radius: 4,
      buttons: { shape: "sharp", size: "md" },
    },
    layout: EDITORIAL_LAYOUT,
  },
  {
    id: "midnight-acid",
    name: "Midnight",
    vibe: "Black + pistachio · bold",
    preview: {
      bg: "#0a0a0a",
      primary: "#c7ff3d",
      accent: "#c7ff3d",
      text: "#fafaf7",
    },
    tokens: {
      preset: "midnight-acid",
      colors: {
        background: "#0a0a0a",
        primary: "#c7ff3d",
        accent: "#c7ff3d",
        text: "#fafaf7",
      },
      typography: {
        display: "Space Grotesk",
        sans: "Space Grotesk",
        mono: "Space Mono",
      },
      radius: 14,
      buttons: { shape: "pill", size: "md" },
    },
    layout: CONVERSION_LAYOUT,
  },
  {
    id: "clay-sand",
    name: "Clay",
    vibe: "Terracotta · artisan",
    preview: {
      bg: "#f3ede3",
      primary: "#b8431c",
      accent: "#b8431c",
      text: "#2a1810",
    },
    tokens: {
      preset: "clay-sand",
      colors: {
        background: "#f3ede3",
        primary: "#b8431c",
        accent: "#b8431c",
        text: "#2a1810",
      },
      typography: {
        display: "Playfair Display",
        sans: "Inter",
        mono: "JetBrains Mono",
      },
      radius: 8,
      buttons: { shape: "rounded", size: "md" },
    },
    layout: SHOWCASE_LAYOUT,
  },
  {
    id: "forest-ivory",
    name: "Forest",
    vibe: "Deep green · natural",
    preview: {
      bg: "#f8f6ef",
      primary: "#1f5a2e",
      accent: "#1f5a2e",
      text: "#1a2a1f",
    },
    tokens: {
      preset: "forest-ivory",
      colors: {
        background: "#f8f6ef",
        primary: "#1f5a2e",
        accent: "#1f5a2e",
        text: "#1a2a1f",
      },
      typography: {
        display: "Instrument Serif",
        sans: "Instrument Sans",
        mono: "JetBrains Mono",
      },
      radius: 6,
      buttons: { shape: "rounded", size: "md" },
    },
    layout: EDITORIAL_LAYOUT,
  },
  {
    id: "bold-sale",
    name: "Bold Sale",
    vibe: "High contrast · DR converter",
    preview: {
      bg: "#fff8ed",
      primary: "#d94f3d",
      accent: "#0a0a0a",
      text: "#0a0a0a",
    },
    tokens: {
      preset: "bold-sale",
      colors: {
        background: "#fff8ed",
        primary: "#d94f3d",
        accent: "#0a0a0a",
        text: "#0a0a0a",
      },
      typography: {
        display: "Archivo Black",
        sans: "Archivo",
        mono: "JetBrains Mono",
      },
      radius: 4,
      buttons: { shape: "sharp", size: "lg" },
    },
    layout: CONVERSION_LAYOUT,
  },
  {
    id: "manrope-minimal",
    name: "Minimal",
    vibe: "Monochrome · zen",
    preview: {
      bg: "#ffffff",
      primary: "#111111",
      accent: "#111111",
      text: "#111111",
    },
    tokens: {
      preset: "manrope-minimal",
      colors: {
        background: "#ffffff",
        primary: "#111111",
        accent: "#111111",
        text: "#111111",
      },
      typography: {
        display: "Manrope",
        sans: "Manrope",
        mono: "JetBrains Mono",
      },
      radius: 999,
      buttons: { shape: "pill", size: "md" },
    },
    layout: DEFAULT_LAYOUT,
  },
  {
    id: "dm-modern",
    name: "Modern Tech",
    vibe: "Tech DTC · fintech-like",
    preview: {
      bg: "#f5f5f5",
      primary: "#2c5ce5",
      accent: "#2c5ce5",
      text: "#0a0a0a",
    },
    tokens: {
      preset: "dm-modern",
      colors: {
        background: "#f5f5f5",
        primary: "#2c5ce5",
        accent: "#2c5ce5",
        text: "#0a0a0a",
      },
      typography: {
        display: "DM Sans",
        sans: "DM Sans",
        mono: "DM Mono",
      },
      radius: 16,
      buttons: { shape: "rounded", size: "md" },
    },
    layout: CONVERSION_LAYOUT,
  },
];
