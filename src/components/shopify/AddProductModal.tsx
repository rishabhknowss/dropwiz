import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createPortal } from "react-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Link01Icon,
  ShoppingBag03Icon,
  SparklesIcon,
  ArrowRight01Icon,
  Globe02Icon,
  DollarCircleIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import { toast } from "sonner";

type ProductSource = "supplier" | "shopify" | "manual";

type Shop = {
  id: string;
  shopDomain: string;
};

type Props = {
  onClose: () => void;
  shops: Shop[];
  preselectedShop?: string;
  storeId?: string;
  onPageAdded?: (pageId: string) => void;
};

const SOURCES: { id: ProductSource; label: string; description: string; icon: typeof Link01Icon }[] = [
  {
    id: "supplier",
    label: "Import from URL",
    description: "Amazon, AliExpress, Etsy, or any product URL",
    icon: Link01Icon,
  },
  {
    id: "shopify",
    label: "From Shopify",
    description: "Import existing product from your store",
    icon: ShoppingBag03Icon,
  },
  {
    id: "manual",
    label: "Create with AI",
    description: "Describe your product, AI generates everything",
    icon: SparklesIcon,
  },
];

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "pt", label: "Portuguese" },
  { code: "zh", label: "Chinese" },
];

const CURRENCIES = [
  { code: "USD", label: "USD ($)" },
  { code: "EUR", label: "EUR (€)" },
  { code: "GBP", label: "GBP (£)" },
  { code: "CAD", label: "CAD ($)" },
  { code: "AUD", label: "AUD ($)" },
  { code: "INR", label: "INR (₹)" },
];

export const AddProductModal = ({ onClose, shops, preselectedShop, storeId, onPageAdded }: Props) => {
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setTarget(document.getElementById("dw-app-root") ?? document.body);
  }, []);

  if (!target) return null;
  return createPortal(
    <ModalBody onClose={onClose} shops={shops} preselectedShop={preselectedShop} storeId={storeId} onPageAdded={onPageAdded} />,
    target
  );
};

const ModalBody = ({ onClose, shops, preselectedShop, storeId, onPageAdded }: Props) => {
  const router = useRouter();
  const utils = api.useUtils();
  const [step, setStep] = useState<"source" | "details">("source");
  const [source, setSource] = useState<ProductSource | null>(null);
  const [selectedShop, setSelectedShop] = useState(preselectedShop ?? shops[0]?.shopDomain ?? "");
  const [url, setUrl] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("USD");

  const isAddingToExistingStore = !!storeId;
  const createStore = api.stores.create.useMutation();
  const addProductPage = api.stores.addProductPage.useMutation();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const handleSourceSelect = (s: ProductSource) => {
    setSource(s);
    if (s === "shopify") {
      router.push(`/build/shopify/${encodeURIComponent(selectedShop)}`);
      onClose();
    } else {
      setStep("details");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (source === "supplier" && !url.startsWith("http")) {
      toast.error("Please enter a valid URL");
      return;
    }

    if (source === "manual" && aiPrompt.length < 10) {
      toast.error("Please describe your product (at least 10 characters)");
      return;
    }

    if (isAddingToExistingStore) {
      const id = toast.loading("Importing product...");
      addProductPage.mutate(
        {
          storeId: storeId!,
          url: source === "supplier" ? url : undefined,
          aiPrompt: source === "manual" ? aiPrompt : undefined,
          targetLanguage: language,
          currency,
        },
        {
          onSuccess: (data) => {
            toast.success(`Added "${data.pageName}"`, { id });
            utils.stores.getPages.invalidate({ storeId: storeId! });
            utils.stores.getMine.invalidate({ storeId: storeId! });
            onPageAdded?.(data.pageId);
            onClose();
          },
          onError: (err) => {
            toast.error(err.message, { id });
          },
        }
      );
      return;
    }

    const id = toast.loading("Creating your product page...");
    createStore.mutate(
      {
        url: source === "supplier" ? url : undefined,
        aiPrompt: source === "manual" ? aiPrompt : undefined,
        targetLanguage: language,
        currency,
      },
      {
        onSuccess: (data) => {
          toast.success("Product page created!", { id });
          const params = new URLSearchParams();
          if (data.claimToken) params.set("claim", data.claimToken);
          router.push(`/build/${data.storeId}/generating?${params.toString()}`);
          onClose();
        },
        onError: (err) => {
          toast.error(err.message, { id });
        },
      }
    );
  };

  const isPending = createStore.isPending || addProductPage.isPending;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-[520px] flex-col overflow-hidden rounded-2xl border border-[var(--dw-border)] bg-[var(--dw-bg)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--dw-border)] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-[var(--dw-accent-subtle)]">
              <HugeiconsIcon icon={ShoppingBag03Icon} size={18} className="text-[var(--dw-accent)]" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-[var(--dw-text)]">
                {step === "source" ? "Add New Product" : source === "supplier" ? "Import from URL" : "Create with AI"}
              </h2>
              <p className="text-[12px] text-[var(--dw-text-muted)]">
                {step === "source" ? "Choose how to add your product" : "Enter product details"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-lg text-[var(--dw-text-muted)] transition hover:bg-[var(--dw-bg-tertiary)] hover:text-[var(--dw-text)]"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={16} />
          </button>
        </div>

        {step === "source" ? (
          <div className="p-5">
            {!isAddingToExistingStore && shops.length > 1 && (
              <div className="mb-5">
                <label className="mb-2 block text-[12px] font-medium text-[var(--dw-text-muted)]">
                  Publish to store
                </label>
                <select
                  value={selectedShop}
                  onChange={(e) => setSelectedShop(e.target.value)}
                  className="h-10 w-full rounded-lg border border-[var(--dw-border)] bg-[var(--dw-surface)] px-3 text-[13px] text-[var(--dw-text)] focus:border-[var(--dw-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--dw-accent)]/20"
                >
                  {shops.map((shop) => (
                    <option key={shop.id} value={shop.shopDomain}>
                      {shop.shopDomain}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-2">
              {SOURCES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSourceSelect(s.id)}
                  className="flex w-full items-center gap-4 rounded-xl border border-[var(--dw-border)] bg-[var(--dw-surface)] p-4 text-left transition-all hover:border-[var(--dw-accent)]/50 hover:bg-[var(--dw-surface-hover)]"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[var(--dw-bg-tertiary)]">
                    <HugeiconsIcon icon={s.icon} size={20} className="text-[var(--dw-text-muted)]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[14px] font-medium text-[var(--dw-text)]">{s.label}</div>
                    <div className="text-[12px] text-[var(--dw-text-muted)]">{s.description}</div>
                  </div>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="text-[var(--dw-text-subtle)]" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5">
            <button
              type="button"
              onClick={() => setStep("source")}
              className="mb-4 flex items-center gap-1.5 text-[12px] font-medium text-[var(--dw-text-muted)] transition hover:text-[var(--dw-text)]"
            >
              <svg className="size-3.5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Back to options
            </button>

            {source === "supplier" && (
              <div className="mb-4">
                <label className="mb-2 block text-[12px] font-medium text-[var(--dw-text-muted)]">
                  Product URL
                </label>
                <Input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://amazon.com/dp/... or https://aliexpress.com/item/..."
                  className="h-11 border-[var(--dw-border)] bg-[var(--dw-surface)] text-[14px] text-[var(--dw-text)] placeholder:text-[var(--dw-text-subtle)]"
                  autoFocus
                />
                <p className="mt-1.5 text-[11px] text-[var(--dw-text-subtle)]">
                  Supports Amazon, AliExpress, Etsy, TikTok Shop, and more
                </p>
              </div>
            )}

            {source === "manual" && (
              <div className="mb-4">
                <label className="mb-2 block text-[12px] font-medium text-[var(--dw-text-muted)]">
                  Describe your product
                </label>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="A premium wireless Bluetooth speaker with 360° sound, waterproof design, and 24-hour battery life. Perfect for outdoor adventures..."
                  className="h-28 w-full resize-none rounded-lg border border-[var(--dw-border)] bg-[var(--dw-surface)] px-3 py-2.5 text-[14px] text-[var(--dw-text)] placeholder:text-[var(--dw-text-subtle)] focus:border-[var(--dw-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--dw-accent)]/20"
                  autoFocus
                />
                <p className="mt-1.5 text-[11px] text-[var(--dw-text-subtle)]">
                  Be specific about features, benefits, and target audience
                </p>
              </div>
            )}

            <div className="mb-5 grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 flex items-center gap-1.5 text-[12px] font-medium text-[var(--dw-text-muted)]">
                  <HugeiconsIcon icon={Globe02Icon} size={12} />
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="h-10 w-full rounded-lg border border-[var(--dw-border)] bg-[var(--dw-surface)] px-3 text-[13px] text-[var(--dw-text)] focus:border-[var(--dw-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--dw-accent)]/20"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 flex items-center gap-1.5 text-[12px] font-medium text-[var(--dw-text-muted)]">
                  <HugeiconsIcon icon={DollarCircleIcon} size={12} />
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="h-10 w-full rounded-lg border border-[var(--dw-border)] bg-[var(--dw-surface)] px-3 text-[13px] text-[var(--dw-text)] focus:border-[var(--dw-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--dw-accent)]/20"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Button
              type="submit"
              className="h-11 w-full gap-2 bg-[var(--dw-accent)] text-[14px] font-semibold text-white hover:bg-[var(--dw-accent-hover)]"
              disabled={isPending}
            >
              {isPending ? (
                isAddingToExistingStore ? "Importing..." : "Creating..."
              ) : (
                <>
                  {isAddingToExistingStore ? "Import Product" : "Generate Product Page"}
                  <HugeiconsIcon icon={SparklesIcon} size={14} />
                </>
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
