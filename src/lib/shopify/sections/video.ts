import type { VideoData } from "@/types/store-sections";
import type { SectionOutput, SectionGeneratorContext, SectionSchema } from "./types";
import { sectionComment, cssAssetTag, wrapWithSchema } from "./utils";

export const generateVideoSection = (
  ctx: SectionGeneratorContext
): SectionOutput | null => {
  const data = ctx.section.data as VideoData;
  if (!data?.videoUrl) return null;

  const schema: SectionSchema = {
    name: "Video",
    tag: "section",
    class: "dw-section-video",
    settings: [
      {
        type: "video_url",
        id: "video_url",
        label: "Video URL",
        info: "YouTube, Vimeo, or Loom URL",
        default: data.videoUrl,
      },
      {
        type: "text",
        id: "caption",
        label: "Caption",
        default: data.caption ?? "",
      },
    ],
    presets: [
      {
        name: "Video",
        settings: {
          video_url: data.videoUrl,
          caption: data.caption ?? "",
        },
      },
    ],
  };

  const liquid = `${sectionComment("Video")}
${cssAssetTag()}

{% if section.settings.video_url != blank %}
  <section class="dw-section dw-video-section">
    <div class="dw-container-narrow">
      <div class="dw-video-wrap">
        {% assign video_url = section.settings.video_url %}
        {% assign is_youtube = false %}
        {% assign is_vimeo = false %}

        {% if video_url contains 'youtube.com' or video_url contains 'youtu.be' %}
          {% assign is_youtube = true %}
          {% if video_url contains 'watch?v=' %}
            {% assign video_id = video_url | split: 'watch?v=' | last | split: '&' | first %}
          {% elsif video_url contains 'youtu.be/' %}
            {% assign video_id = video_url | split: 'youtu.be/' | last | split: '?' | first %}
          {% elsif video_url contains 'embed/' %}
            {% assign video_id = video_url | split: 'embed/' | last | split: '?' | first %}
          {% endif %}
        {% elsif video_url contains 'vimeo.com' %}
          {% assign is_vimeo = true %}
          {% assign video_id = video_url | split: 'vimeo.com/' | last | split: '?' | first | split: '/' | last %}
        {% endif %}

        {% if is_youtube and video_id %}
          <iframe
            src="https://www.youtube.com/embed/{{ video_id }}"
            class="dw-video-iframe"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            title="Video"
          ></iframe>
        {% elsif is_vimeo and video_id %}
          <iframe
            src="https://player.vimeo.com/video/{{ video_id }}"
            class="dw-video-iframe"
            allow="autoplay; fullscreen; picture-in-picture"
            allowfullscreen
            title="Video"
          ></iframe>
        {% else %}
          <video src="{{ video_url }}" controls class="dw-video-native">
            Your browser does not support the video tag.
          </video>
        {% endif %}
      </div>
      {% if section.settings.caption != blank %}
        <p class="dw-video-caption">{{ section.settings.caption }}</p>
      {% endif %}
    </div>
  </section>
{% endif %}`;

  return {
    filename: "dw-video.liquid",
    liquid: wrapWithSchema(liquid, schema),
    schema,
  };
};
