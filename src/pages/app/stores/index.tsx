import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SparklesIcon,
  Delete01Icon,
  Cancel01Icon,
  ArrowRight01Icon,
  Add01Icon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard";
import { ShopifyConnectModal } from "@/components/shopify/ShopifyConnectModal";
import { api } from "@/utils/api";
import { cn } from "@/lib/utils";
import type { RouterOutputs } from "@/utils/api";

type StoreCardData = RouterOutputs["stores"]["listMine"][number];

const PROMO_BANNER = {
  id: "shopify",
  badge: "Shopify exclusive offer!",
  title: "3 months for",
  highlight: "$1!",
  subtitle: "This offer is also available for the creation of multiple stores",
  cta: "Get the offer",
  href: "https://www.shopify.com/in/free-trial",
  image: "/shopify-logo.png",
  gradient: "from-[#0A0A0A] to-[#1a2a1a]",
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
  const [deleteTarget, setDeleteTarget] = useState<StoreCardData | null>(null);
  const successToastShown = useRef(false);

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
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAFAFA]">
        <div className="relative mb-4">
          <div className="absolute inset-0 rounded-full bg-[var(--dw-accent)] opacity-20 blur-xl" />
          <div className="relative h-10 w-10 rounded-full border-2 border-[#E5E5E5] border-t-[var(--dw-accent)] animate-spin" />
        </div>
        <div className="text-[13px] font-medium text-[#666666]">Loading your dashboard</div>
      </div>
    );
  }

  return (
    <DashboardLayout>
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

      <div className="p-6 lg:p-8">
        <section className="mb-10">
          <div
            className={cn(
              "relative overflow-hidden rounded-2xl bg-gradient-to-r p-6",
              PROMO_BANNER.gradient
            )}
          >
            <span className="mb-3 inline-block rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium text-white/80">
              {PROMO_BANNER.badge}
            </span>
            <h3 className="text-[28px] font-bold leading-tight text-white">
              {PROMO_BANNER.title}{" "}
              <span className="text-[var(--dw-accent)]">{PROMO_BANNER.highlight}</span>
            </h3>
            <p className="mt-2 max-w-[280px] text-[13px] leading-relaxed text-white/60">
              {PROMO_BANNER.subtitle}
            </p>
            <a
              href={PROMO_BANNER.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-[13px] font-semibold text-[#0A0A0A] transition-all hover:bg-white/90"
            >
              {PROMO_BANNER.cta}
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
            </a>
            <div className="absolute bottom-4 right-4">
              <Image
                src={PROMO_BANNER.image}
                alt=""
                width={80}
                height={80}
                className="opacity-80"
                unoptimized
              />
            </div>
          </div>
        </section>

        <section className="mb-10">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-[20px] font-bold text-[#0A0A0A]">Your stores</h2>
            <Link
              href="/build/new"
              className="inline-flex items-center gap-2 rounded-lg bg-[#0A0A0A] px-4 py-2 text-[13px] font-medium text-white transition-all hover:bg-[#1a1a1a]"
            >
              New store
            </Link>
          </div>

          {stores.isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-[#E5E5E5]" />
              ))}
            </div>
          ) : (stores.data?.length ?? 0) > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {stores.data?.map((s, i) => (
                <StoreCard
                  key={s.id}
                  store={s}
                  index={i}
                  onDelete={() => setDeleteTarget(s)}
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </section>

      </div>
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
  const isBuilt = (store.status === "ready" || store.status === "published") && !!store.thumbnailUrl && store.thumbnailUrl.length > 10;

  return (
    <Link
      href={`/app/stores/${store.id}/edit`}
      className="group relative overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white p-2 transition-all hover:border-[#CCCCCC] hover:shadow-md"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div
        className={cn(
          "relative aspect-[4/3] w-full overflow-hidden rounded-xl border",
          isBuilt ? "border-[#E5E5E5] bg-[#F5F5F5]" : "border-[#E0E0E0] bg-[#F0F0F0]"
        )}
      >
        {isBuilt ? (
          <Image
            src={store.thumbnailUrl!}
            alt=""
            fill
            unoptimized
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <HugeiconsIcon icon={SparklesIcon} size={28} className="text-[#BBBBBB]" />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-1 pt-2.5 pb-1">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[13px] font-medium text-[#0A0A0A]">
            {store.name ?? "Untitled store"}
          </h3>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            onDelete();
          }}
          className="flex size-7 items-center justify-center rounded-lg text-[#CCCCCC] opacity-0 transition-all hover:bg-red-50 hover:text-[#DC2626] group-hover:opacity-100"
        >
          <HugeiconsIcon icon={Delete01Icon} size={14} />
        </button>
      </div>
    </Link>
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
    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
    <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white shadow-2xl">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-[#999999] transition-colors hover:bg-[#F5F5F5] hover:text-[#666666]"
      >
        <HugeiconsIcon icon={Cancel01Icon} size={16} />
      </button>

      <div className="p-6">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
          <HugeiconsIcon icon={Delete01Icon} size={24} className="text-[var(--dw-error)]" />
        </div>

        <h3 className="text-[18px] font-bold text-[#0A0A0A]">Delete store?</h3>
        <p className="mt-2 text-[14px] leading-relaxed text-[#666666]">
          This will permanently delete{" "}
          <span className="font-semibold text-[#0A0A0A]">{store.name ?? "this store"}</span> and all its
          associated data. This action cannot be undone.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 rounded-xl border border-[#E5E5E5] bg-white px-4 py-3 text-[13px] font-semibold text-[#0A0A0A] transition-all hover:bg-[#F5F5F5] disabled:opacity-50"
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
                <HugeiconsIcon icon={Loading03Icon} size={14} className="animate-spin" />
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

const EmptyState = () => (
  <div className="relative overflow-hidden rounded-2xl border border-dashed border-[#E5E5E5] bg-white px-8 py-16 text-center">
    <div className="relative z-10">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--dw-accent)]/10">
        <HugeiconsIcon icon={SparklesIcon} size={24} className="text-[var(--dw-accent)]" />
      </div>
      <h3 className="text-[18px] font-bold text-[#0A0A0A]">Create your first store</h3>
      <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-[#666666]">
        Paste any product URL and watch AI generate a high-converting store with custom copy and imagery.
      </p>
      <Link
        href="/build/new"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0A0A0A] px-5 py-3 text-[14px] font-semibold text-white transition-all hover:bg-[#1a1a1a]"
      >
        <HugeiconsIcon icon={Add01Icon} size={16} />
        Create Store
      </Link>
    </div>
  </div>
);

export default StoresIndex;
