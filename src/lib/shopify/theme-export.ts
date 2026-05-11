import type { Store, StorePage, ThemeTokens } from "@/db/schema";
import { renderPageToHtml, renderSectionsToHtml, renderCss } from "./theme-render";
import { buildThemeFilesV2 } from "./theme-export-v2";

export type ThemeFile = {
  key: string;
  value: string;
};

export type PublishMode = "all" | "landing" | "product" | string;

export type ThemeVersion = "v1" | "v2";

const buildDropwizLayout = (): string => {
  return `<!DOCTYPE html>
<html class="no-js" lang="{{ request.locale.iso_code }}">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, height=device-height, minimum-scale=1.0">
  <meta name="theme-color" content="">

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

  {% unless settings.type_header_font.system? and settings.type_body_font.system? %}
    <link rel="preconnect" href="https://fonts.shopifycdn.com" crossorigin>
  {% endunless %}

  {{ content_for_header }}

  <style>
    :root {
      --dw-page-width: 1200px;
    }
    *, *::before, *::after { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      padding: 0;
      min-height: 100vh;
    }
  </style>
</head>
<body>
  <main id="MainContent" role="main" tabindex="-1">
    {{ content_for_layout }}
  </main>
</body>
</html>`;
};

const buildSectionLiquid = (storeId: string, body: string, pageType: string): string => {
  const typeName = pageType.charAt(0).toUpperCase() + pageType.slice(1);
  return `{%- comment -%} Dropwiz ${pageType} page. Re-publish from Dropwiz to update. {%- endcomment -%}
{{ 'dropwiz-store.css' | asset_url | stylesheet_tag }}
<div class="dw-store" data-dropwiz-store="${storeId}" data-page-type="${pageType}">
${body}
</div>
<script>
(function() {
  document.querySelectorAll('.dw-prod-thumb, .dw-prod-thumb-btn, .dw-ph-thumb').forEach(function(thumb) {
    thumb.addEventListener('click', function() {
      var container = this.closest('.dw-prod, .dw-hero-product');
      if (!container) return;
      var img = this.querySelector('img');
      if (!img) return;
      var src = img.src || this.dataset.image;
      var mainImg = container.querySelector('.dw-prod-active-img, .dw-prod-hero-img, .dw-ph-main-img img');
      if (mainImg && src) {
        mainImg.src = src;
      }
      container.querySelectorAll('.dw-prod-thumb, .dw-prod-thumb-btn, .dw-ph-thumb').forEach(function(t) {
        t.classList.remove('active');
      });
      this.classList.add('active');
    });
  });
})();
</script>
{% schema %}
{
  "name": "Dropwiz ${typeName}",
  "settings": [],
  "presets": [{ "name": "Dropwiz ${typeName}" }]
}
{% endschema %}`;
};

const buildTemplate = (layout: string, sectionType: string): string => {
  return JSON.stringify(
    {
      layout,
      sections: { main: { type: sectionType, settings: {} } },
      order: ["main"],
    },
    null,
    2
  );
};

export type BuildThemeFilesOptions = {
  publishMode?: PublishMode;
  version?: ThemeVersion;
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

export const buildThemeFiles = (
  store: Store,
  options: BuildThemeFilesOptions = {}
): ThemeFile[] => {
  const version = options.version ?? "v1";

  if (version === "v2") {
    return buildThemeFilesV2(store, { publishMode: options.publishMode });
  }

  const files: ThemeFile[] = [];
  const publishMode = options.publishMode ?? "all";

  files.push({ key: "layout/dropwiz.liquid", value: buildDropwizLayout() });

  const { landingPage, productPage } = getPagesByMode(store, publishMode);

  const css = renderCss(store.themeTokens as ThemeTokens);
  files.push({ key: "assets/dropwiz-store.css", value: css });

  if (landingPage) {
    const { body } = renderPageToHtml(store, landingPage);
    const sectionLiquid = buildSectionLiquid(store.id, body, "landing");
    files.push({
      key: "sections/dropwiz-landing.liquid",
      value: sectionLiquid,
    });
    files.push({
      key: "templates/index.json",
      value: buildTemplate("dropwiz", "dropwiz-landing"),
    });
  }

  if (productPage) {
    const { body } = renderPageToHtml(store, productPage);
    const sectionLiquid = buildSectionLiquid(store.id, body, "product");
    files.push({
      key: "sections/dropwiz-product.liquid",
      value: sectionLiquid,
    });
    files.push({
      key: "templates/product.json",
      value: buildTemplate("dropwiz", "dropwiz-product"),
    });
  } else if (publishMode === "all" && store.sections.length > 0 && !productPage) {
    const { body } = renderSectionsToHtml(
      store.sections,
      store.themeTokens as ThemeTokens
    );
    files.push({
      key: "sections/dropwiz-store.liquid",
      value: buildSectionLiquid(store.id, body, "store"),
    });
    files.push({
      key: "templates/product.json",
      value: buildTemplate("dropwiz", "dropwiz-store"),
    });
  }

  return files;
};
