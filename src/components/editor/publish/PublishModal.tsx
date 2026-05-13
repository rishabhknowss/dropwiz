import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  ShoppingBag03Icon,
  Link02Icon,
  Copy01Icon,
  Tick02Icon,
  CrownIcon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { ClientPortal } from "@/components/ui/client-portal";
import { api } from "@/utils/api";
import { runWithToast } from "@/hooks/useToastMutation";
import { toast } from "sonner";
import { ShopifyConnectModal } from "@/components/shopify/ShopifyConnectModal";
import { UpgradeModal } from "@/components/billing/UpgradeModal";
import type { StorePage } from "@/db/schema";

type PartialStorePage = {
  id?: string;
  type?: StorePage["type"];
  name?: string;
  slug?: string;
  order?: number;
  isDefault?: boolean;
  sections?: unknown[];
};
import confetti from "canvas-confetti";

type PublishMode = "all" | "landing" | "product" | string;

type Props = { storeId: string; onClose: () => void };

export const PublishModal = (props: Props) => (
  <ClientPortal>
    <PublishModalBody {...props} />
  </ClientPortal>
);

const PublishModalBody = ({ storeId, onClose }: Props) => {
  const store = api.stores.getMine.useQuery({ storeId });
  const shops = api.shopify.listShops.useQuery();
  const me = api.auth.me.useQuery();
  const publish = api.shopify.publishStore.useMutation();
  const disconnect = api.shopify.disconnectShop.useMutation();
  const utils = api.useUtils();
  const [shopOverride, setShopOverride] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showConnect, setShowConnect] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [publishMode, setPublishMode] = useState<PublishMode>("all");

  const tier = me.data?.tier ?? "free";
  const isPro = tier === "pro";
  const pages = store.data?.pages ?? [];

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

  const selectedShop = shopOverride ?? shops.data?.[0]?.shopDomain ?? null;
  const publicPath = store.data ? `/p/${store.data.slug}` : "";
  const publicUrl = publicPath
    ? `${typeof window !== "undefined" ? window.location.origin : ""}${publicPath}`
    : "";
  const shopsLoading = shops.isLoading;
  const connected = (shops.data?.length ?? 0) > 0;

  const fireConfetti = () => {
    const duration = 500;
    const end = Date.now() + duration;
    const colors = ["#c7ff3d", "#0a0a0a", "#ffffff", "#fbbf24", "#22c55e"];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleShopifyPublish = () => {
    if (!selectedShop) {
      setShowConnect(true);
      return;
    }
    const modeLabel = publishMode === "all" ? "all pages" : publishMode === "landing" ? "home page" : publishMode === "product" ? "product page" : "selected page";
    runWithToast(
      publish,
      { storeId, withTheme: true, publishMode },
      {
        loading: `Publishing ${modeLabel} to ${selectedShop}…`,
        success: `Published ${modeLabel} to ${selectedShop}`,
        toastId: "shopify-publish",
        onSuccess: (data) => {
          utils.stores.getMine.invalidate({ storeId });
          fireConfetti();
          setTimeout(() => {
            window.open(data.themeEditorUrl, "_blank", "noopener");
            onClose();
          }, 800);
        },
      },
    );
  };

  const handleDisconnect = (shopDomain: string) => {
    if (
      !window.confirm(
        `Disconnect ${shopDomain}? You'll need to reinstall the Dropwiz app to reconnect.`,
      )
    ) {
      return;
    }
    runWithToast(
      disconnect,
      { shopDomain },
      {
        loading: "Disconnecting…",
        success: "Disconnected",
        toastId: "shopify-disconnect",
        onSuccess: () => {
          utils.shopify.listShops.invalidate();
          setShopOverride(null);
        },
      },
    );
  };

  const handleCopy = async () => {
    if (!publicUrl) return;
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-[420px] flex-col overflow-hidden rounded-[14px] border border-[color:var(--dw-border)] bg-[color:var(--dw-bg)] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5">
          <div className="text-[13px] font-medium tracking-[-0.01em]">
            Publish store
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex size-7 items-center justify-center rounded-md text-[color:var(--dw-text-muted)] transition hover:bg-[color:var(--dw-surface2)] hover:text-[color:var(--dw-text)]"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} />
          </button>
        </div>

        <div className="h-px bg-[color:var(--dw-border)]" />

        <div className="flex flex-col gap-3 overflow-y-auto p-4">
          <ShopifyCard
            loading={shopsLoading}
            connected={connected}
            published={store.data?.status === "published"}
            publishedShop={store.data?.publishedShopifyShop ?? null}
            selectedShop={selectedShop}
            shops={shops.data ?? []}
            onSelectShop={setShopOverride}
            publishing={publish.isPending}
            onPublish={handleShopifyPublish}
            onDisconnect={handleDisconnect}
            disconnecting={disconnect.isPending}
            isPro={isPro}
            onUpgrade={() => setShowUpgrade(true)}
            pages={pages}
            publishMode={publishMode}
            onPublishModeChange={setPublishMode}
          />
          <PublicUrlCard
            path={publicPath}
            fullUrl={publicUrl}
            copied={copied}
            onCopy={handleCopy}
          />
        </div>
      </div>
      {showConnect && (
        <ShopifyConnectModal
          onClose={() => setShowConnect(false)}
          storeIdForRedirect={storeId}
        />
      )}
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </div>
  );
};

const ShopifyCard = ({
  loading,
  connected,
  published,
  publishedShop,
  selectedShop,
  shops,
  onSelectShop,
  publishing,
  onPublish,
  onDisconnect,
  disconnecting,
  isPro,
  onUpgrade,
  pages,
  publishMode,
  onPublishModeChange,
}: {
  loading: boolean;
  connected: boolean;
  published: boolean;
  publishedShop: string | null;
  selectedShop: string | null;
  shops: Array<{ id?: string; shopDomain?: string }>;
  onSelectShop: (shop: string) => void;
  publishing: boolean;
  onPublish: () => void;
  onDisconnect: (shopDomain: string) => void;
  disconnecting: boolean;
  isPro: boolean;
  onUpgrade: () => void;
  pages: PartialStorePage[];
  publishMode: PublishMode;
  onPublishModeChange: (mode: PublishMode) => void;
}) => {
  const hasPages = pages.length > 0;
  const hasLanding = pages.some((p) => p.type === "landing");
  const hasProduct = pages.some((p) => p.type === "product");

  return (
  <div className="rounded-[10px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-3.5">
    <div className="flex items-start gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-[color:var(--dw-surface2)] text-[color:var(--dw-text-muted)]">
        <HugeiconsIcon icon={ShoppingBag03Icon} size={14} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className="text-[13px] font-medium">Shopify</div>
          <StatusDot loading={loading} connected={connected} published={published} />
        </div>
        <div className="mt-0.5 text-[11.5px] leading-[1.4] text-[color:var(--dw-text-dim)]">
          {published && publishedShop
            ? `Live on ${publishedShop}`
            : "Pushes the product + the Dropwiz design to your store."}
        </div>
      </div>
    </div>
    {loading ? (
      <Button
        variant="outline"
        size="sm"
        className="mt-3 h-8 w-full text-[12px]"
        disabled
      >
        Loading...
      </Button>
    ) : !isPro ? (
      <Button
        size="sm"
        className="mt-3 h-8 w-full gap-1.5 text-[12px]"
        onClick={onUpgrade}
      >
        <HugeiconsIcon icon={CrownIcon} size={12} />
        Upgrade to Publish
      </Button>
    ) : connected ? (
      <div className="mt-3 flex flex-col gap-2">
        {shops.length > 1 && (
          <select
            value={selectedShop ?? ""}
            onChange={(e) => onSelectShop(e.target.value)}
            className="h-8 w-full rounded-[7px] border border-[color:var(--dw-border)] bg-[color:var(--dw-bg)] px-2 text-[12px] focus:border-[color:var(--dw-accent)] focus:outline-none"
          >
            {shops.map((s) => (
              <option key={s.id} value={s.shopDomain}>
                {s.shopDomain}
              </option>
            ))}
          </select>
        )}
        {hasPages && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-[color:var(--dw-text-muted)]">
              Pages to publish
            </label>
            <select
              value={publishMode}
              onChange={(e) => onPublishModeChange(e.target.value as PublishMode)}
              className="h-8 w-full rounded-[7px] border border-[color:var(--dw-border)] bg-[color:var(--dw-bg)] px-2 text-[12px] focus:border-[color:var(--dw-accent)] focus:outline-none"
            >
              <option value="all">All pages</option>
              {hasLanding && <option value="landing">Home page only</option>}
              {hasProduct && <option value="product">Product page only</option>}
              {pages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.type})
                </option>
              ))}
            </select>
          </div>
        )}
        <Button
          size="sm"
          className="h-8 w-full text-[12px]"
          onClick={onPublish}
          disabled={publishing}
        >
          {publishing
            ? "Publishing..."
            : published
              ? `Update on ${selectedShop ?? "Shopify"}`
              : `Publish to ${selectedShop ?? "Shopify"}`}
        </Button>
        {selectedShop && (
          <button
            onClick={() => onDisconnect(selectedShop)}
            disabled={disconnecting}
            className="dw-mono mt-0.5 self-end text-[10px] tracking-[0.12em] uppercase text-[color:var(--dw-text-muted)] transition hover:text-[color:var(--dw-signal)] disabled:opacity-50"
          >
            {disconnecting ? "Disconnecting…" : "Disconnect"}
          </button>
        )}
      </div>
    ) : (
      <Button
        variant="outline"
        size="sm"
        className="mt-3 h-8 w-full text-[12px]"
        onClick={onPublish}
      >
        Connect a Shopify shop
      </Button>
    )}
  </div>
  );
};

const PublicUrlCard = ({
  path,
  fullUrl,
  copied,
  onCopy,
}: {
  path: string;
  fullUrl: string;
  copied: boolean;
  onCopy: () => void;
}) => (
  <div className="rounded-[10px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-3.5">
    <div className="flex items-start gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-[color:var(--dw-surface2)] text-[color:var(--dw-text-muted)]">
        <HugeiconsIcon icon={Link02Icon} size={14} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-medium">Public URL</div>
        <div className="mt-0.5 text-[11.5px] text-[color:var(--dw-text-dim)]">
          Share anywhere. Always live.
        </div>
      </div>
    </div>
    <div className="mt-3 flex items-center gap-2">
      <div className="dw-mono flex-1 truncate rounded-[7px] border border-[color:var(--dw-border)] bg-[color:var(--dw-bg)] px-2.5 py-1.5 text-[11px] text-[color:var(--dw-text-dim)]">
        {path || "—"}
      </div>
      <button
        onClick={onCopy}
        disabled={!fullUrl}
        aria-label="Copy URL"
        className="flex size-8 shrink-0 items-center justify-center rounded-[7px] border border-[color:var(--dw-border)] bg-[color:var(--dw-bg)] text-[color:var(--dw-text-muted)] transition hover:border-[color:var(--dw-accent)]/40 hover:text-[color:var(--dw-text)] disabled:opacity-40"
      >
        <HugeiconsIcon
          icon={copied ? Tick02Icon : Copy01Icon}
          size={13}
          className={copied ? "text-[color:var(--dw-jade)]" : ""}
        />
      </button>
      <a
        href={path || "#"}
        target="_blank"
        rel="noreferrer"
        className="flex h-8 shrink-0 items-center rounded-[7px] border border-[color:var(--dw-border)] bg-[color:var(--dw-bg)] px-3 text-[11.5px] font-medium text-[color:var(--dw-text)] transition hover:border-[color:var(--dw-accent)]/40"
      >
        Open
      </a>
    </div>
  </div>
);

const StatusDot = ({
  loading,
  connected,
  published,
}: {
  loading: boolean;
  connected: boolean;
  published: boolean;
}) => {
  if (loading) {
    return (
      <span className="dw-mono inline-flex items-center gap-1.5 text-[9.5px] font-medium tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
        <span className="size-1.5 animate-pulse rounded-full bg-[color:var(--dw-text-muted)]/50" />
        Checking...
      </span>
    );
  }

  if (published) {
    return (
      <span className="dw-mono inline-flex items-center gap-1.5 text-[9.5px] font-medium tracking-[0.14em] uppercase text-[color:var(--dw-accent)]">
        <span className="dw-pulse size-1.5 rounded-full bg-[color:var(--dw-accent)]" />
        Published
      </span>
    );
  }

  if (connected) {
    return (
      <span className="dw-mono inline-flex items-center gap-1.5 text-[9.5px] font-medium tracking-[0.14em] uppercase text-[color:var(--dw-jade)]">
        <span className="dw-pulse size-1.5 rounded-full bg-[color:var(--dw-jade)]" />
        Connected
      </span>
    );
  }

  return (
    <span className="dw-mono inline-flex items-center gap-1.5 text-[9.5px] font-medium tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
      <span className="size-1.5 rounded-full bg-[color:var(--dw-text-muted)]/50" />
      Not connected
    </span>
  );
};
