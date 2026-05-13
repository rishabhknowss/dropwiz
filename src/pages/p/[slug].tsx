import { useRouter } from "next/router";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { PaintBrush02Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { StoreRenderer } from "@/components/store/StoreRenderer";
import { api } from "@/utils/api";
import type { Store } from "@/db/schema";
import { SEOHead } from "@/components/seo";
import { storeMetadata } from "@/lib/seo/metadata";
import { productSchema, breadcrumbSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/seo/constants";

const PublicStorePage = () => {
  const router = useRouter();
  const slug = typeof router.query.slug === "string" ? router.query.slug : null;

  const storeQuery = api.stores.getBySlug.useQuery(
    { slug: slug ?? "" },
    { enabled: !!slug, refetchOnWindowFocus: false, retry: false },
  );
  const me = api.auth.me.useQuery(undefined, { refetchOnWindowFocus: false });

  if (!slug || storeQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[color:var(--dw-bg)]">
        <div className="dw-mono text-xs tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
          Loading store…
        </div>
      </div>
    );
  }

  if (storeQuery.isError || !storeQuery.data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[color:var(--dw-bg)] px-6 text-center text-[color:var(--dw-text)]">
        <div>
          <div className="dw-display-sm text-[32px]">Store not found</div>
          <div className="mt-3 text-sm opacity-60">
            This link may have expired or been unpublished.
          </div>
          <Link
            href="/"
            className="mt-6 inline-block text-sm font-medium underline"
          >
            Back to Dropwiz
          </Link>
        </div>
      </div>
    );
  }

  const store = storeQuery.data;
  const isOwner = me.data?.id === store.userId;

  if (store.status !== "ready" && store.status !== "published") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[color:var(--dw-bg)] px-6 text-center text-[color:var(--dw-text)]">
        <div>
          <div className="dw-display-sm text-[32px]">
            {store.status === "failed"
              ? "Generation failed"
              : "Still generating…"}
          </div>
          <div className="mt-3 text-sm opacity-60">
            {store.status === "failed"
              ? (store.failureReason ?? "Something went wrong.")
              : "Check back in a moment."}
          </div>
        </div>
      </div>
    );
  }

  const storeCopy = store.copy as Record<string, unknown> | undefined;
  const storeDescription =
    typeof storeCopy?.headline === "string"
      ? storeCopy.headline
      : `Shop ${store.name ?? "products"} - Built with Dropwiz AI`;

  const schemas = [
    productSchema({
      name: store.name ?? "Store",
      description: storeDescription,
      image: store.screenshotKey
        ? `https://assets.dropwiz.ai/${store.screenshotKey}`
        : `${SITE_URL}/og-default.png`,
      url: `${SITE_URL}/p/${store.slug}`,
    }),
    breadcrumbSchema([
      { name: "Stores", url: `${SITE_URL}/stores` },
      { name: store.name ?? "Store", url: `${SITE_URL}/p/${store.slug}` },
    ]),
  ];

  return (
    <>
      <SEOHead
        meta={storeMetadata(store.slug, store.name ?? "Store", storeDescription)}
        schemas={schemas}
      />
      {isOwner && (
        <Link
          href={`/app/stores/${store.id}/edit`}
          className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] px-4 py-2.5 text-[13px] font-medium text-[color:var(--dw-text)] shadow-lg backdrop-blur transition hover:-translate-y-0.5 hover:border-[color:var(--dw-accent)]/40"
        >
          <HugeiconsIcon icon={PaintBrush02Icon} size={14} />
          Edit this store
          <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
        </Link>
      )}
      <StoreRenderer store={store as unknown as Store} />
    </>
  );
};

export default PublicStorePage;
