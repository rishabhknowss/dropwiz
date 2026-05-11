import type { FeatureMarqueeData } from "@/types/store-sections";
import type { SectionOutput, SectionGeneratorContext, SectionSchema } from "./types";
import { sectionComment, cssAssetTag, wrapWithSchema } from "./utils";

export const generateFeatureMarqueeSection = (
  ctx: SectionGeneratorContext
): SectionOutput | null => {
  const data = ctx.section.data as FeatureMarqueeData;
  if (!data?.items?.length) return null;

  const schema: SectionSchema = {
    name: "Feature Marquee",
    tag: "div",
    class: "dw-section-feature-marquee",
    settings: [
      {
        type: "select",
        id: "speed",
        label: "Animation speed",
        options: [
          { value: "slow", label: "Slow" },
          { value: "normal", label: "Normal" },
          { value: "fast", label: "Fast" },
        ],
        default: data.speed ?? "normal",
      },
    ],
    blocks: [
      {
        type: "feature",
        name: "Feature",
        settings: [
          {
            type: "text",
            id: "label",
            label: "Label",
            default: "Feature",
          },
          {
            type: "text",
            id: "icon",
            label: "Icon name",
            info: "HugeIcons name",
            default: "",
          },
        ],
      },
    ],
    presets: [
      {
        name: "Feature Marquee",
        settings: {
          speed: data.speed ?? "normal",
        },
        blocks: data.items.map((item) => ({
          type: "feature",
          settings: {
            label: item.label,
            icon: item.icon ?? "",
          },
        })),
      },
    ],
  };

  const liquid = `${sectionComment("Feature Marquee")}
${cssAssetTag()}

{% if section.blocks.size > 0 %}
  {% assign speed_duration = '25s' %}
  {% if section.settings.speed == 'slow' %}
    {% assign speed_duration = '40s' %}
  {% elsif section.settings.speed == 'fast' %}
    {% assign speed_duration = '15s' %}
  {% endif %}

  <div class="dw-marquee">
    <div class="dw-marquee-track" style="animation-duration: {{ speed_duration }};">
      {% for i in (1..2) %}
        {% for block in section.blocks %}
          {% if block.type == 'feature' %}
            <span class="dw-marquee-item" {{ block.shopify_attributes }}>
              {% if block.settings.icon != blank %}
                <span class="dw-marquee-icon">{% render 'dw-icon', icon: block.settings.icon %}</span>
              {% endif %}
              {{ block.settings.label }}
            </span>
          {% endif %}
        {% endfor %}
      {% endfor %}
    </div>
  </div>
{% endif %}`;

  return {
    filename: "dw-feature-marquee.liquid",
    liquid: wrapWithSchema(liquid, schema),
    schema,
  };
};
