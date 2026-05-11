import type { FeatureMarqueeData } from "@/types/store-sections";
import { StoreIcon } from "@/components/editor/inspectors/fields/IconPickerField";

type Props = { data: FeatureMarqueeData };

const MarqueeContent = ({ items }: { items: FeatureMarqueeData["items"] }) => (
  <>
    {items.map((item, i) => (
      <div
        key={i}
        className="flex shrink-0 items-center gap-2 px-6 text-[12px] font-medium @3xl/store:px-8 @3xl/store:text-[13px]"
      >
        <StoreIcon name={item.icon || "CheckmarkCircle01Icon"} size={15} className="@3xl/store:!h-[16px] @3xl/store:!w-[16px]" />
        <span>{item.label}</span>
      </div>
    ))}
  </>
);

export const FeatureMarqueeSection = ({ data }: Props) => {
  const speed = data.speed ?? "normal";
  const duration = speed === "slow" ? "50s" : speed === "fast" ? "15s" : "25s";

  return (
    <section
      className="relative overflow-hidden border-y py-2.5 @3xl/store:py-3"
      style={{
        borderColor: "color-mix(in srgb, var(--store-text) 6%, transparent)",
        background: "var(--store-primary)",
        color: "var(--store-bg)",
      }}
    >
      <style>{`
        @keyframes feature-marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .feature-marquee-track {
          animation: feature-marquee-scroll ${duration} linear infinite;
        }
        .feature-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="feature-marquee-track flex w-max">
        <MarqueeContent items={data.items} />
        <MarqueeContent items={data.items} />
        <MarqueeContent items={data.items} />
        <MarqueeContent items={data.items} />
      </div>
    </section>
  );
};
