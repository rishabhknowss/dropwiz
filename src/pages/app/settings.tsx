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
  Mail01Icon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/dashboard";
import { BuyCreditsModal } from "@/components/billing/BuyCreditsModal";
import { api } from "@/utils/api";
import { runWithToast } from "@/hooks/useToastMutation";

const TIER_INFO: Record<string, { label: string; color: string; bgColor: string; iconBg: string; description: string }> = {
  free: {
    label: "Free Plan",
    color: "#666666",
    bgColor: "#FAFAFA",
    iconBg: "#F0F0F0",
    description: "Unlimited store creation, 57+ sections, basic import",
  },
  pro: {
    label: "Dropwiz PRO",
    color: "#0A0A0A",
    bgColor: "#FEF9C3",
    iconBg: "#FDE047",
    description: "50 AI credits/month, publish to Shopify, priority support",
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
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA]">
        <div className="text-[13px] text-[#666666]">Loading...</div>
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
      <div className="mx-auto max-w-[640px] space-y-5 p-6 lg:py-8">
        <section className="overflow-hidden rounded-xl border border-[#E8E8E8] bg-white">
          <div className="border-b border-[#E8E8E8] bg-[#FAFAFA] px-5 py-3">
            <h3 className="text-[13px] font-semibold text-[#0A0A0A]">Profile</h3>
          </div>
          <div className="divide-y divide-[#F0F0F0]">
            <div className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-[#F5F5F5]">
                  <HugeiconsIcon icon={Mail01Icon} size={14} className="text-[#666666]" />
                </div>
                <div>
                  <p className="text-[11px] text-[#999999]">Email</p>
                  <p className="text-[13px] font-medium text-[#0A0A0A]">{me.data.email}</p>
                </div>
              </div>
              {me.data.emailVerified && (
                <div className="flex items-center gap-1 rounded-full bg-[#ECFDF5] px-2 py-1">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={12} className="text-[#059669]" />
                  <span className="text-[10px] font-medium text-[#059669]">Verified</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 px-5 py-3.5">
              <div className="flex size-8 items-center justify-center rounded-full bg-[#F5F5F5]">
                <HugeiconsIcon icon={UserCircleIcon} size={14} className="text-[#666666]" />
              </div>
              <div>
                <p className="text-[11px] text-[#999999]">Name</p>
                <p className="text-[13px] font-medium text-[#0A0A0A]">
                  {me.data.name ?? "Not set"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-[#E8E8E8] bg-white">
          <div
            className="flex items-center justify-between border-b px-5 py-3"
            style={{ backgroundColor: tierInfo.bgColor, borderColor: isPro ? "#FDE047" : "#E8E8E8" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex size-8 items-center justify-center rounded-full"
                style={{ backgroundColor: tierInfo.iconBg }}
              >
                <HugeiconsIcon icon={CrownIcon} size={14} style={{ color: tierInfo.color }} />
              </div>
              <div>
                <h3 className="text-[13px] font-semibold" style={{ color: tierInfo.color }}>
                  {tierInfo.label}
                </h3>
              </div>
            </div>
            {isPro && (
              <span className="rounded-full bg-[#0A0A0A] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
                Active
              </span>
            )}
          </div>
          <div className="px-5 py-4">
            <p className="text-[12px] text-[#666666]">{tierInfo.description}</p>

            {isPro ? (
              <div className="mt-4 space-y-3">
                {!!subscription.data?.cancelAtPeriodEnd && (
                  <div className="rounded-lg bg-[#FEF3C7] px-3 py-2 text-[11px] text-[#92400E]">
                    Your subscription will end on{" "}
                    {subscription.data.currentPeriodEnd
                      ? new Date(subscription.data.currentPeriodEnd).toLocaleDateString()
                      : "end of period"}
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-[#E5E5E5] text-[12px]"
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
                  size="sm"
                  className="gap-2 bg-[#0A0A0A] text-[12px] text-white hover:bg-[#1A1A1A]"
                  onClick={handleUpgrade}
                  disabled={createCheckout.isPending}
                >
                  {createCheckout.isPending ? "Loading…" : "Upgrade to PRO — $79/mo"}
                  {!createCheckout.isPending && <HugeiconsIcon icon={ArrowRight01Icon} size={14} />}
                </Button>
              </div>
            )}
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-[#E8E8E8] bg-white">
          <div className="border-b border-[#E8E8E8] bg-[#FAFAFA] px-5 py-3">
            <h3 className="text-[13px] font-semibold text-[#0A0A0A]">AI Credits</h3>
          </div>
          <div className="px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A]">
                  <HugeiconsIcon icon={SparklesIcon} size={18} className="text-[#D97706]" />
                </div>
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[28px] font-bold tracking-tight text-[#0A0A0A]">
                      {me.data.imageCredits ?? 0}
                    </span>
                    <span className="text-[12px] text-[#999999]">credits</span>
                  </div>
                  <p className="text-[11px] text-[#666666]">1 credit = 1 AI-generated image</p>
                </div>
              </div>
              <Button
                size="sm"
                className="bg-[#0A0A0A] text-[12px] text-white hover:bg-[#1A1A1A]"
                onClick={() => setShowBuyCredits(true)}
              >
                Buy Credits
              </Button>
            </div>

            {isPro && (
              <p className="mt-4 rounded-lg bg-[#F5F5F5] px-3 py-2 text-[11px] text-[#666666]">
                PRO members receive 50 credits monthly with their subscription.
              </p>
            )}
          </div>
        </section>
      </div>

      {showBuyCredits && <BuyCreditsModal onClose={() => setShowBuyCredits(false)} />}
    </DashboardLayout>
  );
};

export default SettingsPage;
