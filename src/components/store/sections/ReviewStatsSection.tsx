import type { ReviewStatsData } from "@/types/store-sections";
import { cn } from "@/lib/utils";

type Props = { data: ReviewStatsData };

export const ReviewStatsSection = ({ data }: Props) => {
  const showStars = data.showStars ?? true;

  return (
    <section className="border-t border-black/5 px-5 py-4 @3xl/store:px-12 @3xl/store:py-5">
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-center gap-3 @3xl/store:gap-4">
        {showStars && (
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={cn(
                  "text-[16px] @3xl/store:text-[18px]",
                  star <= Math.round(data.rating) ? "text-amber-400" : "text-black/15"
                )}
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
