import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShoppingBag03Icon,
  PlusSignIcon,
  ArrowRight01Icon,
  Delete01Icon,
  PackageDeliveredIcon,
  Globe02Icon,
  AlertCircleIcon,
  Refresh04Icon,
  SparklesIcon,
  PaintBoardIcon,
} from "@hugeicons/core-free-icons";
import { DashboardLayout } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { ShopifyConnectModal } from "@/components/shopify/ShopifyConnectModal";
import { AddProductModal } from "@/components/shopify/AddProductModal";
import { CardSkeleton } from "@/components/ui/loaders";
import { api } from "@/utils/api";
import { runWithToast } from "@/hooks/useToastMutation";

const ShopifyManage = () => {
  const router = useRouter();
  const me = api.auth.me.useQuery();
  const shops = api.shopify.listShops.useQuery(undefined, {
    enabled: !!me.data,
    refetchOnWindowFocus: false,
  });
  const utils = api.useUtils();
  const disconnect = api.shopify.disconnectShop.useMutation();
  const [showConnect, setShowConnect] = useState(false);
  const [addProductShop, setAddProductShop] = useState<string | null>(null);

  useEffect(() => {
    if (!me.isLoading && !me.data) router.replace("/auth/signin");
  }, [me.isLoading, me.data, router]);

  if (!me.data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--dw-bg)]">
        <div className="relative mb-4">
          <div className="absolute inset-0 rounded-full bg-[var(--dw-accent)] opacity-20 blur-xl" />
          <div className="relative h-10 w-10 rounded-full border-2 border-[var(--dw-border)] border-t-[var(--dw-accent)] dw-spin" />
        </div>
        <div className="text-[13px] font-medium text-[var(--dw-text-muted)]">Loading...</div>
      </div>
    );
  }

  const handleDisconnect = (shopDomain: string) => {
    if (
      !confirm(
        `Disconnect ${shopDomain}? You'll need to re-install the Dropwiz app from Shopify to reconnect.`
      )
    )
      return;
    runWithToast(
      disconnect,
      { shopDomain },
      {
        loading: "Disconnecting…",
        success: "Disconnected",
        toastId: "shopify-disconnect",
        onSuccess: () => utils.shopify.listShops.invalidate(),
      }
    );
  };

  const list = shops.data ?? [];

  return (
    <DashboardLayout
      title="Shopify Integration"
      subtitle="Manage connected Shopify stores"
      action={
        <Button
          onClick={() => setShowConnect(true)}
          size="sm"
          className="h-9 gap-2 rounded-xl bg-[var(--dw-accent)] px-4 text-[12px] font-semibold text-[#0A0A0A] hover:bg-[var(--dw-accent-hover)]"
        >
          <HugeiconsIcon icon={PlusSignIcon} size={14} />
          Connect Shop
        </Button>
      }
    >
      {shops.isLoading ? (
        <div className="grid gap-4">
          <CardSkeleton hasImage={false} className="h-[200px]" />
        </div>
      ) : list.length === 0 ? (
        <EmptyState onConnect={() => setShowConnect(true)} />
      ) : (
        <div className="grid gap-5">
          {list.map((s, i) => (
            <ShopCard
              key={s.id}
              shopDomain={s.shopDomain}
              createdAt={s.createdAt}
              scope={s.scope}
              onDisconnect={() => handleDisconnect(s.shopDomain)}
              onAddProduct={() => setAddProductShop(s.shopDomain)}
              disconnecting={disconnect.isPending}
              index={i}
            />
          ))}
        </div>
      )}

      {showConnect && (
        <ShopifyConnectModal onClose={() => setShowConnect(false)} />
      )}

      {addProductShop && (
        <AddProductModal
          onClose={() => setAddProductShop(null)}
          shops={list.map((s) => ({ id: s.id, shopDomain: s.shopDomain }))}
          preselectedShop={addProductShop}
        />
      )}
    </DashboardLayout>
  );
};

const ShopCard = ({
  shopDomain,
  createdAt,
  scope,
  onDisconnect,
  onAddProduct,
  disconnecting,
  index = 0,
}: {
  shopDomain: string;
  createdAt: Date | string;
  scope: string | null;
  onDisconnect: () => void;
  onAddProduct: () => void;
  disconnecting: boolean;
  index?: number;
}) => {
  const adminUrl = `https://${shopDomain}/admin`;
  const themesUrl = `https://${shopDomain}/admin/themes`;
  const productsUrl = `https://${shopDomain}/admin/products`;
  const installed = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const hasOrdersScope = scope?.includes("read_orders") ?? false;
  const shopName = shopDomain.replace(".myshopify.com", "");

  const handleReconnect = () => {
    window.location.href = `/api/shopify/install?shop=${encodeURIComponent(shopDomain)}`;
  };

  return (
    <div
      className="animate-slide-up group relative overflow-hidden rounded-2xl border border-[var(--dw-border)] bg-[var(--dw-surface)] transition-all duration-300 hover:border-[var(--dw-accent)]/30 hover:shadow-xl hover:shadow-[var(--dw-accent)]/5"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: "both" }}
    >
      <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-[var(--dw-accent)] opacity-5 blur-3xl transition-opacity group-hover:opacity-10" />

      <div className="relative p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[var(--dw-accent)] to-[var(--dw-accent-hover)] opacity-20 blur-md" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--dw-accent)] to-[var(--dw-accent-hover)]">
                <HugeiconsIcon icon={ShoppingBag03Icon} size={22} className="text-[#0A0A0A]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-[15px] font-bold tracking-tight text-[var(--dw-text)]">{shopName}</span>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--dw-success)]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--dw-success)]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--dw-success)]" />
                  Connected
                </span>
              </div>
              <p className="mt-1 text-[11px] text-[var(--dw-text-muted)]">Installed {installed}</p>
            </div>
          </div>
          <button
            onClick={onDisconnect}
            disabled={disconnecting}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--dw-border)] bg-[var(--dw-surface2)] px-3 py-2 text-[11px] font-medium text-[var(--dw-text-muted)] transition-all hover:border-[var(--dw-error)]/30 hover:bg-[var(--dw-error)]/10 hover:text-[var(--dw-error)] disabled:opacity-50"
          >
            <HugeiconsIcon icon={Delete01Icon} size={12} />
            Disconnect
          </button>
        </div>

        {!hasOrdersScope && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-[var(--dw-warning)]/20 bg-[var(--dw-warning)]/5 p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--dw-warning)]/15">
              <HugeiconsIcon icon={AlertCircleIcon} size={16} className="text-[var(--dw-warning)]" />
            </div>
            <div className="flex-1">
              <p className="text-[12px] font-semibold text-[var(--dw-text)]">Analytics permissions required</p>
              <p className="mt-1 text-[11px] leading-relaxed text-[var(--dw-text-muted)]">
                Reconnect to grant order read permissions for advanced analytics and insights.
              </p>
              <button
                onClick={handleReconnect}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[var(--dw-warning)] px-3.5 py-2 text-[11px] font-semibold text-[#0A0A0A] transition-all hover:brightness-110"
              >
                <HugeiconsIcon icon={Refresh04Icon} size={12} />
                Reconnect with Analytics
              </button>
            </div>
          </div>
        )}

        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <QuickLink href={adminUrl} icon={Globe02Icon} label="Admin Panel" />
          <QuickLink href={productsUrl} icon={PackageDeliveredIcon} label="Products" />
          <QuickLink href={themesUrl} icon={PaintBoardIcon} label="Themes" />
        </div>

        {scope && (
          <div className="mt-4 rounded-lg bg-[var(--dw-surface2)] px-3 py-2">
            <p className="text-[9px] font-medium uppercase tracking-wide text-[var(--dw-text-subtle)]">
              Scopes: <span className="text-[var(--dw-text-muted)]">{scope}</span>
            </p>
          </div>
        )}

        <div className="mt-5 flex items-center justify-between border-t border-[var(--dw-border)] pt-5">
          <div className="text-[11px] text-[var(--dw-text-subtle)]">
            Push products to this store or import existing inventory
          </div>
          <button
            type="button"
            onClick={onAddProduct}
            className="group/btn inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--dw-accent)] to-[var(--dw-accent-hover)] px-5 py-2.5 text-[12px] font-semibold text-[#0A0A0A] shadow-lg shadow-[var(--dw-accent)]/20 transition-all hover:shadow-[var(--dw-accent)]/30 hover:brightness-110"
          >
            <HugeiconsIcon icon={PlusSignIcon} size={14} className="transition-transform group-hover/btn:scale-110" />
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
};

const QuickLink = ({
  href,
  icon,
  label,
}: {
  href: string;
  icon: typeof ShoppingBag03Icon;
  label: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="group/link flex items-center justify-between gap-2 rounded-xl border border-[var(--dw-border)] bg-[var(--dw-surface2)] px-3.5 py-3 text-[11px] font-medium text-[var(--dw-text)] transition-all duration-200 hover:border-[var(--dw-accent)]/30 hover:bg-[var(--dw-accent)]/5"
  >
    <span className="inline-flex items-center gap-2.5">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--dw-bg)] transition-colors group-hover/link:bg-[var(--dw-accent)]/10">
        <HugeiconsIcon icon={icon} size={14} className="text-[var(--dw-text-muted)] transition-colors group-hover/link:text-[var(--dw-accent)]" />
      </span>
      {label}
    </span>
    <HugeiconsIcon
      icon={ArrowRight01Icon}
      size={12}
      className="text-[var(--dw-text-subtle)] transition-all group-hover/link:translate-x-0.5 group-hover/link:text-[var(--dw-accent)]"
    />
  </a>
);

const EmptyState = ({ onConnect }: { onConnect: () => void }) => (
  <div className="animate-fade-up relative overflow-hidden rounded-2xl border border-dashed border-[var(--dw-border)] bg-[var(--dw-surface)] px-8 py-16 text-center">
    <div className="dw-grid-pattern absolute inset-0 opacity-30" />
    <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-[var(--dw-accent)] opacity-10 blur-3xl" />
    <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-[var(--dw-secondary)] opacity-10 blur-3xl" />

    <div className="relative z-10">
      <div className="relative mx-auto mb-6 inline-flex">
        <div className="absolute inset-0 rounded-2xl bg-[var(--dw-accent)] opacity-20 blur-xl" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--dw-accent)] to-[var(--dw-accent-hover)]">
          <HugeiconsIcon icon={ShoppingBag03Icon} size={28} className="text-[#0A0A0A]" />
        </div>
      </div>
      <h3 className="text-[20px] font-bold tracking-tight text-[var(--dw-text)]">
        Connect your Shopify store
      </h3>
      <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-[var(--dw-text-muted)]">
        Link your Shopify store to import existing products into Dropmagic, or seamlessly publish your AI-generated stores.
      </p>
      <button
        onClick={onConnect}
        className="mt-8 inline-flex h-12 items-center gap-2.5 rounded-xl bg-gradient-to-r from-[var(--dw-accent)] to-[var(--dw-accent-hover)] px-6 text-[14px] font-semibold text-[#0A0A0A] shadow-lg shadow-[var(--dw-accent)]/20 transition-all hover:shadow-[var(--dw-accent)]/30 hover:brightness-110"
      >
        <HugeiconsIcon icon={PlusSignIcon} size={16} />
        Connect a Shop
      </button>
      <p className="mt-4 text-[11px] font-medium uppercase tracking-wide text-[var(--dw-text-subtle)]">
        Secure OAuth · No passwords stored
      </p>
    </div>
  </div>
);

export default ShopifyManage;
