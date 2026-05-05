import { useEffect } from "react";
import { useRouter } from "next/router";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  SparklesIcon,
  CrownIcon,
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/dashboard";
import { api } from "@/utils/api";

const TIER_INFO: Record<string, { label: string; color: string; bgColor: string; description: string }> = {
  free: {
    label: "Free",
    color: "var(--dw-text-muted)",
    bgColor: "var(--dw-bg-tertiary)",
    description: "5 free image credits to start",
  },
  starter: {
    label: "Starter",
    color: "var(--dw-accent)",
    bgColor: "var(--dw-accent-subtle)",
    description: "50 image credits per month",
  },
  pro: {
    label: "Pro",
    color: "#7C3AED",
    bgColor: "#F5F3FF",
    description: "Unlimited image credits",
  },
  agency: {
    label: "Agency",
    color: "#F59E0B",
    bgColor: "#FEF3C7",
    description: "Unlimited everything + priority support",
  },
  enterprise: {
    label: "Enterprise",
    color: "#EF4444",
    bgColor: "#FEE2E2",
    description: "Custom limits + dedicated support",
  },
};

const SettingsPage = () => {
  const router = useRouter();
  const me = api.auth.me.useQuery();

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

  const tierInfo = TIER_INFO[me.data.tier] ?? TIER_INFO.free;

  return (
    <DashboardLayout title="Settings" subtitle="Manage your account and billing">
      <div className="mx-auto max-w-[720px] space-y-4">
        <section className="rounded-lg border border-[var(--dw-border)] bg-[var(--dw-surface)] p-5">
          <div className="flex items-center gap-4">
            <div className="flex size-11 items-center justify-center rounded-full bg-[var(--dw-accent-subtle)]">
              <HugeiconsIcon icon={UserIcon} size={20} className="text-[var(--dw-accent)]" />
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--dw-text-muted)]">
                Profile
              </p>
              <h2 className="text-[15px] font-semibold text-[var(--dw-text)]">
                {me.data.name ?? me.data.email.split("@")[0]}
              </h2>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between rounded-md bg-[var(--dw-bg-secondary)] px-3 py-2.5">
              <div>
                <p className="text-[10px] font-medium text-[var(--dw-text-muted)]">Email</p>
                <p className="text-[12px] font-medium text-[var(--dw-text)]">{me.data.email}</p>
              </div>
              {me.data.emailVerified && (
                <div className="flex items-center gap-1 rounded-full bg-[var(--dw-success-bg)] px-2 py-0.5 text-[var(--dw-success)]">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={12} />
                  <span className="text-[9px] font-semibold uppercase">Verified</span>
                </div>
              )}
            </div>

            <div className="rounded-md bg-[var(--dw-bg-secondary)] px-3 py-2.5">
              <p className="text-[10px] font-medium text-[var(--dw-text-muted)]">Name</p>
              <p className="text-[12px] font-medium text-[var(--dw-text)]">
                {me.data.name ?? "Not set"}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-[var(--dw-border)] bg-[var(--dw-surface)] p-5">
          <div className="flex items-center gap-4">
            <div
              className="flex size-11 items-center justify-center rounded-full"
              style={{ backgroundColor: tierInfo.bgColor }}
            >
              <HugeiconsIcon icon={CrownIcon} size={20} style={{ color: tierInfo.color }} />
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--dw-text-muted)]">
                Current Plan
              </p>
              <h2 className="text-[15px] font-semibold" style={{ color: tierInfo.color }}>
                {tierInfo.label}
              </h2>
            </div>
          </div>

          <p className="mt-3 text-[12px] text-[var(--dw-text-muted)]">{tierInfo.description}</p>

          {me.data.tier === "free" && (
            <div className="mt-4">
              <Button className="gap-2 bg-[var(--dw-accent)] hover:bg-[var(--dw-accent-hover)]" disabled>
                Upgrade Plan
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
              </Button>
              <p className="mt-2 text-[10px] text-[var(--dw-text-subtle)]">Paid plans coming soon</p>
            </div>
          )}
        </section>

        <section className="rounded-lg border border-[var(--dw-border)] bg-[var(--dw-surface)] p-5">
          <div className="flex items-center gap-4">
            <div className="flex size-11 items-center justify-center rounded-full bg-[var(--dw-accent-subtle)]">
              <HugeiconsIcon icon={SparklesIcon} size={20} className="text-[var(--dw-accent)]" />
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--dw-text-muted)]">
                Image Credits
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-[24px] font-bold tracking-tight text-[var(--dw-text)]">
                  {me.data.imageCredits}
                </span>
                <span className="text-[12px] text-[var(--dw-text-muted)]">remaining</span>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-md bg-[var(--dw-bg-secondary)] p-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[12px] font-medium text-[var(--dw-text)]">Need more credits?</p>
                <p className="text-[11px] text-[var(--dw-text-muted)]">
                  Each AI-generated image uses 1 credit
                </p>
              </div>
              <Button size="sm" variant="outline" disabled className="border-[var(--dw-border)]">
                Buy Credits
              </Button>
            </div>
          </div>
          <p className="mt-2 text-[10px] text-[var(--dw-text-subtle)]">
            Credit purchasing coming soon. Contact support for bulk credits.
          </p>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
