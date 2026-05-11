import type { TestimonialsData } from "@/types/store-sections";
import type { SectionOutput, SectionGeneratorContext, SectionSchema } from "./types";
import { sectionComment, cssAssetTag, wrapWithSchema } from "./utils";

export const generateTestimonialsSection = (
  ctx: SectionGeneratorContext
): SectionOutput | null => {
  const data = ctx.section.data as TestimonialsData;
  if (!data?.testimonials?.length) return null;

  const schema: SectionSchema = {
    name: "Testimonials",
    tag: "section",
    class: "dw-section-testimonials",
    settings: [
      {
        type: "text",
        id: "title",
        label: "Section title",
        default: data.title ?? "What Our Customers Say",
      },
      {
        type: "select",
        id: "variant",
        label: "Layout style",
        options: [
          { value: "grid", label: "Grid" },
          { value: "marquee", label: "Scrolling marquee" },
          { value: "feature", label: "Featured single" },
        ],
        default: data.variant ?? "grid",
      },
    ],
    blocks: [
      {
        type: "testimonial",
        name: "Testimonial",
        settings: [
          {
            type: "textarea",
            id: "quote",
            label: "Quote",
            default: "This product is amazing!",
          },
          {
            type: "text",
            id: "name",
            label: "Customer name",
            default: "Happy Customer",
          },
          {
            type: "text",
            id: "role",
            label: "Role or location",
            default: "",
          },
          {
            type: "image_picker",
            id: "avatar",
            label: "Avatar image",
          },
          {
            type: "range",
            id: "rating",
            label: "Rating",
            min: 1,
            max: 5,
            step: 1,
            default: 5,
          },
        ],
      },
    ],
    presets: [
      {
        name: "Testimonials",
        settings: {
          title: data.title ?? "What Our Customers Say",
          variant: data.variant ?? "grid",
        },
        blocks: data.testimonials.map((t) => ({
          type: "testimonial",
          settings: {
            quote: t.quote,
            name: t.name,
            role: t.role ?? "",
            rating: t.rating ?? 5,
          },
        })),
      },
    ],
  };

  const liquid = `${sectionComment("Testimonials")}
${cssAssetTag()}

{% if section.blocks.size > 0 %}
  <section class="dw-section">
    <div class="dw-container">
      {% if section.settings.title != blank %}
        <h2 class="dw-h2">{{ section.settings.title }}</h2>
      {% endif %}

      {% case section.settings.variant %}
        {% when 'marquee' %}
          <div class="dw-testimonial-marquee">
            <div class="dw-testimonial-track">
              {% for block in section.blocks %}
                {% if block.type == 'testimonial' %}
                  <div class="dw-testimonial" {{ block.shopify_attributes }}>
                    {% if block.settings.rating > 0 %}
                      <div class="dw-stars">
                        {% for i in (1..5) %}
                          {% if i <= block.settings.rating %}★{% else %}<span class="dw-stars-faded">★</span>{% endif %}
                        {% endfor %}
                      </div>
                    {% endif %}
                    <p class="dw-quote">&ldquo;{{ block.settings.quote }}&rdquo;</p>
                    <div class="dw-cite">
                      <div class="dw-avatar">
                        {% if block.settings.avatar != blank %}
                          {{ block.settings.avatar | image_url: width: 80 | image_tag }}
                        {% endif %}
                      </div>
                      <div>
                        <div class="dw-cite-name">{{ block.settings.name }}</div>
                        {% if block.settings.role != blank %}
                          <div class="dw-cite-role">{{ block.settings.role }}</div>
                        {% endif %}
                      </div>
                    </div>
                  </div>
                {% endif %}
              {% endfor %}
            </div>
          </div>

        {% when 'feature' %}
          {% assign featured = section.blocks.first %}
          {% if featured and featured.type == 'testimonial' %}
            <div class="dw-testimonial-feature">
              <div class="dw-testimonial dw-testimonial-lg" {{ featured.shopify_attributes }}>
                {% if featured.settings.rating > 0 %}
                  <div class="dw-stars dw-stars-lg">
                    {% for i in (1..5) %}
                      {% if i <= featured.settings.rating %}★{% else %}<span class="dw-stars-faded">★</span>{% endif %}
                    {% endfor %}
                  </div>
                {% endif %}
                <p class="dw-quote dw-quote-lg">&ldquo;{{ featured.settings.quote }}&rdquo;</p>
                <div class="dw-cite">
                  <div class="dw-avatar dw-avatar-lg">
                    {% if featured.settings.avatar != blank %}
                      {{ featured.settings.avatar | image_url: width: 120 | image_tag }}
                    {% endif %}
                  </div>
                  <div>
                    <div class="dw-cite-name">{{ featured.settings.name }}</div>
                    {% if featured.settings.role != blank %}
                      <div class="dw-cite-role">{{ featured.settings.role }}</div>
                    {% endif %}
                  </div>
                </div>
              </div>
            </div>
          {% endif %}

        {% else %}
          {%- comment -%} Default: grid {%- endcomment -%}
          <div class="dw-testimonial-grid">
            {% for block in section.blocks %}
              {% if block.type == 'testimonial' %}
                <div class="dw-testimonial" {{ block.shopify_attributes }}>
                  {% if block.settings.rating > 0 %}
                    <div class="dw-stars">
                      {% for i in (1..5) %}
                        {% if i <= block.settings.rating %}★{% else %}<span class="dw-stars-faded">★</span>{% endif %}
                      {% endfor %}
                    </div>
                  {% endif %}
                  <p class="dw-quote">&ldquo;{{ block.settings.quote }}&rdquo;</p>
                  <div class="dw-cite">
                    <div class="dw-avatar">
                      {% if block.settings.avatar != blank %}
                        {{ block.settings.avatar | image_url: width: 80 | image_tag }}
                      {% endif %}
                    </div>
                    <div>
                      <div class="dw-cite-name">{{ block.settings.name }}</div>
                      {% if block.settings.role != blank %}
                        <div class="dw-cite-role">{{ block.settings.role }}</div>
                      {% endif %}
                    </div>
                  </div>
                </div>
              {% endif %}
            {% endfor %}
          </div>
      {% endcase %}
    </div>
  </section>
{% endif %}`;

  return {
    filename: "dw-testimonials.liquid",
    liquid: wrapWithSchema(liquid, schema),
    schema,
  };
};
