import type { ValuePropsData } from "@/types/store-sections";
import type { SectionOutput, SectionGeneratorContext, SectionSchema } from "./types";
import { sectionComment, cssAssetTag, wrapWithSchema, getIconSvg } from "./utils";

export const generateValuePropsSection = (
  ctx: SectionGeneratorContext
): SectionOutput | null => {
  const data = ctx.section.data as ValuePropsData;
  if (!data?.props?.length) return null;

  const defaultIconSvg = getIconSvg("SparklesIcon", "24");

  const schema: SectionSchema = {
    name: "Value Props",
    tag: "section",
    class: "dw-section-value-props",
    settings: [
      {
        type: "text",
        id: "title",
        label: "Section title",
        default: data.title ?? "Why Choose Us",
      },
      {
        type: "select",
        id: "variant",
        label: "Layout style",
        options: [
          { value: "grid", label: "Grid" },
          { value: "alternating", label: "Alternating" },
          { value: "list", label: "List" },
        ],
        default: data.variant ?? "grid",
      },
    ],
    blocks: [
      {
        type: "prop",
        name: "Value Prop",
        settings: [
          {
            type: "text",
            id: "title",
            label: "Title",
            default: "Feature",
          },
          {
            type: "textarea",
            id: "description",
            label: "Description",
            default: "Description of this feature.",
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
        name: "Value Props",
        settings: {
          title: data.title ?? "Why Choose Us",
          variant: data.variant ?? "grid",
        },
        blocks: data.props.map((p) => ({
          type: "prop",
          settings: {
            title: p.title,
            description: p.description,
            icon_svg: getIconSvg(p.icon, "24") || defaultIconSvg,
          },
        })),
      },
    ],
  };

  const liquid = `${sectionComment("Value Props")}
${cssAssetTag()}

<style>
  .dw-value-props { padding: 56px 20px; background: rgba(var(--dw-text-rgb), 0.03); }
  @media (min-width: 900px) { .dw-value-props { padding: 80px 48px; } }
  .dw-value-props-title { font-size: 26px; font-weight: 500; line-height: 1.1; letter-spacing: -0.03em; text-align: center; margin-bottom: 40px; }
  @media (min-width: 900px) { .dw-value-props-title { font-size: 36px; margin-bottom: 56px; } }

  .dw-prop-grid { display: grid; grid-template-columns: 1fr; gap: 32px; max-width: 1100px; margin: 0 auto; }
  @media (min-width: 600px) { .dw-prop-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 900px) { .dw-prop-grid { grid-template-columns: repeat(3, 1fr); gap: 40px; } }

  .dw-prop { text-align: center; }
  .dw-prop-icon { width: 56px; height: 56px; border-radius: 50%; background: var(--dw-accent); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: var(--dw-bg); }
  .dw-prop-icon svg { width: 24px; height: 24px; }
  .dw-prop-title { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
  @media (min-width: 900px) { .dw-prop-title { font-size: 20px; } }
  .dw-prop-desc { font-size: 14px; line-height: 1.6; opacity: 0.75; }
  @media (min-width: 900px) { .dw-prop-desc { font-size: 15px; } }

  .dw-prop-alternating { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 40px; }
  .dw-prop-alt { display: flex; gap: 20px; align-items: flex-start; text-align: left; }
  .dw-prop-alt .dw-prop-icon { margin: 0; flex-shrink: 0; }

  .dw-prop-list { max-width: 700px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px; }
  .dw-prop-list-item { display: flex; gap: 16px; align-items: flex-start; text-align: left; }
  .dw-prop-list-item .dw-prop-icon { width: 40px; height: 40px; margin: 0; flex-shrink: 0; }
  .dw-prop-list-item .dw-prop-icon svg { width: 20px; height: 20px; }
</style>

{% if section.blocks.size > 0 %}
  <section class="dw-value-props">
    {% if section.settings.title != blank %}
      <h2 class="dw-value-props-title">{{ section.settings.title }}</h2>
    {% endif %}

    {% case section.settings.variant %}
      {% when 'alternating' %}
        <div class="dw-prop-alternating">
          {% for block in section.blocks %}
            {% if block.type == 'prop' %}
              <div class="dw-prop dw-prop-alt" {{ block.shopify_attributes }}>
                <div class="dw-prop-icon">{{ block.settings.icon_svg }}</div>
                <div>
                  <div class="dw-prop-title">{{ block.settings.title }}</div>
                  <div class="dw-prop-desc">{{ block.settings.description }}</div>
                </div>
              </div>
            {% endif %}
          {% endfor %}
        </div>

      {% when 'list' %}
        <div class="dw-prop-list">
          {% for block in section.blocks %}
            {% if block.type == 'prop' %}
              <div class="dw-prop dw-prop-list-item" {{ block.shopify_attributes }}>
                <div class="dw-prop-icon">{{ block.settings.icon_svg }}</div>
                <div>
                  <div class="dw-prop-title">{{ block.settings.title }}</div>
                  <div class="dw-prop-desc">{{ block.settings.description }}</div>
                </div>
              </div>
            {% endif %}
          {% endfor %}
        </div>

      {% else %}
        <div class="dw-prop-grid">
          {% for block in section.blocks %}
            {% if block.type == 'prop' %}
              <div class="dw-prop" {{ block.shopify_attributes }}>
                <div class="dw-prop-icon">{{ block.settings.icon_svg }}</div>
                <div class="dw-prop-title">{{ block.settings.title }}</div>
                <div class="dw-prop-desc">{{ block.settings.description }}</div>
              </div>
            {% endif %}
          {% endfor %}
        </div>
    {% endcase %}
  </section>
{% endif %}`;

  return {
    filename: "dw-value-props.liquid",
    liquid: wrapWithSchema(liquid, schema),
    schema,
  };
};
