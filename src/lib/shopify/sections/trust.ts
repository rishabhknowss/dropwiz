import type { TrustData } from "@/types/store-sections";
import type { SectionOutput, SectionGeneratorContext, SectionSchema } from "./types";
import { sectionComment, cssAssetTag, wrapWithSchema, getIconSvg, PAYMENT_FILE_MAP } from "./utils";

export const generateTrustSection = (
  ctx: SectionGeneratorContext
): SectionOutput | null => {
  const data = ctx.section.data as TrustData;
  if (!data?.badges?.length) return null;

  const defaultIconSvg = getIconSvg("ShieldCheckIcon", "24") || getIconSvg("SparklesIcon", "24");

  const paymentMethods: string[] = ["visa", "mastercard", "amex", "paypal", "applepay", "googlepay"];

  const schema: SectionSchema = {
    name: "Trust Badges",
    tag: "section",
    class: "dw-section-trust",
    settings: [
      {
        type: "select",
        id: "variant",
        label: "Layout style",
        options: [
          { value: "simple", label: "Simple" },
          { value: "detailed", label: "Detailed with cards" },
        ],
        default: data.variant ?? "detailed",
      },
      {
        type: "checkbox",
        id: "show_payment_badges",
        label: "Show payment badges",
        default: data.showPaymentBadges ?? true,
      },
      {
        type: "text",
        id: "rating_text",
        label: "Rating text (optional)",
        default: "",
      },
    ],
    blocks: [
      {
        type: "badge",
        name: "Trust Badge",
        settings: [
          {
            type: "text",
            id: "title",
            label: "Title",
            default: "Secure Checkout",
          },
          {
            type: "text",
            id: "description",
            label: "Description",
            default: "",
          },
          {
            type: "html",
            id: "icon_svg",
            label: "Icon SVG",
          },
        ],
      },
    ],
    presets: [
      {
        name: "Trust Badges",
        settings: {
          variant: data.variant ?? "detailed",
          show_payment_badges: data.showPaymentBadges ?? true,
          rating_text: "",
        },
        blocks: data.badges.map((b) => {
          const badge = typeof b === "string" ? { title: b, description: "", icon: "" } : b;
          return {
            type: "badge",
            settings: {
              title: badge.title,
              description: badge.description ?? "",
              icon_svg: getIconSvg(badge.icon, "24") || defaultIconSvg,
            },
          };
        }),
      },
    ],
  };

  const paymentIconsHtml = paymentMethods
    .filter(m => PAYMENT_FILE_MAP[m])
    .map(m => `<img src="{{ '${PAYMENT_FILE_MAP[m]}' | asset_url }}" alt="${m}" class="dw-payment-icon">`)
    .join("\n          ");

  const liquid = `${sectionComment("Trust Badges")}
${cssAssetTag()}

<style>
  .dw-trust { padding: 32px 20px; border-top: 1px solid rgba(var(--dw-text-rgb), 0.08); }
  @media (min-width: 900px) { .dw-trust { padding: 48px 48px; } }

  .dw-trust-rating { text-align: center; margin-bottom: 24px; display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap; }
  .dw-trust-stars { display: flex; gap: 2px; color: #f59e0b; }
  .dw-trust-stars svg { width: 16px; height: 16px; fill: currentColor; }
  .dw-trust-rating-text { font-size: 14px; opacity: 0.75; }

  .dw-trust-grid { display: grid; grid-template-columns: 1fr; gap: 16px; max-width: 900px; margin: 0 auto; }
  @media (min-width: 600px) { .dw-trust-grid { grid-template-columns: repeat(3, 1fr); gap: 24px; } }

  .dw-trust-card { background: rgba(var(--dw-text-rgb), 0.03); border-radius: var(--dw-radius); padding: 24px; text-align: center; }
  .dw-trust-icon { width: 48px; height: 48px; border-radius: 50%; background: var(--dw-accent); color: var(--dw-bg); display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; }
  .dw-trust-icon svg { width: 24px; height: 24px; }
  .dw-trust-title { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
  .dw-trust-desc { font-size: 13px; opacity: 0.7; line-height: 1.5; }

  .dw-trust-simple { display: flex; justify-content: center; gap: 32px; flex-wrap: wrap; }
  .dw-trust-simple-item { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 500; }
  .dw-trust-simple-item .dw-trust-icon { width: 32px; height: 32px; margin: 0; }
  .dw-trust-simple-item .dw-trust-icon svg { width: 16px; height: 16px; }

  .dw-payment-grid { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(var(--dw-text-rgb), 0.08); }
  .dw-payment-icon { height: 32px; width: auto; border-radius: 4px; }
</style>

{% if section.blocks.size > 0 %}
  <section class="dw-trust">
    {% if section.settings.rating_text != blank %}
      <div class="dw-trust-rating">
        <div class="dw-trust-stars">
          <svg viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
          <svg viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
          <svg viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
          <svg viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
          <svg viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
        </div>
        <span class="dw-trust-rating-text">{{ section.settings.rating_text }}</span>
      </div>
    {% endif %}

    {% case section.settings.variant %}
      {% when 'simple' %}
        <div class="dw-trust-simple">
          {% for block in section.blocks %}
            {% if block.type == 'badge' %}
              <div class="dw-trust-simple-item" {{ block.shopify_attributes }}>
                <div class="dw-trust-icon">{{ block.settings.icon_svg }}</div>
                <span>{{ block.settings.title }}</span>
              </div>
            {% endif %}
          {% endfor %}
        </div>

      {% else %}
        <div class="dw-trust-grid">
          {% for block in section.blocks %}
            {% if block.type == 'badge' %}
              <div class="dw-trust-card" {{ block.shopify_attributes }}>
                <div class="dw-trust-icon">{{ block.settings.icon_svg }}</div>
                <div class="dw-trust-title">{{ block.settings.title }}</div>
                {% if block.settings.description != blank %}
                  <div class="dw-trust-desc">{{ block.settings.description }}</div>
                {% endif %}
              </div>
            {% endif %}
          {% endfor %}
        </div>
    {% endcase %}

    {% if section.settings.show_payment_badges %}
      <div class="dw-payment-grid">
        ${paymentIconsHtml}
      </div>
    {% endif %}
  </section>
{% endif %}`;

  return {
    filename: "dw-trust.liquid",
    liquid: wrapWithSchema(liquid, schema),
    schema,
  };
};
