import type { AnnouncementData } from "@/types/store-sections";
import type { SectionOutput, SectionGeneratorContext, SectionSchema } from "./types";
import { sectionComment, cssAssetTag, wrapWithSchema, getIconSvg } from "./utils";

export const generateAnnouncementSection = (
  ctx: SectionGeneratorContext
): SectionOutput | null => {
  const data = ctx.section.data as AnnouncementData;
  if (!data?.badges?.length) return null;

  const schema: SectionSchema = {
    name: "Announcement",
    tag: "div",
    class: "dw-section-announcement",
    settings: [
      {
        type: "select",
        id: "variant",
        label: "Layout style",
        options: [
          { value: "bar", label: "Bar" },
          { value: "pills", label: "Pills" },
          { value: "marquee", label: "Scrolling marquee" },
        ],
        default: data.variant ?? "bar",
      },
    ],
    blocks: [
      {
        type: "badge",
        name: "Badge",
        settings: [
          {
            type: "text",
            id: "text",
            label: "Text",
            default: "Free Shipping",
          },
          {
            type: "text",
            id: "icon",
            label: "Icon name",
            info: "HugeIcons name (e.g., TruckDeliveryIcon)",
            default: "",
          },
        ],
      },
    ],
    presets: [
      {
        name: "Announcement",
        settings: {
          variant: data.variant ?? "bar",
        },
        blocks: data.badges.map((b) => ({
          type: "badge",
          settings: {
            text: b.text,
            icon: b.icon ?? "",
          },
        })),
      },
    ],
  };

  const liquid = `${sectionComment("Announcement")}
${cssAssetTag()}

{% if section.blocks.size > 0 %}
  {% case section.settings.variant %}
    {% when 'marquee' %}
      <div class="dw-marquee">
        <div class="dw-marquee-track">
          {% for i in (1..4) %}
            {% for block in section.blocks %}
              {% if block.type == 'badge' %}
                <span class="dw-marquee-item" {{ block.shopify_attributes }}>
                  {% if block.settings.icon != blank %}
                    <span class="dw-marquee-icon">{% render 'dw-icon', icon: block.settings.icon %}</span>
                  {% endif %}
                  {{ block.settings.text }}
                </span>
              {% endif %}
            {% endfor %}
          {% endfor %}
        </div>
      </div>

    {% when 'pills' %}
      <div class="dw-announcement-pills">
        {% for block in section.blocks %}
          {% if block.type == 'badge' %}
            <span class="dw-announcement-pill" {{ block.shopify_attributes }}>
              {% if block.settings.icon != blank %}
                <span class="dw-announcement-icon">{% render 'dw-icon', icon: block.settings.icon %}</span>
              {% endif %}
              {{ block.settings.text }}
            </span>
          {% endif %}
        {% endfor %}
      </div>

    {% else %}
      {%- comment -%} Default: bar {%- endcomment -%}
      <div class="dw-announcement">
        {% for block in section.blocks %}
          {% if block.type == 'badge' %}
            <span class="dw-announcement-item" {{ block.shopify_attributes }}>
              {% if block.settings.icon != blank %}
                <span class="dw-announcement-icon">{% render 'dw-icon', icon: block.settings.icon %}</span>
              {% endif %}
              {{ block.settings.text }}
            </span>
          {% endif %}
        {% endfor %}
      </div>
  {% endcase %}
{% endif %}`;

  return {
    filename: "dw-announcement.liquid",
    liquid: wrapWithSchema(liquid, schema),
    schema,
  };
};
