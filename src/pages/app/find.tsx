import { useEffect } from "react";
import { useRouter } from "next/router";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, SparklesIcon } from "@hugeicons/core-free-icons";
import { DWTopNav } from "@/components/dw/TopNav";
import { api } from "@/utils/api";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/trpc-errors";

const FindPage = () => {
  const router = useRouter();
  const me = api.auth.me.useQuery();
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

  return (
    <div className="min-h-screen bg-[color:var(--dw-bg)] text-[color:var(--dw-text)]">
      <DWTopNav
        active="Find"
        items={[
          { label: "Stores", href: "/app/stores" },
          { label: "Shopify", href: "/app/shopify" },
          { label: "Find", href: "/app/find" },
          { label: "Settings", href: "/app/settings" },
        ]}
        ctaLabel="New store"
        ctaHref="/build/new"
        secondaryLabel={signOut.isPending ? "Signing out..." : "Sign out"}
        secondaryOnClick={handleSignOut}
        secondaryDisabled={signOut.isPending}
        showCredits
      />

      <main className="mx-auto max-w-[800px] px-5 py-10 md:px-8 md:py-14 lg:px-10 lg:py-16">
        <h1 className="dw-display-sm text-[32px] md:text-[40px]">
          Find Products
          <span className="text-[color:var(--dw-accent)]">.</span>
        </h1>
        <p className="mt-2 text-[14px] text-[color:var(--dw-text-dim)] md:text-[15px]">
          Discover winning products to build stores around
        </p>

        <div className="mt-10 rounded-[20px] border border-dashed border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-10 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-[14px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface2)]">
            <HugeiconsIcon
              icon={Search01Icon}
              size={24}
              className="text-[color:var(--dw-accent)]"
            />
          </div>
          <div className="dw-display-sm text-[24px]">
            Coming soon
            <span className="text-[color:var(--dw-accent)]">.</span>
          </div>
          <p className="mx-auto mt-3 max-w-md text-[14px] text-[color:var(--dw-text-dim)]">
            We&apos;re building an AI-powered product discovery engine to help you
            find trending products with high profit potential.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[color:var(--dw-border)] bg-[color:var(--dw-bg)] px-4 py-2">
            <HugeiconsIcon
              icon={SparklesIcon}
              size={14}
              className="text-[color:var(--dw-accent)]"
            />
            <span className="text-[13px] text-[color:var(--dw-text-muted)]">
              Launching Q2 2026
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FindPage;
