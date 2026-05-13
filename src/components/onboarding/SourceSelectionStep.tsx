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
  subtitle: string;
  blurb: string;
  icon?: typeof PackageDeliveredIcon;
  image?: string;
  color: string;
  bgColor: string;
};

const SOURCES: SourceConfig[] = [
  {
    id: "shopify",
    title: "Connect Shopify",
    subtitle: "Direct publish",
    blurb: "Link your store to publish AI-generated pages instantly.",
    image: "/shopify-logo.png",
    color: "#5E8E3E",
    bgColor: "#DCFCE7",
  },
  {
    id: "supplier",
    title: "Product URL",
    subtitle: "Most popular",
    blurb: "Paste any product link from AliExpress, Amazon, Etsy, or TikTok Shop.",
    icon: PackageDeliveredIcon,
    color: "#0D9488",
    bgColor: "#CCFBF1",
  },
  {
    id: "competitor",
    title: "Shopify Store",
    subtitle: "Reverse engineer",
    blurb: "Drop a competitor's Shopify URL. We'll analyze and build better.",
    icon: Store01Icon,
    color: "#D97706",
    bgColor: "#FEF3C7",
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
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-[32px] font-bold leading-[1.1] tracking-tight text-[#0A0A0A] sm:text-[40px] lg:text-[52px]"
      >
        Let's build
        <br />
        your store
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 max-w-[440px] text-[16px] leading-relaxed text-[#666666] lg:text-[18px]"
      >
        Pick a source and we'll take it from there — AI copy, images, design, all done.
      </motion.p>

      <div className="mt-14 grid gap-5 md:grid-cols-3 lg:mt-20">
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
      transition={{ delay: 0.3 + index * 0.1 }}
      type="button"
      onClick={onSelect}
      className={`group relative flex flex-col rounded-2xl border bg-white p-7 text-left transition-all duration-200 hover:-translate-y-1 lg:p-8 ${
        selected
          ? "border-[var(--dw-text)] shadow-xl"
          : "border-[var(--dw-border)] hover:border-[var(--dw-text)] hover:shadow-xl"
      }`}
    >
      <div className="mb-5 flex items-start justify-between">
        <div
          className="flex size-14 items-center justify-center rounded-2xl transition-transform duration-200 group-hover:scale-105"
          style={{ background: source.bgColor }}
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
            <HugeiconsIcon icon={source.icon} size={26} style={{ color: source.color }} strokeWidth={1.5} />
          ) : null}
        </div>
        <span className="rounded-full border border-[var(--dw-border)] bg-[var(--dw-bg)] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--dw-text-muted)]">
          {source.subtitle}
        </span>
      </div>

      <div className="mb-6 flex-1">
        <h3 className="mb-2 text-[18px] font-bold text-[var(--dw-text)] lg:text-[20px]">
          {source.title}
        </h3>
        <p className="text-[14px] leading-relaxed text-[var(--dw-text-muted)]">
          {source.blurb}
        </p>
      </div>

      <div className="border-t border-[var(--dw-border)] pt-5">
        <div
          className={`inline-flex items-center gap-2 text-[13px] font-semibold transition-all duration-200 ${
            selected
              ? "text-[var(--dw-accent)]"
              : "text-[var(--dw-text)] group-hover:gap-3"
          }`}
        >
          {isShopify ? "Install app" : "Get started"}
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            size={15}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </div>
      </div>
    </motion.button>
  );
};
