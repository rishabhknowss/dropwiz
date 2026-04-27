import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShoppingBag03Icon,
  PlusSignIcon,
  ArrowRight01Icon,
  Delete01Icon,
  PackageDeliveredIcon,
  Globe02Icon,
} from "@hugeicons/core-free-icons";
import { DWTopNav } from "@/components/dw/TopNav";
import { DWChip } from "@/components/dw/Chip";
import { Button } from "@/components/ui/button";
import { ShopifyConnectModal } from "@/components/shopify/ShopifyConnectModal";
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

  useEffect(() => {
    if (!me.isLoading && !me.data) router.replace("/auth/signin");
  }, [me.isLoading, me.data, router]);

  if (!me.data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[color:var(--dw-bg)]">
        <div className="dw-mono text-xs tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
          Loading…
        </div>
      </div>
    );
  }

  const handleDisconnect = (shopDomain: string) => {
    if (
      !confirm(
        `Disconnect ${shopDomain}? You'll need to re-install the Dropwiz app from Shopify to reconnect.`,
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
      },
    );
  };

  const list = shops.data ?? [];

  return (
    <div className="min-h-screen bg-[color:var(--dw-bg)] text-[color:var(--dw-text)]">
      <DWTopNav
        active="Shopify"
        items={[
          { label: "Stores", href: "/app/stores" },
          { label: "Shopify", href: "/app/shopify" },
        ]}
      />
      <main className="mx-auto max-w-[960px] px-5 py-10 md:px-6 md:py-14">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="dw-mono mb-2 inline-flex items-center gap-2 text-[10px] tracking-[0.16em] uppercase text-[color:var(--dw-text-muted)]">
              <HugeiconsIcon icon={ShoppingBag03Icon} size={11} />
              Shopify integration
            </div>
            <h1 className="dw-display-sm text-[28px] leading-[1.05] tracking-[-0.02em] md:text-[32px] lg:text-[36px]">
              Connected shops
              <span className="text-[color:var(--dw-accent)]">.</span>
            </h1>
            <p className="mt-2 text-[14px] text-[color:var(--dw-text-dim)]">
              Manage which Shopify stores Dropwiz can publish to and import
              from.
            </p>
          </div>
          <Button onClick={() => setShowConnect(true)} className="gap-1.5">
            <HugeiconsIcon icon={PlusSignIcon} size={13} />
            Connect new shop
          </Button>
        </div>

        {shops.isLoading ? (
          <div className="dw-mono mt-12 text-[11px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
            Loading shops…
          </div>
        ) : list.length === 0 ? (
          <EmptyState onConnect={() => setShowConnect(true)} />
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-4">
            {list.map((s) => (
              <ShopCard
                key={s.id}
                shopDomain={s.shopDomain}
                createdAt={s.createdAt}
                scope={s.scope}
                onDisconnect={() => handleDisconnect(s.shopDomain)}
                disconnecting={disconnect.isPending}
              />
            ))}
          </div>
        )}
      </main>
      {showConnect && (
        <ShopifyConnectModal onClose={() => setShowConnect(false)} />
      )}
    </div>
  );
};

const ShopCard = ({
  shopDomain,
  createdAt,
  scope,
  onDisconnect,
  disconnecting,
}: {
  shopDomain: string;
  createdAt: Date | string;
  scope: string | null;
  onDisconnect: () => void;
  disconnecting: boolean;
}) => {
  const adminUrl = `https://${shopDomain}/admin`;
  const themesUrl = `https://${shopDomain}/admin/themes`;
  const productsUrl = `https://${shopDomain}/admin/products`;
  const installed = new Date(createdAt).toLocaleDateString();

  return (
    <div className="rounded-[16px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex size-10 items-center justify-center rounded-[10px] bg-[color:var(--dw-surface2)] text-[color:var(--dw-text-muted)]">
            <HugeiconsIcon icon={ShoppingBag03Icon} size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div className="text-[15px] font-medium">{shopDomain}</div>
              <DWChip variant="live">Connected</DWChip>
            </div>
            <div className="dw-mono mt-1 text-[10.5px] tracking-[0.1em] uppercase text-[color:var(--dw-text-muted)]">
              Installed {installed}
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={onDisconnect}
          disabled={disconnecting}
        >
          <HugeiconsIcon icon={Delete01Icon} size={11} />
          Disconnect
        </Button>
      </div>
      {scope && (
        <div className="dw-mono mt-3 text-[10.5px] tracking-[0.06em] text-[color:var(--dw-text-muted)]">
          Scopes: {scope}
        </div>
      )}
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <QuickLink href={adminUrl} icon={Globe02Icon} label="Open admin" />
        <QuickLink
          href={productsUrl}
          icon={PackageDeliveredIcon}
          label="Products"
        />
        <QuickLink
          href={themesUrl}
          icon={ShoppingBag03Icon}
          label="Themes"
        />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[color:var(--dw-border)] pt-4">
        <Link
          href={`/build/shopify/${encodeURIComponent(shopDomain)}`}
          className="inline-flex items-center gap-1.5 rounded-[8px] border border-[color:var(--dw-border)] bg-[color:var(--dw-bg)] px-3 py-1.5 text-[12px] font-medium hover:border-[color:var(--dw-accent)]/40"
        >
          Import a product
          <HugeiconsIcon icon={ArrowRight01Icon} size={11} />
        </Link>
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
    className="flex items-center justify-between gap-2 rounded-[8px] border border-[color:var(--dw-border)] bg-[color:var(--dw-bg)] px-3 py-2 text-[12px] text-[color:var(--dw-text)] transition hover:border-[color:var(--dw-accent)]/40"
  >
    <span className="inline-flex items-center gap-1.5">
      <HugeiconsIcon icon={icon} size={12} />
      {label}
    </span>
    <HugeiconsIcon
      icon={ArrowRight01Icon}
      size={11}
      className="text-[color:var(--dw-text-muted)]"
    />
  </a>
);

const EmptyState = ({ onConnect }: { onConnect: () => void }) => (
  <div className="relative mt-10 overflow-hidden rounded-[18px] border border-dashed border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-10 text-center">
    <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-[12px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface2)] text-[color:var(--dw-accent)]">
      <HugeiconsIcon icon={ShoppingBag03Icon} size={20} />
    </div>
    <div className="dw-display-sm text-[24px]">
      No shops connected yet
      <span className="text-[color:var(--dw-accent)]">.</span>
    </div>
    <p className="mx-auto mt-2 max-w-[420px] text-[13px] leading-[1.5] text-[color:var(--dw-text-dim)]">
      Connect a Shopify store to import existing products into Dropwiz, or
      publish your generated stores back to Shopify.
    </p>
    <Button onClick={onConnect} className="mt-5 gap-1.5">
      <HugeiconsIcon icon={PlusSignIcon} size={13} />
      Connect a shop
    </Button>
  </div>
);

export default ShopifyManage;
