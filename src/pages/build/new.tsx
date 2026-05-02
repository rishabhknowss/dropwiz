import { useState, useEffect, useRef, type FormEvent } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { getErrorMessage } from "@/lib/trpc-errors";
import {
  ArrowRight01Icon,
  LinkSquare01Icon,
  PackageDeliveredIcon,
  Store01Icon,
  MagicWand01Icon,
} from "@hugeicons/core-free-icons";
import { DWTopNav } from "@/components/dw/TopNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import { runWithToast } from "@/hooks/useToastMutation";
import { ShopifyConnectModal } from "@/components/shopify/ShopifyConnectModal";
import { getPendingBuild, clearPendingBuild } from "@/components/dw/FakeBuildModal";

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
    tone: "#E16B3F",
    placeholder: "https://www.amazon.com/dp/B0...",
    hint: "Supplier or marketplace URL",
  },
  {
    id: "competitor",
    title: "Import from competitor",
    blurb: "Paste any Shopify store URL — we'll learn from their listing.",
    icon: Store01Icon,
    tone: "#C7FF3D",
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
    tone: "#A855F7",
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
  const utils = api.useUtils();
  const signOut = api.auth.signOut.useMutation();
  const isLoggedIn = !!me.data;
  const create = api.stores.create.useMutation();
  const shops = api.shopify.listShops.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const handleSignOut = () => {
    const id = toast.loading("Signing out...");
    signOut.mutate(undefined, {
      onSuccess: async () => {
        toast.success("Signed out", { id });
        await utils.auth.me.invalidate();
        router.push("/");
      },
      onError: (err) => toast.error(getErrorMessage(err), { id }),
    });
  };

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
      if (!url.startsWith("http")) {
        toast.error("Enter a valid product URL");
        return;
      }
      runWithToast(
        create,
        {
          url: url.trim(),
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

  return (
    <div className="min-h-screen bg-[color:var(--dw-bg)] text-[color:var(--dw-text)]">
      <DWTopNav
        active={isLoggedIn ? "New store" : "Product"}
        items={isLoggedIn ? [
          { label: "Stores", href: "/app/stores" },
          { label: "New store", href: "/build/new" },
        ] : undefined}
        ctaLabel={isLoggedIn ? "My stores" : "Build free"}
        ctaHref={isLoggedIn ? "/app/stores" : "/auth/signup"}
        secondaryLabel={isLoggedIn ? (signOut.isPending ? "Signing out..." : "Sign out") : "Sign in"}
        secondaryHref={isLoggedIn ? undefined : "/auth/signin"}
        secondaryOnClick={isLoggedIn ? handleSignOut : undefined}
        secondaryDisabled={signOut.isPending}
        showCredits={isLoggedIn}
      />
      <main className="mx-auto max-w-[1080px] px-5 py-10 md:px-6 md:py-14">
        <div className="dw-mono mb-3 inline-flex items-center gap-2 text-[10px] tracking-[0.16em] uppercase text-[color:var(--dw-text-muted)]">
          <span className="size-1 rounded-full bg-[color:var(--dw-accent)]" />
          New store
        </div>
        <h1 className="dw-display-sm text-[32px] leading-[1.05] tracking-[-0.02em] md:text-[40px] lg:text-[44px] lg:leading-[1.04]">
          How do you want to start
          <span className="text-[color:var(--dw-accent)]">?</span>
        </h1>
        <p className="mt-3 max-w-[560px] text-[14px] leading-[1.5] text-[color:var(--dw-text-dim)] md:text-[15px]">
          Choose where your product comes from — we&apos;ll scrape it, write the
          copy, generate the imagery, and ship a full store.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-3 md:mt-10 md:grid-cols-2 lg:grid-cols-4">
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
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 max-w-[640px] rounded-[16px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-5"
          >
            <div className="flex items-center gap-2">
              <span className="dw-mono text-[10px] tracking-[0.16em] uppercase text-[color:var(--dw-text-muted)]">
                {active.hint}
              </span>
            </div>
            {source === "ai" ? (
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g., A premium wireless noise-cancelling headphone for remote workers, with 40-hour battery life and comfortable memory foam ear cushions..."
                rows={4}
                autoFocus
                className="mt-2 w-full rounded-[10px] border border-[color:var(--dw-border)] bg-[color:var(--dw-bg)] p-3 text-[14px] placeholder:text-[color:var(--dw-text-muted)] focus:border-[color:var(--dw-accent)] focus:outline-none"
              />
            ) : (
              <div className="relative mt-2">
                <HugeiconsIcon
                  icon={LinkSquare01Icon}
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[color:var(--dw-text-muted)]"
                />
                <Input
                  type="url"
                  required
                  autoFocus
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={active.placeholder}
                  className="h-12 bg-[color:var(--dw-bg)] pl-10 text-[14px]"
                />
              </div>
            )}

            <div className="mt-4 grid grid-cols-2 gap-3">
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
              className="mt-5 h-12 w-full gap-2 text-[14px] font-medium"
              disabled={create.isPending}
            >
              {create.isPending ? "Generating..." : source === "ai" ? "Create with AI" : "Generate my store"}
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
            </Button>

            <p className="dw-mono mt-4 text-center text-[10.5px] tracking-[0.18em] uppercase text-[color:var(--dw-text-muted)]">
              {source === "ai" ? "AI generates product details + imagery" : "60s median · No card · No signup required"}
            </p>
          </form>
        )}
      </main>
      {showConnectModal && (
        <ShopifyConnectModal onClose={() => setShowConnectModal(false)} />
      )}
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
    className={`group relative flex flex-col items-start gap-4 overflow-hidden rounded-[20px] border p-5 text-left transition-all duration-200 ${
      selected
        ? "border-[color:var(--dw-accent)] bg-[color:var(--dw-surface)] shadow-[0_0_0_1px_var(--dw-accent),0_8px_32px_-8px_rgba(199,255,61,0.15)]"
        : "border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] hover:border-[color:var(--dw-text-muted)]/30 hover:bg-[color:var(--dw-surface2)]"
    }`}
  >
    <div
      className="flex size-14 items-center justify-center rounded-[14px] transition-transform duration-200 group-hover:scale-105"
      style={{
        background: `linear-gradient(135deg, ${source.tone}20 0%, ${source.tone}08 100%)`,
        boxShadow: `0 4px 12px -4px ${source.tone}30`,
      }}
    >
      {source.image ? (
        <img src={source.image} alt="" className="size-8 object-contain" />
      ) : source.icon ? (
        <HugeiconsIcon icon={source.icon} size={26} style={{ color: source.tone }} />
      ) : null}
    </div>
    <div className="space-y-1.5">
      <div className="text-[16px] font-semibold leading-[1.2] tracking-[-0.01em]">{source.title}</div>
      <div className="text-[13px] leading-[1.5] text-[color:var(--dw-text-dim)]">
        {source.blurb}
      </div>
    </div>
    <div
      className={`dw-mono mt-auto inline-flex items-center gap-1.5 pt-2 text-[10px] tracking-[0.14em] uppercase transition ${
        selected ? "text-[color:var(--dw-accent)]" : "text-[color:var(--dw-text-muted)] group-hover:text-[color:var(--dw-text)]"
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
  <div className="space-y-1.5">
    <span className="text-[11.5px] font-medium text-[color:var(--dw-text-dim)]">
      {label}
    </span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-12 w-full rounded-[10px] border border-[color:var(--dw-border)] bg-[color:var(--dw-bg)] px-3 text-[14px] focus:border-[color:var(--dw-accent)] focus:outline-none"
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
