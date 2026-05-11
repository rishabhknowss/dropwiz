import type { Store, StorePage, StoreSection, ThemeTokens } from "@/db/schema";
import { generateAllSections, type SectionOutput, type TemplateJson, type TemplateSection } from "./sections";
import { generateAllSnippets } from "./snippets";
import { generateSettingsSchemaJson } from "./config/settings-schema";
import { renderCss } from "./theme-render";

export type ThemeFile = {
  key: string;
  value: string;
};

export type PublishMode = "all" | "landing" | "product" | string;

const buildThemeLayout = (): string => {
  return `<!DOCTYPE html>
<html class="no-js" lang="{{ request.locale.iso_code }}">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, height=device-height, minimum-scale=1.0">
  <meta name="theme-color" content="{{ settings.color_primary }}">

  <title>
    {{ page_title }}
    {%- if current_tags %} &ndash; tagged "{{ current_tags | join: ', ' }}"{% endif -%}
    {%- if current_page != 1 %} &ndash; Page {{ current_page }}{% endif -%}
    {%- unless page_title contains shop.name %} &ndash; {{ shop.name }}{% endunless -%}
  </title>

  {% if page_description %}
    <meta name="description" content="{{ page_description | escape }}">
  {% endif %}

  {% render 'meta-tags' %}

  <link rel="canonical" href="{{ canonical_url }}">

  {%- if settings.favicon != blank -%}
    <link rel="icon" type="image/png" href="{{ settings.favicon | image_url: width: 32, height: 32 }}">
  {%- endif -%}

  {% unless settings.font_heading.system? and settings.font_body.system? %}
    <link rel="preconnect" href="https://fonts.shopifycdn.com" crossorigin>
  {% endunless %}

  {{ content_for_header }}

  {{ 'dw-base.css' | asset_url | stylesheet_tag }}

  <style>
    :root {
      --store-bg: {{ settings.color_background | default: '#fafaf7' }};
      --store-text: {{ settings.color_text | default: '#0a0a0a' }};
      --store-primary: {{ settings.color_primary | default: '#0a0a0a' }};
      --store-secondary: {{ settings.color_secondary | default: '#1f2937' }};
      --store-accent: {{ settings.color_accent | default: '#c7ff3d' }};
      --store-radius: {{ settings.border_radius | default: 12 }}px;
      --store-button-radius: {{ settings.button_radius | default: 8 }}px;
      --store-font-sans: {{ settings.font_body.family }}, {{ settings.font_body.fallback_families }};
      --store-font-display: {{ settings.font_heading.family }}, {{ settings.font_heading.fallback_families }};
    }

    *, *::before, *::after { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      padding: 0;
      min-height: 100vh;
      background: var(--store-bg);
      color: var(--store-text);
      font-family: var(--store-font-sans);
    }
  </style>
</head>
<body>
  <a class="skip-to-content-link visually-hidden" href="#MainContent">
    {{ "accessibility.skip_to_text" | t }}
  </a>

  <main id="MainContent" role="main" tabindex="-1">
    {{ content_for_layout }}
  </main>
</body>
</html>`;
};

const generateUniqueId = (): string => {
  return Math.random().toString(36).substring(2, 10);
};

const buildTemplateJson = (
  sections: StoreSection[],
  sectionOutputs: Map<string, SectionOutput>,
  _pageType: "landing" | "product"
): TemplateJson => {
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);
  const templateSections: Record<string, TemplateSection> = {};
  const order: string[] = [];

  for (const section of sortedSections) {
    const output = sectionOutputs.get(section.type);
    if (!output) continue;

    const sectionId = `${section.type}-${generateUniqueId()}`;
    const sectionType = output.filename.replace(".liquid", "");

    templateSections[sectionId] = {
      type: sectionType,
      settings: {},
    };

    if (output.schema.blocks && output.schema.presets?.[0]?.blocks) {
      const blocks: Record<string, { type: string; settings: Record<string, unknown> }> = {};
      const blockOrder: string[] = [];

      for (const preset of output.schema.presets[0].blocks) {
        const blockId = generateUniqueId();
        blocks[blockId] = {
          type: preset.type,
          settings: preset.settings ?? {},
        };
        blockOrder.push(blockId);
      }

      templateSections[sectionId].blocks = blocks;
      templateSections[sectionId].block_order = blockOrder;
    }

    if (output.schema.presets?.[0]?.settings) {
      templateSections[sectionId].settings = output.schema.presets[0].settings;
    }

    order.push(sectionId);
  }

  return {
    layout: "theme",
    sections: templateSections,
    order,
  };
};

const getPagesByMode = (
  store: Store,
  publishMode: PublishMode
): { landingPage: StorePage | undefined; productPage: StorePage | undefined } => {
  const allLandingPages = store.pages.filter((p) => p.type === "landing");
  const allProductPages = store.pages.filter((p) => p.type === "product");
  const defaultLanding = allLandingPages.find((p) => p.isDefault) ?? allLandingPages[0];
  const defaultProduct = allProductPages[0];

  switch (publishMode) {
    case "all":
      return { landingPage: defaultLanding, productPage: defaultProduct };
    case "landing":
      return { landingPage: defaultLanding, productPage: undefined };
    case "product":
      return { landingPage: undefined, productPage: defaultProduct };
    default: {
      const specificPage = store.pages.find((p) => p.id === publishMode);
      if (!specificPage) {
        return { landingPage: defaultLanding, productPage: defaultProduct };
      } else if (specificPage.type === "landing") {
        return { landingPage: specificPage, productPage: undefined };
      } else {
        return { landingPage: undefined, productPage: specificPage };
      }
    }
  }
};

export type BuildThemeFilesOptions = {
  publishMode?: PublishMode;
};

export const buildThemeFilesV2 = (
  store: Store,
  options: BuildThemeFilesOptions = {}
): ThemeFile[] => {
  const files: ThemeFile[] = [];
  const publishMode = options.publishMode ?? "all";
  const themeTokens = store.themeTokens as ThemeTokens;

  files.push({ key: "layout/theme.liquid", value: buildThemeLayout() });

  const css = renderCss(themeTokens);
  files.push({ key: "assets/dw-base.css", value: css });

  const settingsSchema = generateSettingsSchemaJson(themeTokens, store.name ?? undefined);
  files.push({ key: "config/settings_schema.json", value: settingsSchema });

  const snippets = generateAllSnippets();
  for (const snippet of snippets) {
    files.push({ key: `snippets/${snippet.filename}`, value: snippet.content });
  }

  const { landingPage, productPage } = getPagesByMode(store, publishMode);

  if (landingPage) {
    const landingSectionOutputs = generateAllSections(
      landingPage.sections,
      themeTokens,
      store.id,
      store.name ?? undefined
    );

    for (const [_type, output] of landingSectionOutputs) {
      files.push({
        key: `sections/${output.filename}`,
        value: output.liquid,
      });
    }

    const indexTemplate = buildTemplateJson(
      landingPage.sections,
      landingSectionOutputs,
      "landing"
    );
    files.push({
      key: "templates/index.json",
      value: JSON.stringify(indexTemplate, null, 2),
    });
  }

  if (productPage) {
    const productSectionOutputs = generateAllSections(
      productPage.sections,
      themeTokens,
      store.id,
      store.name ?? undefined
    );

    for (const [_type, output] of productSectionOutputs) {
      if (!files.find((f) => f.key === `sections/${output.filename}`)) {
        files.push({
          key: `sections/${output.filename}`,
          value: output.liquid,
        });
      }
    }

    const productTemplate = buildTemplateJson(
      productPage.sections,
      productSectionOutputs,
      "product"
    );
    files.push({
      key: "templates/product.json",
      value: JSON.stringify(productTemplate, null, 2),
    });
  }

  return files;
};
