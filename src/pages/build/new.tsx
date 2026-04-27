import { useState, type FormEvent } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  LinkSquare01Icon,
  ShoppingBag03Icon,
  PackageDeliveredIcon,
  Store01Icon,
} from "@hugeicons/core-free-icons";
import { DWTopNav } from "@/components/dw/TopNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import { runWithToast } from "@/hooks/useToastMutation";
import { ShopifyConnectModal } from "@/components/shopify/ShopifyConnectModal";

type Source = "shopify" | "supplier" | "competitor";

const SOURCES: Array<{
  id: Source;
  title: string;
  blurb: string;
  icon: typeof ShoppingBag03Icon;
  tone: string;
  placeholder: string;
  hint: string;
}> = [
  {
    id: "shopify",
    title: "Import from Shopify",
    blurb: "Connect your shop or paste a product URL from your Shopify store.",
    icon: ShoppingBag03Icon,
    tone: "#5DC365",
    placeholder: "https://your-shop.myshopify.com/products/...",
    hint: "Your own Shopify product URL",
  },
  {
    id: "supplier",
    title: "Import from a supplier link",
    blurb: "AliExpress, Amazon, Etsy, TikTok Shop — we'll scrape it.",
    icon: PackageDeliveredIcon,
    tone: "#E16B3F",
    placeholder: "https://www.amazon.com/dp/B0...",
    hint: "Supplier or marketplace URL",
  },
  {
    id: "competitor",
    title: "Import from a competitor store",
    blurb: "Paste any Shopify product URL — we'll learn from their listing.",
    icon: Store01Icon,
    tone: "#C7FF3D",
    placeholder: "https://competitor.com/products/...",
    hint: "Competitor product or store URL",
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
  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("USD");
  const [showConnectModal, setShowConnectModal] = useState(false);

  const create = api.stores.create.useMutation();
  const shops = api.shopify.listShops.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  const active = SOURCES.find((s) => s.id === source) ?? null;

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
  };

  return (
    <div className="min-h-screen bg-[color:var(--dw-bg)] text-[color:var(--dw-text)]">
      <DWTopNav active="Product" />
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

        <div className="mt-8 grid grid-cols-1 gap-4 md:mt-10 md:grid-cols-3">
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
              {create.isPending ? "Submitting..." : "Generate my store"}
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
            </Button>

            <p className="dw-mono mt-4 text-center text-[10.5px] tracking-[0.18em] uppercase text-[color:var(--dw-text-muted)]">
              60s median · No card · No signup required
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
  source: (typeof SOURCES)[number];
  selected: boolean;
  onSelect: () => void;
}) => (
  <button
    type="button"
    onClick={onSelect}
    className={`group relative flex flex-col items-start gap-5 overflow-hidden rounded-[18px] border p-5 text-left transition ${
      selected
        ? "border-[color:var(--dw-accent)] bg-[color:var(--dw-surface)] shadow-[0_0_0_1px_var(--dw-accent)]"
        : "border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] hover:border-[color:var(--dw-accent)]/40"
    }`}
  >
    <div
      className="flex size-12 items-center justify-center rounded-[12px]"
      style={{
        background: `${source.tone}18`,
        color: source.tone,
      }}
    >
      <HugeiconsIcon icon={source.icon} size={22} />
    </div>
    <div className="space-y-1.5">
      <div className="text-[15px] font-medium leading-[1.3]">{source.title}</div>
      <div className="text-[12.5px] leading-[1.5] text-[color:var(--dw-text-dim)]">
        {source.blurb}
      </div>
    </div>
    <div
      className={`dw-mono mt-auto inline-flex items-center gap-1.5 text-[10px] tracking-[0.16em] uppercase transition ${
        selected ? "text-[color:var(--dw-accent)]" : "text-[color:var(--dw-text-muted)]"
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
