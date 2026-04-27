import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MagicWand01Icon,
  ArrowRight01Icon,
  RocketIcon,
  SparklesIcon,
  Target02Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { DWTopNav } from "@/components/dw/TopNav";
import { DWChip } from "@/components/dw/Chip";
import { api } from "@/utils/api";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/trpc-errors";
import type { RouterOutputs } from "@/utils/api";

type StoreCardData = RouterOutputs["stores"]["listMine"][number];

const StoresIndex = () => {
  const router = useRouter();
  const me = api.auth.me.useQuery();
  const stores = api.stores.listMine.useQuery(undefined, {
    enabled: !!me.data,
    refetchOnWindowFocus: false,
  });
  const utils = api.useUtils();
  const signOut = api.auth.signOut.useMutation();

  useEffect(() => {
    if (!me.isLoading && !me.data) router.replace("/auth/signin");
  }, [me.isLoading, me.data, router]);

  const handleSignOut = () => {
    const id = toast.loading("Signing out...");
    signOut.mutate(undefined, {
      onSuccess: async () => {
        toast.success("Signed out", { id });
        await utils.auth.me.invalidate();
        router.push("/");
      },
      onError: (err) => toast.error(getErrorMessage(err), { id }),
    });
  };

  if (!me.data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[color:var(--dw-bg)]">
        <div className="dw-mono text-xs tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
          Loading…
        </div>
      </div>
    );
  }

  const published = stores.data?.filter((s) => s.status === "published") ?? [];
  const drafts = stores.data?.filter((s) => s.status === "ready") ?? [];
  const generating = stores.data?.filter(
    (s) => s.status === "generating" || s.status === "scraping",
  ) ?? [];

  const hasStores = (stores.data?.length ?? 0) > 0;

  return (
    <div className="min-h-screen bg-[color:var(--dw-bg)] text-[color:var(--dw-text)]">
      <DWTopNav
        active="Stores"
        items={[
          { label: "Stores", href: "/app/stores" },
          { label: "Shopify", href: "/app/shopify" },
          { label: "Find", href: "/app/find" },
        ]}
        ctaLabel="New store"
        ctaHref="/build/new"
        secondaryLabel={signOut.isPending ? "Signing out..." : "Sign out"}
        secondaryOnClick={handleSignOut}
        secondaryDisabled={signOut.isPending}
      />

      <main className="mx-auto max-w-[1200px] px-5 py-10 md:px-8 md:py-14 lg:px-10 lg:py-16">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="dw-display-sm text-[32px] md:text-[40px] lg:text-[44px]">
              Welcome back
              <span className="text-[color:var(--dw-accent)]">.</span>
            </h1>
            <p className="mt-2 text-[14px] text-[color:var(--dw-text-dim)] md:text-[15px]">
              {me.data.name ?? me.data.email.split("@")[0]} ·{" "}
              <span className="dw-mono text-[11px] tracking-[0.08em] uppercase md:text-[12px]">
                {me.data.emailVerified ? "Verified" : "Pending"}
              </span>
            </p>
          </div>
          <Button asChild className="gap-2">
            <Link href="/build/new">
              Build a new store
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
            </Link>
          </Button>
        </div>

        {hasStores && (
          <div className="mt-8 grid grid-cols-2 gap-3 md:mt-10 md:grid-cols-4 md:gap-4">
            <StatCard
              label="Live"
              value={String(published.length)}
              sub="Published stores"
              icon={RocketIcon}
              tone="jade"
            />
            <StatCard
              label="Drafts"
              value={String(drafts.length)}
              sub="Ready to publish"
              icon={Target02Icon}
            />
            <StatCard
              label="Generating"
              value={String(generating.length)}
              sub="In progress"
              icon={SparklesIcon}
              tone={generating.length > 0 ? "accent" : undefined}
            />
            <StatCard
              label="Total"
              value={String(stores.data?.length ?? 0)}
              sub="Stores built"
              icon={MagicWand01Icon}
            />
          </div>
        )}

        {stores.isLoading ? (
          <div className="dw-mono mt-16 text-xs tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
            Loading stores…
          </div>
        ) : hasStores ? (
          <>
            <div className="dw-mono mt-14 mb-4 text-[10px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
              Your stores
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {stores.data?.map((s) => (
                <Link key={s.id} href={`/app/stores/${s.id}/edit`}>
                  <StoreCard store={s} />
                </Link>
              ))}
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
};

const StoreCard = ({ store }: { store: StoreCardData }) => {
  const inProgress =
    store.status === "generating" || store.status === "scraping";
  const hasThumb = !!store.thumbnailUrl && !inProgress;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] transition duration-200 hover:-translate-y-0.5 hover:border-[color:var(--dw-accent)]/40 hover:shadow-lg">
      <div
        className="relative aspect-[16/10] w-full overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${store.themePreview.bg} 0%, ${store.themePreview.primary} 100%)`,
        }}
      >
        {hasThumb && store.thumbnailUrl && (
          <img
            src={store.thumbnailUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {inProgress && (
          <>
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
            <div className="relative flex h-full items-center justify-center">
              <div className="dw-mono inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3.5 py-1.5 text-[10px] tracking-[0.18em] uppercase text-white backdrop-blur">
                <span className="dw-pulse size-1.5 rounded-full bg-[color:var(--dw-accent)]" />
                In progress
              </div>
            </div>
          </>
        )}
        {store.status === "failed" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="dw-mono inline-flex items-center gap-2 rounded-full border border-[color:var(--dw-signal)]/40 bg-black/60 px-3.5 py-1.5 text-[10px] tracking-[0.18em] uppercase text-[color:var(--dw-signal)]">
              Failed
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="truncate text-[15px] font-medium">
            {store.name ?? "Untitled store"}
          </div>
          {store.status === "published" ? (
            <DWChip variant="live">Live</DWChip>
          ) : store.status === "ready" ? (
            <DWChip variant="accent">Draft</DWChip>
          ) : store.status === "failed" ? (
            <DWChip variant="signal">Failed</DWChip>
          ) : (
            <DWChip variant="neutral">{store.status}</DWChip>
          )}
        </div>
        <div className="dw-mono mt-2 text-[11px] tracking-[0.1em] uppercase text-[color:var(--dw-text-muted)]">
          {store.score ? `Score ${store.score}` : "No score"} ·{" "}
          {new Date(store.createdAt).toLocaleDateString()}
        </div>
        <div className="mt-auto flex items-center justify-between pt-4 text-[12px] text-[color:var(--dw-text-dim)]">
          <span>Open editor</span>
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            size={12}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  label,
  value,
  sub,
  icon,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  icon: typeof MagicWand01Icon;
  tone?: "accent" | "jade";
}) => (
  <div className="rounded-[14px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-5">
    <div className="flex items-center justify-between">
      <div className="dw-mono text-[10px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
        {label}
      </div>
      <HugeiconsIcon
        icon={icon}
        size={14}
        className={
          tone === "accent"
            ? "text-[color:var(--dw-accent)]"
            : tone === "jade"
              ? "text-[color:var(--dw-jade)]"
              : "text-[color:var(--dw-text-muted)]"
        }
      />
    </div>
    <div className="mt-3 flex items-baseline gap-2">
      <span className="dw-display-sm text-[36px]">{value}</span>
      <span className="text-[12px] text-[color:var(--dw-text-muted)]">{sub}</span>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="relative mt-14 overflow-hidden rounded-[20px] border border-dashed border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-14 text-center">
    <div className="dw-bloom absolute -top-40 left-1/2 -translate-x-1/2" />
    <div className="relative">
      <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-[14px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface2)] text-[color:var(--dw-accent)]">
        <HugeiconsIcon icon={MagicWand01Icon} size={26} />
      </div>
      <div className="dw-display-sm text-[28px]">
        Build your first store
        <span className="text-[color:var(--dw-accent)]">.</span>
      </div>
      <div className="mx-auto mt-3 max-w-[420px] text-[14px] leading-[1.5] text-[color:var(--dw-text-dim)]">
        Paste a product URL and Dropwiz writes the copy, generates the images, and
        renders the store — in about 60 seconds.
      </div>
      <Button asChild className="mt-6 gap-2">
        <Link href="/build/new">
          Start building
          <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
        </Link>
      </Button>
      <div className="dw-mono mt-4 text-[11px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
        No card · No signup step · 60s median
      </div>
    </div>
  </div>
);

export default StoresIndex;
