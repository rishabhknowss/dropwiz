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
} from "@hugeicons/core-free-icons";
import { DashboardLayout } from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { ShopifyConnectModal } from "@/components/shopify/ShopifyConnectModal";
import { AddProductModal } from "@/components/shopify/AddProductModal";
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
      <div className="flex min-h-screen items-center justify-center bg-[var(--dw-bg)]">
        <div className="text-[13px] text-[var(--dw-text-muted)]">Loading...</div>
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
          className="gap-2 bg-[var(--dw-accent)] hover:bg-[var(--dw-accent-hover)]"
        >
          <HugeiconsIcon icon={PlusSignIcon} size={14} />
          Connect Shop
        </Button>
      }
    >
      {shops.isLoading ? (
        <div className="text-[13px] text-[var(--dw-text-muted)]">Loading shops...</div>
      ) : list.length === 0 ? (
        <EmptyState onConnect={() => setShowConnect(true)} />
      ) : (
        <div className="grid gap-3">
          {list.map((s) => (
            <ShopCard
              key={s.id}
              shopDomain={s.shopDomain}
              createdAt={s.createdAt}
              scope={s.scope}
              onDisconnect={() => handleDisconnect(s.shopDomain)}
              onAddProduct={() => setAddProductShop(s.shopDomain)}
              disconnecting={disconnect.isPending}
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
}: {
  shopDomain: string;
  createdAt: Date | string;
  scope: string | null;
  onDisconnect: () => void;
  onAddProduct: () => void;
  disconnecting: boolean;
}) => {
  const adminUrl = `https://${shopDomain}/admin`;
  const themesUrl = `https://${shopDomain}/admin/themes`;
  const productsUrl = `https://${shopDomain}/admin/products`;
  const installed = new Date(createdAt).toLocaleDateString();
  const hasOrdersScope = scope?.includes("read_orders") ?? false;

  const handleReconnect = () => {
    window.location.href = `/api/shopify/install?shop=${encodeURIComponent(shopDomain)}`;
  };

  return (
    <div className="rounded-lg border border-[var(--dw-border)] bg-[var(--dw-surface)] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-[var(--dw-accent-subtle)]">
            <HugeiconsIcon icon={ShoppingBag03Icon} size={18} className="text-[var(--dw-accent)]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-[var(--dw-text)]">{shopDomain}</span>
              <span className="rounded-full bg-[var(--dw-success-bg)] px-2 py-0.5 text-[9px] font-semibold text-[var(--dw-success)]">
                Connected
              </span>
            </div>
            <p className="mt-0.5 text-[10px] text-[var(--dw-text-muted)]">Installed {installed}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 border-[var(--dw-error)]/30 text-[var(--dw-error)] hover:border-[var(--dw-error)]/50 hover:bg-[var(--dw-error-bg)]"
          onClick={onDisconnect}
          disabled={disconnecting}
        >
          <HugeiconsIcon icon={Delete01Icon} size={12} />
          Disconnect
        </Button>
      </div>

      {!hasOrdersScope && (
        <div className="mt-3 flex items-start gap-2.5 rounded-md border border-[var(--dw-warning)]/30 bg-[var(--dw-warning-bg)] p-2.5">
          <HugeiconsIcon icon={AlertCircleIcon} size={14} className="mt-0.5 shrink-0 text-[var(--dw-warning)]" />
          <div className="flex-1">
            <p className="text-[11px] font-semibold text-[var(--dw-text)]">Analytics permissions required</p>
            <p className="mt-0.5 text-[10px] text-[var(--dw-text-muted)]">
              Reconnect to grant order read permissions for analytics.
            </p>
            <Button
              size="sm"
              onClick={handleReconnect}
              className="mt-2 h-7 gap-1.5 bg-[var(--dw-accent)] text-[10px] hover:bg-[var(--dw-accent-hover)]"
            >
              <HugeiconsIcon icon={Refresh04Icon} size={12} />
              Reconnect with Analytics
            </Button>
          </div>
        </div>
      )}

      {scope && (
        <p className="mt-2.5 text-[9px] text-[var(--dw-text-subtle)]">Scopes: {scope}</p>
      )}

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <QuickLink href={adminUrl} icon={Globe02Icon} label="Open admin" />
        <QuickLink href={productsUrl} icon={PackageDeliveredIcon} label="Products" />
        <QuickLink href={themesUrl} icon={ShoppingBag03Icon} label="Themes" />
      </div>

      <div className="mt-3 border-t border-[var(--dw-border)] pt-3">
        <button
          type="button"
          onClick={onAddProduct}
          className="inline-flex items-center gap-2 rounded-md bg-[var(--dw-accent)] px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-[var(--dw-accent-hover)]"
        >
          <HugeiconsIcon icon={PlusSignIcon} size={14} />
          Add Product
        </button>
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
    className="flex items-center justify-between gap-2 rounded-md border border-[var(--dw-border)] bg-[var(--dw-bg-secondary)] px-2.5 py-1.5 text-[10px] font-medium text-[var(--dw-text)] transition-colors hover:border-[var(--dw-accent)]/30 hover:bg-[var(--dw-surface-hover)]"
  >
    <span className="inline-flex items-center gap-1.5">
      <HugeiconsIcon icon={icon} size={12} className="text-[var(--dw-text-muted)]" />
      {label}
    </span>
    <HugeiconsIcon icon={ArrowRight01Icon} size={10} className="text-[var(--dw-text-subtle)]" />
  </a>
);

const EmptyState = ({ onConnect }: { onConnect: () => void }) => (
  <div className="rounded-lg border border-dashed border-[var(--dw-border)] bg-[var(--dw-surface)] p-10 text-center">
    <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-xl bg-[var(--dw-accent-subtle)]">
      <HugeiconsIcon icon={ShoppingBag03Icon} size={28} className="text-[var(--dw-accent)]" />
    </div>
    <h3 className="text-[18px] font-semibold text-[var(--dw-text)]">
      No shops connected yet
    </h3>
    <p className="mx-auto mt-2 max-w-md text-[13px] text-[var(--dw-text-muted)]">
      Connect a Shopify store to import existing products into Dropwiz, or publish your generated
      stores back to Shopify.
    </p>
    <Button
      onClick={onConnect}
      className="mt-5 gap-2 bg-[var(--dw-accent)] hover:bg-[var(--dw-accent-hover)]"
    >
      <HugeiconsIcon icon={PlusSignIcon} size={16} />
      Connect a Shop
    </Button>
  </div>
);

export default ShopifyManage;
