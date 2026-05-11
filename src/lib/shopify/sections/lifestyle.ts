import type { LifestyleData } from "@/types/store-sections";
import type { SectionOutput, SectionGeneratorContext, SectionSchema } from "./types";
import { sectionComment, cssAssetTag, wrapWithSchema, getIconSvg } from "./utils";

export const generateLifestyleSection = (
  ctx: SectionGeneratorContext
): SectionOutput | null => {
  const data = ctx.section.data as LifestyleData;
  if (!data) return null;

  const variant = data.variant ?? "split";
  const features = data.features ?? [];

  const featureBlocks = features.map((f, i) => ({
    type: "feature",
    settings: {
      icon_svg: getIconSvg(f.icon, "20"),
      label: f.label,
    },
  }));

  const schema: SectionSchema = {
    name: "Lifestyle",
    tag: "section",
    class: "dw-section-lifestyle",
    settings: [
      {
        type: "select",
        id: "variant",
        label: "Layout style",
        options: [
          { value: "split", label: "Split" },
          { value: "circular", label: "Circular with badges" },
          { value: "full", label: "Full width" },
        ],
        default: variant,
      },
      {
        type: "text",
        id: "headline",
        label: "Headline",
        default: data.headline ?? "Experience the Difference",
      },
      {
        type: "textarea",
        id: "body",
        label: "Body text",
        default: data.body ?? "",
      },
      {
        type: "image_picker",
        id: "image",
        label: "Image",
      },
      {
        type: "select",
        id: "image_position",
        label: "Image position",
        options: [
          { value: "right", label: "Right" },
          { value: "left", label: "Left" },
        ],
        default: data.imagePosition ?? "right",
      },
    ],
    blocks: [
      {
        type: "feature",
        name: "Feature badge",
        limit: 4,
        settings: [
          {
            type: "html",
            id: "icon_svg",
            label: "Icon SVG",
          },
          {
            type: "text",
            id: "label",
            label: "Label",
            default: "Feature",
          },
        ],
      },
    ],
    presets: [
      {
        name: "Lifestyle",
        settings: {
          variant: variant,
          headline: data.headline ?? "Experience the Difference",
          body: data.body ?? "",
          image_position: data.imagePosition ?? "right",
        },
        blocks: featureBlocks,
      },
    ],
  };

  const liquid = `${sectionComment("Lifestyle")}
${cssAssetTag()}

<style>
  .dw-lifestyle { padding: 56px 20px; border-top: 1px solid rgba(var(--dw-text-rgb), 0.05); }
  @media (min-width: 900px) { .dw-lifestyle { padding: 80px 48px; } }

  .dw-lifestyle-split { display: grid; grid-template-columns: 1fr; gap: 28px; max-width: 1100px; margin: 0 auto; align-items: center; }
  @media (min-width: 900px) { .dw-lifestyle-split { grid-template-columns: 1fr 1fr; gap: 40px; } }
  .dw-lifestyle-split.dw-reverse { direction: rtl; }
  .dw-lifestyle-split.dw-reverse > * { direction: ltr; }

  .dw-lifestyle-circular { max-width: 1100px; margin: 0 auto; }
  .dw-lifestyle-circular-header { text-align: center; margin-bottom: 32px; }
  @media (min-width: 900px) { .dw-lifestyle-circular-header { margin-bottom: 48px; } }
  .dw-lifestyle-circular-content { display: flex; flex-direction: column; align-items: center; gap: 24px; position: relative; }
  @media (min-width: 900px) { .dw-lifestyle-circular-content { flex-direction: row; justify-content: center; gap: 0; } }

  .dw-lifestyle-badges { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
  @media (min-width: 900px) {
    .dw-lifestyle-badges { position: absolute; top: 50%; transform: translateY(-50%); width: 180px; grid-template-columns: 1fr; gap: 16px; }
    .dw-lifestyle-badges-left { left: 0; }
    .dw-lifestyle-badges-right { right: 0; }
  }

  .dw-lifestyle-badge { display: flex; align-items: center; gap: 10px; padding: 12px; border-radius: 12px; background: rgba(var(--dw-text-rgb), 0.05); }
  @media (min-width: 900px) { .dw-lifestyle-badge { gap: 12px; padding: 16px; } }
  .dw-lifestyle-badge-icon { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 8px; background: var(--dw-accent); color: var(--dw-bg); flex-shrink: 0; }
  @media (min-width: 900px) { .dw-lifestyle-badge-icon { width: 40px; height: 40px; } }
  .dw-lifestyle-badge-icon svg { width: 18px; height: 18px; }
  @media (min-width: 900px) { .dw-lifestyle-badge-icon svg { width: 20px; height: 20px; } }
  .dw-lifestyle-badge-label { font-size: 12px; font-weight: 500; line-height: 1.3; }
  @media (min-width: 900px) { .dw-lifestyle-badge-label { font-size: 13px; } }

  .dw-lifestyle-circle-img { width: 220px; height: 220px; border-radius: 50%; overflow: hidden; flex-shrink: 0; }
  @media (min-width: 900px) { .dw-lifestyle-circle-img { width: 280px; height: 280px; margin: 0 64px; } }
  @media (min-width: 1200px) { .dw-lifestyle-circle-img { width: 320px; height: 320px; } }
  .dw-lifestyle-circle-img img { width: 100%; height: 100%; object-fit: cover; }

  .dw-lifestyle-rect-img { border-radius: var(--dw-radius); overflow: hidden; aspect-ratio: 4/5; }
  .dw-lifestyle-rect-img img { width: 100%; height: 100%; object-fit: cover; }
  .dw-lifestyle-rect-img .dw-gradient { width: 100%; height: 100%; background: linear-gradient(135deg, var(--dw-accent), var(--dw-primary)); }

  .dw-lifestyle h2 { font-size: 26px; font-weight: 500; line-height: 1.1; letter-spacing: -0.03em; }
  @media (min-width: 900px) { .dw-lifestyle h2 { font-size: 36px; } }
  @media (min-width: 1200px) { .dw-lifestyle h2 { font-size: 44px; } }
  .dw-lifestyle .dw-body { margin-top: 16px; font-size: 14.5px; line-height: 1.55; opacity: 0.75; }
  @media (min-width: 900px) { .dw-lifestyle .dw-body { margin-top: 20px; font-size: 16px; } }
  .dw-lifestyle-circular-header .dw-body { max-width: 600px; margin-left: auto; margin-right: auto; }
</style>

<section class="dw-lifestyle">
  {%- if section.settings.variant == 'circular' -%}
    <div class="dw-lifestyle-circular">
      <div class="dw-lifestyle-circular-header">
        <h2>{{ section.settings.headline }}</h2>
        {%- if section.settings.body != blank -%}
          <p class="dw-body">{{ section.settings.body }}</p>
        {%- endif -%}
      </div>

      <div class="dw-lifestyle-circular-content">
        {%- assign left_badges = '' -%}
        {%- assign right_badges = '' -%}
        {%- assign badge_index = 0 -%}
        {%- for block in section.blocks -%}
          {%- if block.type == 'feature' -%}
            {%- capture badge_html -%}
              <div class="dw-lifestyle-badge" {{ block.shopify_attributes }}>
                <div class="dw-lifestyle-badge-icon">{{ block.settings.icon_svg }}</div>
                <span class="dw-lifestyle-badge-label">{{ block.settings.label }}</span>
              </div>
            {%- endcapture -%}
            {%- if badge_index < 2 -%}
              {%- assign left_badges = left_badges | append: badge_html -%}
            {%- else -%}
              {%- assign right_badges = right_badges | append: badge_html -%}
            {%- endif -%}
            {%- assign badge_index = badge_index | plus: 1 -%}
          {%- endif -%}
        {%- endfor -%}

        <div class="dw-lifestyle-badges dw-lifestyle-badges-left">{{ left_badges }}</div>

        <div class="dw-lifestyle-circle-img">
          {%- if section.settings.image != blank -%}
            {{ section.settings.image | image_url: width: 640 | image_tag }}
          {%- else -%}
            <div class="dw-gradient" style="width:100%;height:100%;background:linear-gradient(135deg,var(--dw-accent),var(--dw-primary));"></div>
          {%- endif -%}
        </div>

        <div class="dw-lifestyle-badges dw-lifestyle-badges-right">{{ right_badges }}</div>
      </div>
    </div>
  {%- else -%}
    <div class="dw-lifestyle-split {% if section.settings.image_position == 'left' %}dw-reverse{% endif %}">
      <div>
        <h2>{{ section.settings.headline }}</h2>
        {%- if section.settings.body != blank -%}
          <p class="dw-body">{{ section.settings.body }}</p>
        {%- endif -%}
      </div>
      <div class="dw-lifestyle-rect-img">
        {%- if section.settings.image != blank -%}
          {{ section.settings.image | image_url: width: 800 | image_tag }}
        {%- else -%}
          <div class="dw-gradient"></div>
        {%- endif -%}
      </div>
    </div>
  {%- endif -%}
</section>`;

  return {
    filename: "dw-lifestyle.liquid",
    liquid: wrapWithSchema(liquid, schema),
    schema,
  };
};
