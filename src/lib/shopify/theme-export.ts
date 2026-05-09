import type { Store, StorePage, ThemeTokens } from "@/db/schema";
import { renderPageToHtml, renderSectionsToHtml, renderCss } from "./theme-render";

export type ThemeFile = {
  key: string;
  value: string;
};

export type PublishMode = "all" | "landing" | "product" | string;

const log = (event: string, data: Record<string, unknown> = {}) => {
  const ts = new Date().toISOString();
  console.log(`[theme-export ${ts}] ${event}`, JSON.stringify(data, null, 2));
};

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
};

const getPagesByMode = (
  store: Store,
  publishMode: PublishMode
): { landingPage: StorePage | undefined; productPage: StorePage | undefined } => {
  log("getPagesByMode.start", {
    storeId: store.id,
    publishMode,
    totalPages: store.pages.length,
    pageTypes: store.pages.map((p) => ({ id: p.id, type: p.type, name: p.name, isDefault: p.isDefault })),
    sectionsCount: store.sections.length,
  });

  const allLandingPages = store.pages.filter((p) => p.type === "landing");
  const allProductPages = store.pages.filter((p) => p.type === "product");
  const defaultLanding = allLandingPages.find((p) => p.isDefault) ?? allLandingPages[0];
  const defaultProduct = allProductPages[0];

  log("getPagesByMode.filtered", {
    landingPagesCount: allLandingPages.length,
    productPagesCount: allProductPages.length,
    defaultLandingId: defaultLanding?.id ?? null,
    defaultLandingName: defaultLanding?.name ?? null,
    defaultLandingSections: defaultLanding?.sections.map((s) => s.type) ?? [],
    defaultProductId: defaultProduct?.id ?? null,
    defaultProductName: defaultProduct?.name ?? null,
    defaultProductSections: defaultProduct?.sections.map((s) => s.type) ?? [],
  });

  let result: { landingPage: StorePage | undefined; productPage: StorePage | undefined };

  switch (publishMode) {
    case "all":
      result = { landingPage: defaultLanding, productPage: defaultProduct };
      break;
    case "landing":
      result = { landingPage: defaultLanding, productPage: undefined };
      break;
    case "product":
      result = { landingPage: undefined, productPage: defaultProduct };
      break;
    default: {
      const specificPage = store.pages.find((p) => p.id === publishMode);
      log("getPagesByMode.specificPageLookup", {
        publishModeAsPageId: publishMode,
        found: !!specificPage,
        specificPageType: specificPage?.type ?? null,
      });
      if (!specificPage) {
        result = { landingPage: defaultLanding, productPage: defaultProduct };
      } else if (specificPage.type === "landing") {
        result = { landingPage: specificPage, productPage: undefined };
      } else {
        result = { landingPage: undefined, productPage: specificPage };
      }
    }
  }

  log("getPagesByMode.result", {
    publishMode,
    hasLandingPage: !!result.landingPage,
    landingPageId: result.landingPage?.id ?? null,
    landingPageSectionsCount: result.landingPage?.sections.length ?? 0,
    hasProductPage: !!result.productPage,
    productPageId: result.productPage?.id ?? null,
    productPageSectionsCount: result.productPage?.sections.length ?? 0,
  });

  return result;
};

export const buildThemeFiles = (
  store: Store,
  options: BuildThemeFilesOptions = {}
): ThemeFile[] => {
  const files: ThemeFile[] = [];
  const publishMode = options.publishMode ?? "all";

  log("buildThemeFiles.start", {
    storeId: store.id,
    storeName: store.name,
    publishMode,
    optionsReceived: options,
    pagesCount: store.pages.length,
    sectionsCount: store.sections.length,
    themeTokens: store.themeTokens,
  });

  log("buildThemeFiles.addingLayout", { key: "layout/dropwiz.liquid" });
  files.push({ key: "layout/dropwiz.liquid", value: buildDropwizLayout() });

  const { landingPage, productPage } = getPagesByMode(store, publishMode);

  log("buildThemeFiles.renderingCss", {
    themeTokens: store.themeTokens,
  });
  const css = renderCss(store.themeTokens as ThemeTokens);
  log("buildThemeFiles.cssRendered", {
    cssLength: css.length,
    cssPreview: css.substring(0, 500),
  });
  files.push({ key: "assets/dropwiz-store.css", value: css });

  if (landingPage) {
    log("buildThemeFiles.renderingLandingPage", {
      pageId: landingPage.id,
      pageName: landingPage.name,
      sectionsCount: landingPage.sections.length,
      sectionTypes: landingPage.sections.map((s) => ({ id: s.id, type: s.type, order: s.order })),
    });
    const { body } = renderPageToHtml(store, landingPage);
    log("buildThemeFiles.landingPageRendered", {
      bodyLength: body.length,
      bodyPreview: body.substring(0, 1000),
    });
    const sectionLiquid = buildSectionLiquid(store.id, body, "landing");
    log("buildThemeFiles.landingSectionLiquid", {
      liquidLength: sectionLiquid.length,
      liquidPreview: sectionLiquid.substring(0, 500),
    });
    files.push({
      key: "sections/dropwiz-landing.liquid",
      value: sectionLiquid,
    });
    const indexTemplate = buildTemplate("dropwiz", "dropwiz-landing");
    log("buildThemeFiles.indexTemplate", {
      template: indexTemplate,
    });
    files.push({
      key: "templates/index.json",
      value: indexTemplate,
    });
  } else {
    log("buildThemeFiles.noLandingPage", {
      reason: "landingPage is undefined",
    });
  }

  if (productPage) {
    log("buildThemeFiles.renderingProductPage", {
      pageId: productPage.id,
      pageName: productPage.name,
      sectionsCount: productPage.sections.length,
      sectionTypes: productPage.sections.map((s) => ({ id: s.id, type: s.type, order: s.order })),
    });
    const { body } = renderPageToHtml(store, productPage);
    log("buildThemeFiles.productPageRendered", {
      bodyLength: body.length,
      bodyPreview: body.substring(0, 1000),
    });
    const sectionLiquid = buildSectionLiquid(store.id, body, "product");
    log("buildThemeFiles.productSectionLiquid", {
      liquidLength: sectionLiquid.length,
      liquidPreview: sectionLiquid.substring(0, 500),
    });
    files.push({
      key: "sections/dropwiz-product.liquid",
      value: sectionLiquid,
    });
    const productTemplate = buildTemplate("dropwiz", "dropwiz-product");
    log("buildThemeFiles.productTemplate", {
      template: productTemplate,
    });
    files.push({
      key: "templates/product.dropwiz.json",
      value: productTemplate,
    });
  } else if (publishMode === "all" && store.sections.length > 0 && !productPage) {
    log("buildThemeFiles.fallbackToStoreSections", {
      reason: "No product page, using store.sections",
      sectionsCount: store.sections.length,
      sectionTypes: store.sections.map((s) => s.type),
    });
    const { body } = renderSectionsToHtml(
      store.sections,
      store.themeTokens as ThemeTokens
    );
    log("buildThemeFiles.storeSectionsRendered", {
      bodyLength: body.length,
      bodyPreview: body.substring(0, 1000),
    });
    files.push({
      key: "sections/dropwiz-store.liquid",
      value: buildSectionLiquid(store.id, body, "store"),
    });
    files.push({
      key: "templates/product.dropwiz.json",
      value: buildTemplate("dropwiz", "dropwiz-store"),
    });
  } else {
    log("buildThemeFiles.noProductPage", {
      reason: "productPage is undefined and no fallback conditions met",
      publishMode,
      storeSectionsCount: store.sections.length,
    });
  }

  log("buildThemeFiles.complete", {
    totalFiles: files.length,
    fileKeys: files.map((f) => f.key),
    fileSizes: files.map((f) => ({ key: f.key, size: f.value.length })),
  });

  return files;
};
