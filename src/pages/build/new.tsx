import { useState, useEffect, useRef, type FormEvent } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  LinkSquare01Icon,
  PackageDeliveredIcon,
  Store01Icon,
  MagicWand01Icon,
} from "@hugeicons/core-free-icons";
import { DashboardLayout } from "@/components/dashboard";
import { LandingNav } from "@/components/landing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import { runWithToast } from "@/hooks/useToastMutation";
import { ShopifyConnectModal } from "@/components/shopify/ShopifyConnectModal";
import { getPendingBuild, clearPendingBuild } from "@/components/dw/FakeBuildModal";
import { validateProductUrl } from "@/lib/url-validation";

type Source = "shopify" | "supplier" | "competitor" | "ai";

type SourceConfig = {
  id: Source;
  title: string;
  blurb: string;
  icon?: typeof MagicWand01Icon;
  image?: string;
  tone: string;
  placeholder: string;
  hint: string;
};

const SOURCES: SourceConfig[] = [
  {
    id: "supplier",
    title: "Import from supplier",
    blurb: "AliExpress, Amazon, Etsy, TikTok Shop — paste any product link.",
    icon: PackageDeliveredIcon,
    tone: "#00FFCC",
    placeholder: "https://www.amazon.com/dp/B0...",
    hint: "Supplier or marketplace URL",
  },
  {
    id: "competitor",
    title: "Import from competitor",
    blurb: "Paste any Shopify store URL — we'll learn from their listing.",
    icon: Store01Icon,
    tone: "#FFB347",
    placeholder: "https://competitor.com/products/...",
    hint: "Competitor product or store URL",
  },
  {
    id: "shopify",
    title: "Connect Shopify",
    blurb: "Link your existing Shopify store to import products directly.",
    image: "/shopify-logo.png",
    tone: "#95BF47",
    placeholder: "https://your-shop.myshopify.com/products/...",
    hint: "Your own Shopify product URL",
  },
  {
    id: "ai",
    title: "Create with AI",
    blurb: "Describe your product idea and let AI generate everything.",
    icon: MagicWand01Icon,
    tone: "#FF6B9D",
    placeholder: "",
    hint: "Describe your product",
  },
];

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "zh-CN", label: "简体中文" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
];

const CURRENCIES = ["USD", "EUR", "GBP", "INR", "CAD", "AUD"];

const BuildNew = () => {
  const router = useRouter();
  const [source, setSource] = useState<Source | null>(null);
  const [url, setUrl] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("USD");
  const [showConnectModal, setShowConnectModal] = useState(false);
  const autoBuildTriggered = useRef(false);

  const me = api.auth.me.useQuery();
  const isLoggedIn = !!me.data;
  const create = api.stores.create.useMutation();
  const shops = api.shopify.listShops.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const active = SOURCES.find((s) => s.id === source) ?? null;

  const triggerBuild = (buildUrl: string, buildLanguage: string, buildCurrency: string) => {
        runWithToast(
      create,
      {
        url: buildUrl.trim(),
        targetLanguage: buildLanguage,
        currency: buildCurrency,
      },
      {
        loading: "Rendering your store…",
        success: "Building your store",
        onSuccess: (data) => {
          clearPendingBuild();
          const claim = data.claimToken
            ? `?claim=${encodeURIComponent(data.claimToken)}`
            : "";
          router.push(`/build/${data.storeId}/generating${claim}`);
        },
        onError: () => {
                  },
      },
    );
  };

  const triggerAIBuild = (prompt: string, buildLanguage: string, buildCurrency: string) => {
        runWithToast(
      create,
      {
        aiPrompt: prompt.trim(),
        targetLanguage: buildLanguage,
        currency: buildCurrency,
      },
      {
        loading: "Creating your store with AI…",
        success: "Building your store",
        onSuccess: (data) => {
          clearPendingBuild();
          const claim = data.claimToken
            ? `?claim=${encodeURIComponent(data.claimToken)}`
            : "";
          router.push(`/build/${data.storeId}/generating${claim}`);
        },
        onError: () => {
                  },
      },
    );
  };

  useEffect(() => {
    if (router.query.pending === "true" && !autoBuildTriggered.current) {
      const pending = getPendingBuild();
      if (pending) {
        autoBuildTriggered.current = true;
        if (pending.mode === "url" && pending.url) {
          setUrl(pending.url);
          setSource(pending.source as Source);
          setLanguage(pending.language);
          setCurrency(pending.currency);
          setTimeout(() => {
            triggerBuild(pending.url!, pending.language, pending.currency);
          }, 500);
        } else if (pending.mode === "ai" && pending.aiPrompt) {
          setAiPrompt(pending.aiPrompt);
          setSource("ai");
          setLanguage(pending.language);
          setCurrency(pending.currency);
          setTimeout(() => {
            triggerAIBuild(pending.aiPrompt!, pending.language, pending.currency);
          }, 500);
        }
      }
    }
  }, [router.query.pending]);

  const handleSelectSource = (id: Source) => {
    if (id === "shopify") {
      const connected = shops.data ?? [];
      if (connected.length === 1) {
        router.push(
          `/build/shopify/${encodeURIComponent(connected[0].shopDomain)}`,
        );
        return;
      }
      if (connected.length === 0) {
        setShowConnectModal(true);
        return;
      }
    }
    setSource(id);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isAIMode = source === "ai";

    if (isAIMode) {
      if (aiPrompt.trim().length < 10) {
        toast.error("Describe your product in at least 10 characters");
        return;
      }
      runWithToast(
        create,
        {
          aiPrompt: aiPrompt.trim(),
          targetLanguage: language,
          currency,
        },
        {
          loading: "Creating your store with AI…",
          success: "Working on your store",
          onSuccess: (data) => {
            const claim = data.claimToken
              ? `?claim=${encodeURIComponent(data.claimToken)}`
              : "";
            router.push(`/build/${data.storeId}/generating${claim}`);
          },
        },
      );
    } else {
      const validation = validateProductUrl(url);
      if (!validation.valid) {
        toast.error(validation.error ?? "Enter a valid product URL");
        return;
      }
      runWithToast(
        create,
        {
          url: validation.normalizedUrl ?? url.trim(),
          targetLanguage: language,
          currency,
        },
        {
          loading: "Submitting…",
          success: "Working on your store",
          onSuccess: (data) => {
            const claim = data.claimToken
              ? `?claim=${encodeURIComponent(data.claimToken)}`
              : "";
            router.push(`/build/${data.storeId}/generating${claim}`);
          },
        },
      );
    }
  };

  const content = (
    <>
      <div className="mb-4 inline-flex items-center gap-2.5 rounded-full bg-[var(--dw-accent)]/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--dw-accent)]">
        <span className="size-1.5 rounded-full bg-[var(--dw-accent)] animate-pulse" />
        Create Store
      </div>
      <h1 className="dw-display text-[36px] text-[var(--dw-text)] md:text-[48px] lg:text-[56px]">
        How do you want to
        <br />
        <span className="dw-gradient-text">get started?</span>
      </h1>
      <p className="mt-4 max-w-[520px] text-[15px] leading-relaxed text-[var(--dw-text-muted)]">
        Choose your product source. We&apos;ll handle the scraping, AI copywriting,
        image generation, and build you a complete store.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 md:mt-12 md:grid-cols-2 lg:grid-cols-4">
        {SOURCES.map((s, i) => (
          <SourceCard
            key={s.id}
            source={s}
            selected={source === s.id}
            onSelect={() => handleSelectSource(s.id)}
            index={i}
          />
        ))}
      </div>

      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit}
            className="animate-scale-in relative w-full max-w-[520px] overflow-hidden rounded-2xl border border-[var(--dw-border)] bg-[var(--dw-surface)] shadow-2xl"
          >
            <div className="dw-grid-pattern absolute inset-0 opacity-30" />
            <div className="relative p-6">
              <button
                type="button"
                onClick={() => setSource(null)}
                className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-xl text-[var(--dw-text-subtle)] transition-all hover:bg-[var(--dw-surface2)] hover:text-[var(--dw-text)]"
              >
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="mb-1 text-[20px] font-bold tracking-tight text-[var(--dw-text)]">{active.title}</div>
              <div className="mb-6 text-[14px] text-[var(--dw-text-muted)]">{active.blurb}</div>

              <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--dw-text-subtle)]">
                {active.hint}
              </div>
              {source === "ai" ? (
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g., A premium wireless noise-cancelling headphone for remote workers, with 40-hour battery life and comfortable memory foam ear cushions..."
                  rows={4}
                  autoFocus
                  className="mt-2 w-full rounded-xl border border-[var(--dw-border)] bg-[var(--dw-bg-tertiary)] p-4 text-[14px] text-[var(--dw-text)] placeholder:text-[var(--dw-text-subtle)] transition-all focus:border-[var(--dw-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--dw-accent)]/20"
                />
              ) : (
                <div className="relative mt-2">
                  <HugeiconsIcon
                    icon={LinkSquare01Icon}
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--dw-text-subtle)]"
                  />
                  <Input
                    type="url"
                    required
                    autoFocus
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder={active.placeholder}
                    className="h-13 rounded-xl border-[var(--dw-border)] bg-[var(--dw-bg-tertiary)] pl-11 text-[14px] transition-all focus:border-[var(--dw-accent)] focus:ring-[var(--dw-accent)]/20"
                  />
                </div>
              )}

              <div className="mt-5 grid grid-cols-2 gap-4">
                <LocaleField
                  label="Language"
                  value={language}
                  onChange={setLanguage}
                  options={LANGUAGES.map((l) => ({ value: l.code, label: l.label }))}
                />
                <LocaleField
                  label="Currency"
                  value={currency}
                  onChange={setCurrency}
                  options={CURRENCIES.map((c) => ({ value: c, label: c }))}
                />
              </div>

              <Button
                type="submit"
                className="mt-6 h-13 w-full gap-2.5 rounded-xl bg-gradient-to-r from-[var(--dw-accent)] to-[var(--dw-accent-hover)] text-[14px] font-semibold text-[#0A0A0A] shadow-lg shadow-[var(--dw-accent)]/20 transition-all hover:shadow-[var(--dw-accent)]/30 hover:brightness-110"
                disabled={create.isPending}
              >
                {create.isPending ? (
                  <>
                    <div className="h-4 w-4 rounded-full border-2 border-[#0A0A0A]/30 border-t-[#0A0A0A] dw-spin" />
                    Building...
                  </>
                ) : source === "ai" ? (
                  <>
                    <HugeiconsIcon icon={MagicWand01Icon} size={16} />
                    Create with AI
                  </>
                ) : (
                  <>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                    Generate Store
                  </>
                )}
              </Button>

              <p className="mt-4 text-center text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--dw-text-subtle)]">
                {source === "ai" ? "AI generates product details + imagery" : "60 seconds · No credit card required"}
              </p>
            </div>
          </form>
        </div>
      )}
      {showConnectModal && (
        <ShopifyConnectModal onClose={() => setShowConnectModal(false)} />
      )}
    </>
  );

  if (isLoggedIn) {
    return (
      <DashboardLayout title="Create Store" subtitle="Build a new AI-powered store">
        {content}
      </DashboardLayout>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--dw-bg)]">
      <LandingNav isLoggedIn={false} />
      <main className="mx-auto max-w-[1080px] px-5 py-10 md:px-8 md:py-14">
        {content}
      </main>
    </div>
  );
};

const SourceCard = ({
  source,
  selected,
  onSelect,
  index = 0,
}: {
  source: SourceConfig;
  selected: boolean;
  onSelect: () => void;
  index?: number;
}) => (
  <button
    type="button"
    onClick={onSelect}
    className={`animate-slide-up group relative flex flex-col items-start gap-5 overflow-hidden rounded-2xl border p-6 text-left transition-all duration-300 ${
      selected
        ? "border-[var(--dw-accent)]/50 bg-[var(--dw-surface)] shadow-xl shadow-[var(--dw-accent)]/10"
        : "border-[var(--dw-border)] bg-[var(--dw-surface)] hover:border-[var(--dw-accent)]/30 hover:shadow-xl hover:shadow-black/20"
    }`}
    style={{ animationDelay: `${index * 75}ms`, animationFillMode: "both" }}
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
        <Image src={source.image} alt="" width={32} height={32} className="size-8 object-contain" unoptimized />
      ) : source.icon ? (
        <HugeiconsIcon icon={source.icon} size={26} style={{ color: source.tone }} />
      ) : null}
    </div>
    <div className="relative space-y-2">
      <div className="text-[16px] font-bold tracking-tight text-[var(--dw-text)]">{source.title}</div>
      <div className="text-[13px] leading-relaxed text-[var(--dw-text-muted)]">
        {source.blurb}
      </div>
    </div>
    <div
      className={`relative mt-auto inline-flex items-center gap-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.1em] transition-all ${
        selected ? "text-[var(--dw-accent)]" : "text-[var(--dw-text-subtle)] group-hover:text-[var(--dw-accent)]"
      }`}
    >
      {selected ? "Selected" : "Choose this"}
      <HugeiconsIcon
        icon={ArrowRight01Icon}
        size={12}
        className={`transition-transform duration-300 ${selected ? "translate-x-0.5" : "group-hover:translate-x-1"}`}
      />
    </div>
  </button>
);

const LocaleField = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}) => (
  <div className="space-y-2">
    <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--dw-text-subtle)]">
      {label}
    </span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-12 w-full cursor-pointer rounded-xl border border-[var(--dw-border)] bg-[var(--dw-bg-tertiary)] px-4 text-[14px] text-[var(--dw-text)] transition-all focus:border-[var(--dw-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--dw-accent)]/20"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

export default BuildNew;
