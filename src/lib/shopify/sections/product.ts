import type { ProductData } from "@/types/store-sections";
import type { SectionOutput, SectionGeneratorContext, SectionSchema } from "./types";
import { sectionComment, cssAssetTag, wrapWithSchema } from "./utils";

export const generateProductSection = (
  ctx: SectionGeneratorContext
): SectionOutput | null => {
  const data = ctx.section.data as ProductData;
  if (!data) return null;

  const schema: SectionSchema = {
    name: "Product Main",
    tag: "section",
    class: "dw-section-product",
    settings: [
      {
        type: "select",
        id: "variant",
        label: "Layout style",
        options: [
          { value: "default", label: "Default" },
          { value: "gallery", label: "Gallery" },
          { value: "compact", label: "Compact" },
          { value: "rich", label: "Rich with side features" },
        ],
        default: data.variant ?? "default",
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
        id: "button_text",
        label: "Add to cart button text",
        default: "Add to Cart",
      },
      {
        type: "checkbox",
        id: "show_payment_badges",
        label: "Show payment badges",
        default: data.showPaymentBadges ?? true,
      },
      {
        type: "checkbox",
        id: "show_description",
        label: "Show product description",
        default: true,
      },
    ],
    presets: [
      {
        name: "Product Main",
        settings: {
          show_rating: Boolean(data.rating),
          show_payment_badges: data.showPaymentBadges ?? true,
        },
      },
    ],
    enabled_on: {
      templates: ["product"],
    },
  };

  const liquid = `${sectionComment("Product Main")}
${cssAssetTag()}

<section class="dw-prod dw-prod-{{ section.settings.variant }}" id="dw-product">
  {% case section.settings.variant %}
    {% when 'compact' %}
      <div class="dw-prod-compact-inner">
        {% if section.settings.show_rating and section.settings.review_count > 0 %}
          <div class="dw-prod-rating">
            {% render 'dw-rating-stars', rating: section.settings.rating %}
            <span class="dw-rating-text">{{ section.settings.rating }}/5 ({{ section.settings.review_count }}+ reviews)</span>
          </div>
        {% endif %}
        <h2 class="dw-prod-title">{{ product.title }}</h2>
        <div class="dw-prod-price">
          <span class="dw-prod-price-current">{{ product.price | money }}</span>
          {% if product.compare_at_price > product.price %}
            <span class="dw-prod-price-original">{{ product.compare_at_price | money }}</span>
          {% endif %}
        </div>
        {% if section.settings.show_description and product.description != blank %}
          <p class="dw-prod-desc">{{ product.description | strip_html | truncate: 300 }}</p>
        {% endif %}
        {%- form 'product', product, class: 'dw-prod-form' -%}
          <input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}" />
          <button type="submit" class="dw-prod-cta">{{ section.settings.button_text }}</button>
        {%- endform -%}
        {% if section.settings.show_payment_badges %}
          <div class="dw-payment-badges">
            {% render 'dw-payment-icons' %}
          </div>
        {% endif %}
      </div>

    {% when 'gallery' %}
      <div class="dw-prod-gallery-grid">
        <div class="dw-prod-gallery-left">
          <div class="dw-prod-main-img-wrap">
            {% if product.metafields.custom.badge != blank %}
              <span class="dw-prod-img-badge">{{ product.metafields.custom.badge }}</span>
            {% endif %}
            {{ product.featured_image | image_url: width: 800 | image_tag: class: 'dw-prod-hero-img' }}
          </div>
          {% if product.images.size > 1 %}
            <div class="dw-prod-thumb-row">
              {% for image in product.images limit: 4 %}
                <button class="dw-prod-thumb-btn {% if forloop.first %}active{% endif %}" data-image="{{ image | image_url: width: 800 }}">
                  {{ image | image_url: width: 100 | image_tag }}
                </button>
              {% endfor %}
            </div>
          {% endif %}
        </div>
        <div class="dw-prod-gallery-right">
          {% if section.settings.show_rating and section.settings.review_count > 0 %}
            <div class="dw-prod-rating">
              {% render 'dw-rating-stars', rating: section.settings.rating %}
              <span class="dw-rating-text">{{ section.settings.rating }}/5 ({{ section.settings.review_count }}+ reviews)</span>
            </div>
          {% endif %}
          <h2 class="dw-prod-title dw-prod-title-lg">{{ product.title }}</h2>
          <div class="dw-prod-price">
            <span class="dw-prod-price-current">{{ product.price | money }}</span>
            {% if product.compare_at_price > product.price %}
              <span class="dw-prod-price-original">{{ product.compare_at_price | money }}</span>
            {% endif %}
          </div>
          {% if section.settings.show_description and product.description != blank %}
            <p class="dw-prod-desc">{{ product.description | strip_html | truncate: 300 }}</p>
          {% endif %}
          {%- form 'product', product, class: 'dw-prod-form' -%}
            <input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}" />
            <button type="submit" class="dw-prod-cta">{{ section.settings.button_text }}</button>
          {%- endform -%}
          {% if section.settings.show_payment_badges %}
            <div class="dw-payment-badges">
              {% render 'dw-payment-icons' %}
            </div>
          {% endif %}
        </div>
      </div>

    {% else %}
      {%- comment -%} Default layout {%- endcomment -%}
      <div class="dw-prod-grid">
        <div class="dw-prod-gallery">
          {% if product.images.size > 1 %}
            <div class="dw-prod-thumbs">
              {% for image in product.images limit: 6 %}
                <button class="dw-prod-thumb {% if forloop.first %}active{% endif %}" data-image="{{ image | image_url: width: 800 }}">
                  {{ image | image_url: width: 100 | image_tag }}
                </button>
              {% endfor %}
            </div>
          {% endif %}
          <div class="dw-prod-main-img">
            {{ product.featured_image | image_url: width: 800 | image_tag: class: 'dw-prod-active-img' }}
          </div>
        </div>
        <div class="dw-prod-info">
          {% if section.settings.show_rating and section.settings.review_count > 0 %}
            <div class="dw-prod-rating">
              {% render 'dw-rating-stars', rating: section.settings.rating %}
              <span class="dw-rating-text">{{ section.settings.rating }}/5 ({{ section.settings.review_count }}+ reviews)</span>
            </div>
          {% endif %}
          <h2 class="dw-prod-title">{{ product.title }}</h2>
          <div class="dw-prod-price">
            <span class="dw-prod-price-current">{{ product.price | money }}</span>
            {% if product.compare_at_price > product.price %}
              <span class="dw-prod-price-original">{{ product.compare_at_price | money }}</span>
            {% endif %}
          </div>
          {% if section.settings.show_description and product.description != blank %}
            <p class="dw-prod-desc">{{ product.description | strip_html | truncate: 300 }}</p>
          {% endif %}
          {%- form 'product', product, class: 'dw-prod-form' -%}
            <input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}" />
            <button type="submit" class="dw-prod-cta">{{ section.settings.button_text }} — {{ product.price | money }}</button>
          {%- endform -%}
          {% if section.settings.show_payment_badges %}
            <div class="dw-payment-badges">
              {% render 'dw-payment-icons' %}
            </div>
          {% endif %}
        </div>
      </div>
  {% endcase %}
</section>

<script>
(function() {
  document.querySelectorAll('.dw-prod-thumb, .dw-prod-thumb-btn').forEach(function(thumb) {
    thumb.addEventListener('click', function() {
      var container = this.closest('.dw-prod');
      if (!container) return;
      var img = this.querySelector('img');
      if (!img) return;
      var src = this.dataset.image || img.src;
      var mainImg = container.querySelector('.dw-prod-active-img, .dw-prod-hero-img');
      if (mainImg && src) {
        mainImg.src = src;
      }
      container.querySelectorAll('.dw-prod-thumb, .dw-prod-thumb-btn').forEach(function(t) {
        t.classList.remove('active');
      });
      this.classList.add('active');
    });
  });
})();
</script>`;

  return {
    filename: "dw-product-main.liquid",
    liquid: wrapWithSchema(liquid, schema),
    schema,
  };
};
