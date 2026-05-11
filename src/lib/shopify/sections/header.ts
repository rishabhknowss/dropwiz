import type { HeaderData } from "@/types/store-sections";
import type { SectionOutput, SectionGeneratorContext, SectionSchema } from "./types";
import { esc, sectionComment, cssAssetTag, wrapWithSchema } from "./utils";

export const generateHeaderSection = (
  ctx: SectionGeneratorContext
): SectionOutput | null => {
  const data = ctx.section.data as HeaderData;
  if (!data) return null;

  const schema: SectionSchema = {
    name: "Header",
    tag: "header",
    class: "dw-section-header",
    settings: [
      {
        type: "image_picker",
        id: "logo",
        label: "Logo",
      },
      {
        type: "text",
        id: "store_name",
        label: "Store name",
        default: ctx.storeName ?? "Store",
      },
      {
        type: "checkbox",
        id: "show_name_with_logo",
        label: "Show store name with logo",
        default: false,
      },
      {
        type: "checkbox",
        id: "show_cart",
        label: "Show cart icon",
        default: false,
      },
      {
        type: "text",
        id: "cta_text",
        label: "CTA button text",
        default: "Shop Now",
      },
      {
        type: "url",
        id: "cta_link",
        label: "CTA button link",
      },
    ],
    presets: [
      {
        name: "Header",
        settings: {
          store_name: ctx.storeName ?? data.storeName ?? "Store",
        },
      },
    ],
  };

  const liquid = `${sectionComment("Header")}
${cssAssetTag()}

<header class="dw-header">
  <div class="dw-container dw-header-inner">
    <a href="/" class="dw-header-logo">
      {% if section.settings.logo != blank %}
        {{ section.settings.logo | image_url: width: 200 | image_tag: class: 'dw-header-logo-img', alt: section.settings.store_name }}
        {% if section.settings.show_name_with_logo %}
          <span class="dw-header-name">{{ section.settings.store_name }}</span>
        {% endif %}
      {% else %}
        <span class="dw-header-name">{{ section.settings.store_name }}</span>
      {% endif %}
    </a>
    <nav class="dw-header-nav">
      {% if section.settings.show_cart %}
        <a href="{{ routes.cart_url }}" class="dw-header-cart">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          <span class="dw-cart-count">{{ cart.item_count }}</span>
        </a>
      {% endif %}
      <a href="{% if section.settings.cta_link != blank %}{{ section.settings.cta_link }}{% elsif product %}#dw-product{% else %}{{ routes.all_products_collection_url }}{% endif %}" class="dw-btn-primary dw-btn-sm">
        {{ section.settings.cta_text }}
      </a>
    </nav>
  </div>
</header>`;

  return {
    filename: "dw-header.liquid",
    liquid: wrapWithSchema(liquid, schema),
    schema,
  };
};
