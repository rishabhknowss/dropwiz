import type { FaqData } from "@/types/store-sections";
import type { SectionOutput, SectionGeneratorContext, SectionSchema } from "./types";
import { sectionComment, cssAssetTag, wrapWithSchema } from "./utils";

export const generateFaqSection = (
  ctx: SectionGeneratorContext
): SectionOutput | null => {
  const data = ctx.section.data as FaqData;
  if (!data?.faqs?.length) return null;

  const schema: SectionSchema = {
    name: "FAQ",
    tag: "section",
    class: "dw-section-faq",
    settings: [
      {
        type: "text",
        id: "title",
        label: "Section title",
        default: "Common Questions",
      },
      {
        type: "select",
        id: "variant",
        label: "Layout style",
        options: [
          { value: "accordion", label: "Accordion" },
          { value: "two-column", label: "Two column" },
          { value: "cards", label: "Cards" },
        ],
        default: data.variant ?? "accordion",
      },
    ],
    blocks: [
      {
        type: "faq",
        name: "FAQ",
        settings: [
          {
            type: "text",
            id: "question",
            label: "Question",
            default: "Your question here?",
          },
          {
            type: "textarea",
            id: "answer",
            label: "Answer",
            default: "Your answer here.",
          },
        ],
      },
    ],
    presets: [
      {
        name: "FAQ",
        settings: {
          title: "Common Questions",
          variant: data.variant ?? "accordion",
        },
        blocks: data.faqs.map((faq) => ({
          type: "faq",
          settings: {
            question: faq.question,
            answer: faq.answer,
          },
        })),
      },
    ],
  };

  const liquid = `${sectionComment("FAQ")}
${cssAssetTag()}

{% if section.blocks.size > 0 %}
  {% case section.settings.variant %}
    {% when 'two-column' %}
      <section class="dw-section" id="dw-faq">
        <div class="dw-container dw-grid-faq-twocol">
          <div>
            <div class="dw-mono-kicker">Help &amp; FAQ</div>
            <h2 class="dw-h2">{{ section.settings.title }}</h2>
          </div>
          <div class="dw-faq-list">
            {% for block in section.blocks %}
              {% if block.type == 'faq' %}
                <details class="dw-faq-item" {{ block.shopify_attributes }}>
                  <summary>{{ block.settings.question }}</summary>
                  <div class="dw-faq-answer">{{ block.settings.answer }}</div>
                </details>
              {% endif %}
            {% endfor %}
          </div>
        </div>
      </section>

    {% when 'cards' %}
      <section class="dw-section" id="dw-faq">
        <div class="dw-container">
          {% if section.settings.title != blank %}
            <h2 class="dw-h2">{{ section.settings.title }}</h2>
          {% endif %}
          <div class="dw-faq-cards">
            {% for block in section.blocks %}
              {% if block.type == 'faq' %}
                <details class="dw-faq-item" {{ block.shopify_attributes }}>
                  <summary>{{ block.settings.question }}</summary>
                  <div class="dw-faq-answer">{{ block.settings.answer }}</div>
                </details>
              {% endif %}
            {% endfor %}
          </div>
        </div>
      </section>

    {% else %}
      {%- comment -%} Default: accordion {%- endcomment -%}
      <section class="dw-section" id="dw-faq">
        <div class="dw-container-narrow">
          {% if section.settings.title != blank %}
            <h2 class="dw-h2">{{ section.settings.title }}</h2>
          {% endif %}
          <div class="dw-faq-list">
            {% for block in section.blocks %}
              {% if block.type == 'faq' %}
                <details class="dw-faq-item" {{ block.shopify_attributes }}>
                  <summary>{{ block.settings.question }}</summary>
                  <div class="dw-faq-answer">{{ block.settings.answer }}</div>
                </details>
              {% endif %}
            {% endfor %}
          </div>
        </div>
      </section>
  {% endcase %}
{% endif %}`;

  return {
    filename: "dw-faq.liquid",
    liquid: wrapWithSchema(liquid, schema),
    schema,
  };
};
