import type { Store, Product } from "@/db/schema";

export type AdPromptInput = {
  store: Pick<
    Store,
    "name" | "persona" | "angle" | "themeTokens" | "copy" | "targetLanguage"
  >;
  product: Pick<Product, "title" | "description" | "originalImages">;
  format: "story" | "feed" | "landscape" | "square" | "wide";
  audience?: string;
  hook?: string;
  tone?: "bold" | "minimal" | "premium" | "playful" | "editorial";
  customNotes?: string;
  hasReferenceImage?: boolean;
};

export type AdPromptOutput = {
  prompt: string;
  aspectRatio: "1:1" | "9:16" | "16:9" | "4:5" | "21:9";
};

const FORMAT_TO_ASPECT: Record<AdPromptInput["format"], AdPromptOutput["aspectRatio"]> = {
  square: "1:1",
  feed: "4:5",
  story: "9:16",
  landscape: "16:9",
  wide: "21:9",
};

const TONE_DIRECTION: Record<NonNullable<AdPromptInput["tone"]>, string> = {
  bold:
    "high-contrast, saturated palette, oversized typography, confident composition, magazine-cover energy",
  minimal:
    "negative space, single focal subject, soft natural light, refined product framing, gallery-grade restraint",
  premium:
    "studio lighting with subtle gradients, marble or matte textures, rich shadows, luxury product photography",
  playful:
    "cheerful color blocks, kinetic layout, friendly mascot or sticker accents, casual modern feel",
  editorial:
    "fashion-magazine layout, intentional grain, monochrome or muted palette, narrative composition",
};

export function composeAdPrompt(input: AdPromptInput): AdPromptOutput {
  const tokens = (input.store.themeTokens ?? {}) as {
    colors?: { primary?: string; accent?: string; background?: string };
    typography?: { display?: string };
  };
  const copy = (input.store.copy ?? {}) as {
    hero?: { headline?: string; subheadline?: string };
  };

  const palette = [tokens.colors?.primary, tokens.colors?.accent, tokens.colors?.background]
    .filter(Boolean)
    .join(", ");

  const tone = input.tone ?? "premium";
  const aspect = FORMAT_TO_ASPECT[input.format];
  const headline = input.hook ?? copy.hero?.headline ?? input.product.title ?? "";

  const productAnchor = input.hasReferenceImage
    ? `Use the provided reference photo as the LITERAL product — preserve its exact shape, color, material, proportions, and details. Do not invent a different product. Re-stage it in a new advertisement scene that matches the brief below.`
    : `Photoreal static advertisement for "${input.product.title}".`;

  const lines = [
    productAnchor,
    input.product.description
      ? `Product context: ${input.product.description.slice(0, 280)}.`
      : "",
    `Headline overlay (clean modern sans-serif, max 7 words, kerning tight): "${headline}".`,
    `Visual direction: ${TONE_DIRECTION[tone]}.`,
    palette
      ? `Brand palette to honor: ${palette}. Treat the primary as the dominant brand color in props, surfaces, or background. Tertiary accents only sparingly.`
      : "",
    input.audience ? `Audience: ${input.audience}.` : "",
    input.store.persona ? `Persona signal: ${input.store.persona}.` : "",
    input.store.angle ? `Marketing angle: ${input.store.angle}.` : "",
    `Composition for ${aspect} aspect ratio. Subject placed for thumb-stopping social-feed impact, with safe-area for the headline.`,
    "Output a single finished ad-ready image. Photorealistic surfaces, crisp depth of field. No watermark, no third-party logos, no UI chrome, no border artifacts, no extra products.",
    input.customNotes ? `Additional direction: ${input.customNotes}` : "",
  ].filter(Boolean);

  return { prompt: lines.join(" "), aspectRatio: aspect };
}
