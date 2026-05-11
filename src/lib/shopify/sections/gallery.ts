import type { GalleryData } from "@/types/store-sections";
import type { SectionOutput, SectionGeneratorContext, SectionSchema } from "./types";
import { sectionComment, cssAssetTag, wrapWithSchema } from "./utils";

export const generateGallerySection = (
  ctx: SectionGeneratorContext
): SectionOutput | null => {
  const data = ctx.section.data as GalleryData;
  if (!data?.images?.length) return null;

  const schema: SectionSchema = {
    name: "Gallery",
    tag: "section",
    class: "dw-section-gallery",
    settings: [
      {
        type: "text",
        id: "title",
        label: "Section title",
        default: data.title ?? "",
      },
    ],
    blocks: [
      {
        type: "image",
        name: "Image",
        settings: [
          {
            type: "image_picker",
            id: "image",
            label: "Image",
          },
          {
            type: "text",
            id: "caption",
            label: "Caption",
            default: "",
          },
        ],
      },
    ],
    presets: [
      {
        name: "Gallery",
        settings: {
          title: data.title ?? "",
        },
        blocks: data.images.map((img) => ({
          type: "image",
          settings: {
            caption: img.caption ?? "",
          },
        })),
      },
    ],
  };

  const liquid = `${sectionComment("Gallery")}
${cssAssetTag()}

{% if section.blocks.size > 0 %}
  <section class="dw-section">
    <div class="dw-container">
      {% if section.settings.title != blank %}
        <h2 class="dw-h2">{{ section.settings.title }}</h2>
      {% endif %}
      <div class="dw-gallery-grid">
        {% for block in section.blocks %}
          {% if block.type == 'image' %}
            <figure class="dw-gallery-item" {{ block.shopify_attributes }}>
              {% if block.settings.image != blank %}
                {{ block.settings.image | image_url: width: 600 | image_tag }}
              {% else %}
                <div class="dw-gradient"></div>
              {% endif %}
              {% if block.settings.caption != blank %}
                <figcaption>{{ block.settings.caption }}</figcaption>
              {% endif %}
            </figure>
          {% endif %}
        {% endfor %}
      </div>
    </div>
  </section>
{% endif %}`;

  return {
    filename: "dw-gallery.liquid",
    liquid: wrapWithSchema(liquid, schema),
    schema,
  };
};
