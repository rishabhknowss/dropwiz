import type { FooterData } from "@/types/store-sections";
import type { SectionOutput, SectionGeneratorContext, SectionSchema } from "./types";
import { sectionComment, cssAssetTag, wrapWithSchema } from "./utils";

export const generateFooterSection = (
  ctx: SectionGeneratorContext
): SectionOutput | null => {
  const data = ctx.section.data as FooterData;
  if (!data) return null;

  const schema: SectionSchema = {
    name: "Footer",
    tag: "footer",
    class: "dw-section-footer",
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
        type: "text",
        id: "tagline",
        label: "Tagline",
        default: data.tagline ?? "",
      },
      {
        type: "checkbox",
        id: "show_payment_badges",
        label: "Show payment badges",
        default: data.showPayments !== false,
      },
      {
        type: "checkbox",
        id: "show_powered_by",
        label: "Show 'Built with Dropwiz'",
        default: data.showPoweredBy !== false,
      },
      {
        type: "text",
        id: "copyright_text",
        label: "Additional copyright text",
        default: data.copyrightText ?? "",
      },
    ],
    presets: [
      {
        name: "Footer",
        settings: {
          store_name: ctx.storeName ?? data.storeName ?? "Store",
          tagline: data.tagline ?? "",
        },
      },
    ],
  };

  const liquid = `${sectionComment("Footer")}
${cssAssetTag()}

<footer class="dw-footer">
  <div class="dw-container">
    <div class="dw-footer-main">
      <div class="dw-footer-brand">
        {% if section.settings.logo != blank %}
          {{ section.settings.logo | image_url: width: 160 | image_tag: class: 'dw-footer-logo-img', alt: section.settings.store_name }}
        {% else %}
          <span class="dw-footer-name">{{ section.settings.store_name }}</span>
        {% endif %}
        {% if section.settings.tagline != blank %}
          <span class="dw-footer-tagline">{{ section.settings.tagline }}</span>
        {% endif %}
      </div>
      {% if section.settings.show_payment_badges %}
        <div class="dw-footer-payments">
          {% render 'dw-payment-icons' %}
        </div>
      {% endif %}
    </div>
    <div class="dw-footer-bottom">
      <span>&copy; {{ 'now' | date: '%Y' }} {{ section.settings.store_name }}{% if section.settings.copyright_text != blank %} &middot; {{ section.settings.copyright_text }}{% endif %}</span>
      {% if section.settings.show_powered_by %}
        <span>Built with <a href="https://dropwiz.ai" class="dw-footer-link" target="_blank" rel="noopener">Dropwiz</a></span>
      {% endif %}
    </div>
  </div>
</footer>`;

  return {
    filename: "dw-footer.liquid",
    liquid: wrapWithSchema(liquid, schema),
    schema,
  };
};
