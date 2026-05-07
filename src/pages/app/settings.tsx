import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  SparklesIcon,
  CrownIcon,
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  Settings02Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/dashboard";
import { BuyCreditsModal } from "@/components/billing/BuyCreditsModal";
import { api } from "@/utils/api";
import { runWithToast } from "@/hooks/useToastMutation";

const TIER_INFO: Record<string, { label: string; color: string; bgColor: string; description: string }> = {
  free: {
    label: "Free Trial",
    color: "var(--dw-text-muted)",
    bgColor: "var(--dw-bg-tertiary)",
    description: "Unlimited store creation, 57+ sections, basic import",
  },
  pro: {
    label: "Dropwiz PRO",
    color: "var(--dw-accent)",
    bgColor: "var(--dw-accent-subtle)",
    description: "Unlimited AI, publish to Shopify, priority support",
  },
};

const SettingsPage = () => {
  const router = useRouter();
  const me = api.auth.me.useQuery();
  const utils = api.useUtils();
  const subscription = api.billing.getSubscription.useQuery();
  const createCheckout = api.billing.createCheckoutUrl.useMutation();
  const createPortal = api.billing.createPortalUrl.useMutation();
  const [showBuyCredits, setShowBuyCredits] = useState(false);
  const creditsToastShown = useRef(false);

  const creditsSuccess = router.query.credits === "success";

  useEffect(() => {
    if (!me.isLoading && !me.data) router.replace("/auth/signin");
  }, [me.isLoading, me.data, router]);

  useEffect(() => {
    if (creditsSuccess && !creditsToastShown.current) {
      creditsToastShown.current = true;
      toast.success("Credits added to your account!");
      utils.auth.me.invalidate();
      router.replace("/app/settings", undefined, { shallow: true });
    }
  }, [creditsSuccess, router, utils]);

  if (!me.data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--dw-bg)]">
        <div className="text-[13px] text-[var(--dw-text-muted)]">Loading...</div>
      </div>
    );
  }

  const tierInfo = TIER_INFO[me.data.tier] ?? TIER_INFO.free;
  const isPro = me.data.tier === "pro";

  const handleUpgrade = () => {
    runWithToast(createCheckout, undefined, {
      loading: "Creating checkout session…",
      success: "Redirecting to checkout",
      toastId: "upgrade-checkout",
      onSuccess: (data) => {
        window.location.href = data.url;
      },
    });
  };

  const handleManageSubscription = () => {
    runWithToast(createPortal, undefined, {
      loading: "Opening billing portal…",
      success: "Redirecting to billing",
      toastId: "manage-subscription",
      onSuccess: (data) => {
        window.location.href = data.url;
      },
    });
  };

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

          {isPro ? (
            <div className="mt-4 space-y-3">
              {subscription.data?.cancelAtPeriodEnd ? (
                <div className="rounded-md bg-[var(--dw-warning-bg)] px-3 py-2 text-[11px] text-[var(--dw-warning)]">
                  Your subscription will end on{" "}
                  {subscription.data.currentPeriodEnd
                    ? new Date(subscription.data.currentPeriodEnd).toLocaleDateString()
                    : "end of period"}
                </div>
              ) : null}
              <Button
                variant="outline"
                className="gap-2 border-[var(--dw-border)]"
                onClick={handleManageSubscription}
                disabled={createPortal.isPending}
              >
                <HugeiconsIcon icon={Settings02Icon} size={14} />
                {createPortal.isPending ? "Loading…" : "Manage Subscription"}
              </Button>
            </div>
          ) : (
            <div className="mt-4">
              <Button
                className="gap-2 bg-[var(--dw-accent)] hover:bg-[var(--dw-accent-hover)]"
                onClick={handleUpgrade}
                disabled={createCheckout.isPending}
              >
                {createCheckout.isPending ? "Loading…" : "Upgrade to PRO — $79/mo"}
                {!createCheckout.isPending && <HugeiconsIcon icon={ArrowRight01Icon} size={14} />}
              </Button>
              <p className="mt-2 text-[10px] text-[var(--dw-text-subtle)]">
                Unlock unlimited AI credits and publishing
              </p>
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
                  {isPro ? "∞" : me.data.imageCredits}
                </span>
                <span className="text-[12px] text-[var(--dw-text-muted)]">
                  {isPro ? "unlimited" : "remaining"}
                </span>
              </div>
            </div>
          </div>

          {!isPro && (
            <div className="mt-4 rounded-md bg-[var(--dw-bg-secondary)] p-3">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[12px] font-medium text-[var(--dw-text)]">Need more credits?</p>
                  <p className="text-[11px] text-[var(--dw-text-muted)]">
                    Each AI-generated image uses 1 credit
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[var(--dw-border)]"
                  onClick={() => setShowBuyCredits(true)}
                >
                  Buy Credits
                </Button>
              </div>
            </div>
          )}

          {isPro && (
            <p className="mt-3 text-[11px] text-[var(--dw-text-muted)]">
              PRO members have unlimited image generation credits.
            </p>
          )}
        </section>
      </div>

      {showBuyCredits && <BuyCreditsModal onClose={() => setShowBuyCredits(false)} />}
    </DashboardLayout>
  );
};

export default SettingsPage;
