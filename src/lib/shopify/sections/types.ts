import type { ThemeTokens, StoreSection } from "@/db/schema";

export type SchemaSettingType =
  | "text"
  | "textarea"
  | "richtext"
  | "image_picker"
  | "url"
  | "video_url"
  | "checkbox"
  | "number"
  | "range"
  | "select"
  | "radio"
  | "color"
  | "font_picker"
  | "collection"
  | "product"
  | "blog"
  | "page"
  | "link_list"
  | "html"
  | "article"
  | "liquid";

export type SchemaSettingOption = {
  value: string;
  label: string;
};

export type SchemaSetting = {
  type: SchemaSettingType;
  id: string;
  label: string;
  default?: string | number | boolean;
  info?: string;
  placeholder?: string;
  options?: SchemaSettingOption[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
};

export type SchemaBlock = {
  type: string;
  name: string;
  limit?: number;
  settings: SchemaSetting[];
};

export type SchemaPreset = {
  name: string;
  settings?: Record<string, unknown>;
  blocks?: Array<{
    type: string;
    settings?: Record<string, unknown>;
  }>;
};

export type SectionSchema = {
  name: string;
  tag?: string;
  class?: string;
  limit?: number;
  settings: SchemaSetting[];
  blocks?: SchemaBlock[];
  presets: SchemaPreset[];
  enabled_on?: {
    templates?: string[];
    groups?: string[];
  };
  disabled_on?: {
    templates?: string[];
    groups?: string[];
  };
};

export type SectionOutput = {
  filename: string;
  liquid: string;
  schema: SectionSchema;
};

export type TemplateSection = {
  type: string;
  disabled?: boolean;
  settings: Record<string, unknown>;
  blocks?: Record<
    string,
    {
      type: string;
      settings: Record<string, unknown>;
    }
  >;
  block_order?: string[];
};

export type TemplateJson = {
  layout?: string;
  sections: Record<string, TemplateSection>;
  order: string[];
};

export type SectionGeneratorContext = {
  section: StoreSection;
  themeTokens: ThemeTokens;
  storeId: string;
  storeName?: string;
};

export type SectionGenerator = (
  ctx: SectionGeneratorContext
) => SectionOutput | null;
