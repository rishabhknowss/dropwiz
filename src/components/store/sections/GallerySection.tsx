import type { GalleryData } from "@/types/store-sections";

export const GallerySection = ({ data }: { data: GalleryData }) => (
  <section className="border-t border-black/5 px-5 py-14 @3xl/store:px-12 @3xl/store:py-20">
    <div className="mx-auto max-w-[1200px]">
      {data.title && (
        <h2 className="mb-7 text-[26px] font-medium tracking-[-0.03em] @3xl/store:mb-10 @3xl/store:text-[36px] @5xl/store:text-[40px]">
          {data.title}
        </h2>
      )}
      <div className="grid grid-cols-2 gap-2.5 @3xl/store:grid-cols-3 @3xl/store:gap-3 @5xl/store:grid-cols-4">
        {data.images.map((img, i) => (
          <figure
            key={i}
            className="relative aspect-square overflow-hidden"
            style={{ borderRadius: "var(--store-radius)" }}
          >
            {img.url ? (
              <img
                src={img.url}
                alt={img.caption ?? ""}
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                className="h-full w-full"
                style={{
                  background:
                    "linear-gradient(135deg, var(--store-accent), var(--store-primary))",
                }}
              />
            )}
            {img.caption && (
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2.5 text-[10.5px] font-medium text-white @3xl/store:p-3 @3xl/store:text-[11px]">
                {img.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </div>
  </section>
);
