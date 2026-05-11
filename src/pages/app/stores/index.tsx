import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SparklesIcon,
  Loading03Icon,
  Delete01Icon,
  Cancel01Icon,
  AlertCircleIcon,
  Edit02Icon,
  Globe02Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard";
import { OnboardingModal } from "@/components/dw/OnboardingModal";
import { ShopifyConnectModal } from "@/components/shopify/ShopifyConnectModal";
import { CardSkeleton } from "@/components/ui/loaders";
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
  const utils = api.useUtils();
  const deleteStore = api.stores.deleteStore.useMutation();

  const shouldShowConnect = router.query.action === "connect-shopify";
  const subscriptionSuccess = router.query.subscription === "success";
  const [showShopifyConnect, setShowShopifyConnect] = useState(false);
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<StoreCardData | null>(null);
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

  const handleDelete = () => {
    if (!deleteTarget) return;
    const id = toast.loading("Deleting store...");
    deleteStore.mutate(
      { storeId: deleteTarget.id },
      {
        onSuccess: () => {
          toast.success("Store deleted", { id });
          utils.stores.listMine.invalidate();
          setDeleteTarget(null);
        },
        onError: (err) => {
          toast.error(err.message, { id });
        },
      }
    );
  };

  if (!me.data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--dw-bg)]">
        <div className="relative mb-4">
          <div className="absolute inset-0 rounded-full bg-[var(--dw-accent)] opacity-20 blur-xl" />
          <div className="relative h-10 w-10 rounded-full border-2 border-[var(--dw-border)] border-t-[var(--dw-accent)] dw-spin" />
        </div>
        <div className="text-[13px] font-medium text-[var(--dw-text-muted)]">Loading your dashboard</div>
      </div>
    );
  }

  const hasStores = (stores.data?.length ?? 0) > 0;

  return (
    <DashboardLayout
      title={`Welcome back, ${me.data.name ?? me.data.email.split("@")[0]}`}
      subtitle={me.data.emailVerified ? "Pro account" : "Free tier"}
      action={
        <Link
          href="/build/new"
          className="inline-flex h-9 items-center gap-2 rounded-xl bg-[var(--dw-accent)] px-4 text-[12px] font-semibold text-[#0A0A0A] transition-all hover:bg-[var(--dw-accent-hover)]"
        >
          <HugeiconsIcon icon={SparklesIcon} size={14} />
          New Store
        </Link>
      }
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
      {deleteTarget && (
        <DeleteModal
          store={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          isDeleting={deleteStore.isPending}
        />
      )}

      {stores.isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : hasStores ? (
        <div className="animate-fade-up">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-[13px] text-[var(--dw-text-muted)]">
              {stores.data?.length} store{stores.data?.length !== 1 ? "s" : ""} created
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {stores.data?.map((s, i) => (
              <StoreCard
                key={s.id}
                store={s}
                index={i}
                onDelete={() => setDeleteTarget(s)}
              />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState />
      )}
    </DashboardLayout>
  );
};

const StoreCard = ({
  store,
  index = 0,
  onDelete,
}: {
  store: StoreCardData;
  index?: number;
  onDelete: () => void;
}) => {
  const inProgress = store.status === "generating" || store.status === "scraping";
  const isFailed = store.status === "failed";
  const hasThumb = !!store.thumbnailUrl && !inProgress && !isFailed;

  return (
    <div
      className="animate-slide-up group relative overflow-hidden rounded-lg border border-[var(--dw-border)] bg-[var(--dw-surface)] transition-all duration-200 hover:border-[var(--dw-accent)]/30"
      style={{ animationDelay: `${index * 30}ms`, animationFillMode: "both" }}
    >
      <div
        className="relative aspect-[4/3] w-full overflow-hidden"
        style={{
          background: hasThumb
            ? "var(--dw-bg-tertiary)"
            : isFailed
            ? "linear-gradient(135deg, #1a1a1a 0%, #2a1a1a 100%)"
            : `linear-gradient(135deg, ${store.themePreview.bg} 0%, ${store.themePreview.primary}40 100%)`,
        }}
      >
        {hasThumb && store.thumbnailUrl && (
          <Image
            src={store.thumbnailUrl}
            alt=""
            fill
            unoptimized
            className="object-cover"
          />
        )}
        {inProgress && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <div className="flex items-center gap-1.5 rounded-md bg-white/10 px-2.5 py-1.5">
              <HugeiconsIcon icon={Loading03Icon} size={11} className="text-[var(--dw-accent)] dw-spin" />
              <span className="text-[10px] font-medium text-white">Building...</span>
            </div>
          </div>
        )}
        {isFailed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
            <HugeiconsIcon icon={AlertCircleIcon} size={16} className="text-[var(--dw-error)]" />
            <span className="mt-1 text-[9px] font-medium text-[var(--dw-error)]">Failed</span>
          </div>
        )}
        <div className="absolute right-1.5 top-1.5">
          <StatusBadge status={store.status} />
        </div>
      </div>

      <div className="p-2.5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[12px] font-semibold text-[var(--dw-text)]">
              {store.name ?? "Untitled store"}
            </h3>
            <p className="mt-0.5 flex items-center gap-1 text-[9px] text-[var(--dw-text-subtle)]">
              {new Date(store.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
              {store.publishedShopifyUrl && (
                <span className="inline-flex items-center gap-0.5 text-[var(--dw-success)]">
                  <HugeiconsIcon icon={Globe02Icon} size={8} />
                  Live
                </span>
              )}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete();
            }}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-[var(--dw-text-subtle)] transition-all hover:bg-[var(--dw-error)]/10 hover:text-[var(--dw-error)]"
          >
            <HugeiconsIcon icon={Delete01Icon} size={11} />
          </button>
        </div>

        <Link
          href={`/app/stores/${store.id}/edit`}
          className="flex w-full items-center justify-center gap-1 rounded-md bg-[var(--dw-surface2)] px-2.5 py-1.5 text-[10px] font-medium text-[var(--dw-text)] transition-all hover:bg-[var(--dw-accent)] hover:text-[#0A0A0A]"
        >
          <HugeiconsIcon icon={Edit02Icon} size={11} />
          Edit Store
        </Link>
      </div>
    </div>
  );
};

const DeleteModal = ({
  store,
  onClose,
  onConfirm,
  isDeleting,
}: {
  store: StoreCardData;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
    <div className="animate-scale-in relative w-full max-w-md overflow-hidden rounded-2xl border border-[var(--dw-border)] bg-[var(--dw-surface)] shadow-2xl">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-[var(--dw-text-muted)] transition-colors hover:bg-[var(--dw-surface2)] hover:text-[var(--dw-text)]"
      >
        <HugeiconsIcon icon={Cancel01Icon} size={16} />
      </button>

      <div className="p-6">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--dw-error)]/10">
          <HugeiconsIcon icon={Delete01Icon} size={24} className="text-[var(--dw-error)]" />
        </div>

        <h3 className="text-[18px] font-bold text-[var(--dw-text)]">Delete store?</h3>
        <p className="mt-2 text-[14px] leading-relaxed text-[var(--dw-text-muted)]">
          This will permanently delete{" "}
          <span className="font-semibold text-[var(--dw-text)]">{store.name ?? "this store"}</span> and all its
          associated data. This action cannot be undone.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 rounded-xl border border-[var(--dw-border)] bg-[var(--dw-surface2)] px-4 py-3 text-[13px] font-semibold text-[var(--dw-text)] transition-all hover:bg-[var(--dw-surface-hover)] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--dw-error)] px-4 py-3 text-[13px] font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <HugeiconsIcon icon={Loading03Icon} size={14} className="dw-spin" />
                Deleting...
              </>
            ) : (
              <>
                <HugeiconsIcon icon={Delete01Icon} size={14} />
                Delete Store
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    published: {
      bg: "bg-[var(--dw-success)]/10",
      text: "text-[var(--dw-success)]",
      dot: "bg-[var(--dw-success)]",
      label: "Live",
    },
    ready: {
      bg: "bg-[var(--dw-accent)]/10",
      text: "text-[var(--dw-accent)]",
      dot: "bg-[var(--dw-accent)]",
      label: "Draft",
    },
    failed: {
      bg: "bg-[var(--dw-error)]/10",
      text: "text-[var(--dw-error)]",
      dot: "bg-[var(--dw-error)]",
      label: "Failed",
    },
    generating: {
      bg: "bg-[var(--dw-warning)]/10",
      text: "text-[var(--dw-warning)]",
      dot: "bg-[var(--dw-warning)]",
      label: "Building",
    },
    scraping: {
      bg: "bg-[var(--dw-warning)]/10",
      text: "text-[var(--dw-warning)]",
      dot: "bg-[var(--dw-warning)]",
      label: "Importing",
    },
  };

  const c = config[status] ?? {
    bg: "bg-[var(--dw-surface2)]",
    text: "text-[var(--dw-text-muted)]",
    dot: "bg-[var(--dw-text-subtle)]",
    label: status,
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[9px] font-semibold uppercase tracking-wide backdrop-blur-sm",
        c.bg,
        c.text
      )}
    >
      <span
        className={cn(
          "h-1 w-1 rounded-full",
          c.dot,
          status === "generating" || status === "scraping" ? "animate-pulse" : ""
        )}
      />
      {c.label}
    </span>
  );
};

const EmptyState = () => (
  <div className="animate-fade-up relative overflow-hidden rounded-2xl border border-dashed border-[var(--dw-border)] bg-[var(--dw-surface)] px-8 py-20 text-center">
    <div className="dw-grid-pattern absolute inset-0 opacity-30" />
    <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-[var(--dw-accent)] opacity-10 blur-3xl" />
    <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-[var(--dw-secondary)] opacity-10 blur-3xl" />

    <div className="relative z-10">
      <div className="relative mx-auto mb-6 inline-flex">
        <div className="absolute inset-0 rounded-2xl bg-[var(--dw-accent)] opacity-20 blur-xl" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--dw-accent)] to-[var(--dw-accent-hover)]">
          <HugeiconsIcon icon={SparklesIcon} size={28} className="text-[#0A0A0A]" />
        </div>
      </div>
      <h3 className="text-[20px] font-bold tracking-tight text-[var(--dw-text)]">Create your first store</h3>
      <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-[var(--dw-text-muted)]">
        Paste any product URL and watch AI generate a high-converting store with custom copy, imagery, and optimized
        layouts.
      </p>
      <Link
        href="/build/new"
        className="mt-8 inline-flex h-12 items-center gap-2.5 rounded-xl bg-gradient-to-r from-[var(--dw-accent)] to-[var(--dw-accent-hover)] px-6 text-[14px] font-semibold text-[#0A0A0A] shadow-lg shadow-[var(--dw-accent)]/20 transition-all hover:shadow-[var(--dw-accent)]/30 hover:brightness-110"
      >
        <HugeiconsIcon icon={SparklesIcon} size={16} />
        Create Store
      </Link>
      <p className="mt-4 text-[11px] font-medium uppercase tracking-wide text-[var(--dw-text-subtle)]">
        60 seconds · No credit card required
      </p>
    </div>
  </div>
);

export default StoresIndex;
