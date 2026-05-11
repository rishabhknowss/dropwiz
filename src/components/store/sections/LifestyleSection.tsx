import type { LifestyleData } from "@/types/store-sections";
import { StoreIcon } from "@/components/editor/inspectors/fields/IconPickerField";

const SplitVariant = ({ data }: { data: LifestyleData }) => {
  const imageOnRight = (data.imagePosition ?? "right") === "right";
  return (
    <div
      className={`mx-auto grid max-w-[1100px] grid-cols-1 items-center gap-7 @3xl/store:grid-cols-2 @3xl/store:gap-10 ${
        imageOnRight ? "" : "@3xl/store:[direction:rtl]"
      }`}
    >
      <div className="@3xl/store:[direction:ltr]">
        <h2 className="text-[26px] font-medium leading-[1.1] tracking-[-0.03em] @3xl/store:text-[36px] @5xl/store:text-[44px]">
          {data.headline}
        </h2>
        <p className="mt-4 text-[14.5px] leading-[1.55] opacity-75 @3xl/store:mt-5 @3xl/store:text-[16px]">
          {data.body}
        </p>
      </div>
      <div
        data-img-styled
        className="overflow-hidden @3xl/store:[direction:ltr]"
        style={{
          borderRadius: "var(--store-radius)",
          aspectRatio: "4 / 5",
        }}
      >
        {data.imageUrl ? (
          <img
            src={data.imageUrl}
            alt=""
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
      </div>
    </div>
  );
};

const CircularVariant = ({ data }: { data: LifestyleData }) => {
  const features = data.features ?? [
    { icon: "SparklesIcon", label: "Premium Quality" },
    { icon: "HeartCheckIcon", label: "Customer Loved" },
    { icon: "StarIcon", label: "Top Rated" },
    { icon: "ZapIcon", label: "Fast Results" },
  ];

  return (
    <div className="mx-auto max-w-[1100px]">
      <div className="mb-8 text-center @3xl/store:mb-12">
        <h2 className="text-[26px] font-medium leading-[1.1] tracking-[-0.03em] @3xl/store:text-[36px] @5xl/store:text-[44px]">
          {data.headline}
        </h2>
        <p className="mx-auto mt-4 max-w-[600px] text-[14.5px] leading-[1.55] opacity-75 @3xl/store:mt-5 @3xl/store:text-[16px]">
          {data.body}
        </p>
      </div>

      <div className="relative flex flex-col items-center gap-6 @3xl/store:flex-row @3xl/store:justify-center @3xl/store:gap-0">
        <div className="grid grid-cols-2 gap-3 @3xl/store:absolute @3xl/store:left-0 @3xl/store:top-1/2 @3xl/store:w-[180px] @3xl/store:-translate-y-1/2 @3xl/store:grid-cols-1 @3xl/store:gap-4">
          {features.slice(0, 2).map((feature, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 rounded-xl p-3 @3xl/store:gap-3 @3xl/store:p-4"
              style={{ background: "color-mix(in srgb, var(--store-text) 5%, transparent)" }}
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg @3xl/store:h-10 @3xl/store:w-10"
                style={{ background: "var(--store-accent)", color: "var(--store-bg)" }}
              >
                <StoreIcon name={feature.icon} size={18} className="@3xl/store:!h-5 @3xl/store:!w-5" />
              </div>
              <span className="text-[12px] font-medium leading-tight @3xl/store:text-[13px]">
                {feature.label}
              </span>
            </div>
          ))}
        </div>

        <div
          className="relative mx-auto aspect-square w-[220px] overflow-hidden @3xl/store:mx-16 @3xl/store:w-[280px] @5xl/store:w-[320px]"
          style={{ borderRadius: "50%" }}
        >
          {data.imageUrl ? (
            <img
              src={data.imageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className="h-full w-full"
              style={{
                background: "linear-gradient(135deg, var(--store-accent), var(--store-primary))",
              }}
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 @3xl/store:absolute @3xl/store:right-0 @3xl/store:top-1/2 @3xl/store:w-[180px] @3xl/store:-translate-y-1/2 @3xl/store:grid-cols-1 @3xl/store:gap-4">
          {features.slice(2, 4).map((feature, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 rounded-xl p-3 @3xl/store:gap-3 @3xl/store:p-4"
              style={{ background: "color-mix(in srgb, var(--store-text) 5%, transparent)" }}
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg @3xl/store:h-10 @3xl/store:w-10"
                style={{ background: "var(--store-accent)", color: "var(--store-bg)" }}
              >
                <StoreIcon name={feature.icon} size={18} className="@3xl/store:!h-5 @3xl/store:!w-5" />
              </div>
              <span className="text-[12px] font-medium leading-tight @3xl/store:text-[13px]">
                {feature.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const LifestyleSection = ({ data }: { data: LifestyleData }) => {
  const variant = data.variant ?? "split";

  return (
    <section
      className="px-5 py-14 @3xl/store:px-12 @3xl/store:py-20"
      style={{ borderTop: "1px solid color-mix(in srgb, var(--store-text) 5%, transparent)" }}
    >
      {variant === "circular" ? (
        <CircularVariant data={data} />
      ) : (
        <SplitVariant data={data} />
      )}
    </section>
  );
};
