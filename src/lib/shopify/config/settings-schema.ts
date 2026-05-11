import type { ThemeTokens } from "@/db/schema";

export type SettingsSchemaItem = {
  name: string;
  theme_name?: string;
  theme_version?: string;
  theme_author?: string;
  theme_documentation_url?: string;
  settings?: Array<{
    type: string;
    id?: string;
    label?: string;
    default?: string | number | boolean;
    info?: string;
    options?: Array<{ value: string; label: string }>;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
  }>;
};

export const generateSettingsSchema = (
  themeTokens: ThemeTokens,
  storeName?: string
): SettingsSchemaItem[] => {
  const colors = themeTokens?.colors ?? {};
  const typography = themeTokens?.typography ?? {};
  const buttons = themeTokens?.buttons ?? {};

  return [
    {
      name: "theme_info",
      theme_name: "Dropwiz",
      theme_version: "2.0.0",
      theme_author: "Dropwiz",
      theme_documentation_url: "https://dropwiz.ai/docs",
    },
    {
      name: "Colors",
      settings: [
        {
          type: "header",
          label: "Brand colors",
        },
        {
          type: "color",
          id: "color_primary",
          label: "Primary color",
          default: colors.primary ?? "#0a0a0a",
          info: "Used for buttons, links, and accents",
        },
        {
          type: "color",
          id: "color_secondary",
          label: "Secondary color",
          default: colors.secondary ?? "#1f2937",
        },
        {
          type: "color",
          id: "color_accent",
          label: "Accent color",
          default: colors.accent ?? "#c7ff3d",
          info: "Used for badges and highlights",
        },
        {
          type: "header",
          label: "Background & Text",
        },
        {
          type: "color",
          id: "color_background",
          label: "Background color",
          default: colors.background ?? "#fafaf7",
        },
        {
          type: "color",
          id: "color_text",
          label: "Text color",
          default: colors.text ?? "#0a0a0a",
        },
      ],
    },
    {
      name: "Typography",
      settings: [
        {
          type: "font_picker",
          id: "font_heading",
          label: "Heading font",
          default: typography.display ?? "assistant_n4",
        },
        {
          type: "font_picker",
          id: "font_body",
          label: "Body font",
          default: typography.sans ?? "assistant_n4",
        },
      ],
    },
    {
      name: "Buttons",
      settings: [
        {
          type: "select",
          id: "button_style",
          label: "Button style",
          options: [
            { value: "classic", label: "Classic" },
            { value: "brick", label: "Brick" },
            { value: "bubble", label: "Bubble" },
            { value: "gradient", label: "Gradient" },
            { value: "soft", label: "Soft" },
            { value: "ghost", label: "Ghost" },
          ],
          default: buttons.style ?? "classic",
        },
        {
          type: "select",
          id: "button_shape",
          label: "Button shape",
          options: [
            { value: "sharp", label: "Sharp corners" },
            { value: "rounded", label: "Rounded" },
            { value: "pill", label: "Pill" },
          ],
          default: buttons.shape ?? "rounded",
        },
        {
          type: "range",
          id: "button_radius",
          label: "Button corner radius",
          min: 0,
          max: 40,
          step: 2,
          default: themeTokens?.buttonRadius ?? 8,
          unit: "px",
        },
      ],
    },
    {
      name: "Layout",
      settings: [
        {
          type: "range",
          id: "border_radius",
          label: "Global border radius",
          min: 0,
          max: 24,
          step: 2,
          default: themeTokens?.radius ?? 12,
          unit: "px",
        },
      ],
    },
    {
      name: "Social media",
      settings: [
        {
          type: "text",
          id: "social_twitter",
          label: "Twitter/X link",
        },
        {
          type: "text",
          id: "social_instagram",
          label: "Instagram link",
        },
        {
          type: "text",
          id: "social_facebook",
          label: "Facebook link",
        },
        {
          type: "text",
          id: "social_tiktok",
          label: "TikTok link",
        },
      ],
    },
  ];
};

export const generateSettingsSchemaJson = (
  themeTokens: ThemeTokens,
  storeName?: string
): string => {
  const schema = generateSettingsSchema(themeTokens, storeName);
  return JSON.stringify(schema, null, 2);
};
