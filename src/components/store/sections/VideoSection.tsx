import type { VideoData } from "@/types/store-sections";

type Props = { data: VideoData };

export const VideoSection = ({ data }: Props) => {
  const { videoUrl, caption } = data;

  if (!videoUrl) {
    return (
      <section
        className="px-5 py-14 @3xl/store:px-12 @3xl/store:py-20"
        style={{
          background: "var(--store-bg)",
          borderTop: "1px solid color-mix(in srgb, var(--store-text) 5%, transparent)",
        }}
      >
        <div className="mx-auto max-w-4xl">
          <div
            className="flex aspect-video items-center justify-center"
            style={{
              background: "color-mix(in srgb, var(--store-text) 5%, transparent)",
              borderRadius: "var(--store-radius)",
              color: "color-mix(in srgb, var(--store-text) 40%, transparent)",
            }}
          >
            <span className="text-[14px]">No video URL provided</span>
          </div>
        </div>
      </section>
    );
  }

  const isYouTube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
  const isVimeo = videoUrl.includes("vimeo.com");
  const isLoom = videoUrl.includes("loom.com");

  const getEmbedUrl = () => {
    if (isYouTube) {
      const match = videoUrl.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
      return match ? `https://www.youtube.com/embed/${match[1]}` : videoUrl;
    }
    if (isVimeo) {
      const match = videoUrl.match(/vimeo\.com\/(?:video\/)?(\d+)/);
      return match ? `https://player.vimeo.com/video/${match[1]}` : videoUrl;
    }
    if (isLoom) {
      const match = videoUrl.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9]+)/);
      return match ? `https://www.loom.com/embed/${match[1]}` : videoUrl;
    }
    return videoUrl;
  };

  const embedUrl = getEmbedUrl();
  const isEmbed = isYouTube || isVimeo || isLoom;

  return (
    <section
      className="px-5 py-14 @3xl/store:px-12 @3xl/store:py-20"
      style={{
        background: "var(--store-bg)",
        borderTop: "1px solid color-mix(in srgb, var(--store-text) 5%, transparent)",
      }}
    >
      <div className="mx-auto max-w-4xl">
        <div
          className="relative aspect-video overflow-hidden"
          style={{ borderRadius: "var(--store-radius)" }}
        >
          {isEmbed ? (
            <iframe
              src={embedUrl}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Video"
            />
          ) : (
            <video
              src={videoUrl}
              controls
              className="h-full w-full object-cover"
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>
        {caption && (
          <p
            className="mt-4 text-center text-[13px] @3xl/store:text-[14px]"
            style={{ color: "color-mix(in srgb, var(--store-text) 60%, transparent)" }}
          >
            {caption}
          </p>
        )}
      </div>
    </section>
  );
};
