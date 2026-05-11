import Image from "next/image";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PackageDeliveredIcon,
  Store01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { useOnboarding } from "./OnboardingContext";
import type { OnboardingSource } from "./types";

type SourceConfig = {
  id: OnboardingSource;
  title: string;
  blurb: string;
  icon?: typeof PackageDeliveredIcon;
  image?: string;
  tone: string;
};

const SOURCES: SourceConfig[] = [
  {
    id: "supplier",
    title: "Import from supplier",
    blurb: "AliExpress, Amazon, Etsy, TikTok Shop — paste any product link.",
    icon: PackageDeliveredIcon,
    tone: "#00FFCC",
  },
  {
    id: "competitor",
    title: "Import from competitor",
    blurb: "Paste any Shopify store URL — we'll learn from their listing.",
    icon: Store01Icon,
    tone: "#FFB347",
  },
  {
    id: "shopify",
    title: "Connect Shopify",
    blurb: "Install the Dropwiz app on your Shopify store to publish directly.",
    image: "/shopify-logo.png",
    tone: "#95BF47",
  },
];

export const SourceSelectionStep = () => {
  const { data, setSource, goToStep } = useOnboarding();

  const handleSelect = (source: OnboardingSource) => {
    if (source === "shopify") {
      window.open("https://apps.shopify.com/dropwiz-ai", "_blank");
      return;
    }
    setSource(source);
    goToStep("details");
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-4 inline-flex items-center gap-2.5 rounded-full bg-[var(--dw-accent)]/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--dw-accent)]"
      >
        <span className="size-1.5 rounded-full bg-[var(--dw-accent)] animate-pulse" />
        Create Store
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="dw-display text-[36px] text-[var(--dw-text)] md:text-[48px] lg:text-[56px]"
      >
        How do you want to
        <br />
        <span className="dw-gradient-text">get started?</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4 max-w-[520px] text-[15px] leading-relaxed text-[var(--dw-text-muted)]"
      >
        Choose your product source. We&apos;ll handle the scraping, AI copywriting,
        image generation, and build you a complete store.
      </motion.p>

      <div className="mt-10 grid grid-cols-1 gap-4 md:mt-12 md:grid-cols-3">
        {SOURCES.map((source, i) => (
          <SourceCard
            key={source.id}
            source={source}
            selected={data.source === source.id}
            onSelect={() => handleSelect(source.id)}
            index={i}
          />
        ))}
      </div>
    </div>
  );
};

const SourceCard = ({
  source,
  selected,
  onSelect,
  index,
}: {
  source: SourceConfig;
  selected: boolean;
  onSelect: () => void;
  index: number;
}) => {
  const isShopify = source.id === "shopify";

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 + index * 0.075 }}
      type="button"
      onClick={onSelect}
      className={`group relative flex flex-col items-start gap-5 overflow-hidden rounded-2xl border p-6 text-left transition-all duration-300 ${
        selected
          ? "border-[var(--dw-accent)]/50 bg-[var(--dw-surface)] shadow-xl shadow-[var(--dw-accent)]/10"
          : "border-[var(--dw-border)] bg-[var(--dw-surface)] hover:border-[var(--dw-accent)]/30 hover:shadow-xl hover:shadow-black/20"
      }`}
    >
      {selected && (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--dw-accent)]/5 to-transparent" />
      )}
      <div
        className="relative flex size-14 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-105"
        style={{
          background: `linear-gradient(135deg, ${source.tone}18 0%, ${source.tone}08 100%)`,
        }}
      >
        {source.image ? (
          <Image
            src={source.image}
            alt=""
            width={32}
            height={32}
            className="size-8 object-contain"
            unoptimized
          />
        ) : source.icon ? (
          <HugeiconsIcon icon={source.icon} size={26} style={{ color: source.tone }} />
        ) : null}
      </div>
      <div className="relative space-y-2">
        <div className="text-[16px] font-bold tracking-tight text-[var(--dw-text)]">
          {source.title}
        </div>
        <div className="text-[13px] leading-relaxed text-[var(--dw-text-muted)]">
          {source.blurb}
        </div>
      </div>
      <div
        className={`relative mt-auto inline-flex items-center gap-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.1em] transition-all ${
          selected
            ? "text-[var(--dw-accent)]"
            : "text-[var(--dw-text-subtle)] group-hover:text-[var(--dw-accent)]"
        }`}
      >
        {isShopify ? "Install App" : "Choose this"}
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          size={12}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </div>
    </motion.button>
  );
};
