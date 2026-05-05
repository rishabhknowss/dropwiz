import type { FeatureMarqueeData } from "@/types/store-sections";

type Props = { data: FeatureMarqueeData };

export const FeatureMarqueeSection = ({ data }: Props) => {
  const items = [...data.items, ...data.items];
  const speed = data.speed ?? "normal";
  const duration = speed === "slow" ? "60s" : speed === "fast" ? "20s" : "40s";

  return (
    <section
      className="overflow-hidden border-y py-3 @3xl/store:py-4"
      style={{ borderColor: "rgba(10,10,10,0.06)" }}
    >
      <div
        className="flex gap-6 whitespace-nowrap @3xl/store:gap-8"
        style={{
          animation: `dw-marquee ${duration} linear infinite`,
          width: "fit-content",
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            className="flex shrink-0 items-center gap-2 text-[12px] font-medium @3xl/store:gap-2.5 @3xl/store:text-[13px]"
          >
            <span className="text-[14px] @3xl/store:text-[16px]">{item.icon}</span>
            <span style={{ color: "var(--store-text)" }}>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
