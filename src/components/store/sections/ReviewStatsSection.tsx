import type { ReviewStatsData } from "@/types/store-sections";
import { cn } from "@/lib/utils";

type Props = { data: ReviewStatsData };

export const ReviewStatsSection = ({ data }: Props) => {
  const showStars = data.showStars ?? true;

  return (
    <section
      className="px-5 py-4 @3xl/store:px-12 @3xl/store:py-5"
      style={{ borderTop: "1px solid color-mix(in srgb, var(--store-text) 5%, transparent)" }}
    >
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-center gap-3 @3xl/store:gap-4">
        {showStars && (
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className="text-[16px] @3xl/store:text-[18px]"
                style={{
                  color: star <= Math.round(data.rating) ? "#fbbf24" : "color-mix(in srgb, var(--store-text) 15%, transparent)"
                }}
              >
                ★
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 text-[13px] @3xl/store:text-[14px]">
          <span className="font-semibold">{data.rating.toFixed(1)}/5</span>
          <span className="opacity-60">
            based on {data.reviewCount.toLocaleString()}+ reviews
          </span>
        </div>
        {data.source && (
          <div className="flex items-center gap-1.5">
            <img
              src={`/trust/${data.source.toLowerCase()}.svg`}
              alt={data.source}
              className="h-4 w-auto @3xl/store:h-5"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
};
