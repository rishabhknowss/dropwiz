import type { HeroData } from "@/types/store-sections";
import type { SectionOutput, SectionGeneratorContext, SectionSchema } from "./types";
import { esc, sectionComment, cssAssetTag, wrapWithSchema, getIconSvg, formatStaticPrice } from "./utils";

export const generateHeroSection = (
  ctx: SectionGeneratorContext
): SectionOutput | null => {
  const data = ctx.section.data as HeroData;
  if (!data) return null;

  const schema: SectionSchema = {
    name: "Hero",
    tag: "section",
    class: "dw-section-hero",
    settings: [
      {
        type: "select",
        id: "variant",
        label: "Layout style",
        options: [
          { value: "split", label: "Split (image right)" },
          { value: "centered", label: "Centered" },
          { value: "full-bleed", label: "Full bleed background" },
          { value: "minimal", label: "Minimal" },
          { value: "product-hero", label: "Product hero" },
        ],
        default: data.variant ?? "split",
      },
      {
        type: "text",
        id: "badge",
        label: "Badge text",
        default: data.urgencyBadge ?? "",
      },
      {
        type: "text",
        id: "headline",
        label: "Headline",
        default: data.headline ?? "Your Product Headline",
      },
      {
        type: "textarea",
        id: "subheadline",
        label: "Subheadline",
        default: data.subheadline ?? "",
      },
      {
        type: "image_picker",
        id: "image",
        label: "Hero image",
      },
      {
        type: "text",
        id: "button_text",
        label: "Button text",
        default: data.primaryCta ?? "Shop Now",
      },
      {
        type: "url",
        id: "button_link",
        label: "Button link",
      },
      {
        type: "text",
        id: "secondary_button_text",
        label: "Secondary button text",
        default: data.secondaryCta ?? "",
      },
      {
        type: "url",
        id: "secondary_button_link",
        label: "Secondary button link",
      },
      {
        type: "checkbox",
        id: "show_rating",
        label: "Show rating",
        default: Boolean(data.rating),
      },
      {
        type: "range",
        id: "rating",
        label: "Rating value",
        min: 1,
        max: 5,
        step: 0.1,
        default: data.rating ?? 4.8,
      },
      {
        type: "number",
        id: "review_count",
        label: "Review count",
        default: data.reviewCount ?? 0,
      },
      {
        type: "text",
        id: "social_proof",
        label: "Social proof text",
        default: data.socialProof ?? "",
      },
      {
        type: "checkbox",
        id: "show_payment_badges",
        label: "Show payment badges",
        default: data.showPaymentBadges ?? false,
      },
    ],
    presets: [
      {
        name: "Hero",
        settings: {
          headline: data.headline ?? "Your Product Headline",
          subheadline: data.subheadline ?? "",
          button_text: data.primaryCta ?? "Shop Now",
          variant: data.variant ?? "split",
        },
      },
    ],
  };

  const liquid = `${sectionComment("Hero")}
${cssAssetTag()}

{% case section.settings.variant %}
  {% when 'centered' %}
    <section class="dw-hero dw-hero-centered">
      <div class="dw-container dw-text-center">
        {% if section.settings.badge != blank %}
          <span class="dw-badge">{{ section.settings.badge }}</span>
        {% endif %}
        <h1 class="dw-h1">{{ section.settings.headline }}</h1>
        {% if section.settings.subheadline != blank %}
          <p class="dw-sub">{{ section.settings.subheadline }}</p>
        {% endif %}
        <div class="dw-cta-row dw-justify-center">
          <a href="{% if section.settings.button_link != blank %}{{ section.settings.button_link }}{% elsif product %}#dw-product{% else %}{{ routes.all_products_collection_url }}{% endif %}" class="dw-btn-primary">
            {{ section.settings.button_text }}
          </a>
          {% if section.settings.secondary_button_text != blank %}
            <a href="{{ section.settings.secondary_button_link | default: '#dw-faq' }}" class="dw-btn-outline">
              {{ section.settings.secondary_button_text }}
            </a>
          {% endif %}
        </div>
        {% if section.settings.social_proof != blank %}
          <div class="dw-social">{{ section.settings.social_proof }}</div>
        {% endif %}
        {% if section.settings.image != blank %}
          <div class="dw-hero-img-video">
            {{ section.settings.image | image_url: width: 1200 | image_tag }}
          </div>
        {% endif %}
      </div>
    </section>

  {% when 'full-bleed' %}
    <section class="dw-hero-fullbleed">
      {% if section.settings.image != blank %}
        {{ section.settings.image | image_url: width: 1920 | image_tag: class: 'dw-hero-bg' }}
      {% else %}
        <div class="dw-hero-bg dw-gradient"></div>
      {% endif %}
      <div class="dw-hero-overlay" style="background:linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.6) 100%)"></div>
      <div class="dw-hero-fullbleed-inner">
        <nav class="dw-fullbleed-nav">
          <span class="dw-brand">{{ shop.name }}</span>
          <a href="{% if section.settings.button_link != blank %}{{ section.settings.button_link }}{% elsif product %}#dw-product{% else %}{{ routes.all_products_collection_url }}{% endif %}" class="dw-btn-pill">{{ section.settings.button_text }}</a>
        </nav>
        <div class="dw-fullbleed-copy">
          {% if section.settings.badge != blank %}
            <div class="dw-badge-glass">{{ section.settings.badge }}</div>
          {% endif %}
          <h1 class="dw-h1 dw-on-dark">{{ section.settings.headline }}</h1>
          {% if section.settings.subheadline != blank %}
            <p class="dw-sub dw-on-dark">{{ section.settings.subheadline }}</p>
          {% endif %}
          <div class="dw-cta-row">
            <a href="{% if section.settings.button_link != blank %}{{ section.settings.button_link }}{% elsif product %}#dw-product{% else %}{{ routes.all_products_collection_url }}{% endif %}" class="dw-btn-primary">{{ section.settings.button_text }}</a>
            {% if section.settings.secondary_button_text != blank %}
              <a href="{{ section.settings.secondary_button_link | default: '#dw-faq' }}" class="dw-btn-outline-light">{{ section.settings.secondary_button_text }}</a>
            {% endif %}
          </div>
        </div>
      </div>
    </section>

  {% when 'minimal' %}
    <section class="dw-hero dw-hero-minimal">
      <div class="dw-container">
        {% if section.settings.badge != blank %}
          <div class="dw-mono-kicker">{{ section.settings.badge }}</div>
        {% endif %}
        <div class="dw-hero-minimal-grid">
          <h1 class="dw-h1">{{ section.settings.headline }}</h1>
          <div>
            {% if section.settings.subheadline != blank %}
              <p class="dw-sub">{{ section.settings.subheadline }}</p>
            {% endif %}
            <div class="dw-cta-row">
              <a href="{% if section.settings.button_link != blank %}{{ section.settings.button_link }}{% elsif product %}#dw-product{% else %}{{ routes.all_products_collection_url }}{% endif %}" class="dw-btn-primary">{{ section.settings.button_text }}</a>
              {% if section.settings.secondary_button_text != blank %}
                <a href="{{ section.settings.secondary_button_link | default: '#dw-faq' }}" class="dw-btn-outline">{{ section.settings.secondary_button_text }}</a>
              {% endif %}
            </div>
            {% if section.settings.social_proof != blank %}
              <div class="dw-social">{{ section.settings.social_proof }}</div>
            {% endif %}
          </div>
        </div>
        {% if section.settings.image != blank %}
          <div class="dw-hero-img-video">
            {{ section.settings.image | image_url: width: 1200 | image_tag }}
          </div>
        {% endif %}
      </div>
    </section>

  {% when 'product-hero' %}
    {% render 'dw-hero-product', section: section %}

  {% else %}
    {%- comment -%} Default: split {%- endcomment -%}
    <section class="dw-hero dw-hero-split">
      <div class="dw-container dw-grid-2">
        <div>
          {% if section.settings.show_rating and section.settings.review_count > 0 %}
            <div class="dw-rating">
              <span class="dw-stars">★★★★★</span>
              <span class="dw-rating-text">{{ section.settings.rating }}/5 ({{ section.settings.review_count }}+ reviews)</span>
            </div>
          {% endif %}
          {% if section.settings.badge != blank %}
            <span class="dw-badge">{{ section.settings.badge }}</span>
          {% endif %}
          <h1 class="dw-h1">{{ section.settings.headline }}</h1>
          {% if section.settings.subheadline != blank %}
            <p class="dw-sub">{{ section.settings.subheadline }}</p>
          {% endif %}
          <div class="dw-cta-row">
            <a href="{% if section.settings.button_link != blank %}{{ section.settings.button_link }}{% elsif product %}#dw-product{% else %}{{ routes.all_products_collection_url }}{% endif %}" class="dw-btn-primary">{{ section.settings.button_text }}</a>
            {% if section.settings.secondary_button_text != blank %}
              <a href="{{ section.settings.secondary_button_link | default: '#dw-faq' }}" class="dw-btn-outline">{{ section.settings.secondary_button_text }}</a>
            {% endif %}
          </div>
          {% if section.settings.social_proof != blank %}
            <div class="dw-social">{{ section.settings.social_proof }}</div>
          {% endif %}
          {% if section.settings.show_payment_badges %}
            <div class="dw-payment-badges">
              {% render 'dw-payment-icons' %}
            </div>
          {% endif %}
        </div>
        <div class="dw-hero-img-square">
          {% if section.settings.image != blank %}
            {{ section.settings.image | image_url: width: 800 | image_tag }}
          {% else %}
            <div class="dw-gradient"></div>
          {% endif %}
        </div>
      </div>
    </section>
{% endcase %}`;

  return {
    filename: "dw-hero.liquid",
    liquid: wrapWithSchema(liquid, schema),
    schema,
  };
};
