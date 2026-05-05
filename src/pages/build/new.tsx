import { useState, useEffect, useRef, type FormEvent } from "react";
import { useRouter } from "next/router";
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
    tone: "#5235EF",
    placeholder: "https://www.amazon.com/dp/B0...",
    hint: "Supplier or marketplace URL",
  },
  {
    id: "competitor",
    title: "Import from competitor",
    blurb: "Paste any Shopify store URL — we'll learn from their listing.",
    icon: Store01Icon,
    tone: "#8771FF",
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
    tone: "#5235EF",
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
  const [isAutoBuilding, setIsAutoBuilding] = useState(false);
  const autoBuildTriggered = useRef(false);

  const me = api.auth.me.useQuery();
  const isLoggedIn = !!me.data;
  const create = api.stores.create.useMutation();
  const shops = api.shopify.listShops.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const active = SOURCES.find((s) => s.id === source) ?? null;

  const triggerBuild = (buildUrl: string, buildLanguage: string, buildCurrency: string) => {
    setIsAutoBuilding(true);
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
          setIsAutoBuilding(false);
        },
      },
    );
  };

  const triggerAIBuild = (prompt: string, buildLanguage: string, buildCurrency: string) => {
    setIsAutoBuilding(true);
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
          setIsAutoBuilding(false);
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
      <div className="mb-3 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-[#6B7280]">
        <span className="size-1.5 rounded-full bg-[#5235EF]" />
        New store
      </div>
      <h1 className="text-[32px] font-bold leading-[1.1] text-[#101011] md:text-[40px]">
        How do you want to start
        <span className="text-[#5235EF]">?</span>
      </h1>
      <p className="mt-3 max-w-[560px] text-[15px] leading-relaxed text-[#6B7280]">
        Choose where your product comes from — we&apos;ll scrape it, write the
        copy, generate the imagery, and ship a full store.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 md:mt-10 md:grid-cols-2 lg:grid-cols-4">
        {SOURCES.map((s) => (
          <SourceCard
            key={s.id}
            source={s}
            selected={source === s.id}
            onSelect={() => handleSelectSource(s.id)}
          />
        ))}
      </div>

      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={handleSubmit}
            className="relative w-full max-w-[500px] rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setSource(null)}
              className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full text-[#9CA3AF] transition hover:bg-[#F4F4F5] hover:text-[#101011]"
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-1 text-[18px] font-bold text-[#101011]">{active.title}</div>
            <div className="mb-5 text-[14px] text-[#6B7280]">{active.blurb}</div>

            <div className="text-[11px] font-medium uppercase tracking-wider text-[#6B7280]">
              {active.hint}
            </div>
            {source === "ai" ? (
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g., A premium wireless noise-cancelling headphone for remote workers, with 40-hour battery life and comfortable memory foam ear cushions..."
                rows={4}
                autoFocus
                className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 text-[14px] text-[#101011] placeholder:text-[#9CA3AF] focus:border-[#5235EF] focus:outline-none focus:ring-2 focus:ring-[#5235EF]/20"
              />
            ) : (
              <div className="relative mt-2">
                <HugeiconsIcon
                  icon={LinkSquare01Icon}
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                />
                <Input
                  type="url"
                  required
                  autoFocus
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={active.placeholder}
                  className="h-12 rounded-xl border-[#E5E7EB] bg-[#F9FAFB] pl-11 text-[14px] focus:border-[#5235EF] focus:ring-[#5235EF]/20"
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
              className="mt-6 h-12 w-full gap-2 bg-gradient-to-r from-[#5235EF] to-[#8771FF] text-[14px] font-semibold shadow-lg shadow-[#5235EF]/30 transition hover:opacity-90"
              disabled={create.isPending}
            >
              {create.isPending ? "Generating..." : source === "ai" ? "Create with AI" : "Generate my store"}
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
            </Button>

            <p className="mt-4 text-center text-[11px] font-medium uppercase tracking-wider text-[#9CA3AF]">
              {source === "ai" ? "AI generates product details + imagery" : "60s median · No card · No signup required"}
            </p>
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
    <div className="min-h-screen bg-white">
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
}: {
  source: SourceConfig;
  selected: boolean;
  onSelect: () => void;
}) => (
  <button
    type="button"
    onClick={onSelect}
    className={`group relative flex flex-col items-start gap-4 overflow-hidden rounded-2xl border p-5 text-left transition-all ${
      selected
        ? "border-[#5235EF] bg-white shadow-lg shadow-[#5235EF]/10"
        : "border-[#E5E7EB] bg-white hover:border-[#5235EF]/30 hover:shadow-lg"
    }`}
  >
    <div
      className="flex size-14 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
      style={{
        background: `linear-gradient(135deg, ${source.tone}20 0%, ${source.tone}08 100%)`,
      }}
    >
      {source.image ? (
        <img src={source.image} alt="" className="size-8 object-contain" />
      ) : source.icon ? (
        <HugeiconsIcon icon={source.icon} size={26} style={{ color: source.tone }} />
      ) : null}
    </div>
    <div className="space-y-1.5">
      <div className="text-[16px] font-semibold text-[#101011]">{source.title}</div>
      <div className="text-[13px] leading-relaxed text-[#6B7280]">
        {source.blurb}
      </div>
    </div>
    <div
      className={`mt-auto inline-flex items-center gap-1.5 pt-2 text-[11px] font-medium uppercase tracking-wider transition ${
        selected ? "text-[#5235EF]" : "text-[#9CA3AF] group-hover:text-[#5235EF]"
      }`}
    >
      {selected ? "Selected" : "Choose"}
      <HugeiconsIcon
        icon={ArrowRight01Icon}
        size={11}
        className={`transition-transform ${selected ? "translate-x-0.5" : "group-hover:translate-x-0.5"}`}
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
    <span className="text-[12px] font-medium text-[#6B7280]">
      {label}
    </span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-12 w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 text-[14px] text-[#101011] focus:border-[#5235EF] focus:outline-none focus:ring-2 focus:ring-[#5235EF]/20"
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
