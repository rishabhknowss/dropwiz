import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MagicWand01Icon,
  ArrowRight01Icon,
  RocketIcon,
  SparklesIcon,
  Target02Icon,
  Add01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/dashboard";
import { OnboardingModal } from "@/components/dw/OnboardingModal";
import { ShopifyConnectModal } from "@/components/shopify/ShopifyConnectModal";
import { api } from "@/utils/api";
import { cn } from "@/lib/utils";
import type { RouterOutputs } from "@/utils/api";

const ONBOARDING_KEY = "dropwiz_onboarding_complete";

type StoreCardData = RouterOutputs["stores"]["listMine"][number];

const StoresIndex = () => {
  const router = useRouter();
  const me = api.auth.me.useQuery();
  const stores = api.stores.listMine.useQuery(undefined, {
    enabled: !!me.data,
    refetchOnWindowFocus: false,
  });
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showShopifyConnect, setShowShopifyConnect] = useState(false);

  useEffect(() => {
    if (!me.isLoading && !me.data) router.replace("/auth/signin");
  }, [me.isLoading, me.data, router]);

  useEffect(() => {
    if (router.query.action === "connect-shopify") {
      setShowShopifyConnect(true);
      router.replace("/app/stores", undefined, { shallow: true });
    }
  }, [router.query.action, router]);

  useEffect(() => {
    if (me.data && stores.data !== undefined) {
      const hasCompleted = localStorage.getItem(ONBOARDING_KEY) === "true";
      if (!hasCompleted && stores.data.length === 0) {
        setShowOnboarding(true);
      }
    }
  }, [me.data, stores.data]);

  const handleOnboardingComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setShowOnboarding(false);
  };

  if (!me.data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--dw-bg)]">
        <div className="text-[13px] text-[var(--dw-text-muted)]">Loading...</div>
      </div>
    );
  }

  const published = stores.data?.filter((s) => s.status === "published") ?? [];
  const drafts = stores.data?.filter((s) => s.status === "ready") ?? [];
  const generating = stores.data?.filter(
    (s) => s.status === "generating" || s.status === "scraping"
  ) ?? [];

  const hasStores = (stores.data?.length ?? 0) > 0;

  return (
    <DashboardLayout
      title={`Welcome, ${me.data.name ?? me.data.email.split("@")[0]}`}
      subtitle={me.data.emailVerified ? "Verified account" : "Pending verification"}
    >
      {showOnboarding && (
        <OnboardingModal
          userName={me.data?.name ?? undefined}
          onComplete={handleOnboardingComplete}
        />
      )}
      {showShopifyConnect && (
        <ShopifyConnectModal onClose={() => setShowShopifyConnect(false)} />
      )}

      {hasStores && (
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Published" value={published.length} icon={RocketIcon} variant="success" />
          <StatCard label="Drafts" value={drafts.length} icon={Target02Icon} variant="default" />
          <StatCard label="Generating" value={generating.length} icon={SparklesIcon} variant="warning" />
          <StatCard label="Total" value={stores.data?.length ?? 0} icon={MagicWand01Icon} variant="accent" />
        </div>
      )}

      {stores.isLoading ? (
        <div className="text-[13px] text-[var(--dw-text-muted)]">Loading stores...</div>
      ) : hasStores ? (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[14px] font-medium text-[var(--dw-text)]">Your Stores</h2>
            <Button asChild size="sm" className="h-8 gap-1.5 bg-[var(--dw-accent)] text-[12px] hover:bg-[var(--dw-accent-hover)]">
              <Link href="/build/new">
                <HugeiconsIcon icon={Add01Icon} size={14} />
                New Store
              </Link>
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stores.data?.map((s) => (
              <StoreCard key={s.id} store={s} />
            ))}
          </div>
        </>
      ) : (
        <EmptyState />
      )}
    </DashboardLayout>
  );
};

const StoreCard = ({ store }: { store: StoreCardData }) => {
  const inProgress = store.status === "generating" || store.status === "scraping";
  const hasThumb = !!store.thumbnailUrl && !inProgress;

  return (
    <Link href={`/app/stores/${store.id}/edit`}>
      <div className="group overflow-hidden rounded-lg border border-[var(--dw-border)] bg-[var(--dw-surface)] transition-all hover:border-[var(--dw-border-strong)]">
        <div
          className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--dw-bg-tertiary)]"
          style={{
            background: hasThumb ? undefined : `linear-gradient(135deg, ${store.themePreview.bg} 0%, ${store.themePreview.primary} 100%)`,
          }}
        >
          {hasThumb && store.thumbnailUrl && (
            <img
              src={store.thumbnailUrl}
              alt=""
              className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          )}
          {inProgress && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="flex items-center gap-2 rounded-md bg-white/10 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur">
                <span className="size-1.5 animate-pulse rounded-full bg-white" />
                Generating...
              </div>
            </div>
          )}
          {store.status === "failed" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="rounded-md bg-[var(--dw-error)] px-3 py-1.5 text-[11px] font-medium text-white">
                Failed
              </div>
            </div>
          )}
          <div className="absolute right-2 top-2">
            <StatusBadge status={store.status} />
          </div>
        </div>
        <div className="p-3">
          <h3 className="truncate text-[13px] font-medium text-[var(--dw-text)]">
            {store.name ?? "Untitled store"}
          </h3>
          <p className="mt-0.5 text-[11px] text-[var(--dw-text-muted)]">
            {new Date(store.createdAt).toLocaleDateString()}
          </p>
          <div className="mt-2 flex items-center justify-between border-t border-[var(--dw-border)] pt-2">
            <span className="text-[11px] text-[var(--dw-text-muted)]">Edit store</span>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={12}
              className="text-[var(--dw-text-subtle)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--dw-accent)]"
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    published: { bg: "bg-[var(--dw-success)]", text: "text-white", label: "Live" },
    ready: { bg: "bg-[var(--dw-accent)]", text: "text-white", label: "Draft" },
    failed: { bg: "bg-[var(--dw-error)]", text: "text-white", label: "Failed" },
    generating: { bg: "bg-[var(--dw-warning)]", text: "text-black", label: "Building" },
    scraping: { bg: "bg-[var(--dw-warning)]", text: "text-black", label: "Importing" },
  };

  const c = config[status] ?? { bg: "bg-[var(--dw-bg-tertiary)]", text: "text-[var(--dw-text-muted)]", label: status };

  return (
    <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-medium", c.bg, c.text)}>
      {c.label}
    </span>
  );
};

const StatCard = ({
  label,
  value,
  icon,
  variant,
}: {
  label: string;
  value: number;
  icon: typeof RocketIcon;
  variant: "success" | "warning" | "default" | "accent";
}) => {
  const iconColors = {
    success: "text-[var(--dw-success)]",
    warning: "text-[var(--dw-warning)]",
    default: "text-[var(--dw-text-muted)]",
    accent: "text-[var(--dw-accent)]",
  };

  return (
    <div className="rounded-lg border border-[var(--dw-border)] bg-[var(--dw-surface)] p-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-[var(--dw-text-muted)]">{label}</span>
        <HugeiconsIcon icon={icon} size={16} className={iconColors[variant]} />
      </div>
      <p className="mt-1 text-[22px] font-semibold tabular-nums text-[var(--dw-text)]">{value}</p>
    </div>
  );
};

const EmptyState = () => (
  <div className="rounded-lg border border-dashed border-[var(--dw-border)] bg-[var(--dw-surface)] p-10 text-center">
    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--dw-accent-subtle)]">
      <HugeiconsIcon icon={MagicWand01Icon} size={24} className="text-[var(--dw-accent)]" />
    </div>
    <h3 className="text-[16px] font-semibold text-[var(--dw-text)]">Build your first store</h3>
    <p className="mx-auto mt-1 max-w-sm text-[13px] text-[var(--dw-text-muted)]">
      Paste a product URL and Dropwiz generates a high-converting store in about 60 seconds.
    </p>
    <Button asChild className="mt-4 gap-1.5 bg-[var(--dw-accent)] hover:bg-[var(--dw-accent-hover)]">
      <Link href="/build/new">
        <HugeiconsIcon icon={Add01Icon} size={14} />
        Create Store
      </Link>
    </Button>
  </div>
);

export default StoresIndex;
