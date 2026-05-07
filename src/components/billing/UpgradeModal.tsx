import { useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  CrownIcon,
  Tick02Icon,
  SparklesIcon,
  Image01Icon,
  Download02Icon,
  Globe02Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { ClientPortal } from "@/components/ui/client-portal";
import { api } from "@/utils/api";
import { runWithToast } from "@/hooks/useToastMutation";

type Props = { onClose: () => void };

const FEATURES = [
  { icon: SparklesIcon, label: "Unlimited AI copywriter" },
  { icon: Image01Icon, label: "AI image generation" },
  { icon: Download02Icon, label: "One-click product import" },
  { icon: Globe02Icon, label: "Publish to Shopify" },
];

export const UpgradeModal = (props: Props) => (
  <ClientPortal>
    <Body {...props} />
  </ClientPortal>
);

const Body = ({ onClose }: Props) => {
  const createCheckout = api.billing.createCheckoutUrl.useMutation();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const handleUpgrade = () => {
    runWithToast(
      createCheckout,
      undefined,
      {
        loading: "Creating checkout session…",
        success: "Redirecting to checkout",
        toastId: "upgrade-checkout",
        onSuccess: (data) => {
          window.location.href = data.url;
        },
      },
    );
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-[420px] flex-col overflow-hidden rounded-[14px] border border-[color:var(--dw-border)] bg-[color:var(--dw-bg)] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-[7px] bg-[color:var(--dw-accent-subtle)] text-[color:var(--dw-accent)]">
              <HugeiconsIcon icon={CrownIcon} size={13} />
            </div>
            <div className="text-[13px] font-medium tracking-[-0.01em]">
              Upgrade to PRO
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex size-7 items-center justify-center rounded-md text-[color:var(--dw-text-muted)] transition hover:bg-[color:var(--dw-surface2)] hover:text-[color:var(--dw-text)]"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={13} />
          </button>
        </div>
        <div className="h-px bg-[color:var(--dw-border)]" />
        <div className="flex flex-col gap-4 p-5">
          <div className="rounded-[10px] border border-[color:var(--dw-accent)]/30 bg-[color:var(--dw-accent-subtle)]/30 p-4">
            <div className="flex items-baseline gap-2">
              <span className="text-[28px] font-bold tracking-tight text-[color:var(--dw-text)]">
                $79
              </span>
              <span className="text-[13px] text-[color:var(--dw-text-muted)]">
                /month
              </span>
            </div>
            <p className="mt-1.5 text-[12px] text-[color:var(--dw-text-dim)]">
              Unlock all features and publish unlimited stores
            </p>
          </div>

          <div className="space-y-2.5">
            <div className="text-[11px] font-medium uppercase tracking-wider text-[color:var(--dw-text-muted)]">
              Everything in PRO
            </div>
            <div className="grid gap-2">
              {FEATURES.map((f) => (
                <div key={f.label} className="flex items-center gap-2.5">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[color:var(--dw-jade)]/10 text-[color:var(--dw-jade)]">
                    <HugeiconsIcon icon={Tick02Icon} size={12} />
                  </div>
                  <span className="text-[13px] text-[color:var(--dw-text)]">
                    {f.label}
                  </span>
                </div>
              ))}
              <div className="flex items-center gap-2.5">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[color:var(--dw-jade)]/10 text-[color:var(--dw-jade)]">
                  <HugeiconsIcon icon={Tick02Icon} size={12} />
                </div>
                <span className="text-[13px] font-medium text-[color:var(--dw-accent)]">
                  Publish to Shopify
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={handleUpgrade}
            className="mt-2 h-11 w-full gap-2 text-[13px] font-medium"
            disabled={createCheckout.isPending}
          >
            {createCheckout.isPending ? (
              "Creating checkout…"
            ) : (
              <>
                Subscribe for $79/mo
                <HugeiconsIcon icon={ArrowRight01Icon} size={13} />
              </>
            )}
          </Button>
          <p className="text-center text-[10.5px] text-[color:var(--dw-text-muted)]">
            Cancel anytime. Billed monthly.
          </p>
        </div>
      </div>
    </div>
  );
};
