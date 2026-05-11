import type { BundleData } from "@/types/store-sections";
import type { SectionOutput, SectionGeneratorContext, SectionSchema } from "./types";
import { sectionComment, cssAssetTag, wrapWithSchema, generateUniqueId } from "./utils";

export const generateBundlesSection = (
  ctx: SectionGeneratorContext
): SectionOutput | null => {
  const data = ctx.section.data as BundleData;
  if (!data?.bundles?.length) return null;

  const schema: SectionSchema = {
    name: "Bundles",
    tag: "section",
    class: "dw-section-bundles",
    settings: [
      {
        type: "text",
        id: "title",
        label: "Section title",
        default: "Bundle & Save",
      },
      {
        type: "textarea",
        id: "subtitle",
        label: "Section subtitle",
        default: "More items, bigger savings.",
      },
      {
        type: "select",
        id: "variant",
        label: "Layout style",
        options: [
          { value: "tiers", label: "Tiers (grid)" },
          { value: "compact", label: "Compact (list)" },
          { value: "showcase", label: "Showcase" },
        ],
        default: data.variant ?? "tiers",
      },
    ],
    blocks: [
      {
        type: "bundle",
        name: "Bundle",
        settings: [
          {
            type: "text",
            id: "name",
            label: "Bundle name",
            default: "Bundle",
          },
          {
            type: "text",
            id: "description",
            label: "Description",
            default: "",
          },
          {
            type: "number",
            id: "quantity",
            label: "Quantity",
            default: 1,
          },
          {
            type: "range",
            id: "discount_percent",
            label: "Discount percentage",
            min: 0,
            max: 50,
            step: 5,
            default: 0,
          },
          {
            type: "text",
            id: "badge",
            label: "Badge text",
            default: "",
          },
          {
            type: "text",
            id: "savings",
            label: "Savings text",
            default: "",
          },
          {
            type: "checkbox",
            id: "recommended",
            label: "Mark as recommended",
            default: false,
          },
        ],
      },
    ],
    presets: [
      {
        name: "Bundles",
        settings: {
          title: "Bundle & Save",
          subtitle: "More items, bigger savings.",
        },
        blocks: data.bundles.map((b) => ({
          type: "bundle",
          settings: {
            name: b.name,
            description: b.description,
            quantity: b.quantity,
            discount_percent: b.discountPercent,
            badge: b.badge ?? "",
            savings: b.savings,
            recommended: b.recommended,
          },
        })),
      },
    ],
    enabled_on: {
      templates: ["product"],
    },
  };

  const liquid = `${sectionComment("Bundles")}
${cssAssetTag()}

{% if section.blocks.size > 0 %}
  {% case section.settings.variant %}
    {% when 'compact' %}
      <section class="dw-section dw-bundles-compact">
        <div class="dw-container-narrow">
          {% if section.settings.title != blank %}
            <h2 class="dw-h2 dw-text-center">{{ section.settings.title }}</h2>
          {% endif %}
          <div class="dw-bundle-list">
            {% for block in section.blocks %}
              {% if block.type == 'bundle' %}
                {% assign discount = block.settings.discount_percent | divided_by: 100.0 %}
                {% assign discounted_price = product.price | times: block.settings.quantity %}
                {% assign discounted_price = discounted_price | times: 1 | minus: discounted_price | times: discount %}
                <div class="dw-bundle {% if block.settings.recommended %}dw-bundle-rec{% endif %}" {{ block.shopify_attributes }}>
                  {% if block.settings.badge != blank %}
                    <span class="dw-bundle-badge">{{ block.settings.badge }}</span>
                  {% endif %}
                  <div class="dw-bundle-name">{{ block.settings.name }}</div>
                  {% if block.settings.description != blank %}
                    <div class="dw-bundle-desc">{{ block.settings.description }}</div>
                  {% endif %}
                  <div class="dw-bundle-price">{{ discounted_price | money }}</div>
                  <div class="dw-bundle-meta">{{ block.settings.quantity }} × — {{ block.settings.savings }}</div>
                  {%- form 'product', product, class: 'dw-bundle-form' -%}
                    <input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}" />
                    <input type="hidden" name="quantity" value="{{ block.settings.quantity }}" />
                    <button type="submit" class="dw-btn-{% if block.settings.recommended %}primary{% else %}outline{% endif %} dw-btn-block">
                      Add {% if block.settings.quantity > 1 %}{{ block.settings.quantity }} items{% endif %} to cart
                    </button>
                  {%- endform -%}
                </div>
              {% endif %}
            {% endfor %}
          </div>
        </div>
      </section>

    {% when 'showcase' %}
      <section class="dw-section">
        <div class="dw-container">
          {% if section.settings.title != blank %}
            <h2 class="dw-h2">{{ section.settings.title }}</h2>
          {% endif %}
          <div class="dw-bundle-showcase">
            {% for block in section.blocks %}
              {% if block.type == 'bundle' %}
                {% assign discount = block.settings.discount_percent | divided_by: 100.0 %}
                {% assign discounted_price = product.price | times: block.settings.quantity %}
                {% assign discounted_price = discounted_price | times: 1 | minus: discounted_price | times: discount %}
                <div class="dw-bundle {% if block.settings.recommended %}dw-bundle-rec{% endif %}" {{ block.shopify_attributes }}>
                  {% if block.settings.badge != blank %}
                    <span class="dw-bundle-badge">{{ block.settings.badge }}</span>
                  {% endif %}
                  <div class="dw-bundle-name">{{ block.settings.name }}</div>
                  {% if block.settings.description != blank %}
                    <div class="dw-bundle-desc">{{ block.settings.description }}</div>
                  {% endif %}
                  <div class="dw-bundle-price">{{ discounted_price | money }}</div>
                  <div class="dw-bundle-meta">{{ block.settings.quantity }} × — {{ block.settings.savings }}</div>
                  {%- form 'product', product, class: 'dw-bundle-form' -%}
                    <input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}" />
                    <input type="hidden" name="quantity" value="{{ block.settings.quantity }}" />
                    <button type="submit" class="dw-btn-{% if block.settings.recommended %}primary{% else %}outline{% endif %} dw-btn-block">
                      Add {% if block.settings.quantity > 1 %}{{ block.settings.quantity }} items{% endif %} to cart
                    </button>
                  {%- endform -%}
                </div>
              {% endif %}
            {% endfor %}
          </div>
        </div>
      </section>

    {% else %}
      {%- comment -%} Default: tiers {%- endcomment -%}
      <section class="dw-section">
        <div class="dw-container">
          {% if section.settings.title != blank %}
            <h2 class="dw-h2">{{ section.settings.title }}</h2>
          {% endif %}
          {% if section.settings.subtitle != blank %}
            <p class="dw-section-sub">{{ section.settings.subtitle }}</p>
          {% endif %}
          <div class="dw-bundle-grid">
            {% for block in section.blocks %}
              {% if block.type == 'bundle' %}
                {% assign discount = block.settings.discount_percent | divided_by: 100.0 %}
                {% assign discounted_price = product.price | times: block.settings.quantity %}
                {% assign discounted_price = discounted_price | times: 1 | minus: discounted_price | times: discount %}
                <div class="dw-bundle {% if block.settings.recommended %}dw-bundle-rec{% endif %}" {{ block.shopify_attributes }}>
                  {% if block.settings.badge != blank %}
                    <span class="dw-bundle-badge">{{ block.settings.badge }}</span>
                  {% endif %}
                  <div class="dw-bundle-name">{{ block.settings.name }}</div>
                  {% if block.settings.description != blank %}
                    <div class="dw-bundle-desc">{{ block.settings.description }}</div>
                  {% endif %}
                  <div class="dw-bundle-price">{{ discounted_price | money }}</div>
                  <div class="dw-bundle-meta">{{ block.settings.quantity }} × — {{ block.settings.savings }}</div>
                  {%- form 'product', product, class: 'dw-bundle-form' -%}
                    <input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}" />
                    <input type="hidden" name="quantity" value="{{ block.settings.quantity }}" />
                    <button type="submit" class="dw-btn-{% if block.settings.recommended %}primary{% else %}outline{% endif %} dw-btn-block">
                      Add {% if block.settings.quantity > 1 %}{{ block.settings.quantity }} items{% endif %} to cart
                    </button>
                  {%- endform -%}
                </div>
              {% endif %}
            {% endfor %}
          </div>
        </div>
      </section>
  {% endcase %}
{% endif %}`;

  return {
    filename: "dw-bundles.liquid",
    liquid: wrapWithSchema(liquid, schema),
    schema,
  };
};
