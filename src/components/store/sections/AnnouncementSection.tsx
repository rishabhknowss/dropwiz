import type { AnnouncementData } from "@/types/store-sections";

type Props = { data: AnnouncementData };

export const AnnouncementSection = ({ data }: Props) => {
  const variant = data.variant ?? "bar";
  if (variant === "pills") {
    return <AnnouncementPills data={data} />;
  }
  if (variant === "marquee") {
    return <AnnouncementMarquee data={data} />;
  }
  return <AnnouncementBar data={data} />;
};

const AnnouncementBar = ({ data }: Props) => (
  <section
    className="px-4 py-2.5 @3xl/store:py-3"
    style={{
      background: "var(--store-primary)",
      color: "var(--store-bg)",
    }}
  >
    <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-6 gap-y-1.5">
      {data.badges.map((badge, i) => (
        <div
          key={i}
          className="flex items-center gap-1.5 text-[11px] font-medium @3xl/store:text-[12px]"
        >
          {badge.icon && <span className="text-[13px] @3xl/store:text-[14px]">{badge.icon}</span>}
          <span>{badge.text}</span>
        </div>
      ))}
    </div>
  </section>
);

const AnnouncementPills = ({ data }: Props) => (
  <section className="px-4 py-3 @3xl/store:py-4">
    <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-2 @3xl/store:gap-3">
      {data.badges.map((badge, i) => (
        <div
          key={i}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium @3xl/store:px-4 @3xl/store:text-[12px]"
          style={{
            background: "color-mix(in oklab, var(--store-primary) 10%, transparent)",
            color: "var(--store-primary)",
          }}
        >
          {badge.icon && <span className="text-[13px] @3xl/store:text-[14px]">{badge.icon}</span>}
          <span>{badge.text}</span>
        </div>
      ))}
    </div>
  </section>
);

const MarqueeContent = ({ badges }: { badges: AnnouncementData["badges"] }) => (
  <>
    {badges.map((badge, i) => (
      <div
        key={i}
        className="flex shrink-0 items-center gap-2 px-6 text-[12px] font-medium @3xl/store:px-8 @3xl/store:text-[13px]"
      >
        <span className="text-[14px] @3xl/store:text-[15px]">✓</span>
        {badge.icon && <span className="text-[14px] @3xl/store:text-[15px]">{badge.icon}</span>}
        <span>{badge.text}</span>
      </div>
    ))}
  </>
);

const AnnouncementMarquee = ({ data }: Props) => (
  <section
    className="relative overflow-hidden py-2.5 @3xl/store:py-3"
    style={{
      background: "var(--store-primary)",
      color: "var(--store-bg)",
    }}
  >
    <style>{`
      @keyframes marquee-scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .marquee-track {
        animation: marquee-scroll 25s linear infinite;
      }
      .marquee-track:hover {
        animation-play-state: paused;
      }
    `}</style>
    <div className="marquee-track flex w-max">
      <MarqueeContent badges={data.badges} />
      <MarqueeContent badges={data.badges} />
      <MarqueeContent badges={data.badges} />
      <MarqueeContent badges={data.badges} />
    </div>
  </section>
);
