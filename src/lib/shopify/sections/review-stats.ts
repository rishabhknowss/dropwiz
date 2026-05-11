import type { ReviewStatsData } from "@/types/store-sections";
import type { SectionOutput, SectionGeneratorContext, SectionSchema } from "./types";
import { sectionComment, cssAssetTag, wrapWithSchema } from "./utils";

export const generateReviewStatsSection = (
  ctx: SectionGeneratorContext
): SectionOutput | null => {
  const data = ctx.section.data as ReviewStatsData;
  if (!data) return null;

  const schema: SectionSchema = {
    name: "Review Stats",
    tag: "div",
    class: "dw-section-review-stats",
    settings: [
      {
        type: "range",
        id: "rating",
        label: "Rating",
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
        type: "select",
        id: "source",
        label: "Review source",
        options: [
          { value: "customers", label: "Customers" },
          { value: "trustpilot", label: "Trustpilot" },
          { value: "google", label: "Google" },
          { value: "judgeme", label: "Judge.me" },
          { value: "loox", label: "Loox" },
        ],
        default: data.source ?? "customers",
      },
      {
        type: "checkbox",
        id: "show_stars",
        label: "Show stars",
        default: data.showStars !== false,
      },
    ],
    presets: [
      {
        name: "Review Stats",
        settings: {
          rating: data.rating ?? 4.8,
          review_count: data.reviewCount ?? 0,
          source: data.source ?? "customers",
          show_stars: data.showStars !== false,
        },
      },
    ],
  };

  const liquid = `${sectionComment("Review Stats")}
${cssAssetTag()}

{% assign source_labels = 'customers:customers,trustpilot:Trustpilot,google:Google,judgeme:Judge.me,loox:Loox' | split: ',' %}
{% assign source_label = 'customers' %}
{% for pair in source_labels %}
  {% assign parts = pair | split: ':' %}
  {% if parts[0] == section.settings.source %}
    {% assign source_label = parts[1] %}
  {% endif %}
{% endfor %}

<div class="dw-review-stats">
  {% if section.settings.show_stars %}
    <span class="dw-review-stars">
      {% assign full_stars = section.settings.rating | floor %}
      {% for i in (1..5) %}
        {% if i <= full_stars %}★{% else %}<span class="dw-stars-faded">★</span>{% endif %}
      {% endfor %}
    </span>
  {% endif %}
  <span class="dw-review-text">
    {{ section.settings.rating }}/5 from {{ section.settings.review_count }}+ {{ source_label }}
  </span>
</div>`;

  return {
    filename: "dw-review-stats.liquid",
    liquid: wrapWithSchema(liquid, schema),
    schema,
  };
};
