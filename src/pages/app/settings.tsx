import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  SparklesIcon,
  CrownIcon,
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { DWTopNav } from "@/components/dw/TopNav";
import { api } from "@/utils/api";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/trpc-errors";

const TIER_INFO: Record<string, { label: string; color: string; description: string }> = {
  free: {
    label: "Free",
    color: "var(--dw-text-muted)",
    description: "5 free image credits to start",
  },
  starter: {
    label: "Starter",
    color: "var(--dw-accent)",
    description: "50 image credits per month",
  },
  pro: {
    label: "Pro",
    color: "#a78bfa",
    description: "Unlimited image credits",
  },
  agency: {
    label: "Agency",
    color: "#f59e0b",
    description: "Unlimited everything + priority support",
  },
  enterprise: {
    label: "Enterprise",
    color: "#ef4444",
    description: "Custom limits + dedicated support",
  },
};

const SettingsPage = () => {
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

  const tierInfo = TIER_INFO[me.data.tier] ?? TIER_INFO.free;

  return (
    <div className="min-h-screen bg-[color:var(--dw-bg)] text-[color:var(--dw-text)]">
      <DWTopNav
        active="Settings"
        items={[
          { label: "Stores", href: "/app/stores" },
          { label: "Shopify", href: "/app/shopify" },
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
          Settings
          <span className="text-[color:var(--dw-accent)]">.</span>
        </h1>
        <p className="mt-2 text-[14px] text-[color:var(--dw-text-dim)] md:text-[15px]">
          Manage your account, plan, and credits
        </p>

        <div className="mt-10 space-y-6">
          <section className="rounded-[20px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-[color:var(--dw-surface2)]">
                <HugeiconsIcon
                  icon={UserIcon}
                  size={20}
                  className="text-[color:var(--dw-text-muted)]"
                />
              </div>
              <div>
                <div className="dw-mono text-[10px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
                  Profile
                </div>
                <div className="text-[16px] font-medium">
                  {me.data.name ?? me.data.email.split("@")[0]}
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-[color:var(--dw-surface2)] px-4 py-3">
                <div>
                  <div className="text-[13px] text-[color:var(--dw-text-muted)]">Email</div>
                  <div className="text-[14px]">{me.data.email}</div>
                </div>
                {me.data.emailVerified && (
                  <div className="flex items-center gap-1.5 text-[color:var(--dw-jade)]">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
                    <span className="dw-mono text-[10px] tracking-[0.1em] uppercase">Verified</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between rounded-xl bg-[color:var(--dw-surface2)] px-4 py-3">
                <div>
                  <div className="text-[13px] text-[color:var(--dw-text-muted)]">Name</div>
                  <div className="text-[14px]">{me.data.name ?? "Not set"}</div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[20px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-6">
            <div className="flex items-center gap-3">
              <div
                className="flex size-12 items-center justify-center rounded-full"
                style={{ backgroundColor: `${tierInfo.color}20` }}
              >
                <HugeiconsIcon
                  icon={CrownIcon}
                  size={20}
                  style={{ color: tierInfo.color }}
                />
              </div>
              <div>
                <div className="dw-mono text-[10px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
                  Current Plan
                </div>
                <div className="text-[16px] font-medium" style={{ color: tierInfo.color }}>
                  {tierInfo.label}
                </div>
              </div>
            </div>

            <div className="mt-4 text-[14px] text-[color:var(--dw-text-dim)]">
              {tierInfo.description}
            </div>

            {me.data.tier === "free" && (
              <div className="mt-6">
                <Button className="gap-2" disabled>
                  Upgrade Plan
                  <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                </Button>
                <p className="mt-2 text-[12px] text-[color:var(--dw-text-muted)]">
                  Paid plans coming soon
                </p>
              </div>
            )}
          </section>

          <section className="rounded-[20px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-[color:var(--dw-accent)]/10">
                <HugeiconsIcon
                  icon={SparklesIcon}
                  size={20}
                  className="text-[color:var(--dw-accent)]"
                />
              </div>
              <div>
                <div className="dw-mono text-[10px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
                  Image Credits
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="dw-display-sm text-[32px]">{me.data.imageCredits}</span>
                  <span className="text-[14px] text-[color:var(--dw-text-muted)]">remaining</span>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-[color:var(--dw-surface2)] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[14px] font-medium">Need more credits?</div>
                  <div className="text-[13px] text-[color:var(--dw-text-muted)]">
                    Each AI-generated image uses 1 credit
                  </div>
                </div>
                <Button size="sm" variant="outline" disabled>
                  Buy Credits
                </Button>
              </div>
            </div>
            <p className="mt-3 text-[12px] text-[color:var(--dw-text-muted)]">
              Credit purchasing coming soon. Contact support for bulk credits.
            </p>
          </section>

          <section className="rounded-[20px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-6">
            <div className="dw-mono text-[10px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
              Account Actions
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={handleSignOut}
                disabled={signOut.isPending}
              >
                {signOut.isPending ? "Signing out..." : "Sign Out"}
              </Button>
              <Button asChild variant="ghost">
                <Link href="/app/stores">Back to Stores</Link>
              </Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
