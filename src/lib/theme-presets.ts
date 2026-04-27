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
];
