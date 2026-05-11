import type { ThemeTokens } from "@/db/schema";

export type ThemePreset = {
  id: string;
  name: string;
  colors: NonNullable<ThemeTokens["colors"]>;
  radius: number;
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "ink-warm",
    name: "Ink on cream",
    colors: {
      background: "#fafaf7",
      primary: "#0a0a0a",
      accent: "#c7ff3d",
      text: "#0a0a0a",
    },
    radius: 12,
  },
  {
    id: "midnight-acid",
    name: "Midnight + acid",
    colors: {
      background: "#0a0a0a",
      primary: "#c7ff3d",
      accent: "#c7ff3d",
      text: "#fafaf7",
    },
    radius: 12,
  },
  {
    id: "clay-sand",
    name: "Clay + sand",
    colors: {
      background: "#f3ede3",
      primary: "#b8431c",
      accent: "#b8431c",
      text: "#2a1810",
    },
    radius: 12,
  },
  {
    id: "forest-ivory",
    name: "Forest + ivory",
    colors: {
      background: "#f8f6ef",
      primary: "#1f5a2e",
      accent: "#1f5a2e",
      text: "#1a2a1f",
    },
    radius: 12,
  },
  {
    id: "ocean-coral",
    name: "Ocean + coral",
    colors: {
      background: "#f0f4f8",
      primary: "#1e3a5f",
      accent: "#ff6b6b",
      text: "#1e3a5f",
    },
    radius: 16,
  },
  {
    id: "lavender-gold",
    name: "Lavender + gold",
    colors: {
      background: "#f8f5ff",
      primary: "#4a3f6b",
      accent: "#d4a574",
      text: "#2d2640",
    },
    radius: 20,
  },
  {
    id: "slate-mint",
    name: "Slate + mint",
    colors: {
      background: "#f5f7f8",
      primary: "#334155",
      accent: "#34d399",
      text: "#1e293b",
    },
    radius: 8,
  },
  {
    id: "noir-rose",
    name: "Noir + rose",
    colors: {
      background: "#1a1a1a",
      primary: "#f43f5e",
      accent: "#f43f5e",
      text: "#f5f5f5",
    },
    radius: 4,
  },
  {
    id: "paper-ink",
    name: "Paper + ink",
    colors: {
      background: "#ffffff",
      primary: "#171717",
      accent: "#3b82f6",
      text: "#171717",
    },
    radius: 12,
  },
  {
    id: "warm-ember",
    name: "Warm ember",
    colors: {
      background: "#fef7ed",
      primary: "#c2410c",
      accent: "#f97316",
      text: "#431407",
    },
    radius: 16,
  },
  {
    id: "arctic-blue",
    name: "Arctic blue",
    colors: {
      background: "#f0f9ff",
      primary: "#0369a1",
      accent: "#06b6d4",
      text: "#0c4a6e",
    },
    radius: 8,
  },
  {
    id: "charcoal-lime",
    name: "Charcoal + lime",
    colors: {
      background: "#262626",
      primary: "#a3e635",
      accent: "#a3e635",
      text: "#e5e5e5",
    },
    radius: 6,
  },
];
