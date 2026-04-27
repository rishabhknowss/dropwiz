import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  MagicWand01Icon,
  Target02Icon,
  SearchVisualIcon,
  PlayIcon,
} from "@hugeicons/core-free-icons";
import { DWTopNav } from "@/components/dw/TopNav";
import { DWChip } from "@/components/dw/Chip";

const ENTRIES = [
  {
    title: "Build a store",
    desc: "Paste a product URL. Dropwiz generates a full store in 60 seconds.",
    icon: MagicWand01Icon,
    href: "/build/new",
    available: true,
  },
  {
    title: "Find winning products",
    desc: "Curated feed of trending products across TikTok, Amazon, AliExpress.",
    icon: Target02Icon,
    href: "/app/find",
    available: false,
  },
  {
    title: "Spy on a competitor",
    desc: "Paste a Shopify URL to see products, ads, and estimated revenue.",
    icon: SearchVisualIcon,
    href: "#",
    available: false,
  },
  {
    title: "Browse ad library",
    desc: "Scroll-stopping Meta and TikTok ads in the dropshipping space.",
    icon: PlayIcon,
    href: "#",
    available: false,
  },
];

const BuildEntry = () => {
  return (
    <div className="min-h-screen bg-[color:var(--dw-bg)] text-[color:var(--dw-text)]">
      <DWTopNav active="Product" />
      <main className="mx-auto max-w-[1100px] px-5 py-10 md:px-8 md:py-14 lg:px-10 lg:py-16">
        <h1 className="dw-display-sm max-w-[800px] text-[32px] md:text-[40px] lg:text-[48px]">
          What do you want to do
          <span className="text-[color:var(--dw-accent)]">?</span>
        </h1>
        <p className="mt-3 max-w-[560px] text-[14px] text-[color:var(--dw-text-dim)] md:text-[15px]">
          Pick a starting point. You can always come back and try another.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 md:mt-12 md:grid-cols-2">
          {ENTRIES.map((entry) => {
            const Inner = (
              <div
                className={`flex h-full flex-col rounded-[20px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-7 transition ${
                  entry.available
                    ? "hover:border-[color:var(--dw-accent)]/40"
                    : "opacity-50"
                }`}
              >
                <div className="mb-6 flex items-start justify-between">
                  <div className="flex size-10 items-center justify-center rounded-[10px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface2)] text-[color:var(--dw-accent)]">
                    <HugeiconsIcon icon={entry.icon} size={18} />
                  </div>
                  {!entry.available && <DWChip variant="neutral">Coming v2</DWChip>}
                </div>
                <div className="text-[19px] font-medium tracking-[-0.02em]">
                  {entry.title}
                </div>
                <div className="mt-2 text-[14px] leading-[1.5] text-[color:var(--dw-text-dim)]">
                  {entry.desc}
                </div>
                {entry.available && (
                  <div className="dw-mono mt-auto flex items-center gap-1.5 pt-6 text-[11px] tracking-[0.14em] uppercase text-[color:var(--dw-accent)]">
                    Start
                    <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
                  </div>
                )}
              </div>
            );
            return entry.available ? (
              <Link key={entry.title} href={entry.href}>
                {Inner}
              </Link>
            ) : (
              <div key={entry.title}>{Inner}</div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default BuildEntry;
