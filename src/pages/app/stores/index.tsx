import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MagicWand01Icon,
  ArrowRight01Icon,
  RocketIcon,
  SparklesIcon,
  Target02Icon,
  Add01Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/dashboard";
import { OnboardingModal } from "@/components/dw/OnboardingModal";
import { ShopifyConnectModal } from "@/components/shopify/ShopifyConnectModal";
import { api } from "@/utils/api";
import { cn } from "@/lib/utils";
import type { RouterOutputs } from "@/utils/api";

const ONBOARDING_KEY = "dropwiz_onboarding_complete";

type StoreCardData = RouterOutputs["stores"]["listMine"][number];

const getInitialOnboardingState = () => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ONBOARDING_KEY) !== "true";
};

const StoresIndex = () => {
  const router = useRouter();
  const me = api.auth.me.useQuery();
  const stores = api.stores.listMine.useQuery(undefined, {
    enabled: !!me.data,
    refetchOnWindowFocus: false,
  });

  const shouldShowConnect = router.query.action === "connect-shopify";
  const subscriptionSuccess = router.query.subscription === "success";
  const [showShopifyConnect, setShowShopifyConnect] = useState(false);
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);
  const successToastShown = useRef(false);

  const showOnboarding = useMemo(() => {
    if (onboardingDismissed) return false;
    if (!me.data || stores.data === undefined) return false;
    if (stores.data.length > 0) return false;
    return getInitialOnboardingState();
  }, [me.data, stores.data, onboardingDismissed]);

  useEffect(() => {
    if (!me.isLoading && !me.data) router.replace("/auth/signin");
  }, [me.isLoading, me.data, router]);

  useEffect(() => {
    if (shouldShowConnect) {
      const timer = setTimeout(() => {
        setShowShopifyConnect(true);
        router.replace("/app/stores", undefined, { shallow: true });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [shouldShowConnect, router]);

  useEffect(() => {
    if (subscriptionSuccess && !successToastShown.current) {
      successToastShown.current = true;
      toast.success("Welcome to PRO! You can now publish stores.");
      router.replace("/app/stores", undefined, { shallow: true });
    }
  }, [subscriptionSuccess, router]);

  const handleOnboardingComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setOnboardingDismissed(true);
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
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label="Published" value={published.length} icon={RocketIcon} color="success" />
          <StatCard label="Drafts" value={drafts.length} icon={Target02Icon} color="accent" />
          <StatCard label="Generating" value={generating.length} icon={SparklesIcon} color="warning" />
          <StatCard label="Total" value={stores.data?.length ?? 0} icon={MagicWand01Icon} color="default" />
        </div>
      )}

      {stores.isLoading ? (
        <div className="flex items-center gap-2 text-[13px] text-[var(--dw-text-muted)]">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--dw-border)] border-t-[var(--dw-accent)]" />
          Loading stores...
        </div>
      ) : hasStores ? (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[14px] font-semibold text-[var(--dw-text)]">Your Stores</h2>
            <Button asChild size="sm" className="h-8 gap-1.5 rounded-lg bg-[var(--dw-accent)] text-[12px] font-medium hover:bg-[var(--dw-accent-hover)]">
              <Link href="/build/new">
                <HugeiconsIcon icon={Add01Icon} size={14} />
                New Store
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
      <div className="group overflow-hidden rounded-xl border border-[var(--dw-border)] bg-[var(--dw-surface)] transition-all duration-200 hover:border-[var(--dw-border-strong)] hover:shadow-lg">
        <div
          className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--dw-bg-tertiary)]"
          style={{
            background: hasThumb ? undefined : `linear-gradient(135deg, ${store.themePreview.bg} 0%, ${store.themePreview.primary} 100%)`,
          }}
        >
          {hasThumb && store.thumbnailUrl && (
            <Image
              src={store.thumbnailUrl}
              alt=""
              fill
              unoptimized
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
          {inProgress && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span className="text-[11px] font-medium text-white">Generating...</span>
              </div>
            </div>
          )}
          {store.status === "failed" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <div className="rounded-full bg-[var(--dw-error)] px-4 py-1.5 text-[11px] font-medium text-white">
                Failed
              </div>
            </div>
          )}
          <div className="absolute right-3 top-3">
            <StatusBadge status={store.status} />
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-[13px] font-semibold text-[var(--dw-text)]">
                {store.name ?? "Untitled store"}
              </h3>
              <p className="mt-0.5 text-[11px] text-[var(--dw-text-muted)]">
                {new Date(store.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--dw-bg-tertiary)] text-[var(--dw-text-muted)] transition-all group-hover:bg-[var(--dw-accent)] group-hover:text-white">
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { bg: string; dot: string; label: string }> = {
    published: { bg: "bg-[var(--dw-success-bg)]", dot: "bg-[var(--dw-success)]", label: "Live" },
    ready: { bg: "bg-[var(--dw-accent-subtle)]", dot: "bg-[var(--dw-accent)]", label: "Draft" },
    failed: { bg: "bg-[var(--dw-error-bg)]", dot: "bg-[var(--dw-error)]", label: "Failed" },
    generating: { bg: "bg-[var(--dw-warning-bg)]", dot: "bg-[var(--dw-warning)]", label: "Building" },
    scraping: { bg: "bg-[var(--dw-warning-bg)]", dot: "bg-[var(--dw-warning)]", label: "Importing" },
  };

  const c = config[status] ?? { bg: "bg-[var(--dw-bg-tertiary)]", dot: "bg-[var(--dw-text-subtle)]", label: status };

  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium text-[var(--dw-text)]", c.bg)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />
      {c.label}
    </span>
  );
};

const StatCard = ({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: typeof RocketIcon;
  color: "success" | "warning" | "accent" | "default";
}) => {
  const iconColors = {
    success: "text-[var(--dw-success)]",
    warning: "text-[var(--dw-warning)]",
    accent: "text-[var(--dw-accent)]",
    default: "text-[var(--dw-text-muted)]",
  };

  return (
    <div className="rounded-xl border border-[var(--dw-border)] bg-[var(--dw-surface)] p-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-[var(--dw-text-muted)]">{label}</span>
        <HugeiconsIcon icon={icon} size={18} className={iconColors[color]} />
      </div>
      <p className="mt-2 text-[26px] font-bold tabular-nums tracking-tight text-[var(--dw-text)]">{value}</p>
    </div>
  );
};

const EmptyState = () => (
  <div className="flex flex-col items-center rounded-xl border border-dashed border-[var(--dw-border)] bg-[var(--dw-surface)] px-6 py-16 text-center">
    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--dw-accent-subtle)]">
      <HugeiconsIcon icon={MagicWand01Icon} size={26} className="text-[var(--dw-accent)]" />
    </div>
    <h3 className="text-[16px] font-semibold text-[var(--dw-text)]">Build your first store</h3>
    <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-[var(--dw-text-muted)]">
      Paste a product URL and Dropwiz generates a high-converting store in about 60 seconds.
    </p>
    <Button asChild className="mt-6 h-10 gap-2 rounded-lg bg-[var(--dw-accent)] px-5 text-[13px] font-semibold hover:bg-[var(--dw-accent-hover)]">
      <Link href="/build/new">
        <HugeiconsIcon icon={Add01Icon} size={16} />
        Create Store
      </Link>
    </Button>
  </div>
);

export default StoresIndex;
