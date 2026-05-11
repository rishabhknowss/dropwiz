import type { HowItWorksData } from "@/types/store-sections";
import type { SectionOutput, SectionGeneratorContext, SectionSchema } from "./types";
import { sectionComment, cssAssetTag, wrapWithSchema, getIconSvg } from "./utils";

export const generateHowItWorksSection = (
  ctx: SectionGeneratorContext
): SectionOutput | null => {
  const data = ctx.section.data as HowItWorksData;
  if (!data?.steps?.length) return null;

  const defaultIconSvg = getIconSvg("SparklesIcon", "24");

  const schema: SectionSchema = {
    name: "How It Works",
    tag: "section",
    class: "dw-section-how-it-works",
    settings: [
      {
        type: "text",
        id: "title",
        label: "Section title",
        default: data.title ?? "How It Works",
      },
      {
        type: "select",
        id: "variant",
        label: "Layout style",
        options: [
          { value: "cards", label: "Cards" },
          { value: "timeline", label: "Timeline" },
          { value: "numbered", label: "Numbered" },
        ],
        default: data.variant ?? "cards",
      },
    ],
    blocks: [
      {
        type: "step",
        name: "Step",
        settings: [
          {
            type: "text",
            id: "title",
            label: "Title",
            default: "Step",
          },
          {
            type: "textarea",
            id: "description",
            label: "Description",
            default: "",
          },
          {
            type: "html",
            id: "icon_svg",
            label: "Icon SVG",
          },
          {
            type: "image_picker",
            id: "image",
            label: "Image (optional)",
          },
        ],
      },
    ],
    presets: [
      {
        name: "How It Works",
        settings: {
          title: data.title ?? "How It Works",
          variant: data.variant ?? "cards",
        },
        blocks: data.steps.map((step) => ({
          type: "step",
          settings: {
            title: step.title,
            description: step.description,
            icon_svg: getIconSvg(step.icon, "24") || defaultIconSvg,
          },
        })),
      },
    ],
  };

  const liquid = `${sectionComment("How It Works")}
${cssAssetTag()}

<style>
  .dw-how-it-works { padding: 56px 20px; }
  @media (min-width: 900px) { .dw-how-it-works { padding: 80px 48px; } }
  .dw-how-title { font-size: 26px; font-weight: 500; line-height: 1.1; letter-spacing: -0.03em; text-align: center; margin-bottom: 40px; }
  @media (min-width: 900px) { .dw-how-title { font-size: 36px; margin-bottom: 56px; } }

  .dw-how-grid { display: grid; grid-template-columns: 1fr; gap: 24px; max-width: 1200px; margin: 0 auto; }
  @media (min-width: 600px) { .dw-how-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 900px) { .dw-how-grid { grid-template-columns: repeat(3, 1fr); gap: 32px; } }
  @media (min-width: 1100px) { .dw-how-grid { grid-template-columns: repeat(4, 1fr); } }

  .dw-how-card { background: rgba(var(--dw-text-rgb), 0.03); border-radius: var(--dw-radius); padding: 24px; }
  .dw-how-card-icon { width: 48px; height: 48px; border-radius: 50%; background: var(--dw-accent); color: var(--dw-bg); display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
  .dw-how-card-icon svg { width: 24px; height: 24px; }
  .dw-how-card-title { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
  .dw-how-card-desc { font-size: 14px; line-height: 1.6; opacity: 0.75; }
  .dw-how-card-img { margin-top: 16px; border-radius: calc(var(--dw-radius) - 8px); overflow: hidden; aspect-ratio: 4/3; }
  .dw-how-card-img img { width: 100%; height: 100%; object-fit: cover; }

  .dw-how-numbered { display: flex; gap: 16px; align-items: flex-start; padding: 20px; border-left: 2px solid var(--dw-accent); }
  .dw-how-num { width: 32px; height: 32px; border-radius: 50%; background: var(--dw-accent); color: var(--dw-bg); display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px; flex-shrink: 0; }
  .dw-how-numbered .dw-how-card-title { margin-bottom: 4px; }

  .dw-how-timeline { position: relative; padding-left: 24px; }
  .dw-how-timeline::before { content: ''; position: absolute; left: 8px; top: 0; bottom: 0; width: 2px; background: var(--dw-accent); }
  .dw-how-timeline-dot { width: 18px; height: 18px; border-radius: 50%; background: var(--dw-accent); position: absolute; left: 0; top: 4px; }
  .dw-how-timeline .dw-how-card-title { margin-bottom: 4px; }
</style>

{% if section.blocks.size > 0 %}
  <section class="dw-how-it-works">
    {% if section.settings.title != blank %}
      <h2 class="dw-how-title">{{ section.settings.title }}</h2>
    {% endif %}

    <div class="dw-how-grid">
      {% for block in section.blocks %}
        {% if block.type == 'step' %}
          {% case section.settings.variant %}
            {% when 'numbered' %}
              <div class="dw-how-numbered" {{ block.shopify_attributes }}>
                <span class="dw-how-num">{{ forloop.index }}</span>
                <div>
                  <div class="dw-how-card-title">{{ block.settings.title }}</div>
                  {% if block.settings.description != blank %}
                    <div class="dw-how-card-desc">{{ block.settings.description }}</div>
                  {% endif %}
                </div>
              </div>

            {% when 'timeline' %}
              <div class="dw-how-timeline" {{ block.shopify_attributes }}>
                <div class="dw-how-timeline-dot"></div>
                <div>
                  <div class="dw-how-card-title">{{ block.settings.title }}</div>
                  {% if block.settings.description != blank %}
                    <div class="dw-how-card-desc">{{ block.settings.description }}</div>
                  {% endif %}
                </div>
              </div>

            {% else %}
              <div class="dw-how-card" {{ block.shopify_attributes }}>
                <div class="dw-how-card-icon">{{ block.settings.icon_svg }}</div>
                <div class="dw-how-card-title">{{ block.settings.title }}</div>
                {% if block.settings.description != blank %}
                  <div class="dw-how-card-desc">{{ block.settings.description }}</div>
                {% endif %}
                {% if block.settings.image != blank %}
                  <div class="dw-how-card-img">
                    {{ block.settings.image | image_url: width: 600 | image_tag }}
                  </div>
                {% endif %}
              </div>
          {% endcase %}
        {% endif %}
      {% endfor %}
    </div>
  </section>
{% endif %}`;

  return {
    filename: "dw-how-it-works.liquid",
    liquid: wrapWithSchema(liquid, schema),
    schema,
  };
};
