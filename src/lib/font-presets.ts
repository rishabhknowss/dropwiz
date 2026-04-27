export type FontPreset = {
  id: string;
  name: string;
  display: string;
  body: string;
  mono: string;
  vibe: string;
};

export const FONT_PRESETS: FontPreset[] = [
  {
    id: "geist",
    name: "Geist",
    display: "Geist Sans",
    body: "Geist Sans",
    mono: "Geist Mono",
    vibe: "Clean · modern default",
  },
  {
    id: "editorial",
    name: "Editorial",
    display: "Fraunces",
    body: "Lora",
    mono: "JetBrains Mono",
    vibe: "Serif display · reading",
  },
  {
    id: "manrope",
    name: "Manrope",
    display: "Manrope",
    body: "Manrope",
    mono: "JetBrains Mono",
    vibe: "Friendly · rounded",
  },
  {
    id: "dm",
    name: "DM",
    display: "DM Sans",
    body: "DM Sans",
    mono: "DM Mono",
    vibe: "Geometric · neutral",
  },
  {
    id: "space",
    name: "Space",
    display: "Space Grotesk",
    body: "Space Grotesk",
    mono: "Space Mono",
    vibe: "Display · techy",
  },
  {
    id: "instrument",
    name: "Instrument",
    display: "Instrument Serif",
    body: "Instrument Sans",
    mono: "JetBrains Mono",
    vibe: "Editorial · italic serif",
  },
  {
    id: "playfair",
    name: "Playfair",
    display: "Playfair Display",
    body: "Inter",
    mono: "JetBrains Mono",
    vibe: "Luxury · high contrast",
  },
  {
    id: "archivo",
    name: "Archivo",
    display: "Archivo Black",
    body: "Archivo",
    mono: "JetBrains Mono",
    vibe: "Bold · display-first",
  },
];

export const ALL_FONT_FAMILIES = Array.from(
  new Set(
    FONT_PRESETS.flatMap((p) => [p.display, p.body, p.mono]).filter(
      (f) => f !== "Geist Sans" && f !== "Geist Mono",
    ),
  ),
);

export function googleFontsUrl(): string {
  const families = ALL_FONT_FAMILIES.map((f) => {
    const name = f.replace(/ /g, "+");
    return `family=${name}:wght@400;500;600;700;800`;
  }).join("&");
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}
