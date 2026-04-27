"use client";
import { DottedMap } from "@/components/ui/dotted-map";
import { HexagonPattern } from "@/components/ui/hexagon-pattern";
import { Marquee } from "@/components/ui/marquee";
import { NumberTicker } from "@/components/ui/number-ticker";
import { RetroGrid } from "@/components/ui/retro-grid";
import { Ripple } from "@/components/ui/ripple";
import { HalfIosMobile } from "./HalfIosMobile";
import { ActivityFeed, DROPWIZ_ACTIVITY } from "./ActivityFeed";

export type VizKind =
  | "winners"
  | "loop"
  | "timer"
  | "sections"
  | "ads"
  | "platforms";

export const FeatureViz = ({ kind }: { kind: VizKind }) => {
  if (kind === "timer") return <GenerationBeam />;
  if (kind === "loop") return <ProductRipple />;
  if (kind === "sections") return <SectionsList />;
  if (kind === "ads") return <AdsList />;
  if (kind === "winners") return <PublishGlobe />;
  if (kind === "platforms") return <LivePreview />;
  return null;
};

const GenerationBeam = () => (
  <div className="relative isolate flex h-[200px] w-full items-center justify-center overflow-hidden px-2">
    <HexagonPattern
      radius={26}
      gap={2}
      className="pointer-events-none absolute inset-0 -z-10 size-full text-[color:var(--dw-text)]/10 [mask-image:radial-gradient(ellipse_at_center,white_10%,transparent_75%)]"
    />
    <div className="relative z-10 flex flex-col items-center gap-2">
      <div className="flex items-baseline gap-1.5">
        <NumberTicker
          value={60}
          startValue={0}
          delay={0.2}
          className="dw-display-sm text-[96px] leading-none tracking-[-0.04em] text-[color:var(--dw-text)]"
        />
        <span className="text-[32px] font-medium tracking-[-0.02em] text-[color:var(--dw-text-dim)]">
          s
        </span>
      </div>
      <div className="dw-mono inline-flex items-center gap-1.5 text-[10px] tracking-[0.16em] uppercase text-[color:var(--dw-accent)]">
        <span className="dw-pulse size-1.5 rounded-full bg-[color:var(--dw-accent)]" />
        Median build time
      </div>
    </div>
  </div>
);

const ProductRipple = () => (
  <div className="relative flex h-[180px] w-full items-center justify-center overflow-hidden">
    <Ripple
      mainCircleSize={140}
      mainCircleOpacity={0.18}
      numCircles={6}
      className="text-[color:var(--dw-accent)]"
    />
    <div className="relative z-10 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fef9c3] via-[#c7ff3d] to-[#84cc16] shadow-[0_20px_40px_-15px_rgba(199,255,61,0.5)]">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <rect x="6" y="3" width="12" height="18" rx="2" stroke="#0a0a0a" strokeWidth="1.4" />
        <path d="M9 7h6M9 11h6M9 15h4" stroke="#0a0a0a" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  </div>
);

const SectionsList = () => (
  <div className="relative h-[200px] w-full overflow-hidden p-3">
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-12 bg-gradient-to-b from-[color:var(--dw-surface)] to-transparent" />
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-gradient-to-t from-[color:var(--dw-surface)] to-transparent" />
    <ActivityFeed events={DROPWIZ_ACTIVITY} interval={1500} visible={4} />
  </div>
);

type AdCreative = {
  id: string;
  headline: string;
  image: string;
};

const AD_CREATIVES: AdCreative[] = [
  {
    id: "skin",
    headline: "Glow up, daily.",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80&auto=format&fit=crop",
  },
  {
    id: "fragrance",
    headline: "Bottle the moment.",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80&auto=format&fit=crop",
  },
  {
    id: "fitness",
    headline: "Built for runners.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80&auto=format&fit=crop",
  },
  {
    id: "supplement",
    headline: "Strength, simplified.",
    image: "https://images.unsplash.com/photo-1579722821273-0f6c1b5d0bda?w=400&q=80&auto=format&fit=crop",
  },
  {
    id: "skincare2",
    headline: "Clean. Quietly.",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80&auto=format&fit=crop",
  },
  {
    id: "drink",
    headline: "Hydrate without the sugar.",
    image: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=400&q=80&auto=format&fit=crop",
  },
];

const AdCard = ({ creative }: { creative: AdCreative }) => (
  <div
    className="relative shrink-0 overflow-hidden rounded-[12px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface2)]"
    style={{ width: "140px", aspectRatio: "4 / 5" }}
  >
    <img
      src={creative.image}
      alt=""
      className="h-full w-full object-cover"
      loading="lazy"
    />
  </div>
);

const AdsList = () => {
  const half = Math.ceil(AD_CREATIVES.length / 2);
  const row1 = AD_CREATIVES.slice(0, half);
  const row2 = AD_CREATIVES.slice(half);

  return (
    <div className="relative flex h-[260px] w-full flex-col justify-center gap-2 overflow-hidden">
      <Marquee className="[--duration:32s] [--gap:0.75rem]" pauseOnHover>
        {row1.map((c) => (
          <AdCard key={c.id} creative={c} />
        ))}
      </Marquee>
      <Marquee
        reverse
        className="[--duration:38s] [--gap:0.75rem]"
        pauseOnHover
      >
        {row2.map((c) => (
          <AdCard key={c.id} creative={c} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[color:var(--dw-surface)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[color:var(--dw-surface)] to-transparent" />
    </div>
  );
};

const COMMERCE_HUBS = [
  { lat: 40.7128, lng: -74.006, size: 1.2, pulse: true },
  { lat: 51.5074, lng: -0.1278, size: 1.1, pulse: true },
  { lat: 48.8566, lng: 2.3522, size: 0.9, pulse: false },
  { lat: 52.52, lng: 13.405, size: 0.9, pulse: false },
  { lat: 35.6762, lng: 139.6503, size: 1.1, pulse: true },
  { lat: 22.3193, lng: 114.1694, size: 0.9, pulse: false },
  { lat: 19.076, lng: 72.8777, size: 1.1, pulse: true },
  { lat: -33.8688, lng: 151.2093, size: 0.9, pulse: false },
  { lat: 37.7749, lng: -122.4194, size: 1.1, pulse: true },
  { lat: -23.5505, lng: -46.6333, size: 0.9, pulse: false },
  { lat: 25.2048, lng: 55.2708, size: 0.85, pulse: false },
  { lat: 1.3521, lng: 103.8198, size: 0.85, pulse: false },
];

const PublishGlobe = () => (
  <div className="relative flex h-[320px] w-full items-center justify-center overflow-hidden">
    <DottedMap
      width={300}
      height={150}
      mapSamples={18000}
      dotRadius={0.18}
      markers={COMMERCE_HUBS}
      dotColor="color-mix(in oklab, var(--dw-text) 38%, transparent)"
      markerColor="var(--dw-accent)"
      pulse
      className="h-auto w-full max-w-[820px] text-[color:var(--dw-text)]"
    />
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,var(--dw-surface)_100%)]" />
    <div className="absolute right-4 top-4 z-10">
      <div className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--dw-surface2)] px-2.5 py-1 ring-1 ring-[color:var(--dw-border)]">
        <span className="dw-pulse size-1.5 rounded-full bg-[color:var(--dw-accent)]" />
        <span className="dw-mono text-[9px] tracking-[0.12em] uppercase text-[color:var(--dw-text)]">
          Shopify · Live
        </span>
      </div>
    </div>
  </div>
);

const LivePreview = () => (
  <div className="relative h-[260px] w-full overflow-hidden">
    <RetroGrid angle={60} className="opacity-25" />
    <HalfIosMobile />
  </div>
);
