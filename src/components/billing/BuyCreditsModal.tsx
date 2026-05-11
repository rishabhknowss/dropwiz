import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  SparklesIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { ClientPortal } from "@/components/ui/client-portal";
import { api } from "@/utils/api";
import { runWithToast } from "@/hooks/useToastMutation";
import { CREDIT_PACKS, type CreditPack } from "@/lib/stripe/credit-packs";
import { cn } from "@/lib/utils";

type Props = { onClose: () => void };

export const BuyCreditsModal = (props: Props) => (
  <ClientPortal>
    <Body {...props} />
  </ClientPortal>
);

const Body = ({ onClose }: Props) => {
  const [selectedPack, setSelectedPack] = useState<CreditPack>(
    CREDIT_PACKS.find((p) => p.popular) ?? CREDIT_PACKS[0],
  );
  const createCheckout = api.billing.createCreditsCheckoutUrl.useMutation();

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

  const handlePurchase = () => {
    runWithToast(
      createCheckout,
      { priceId: selectedPack.priceId },
      {
        loading: "Creating checkout session…",
        success: "Redirecting to checkout",
        toastId: "credits-checkout",
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
        className="flex w-full max-w-[480px] flex-col overflow-hidden rounded-[14px] border border-[color:var(--dw-border)] bg-[color:var(--dw-bg)] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-[7px] bg-[color:var(--dw-accent-subtle)] text-[color:var(--dw-accent)]">
              <HugeiconsIcon icon={SparklesIcon} size={13} />
            </div>
            <div className="text-[13px] font-medium tracking-[-0.01em]">
              Buy Image Credits
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
          <p className="text-[12.5px] leading-[1.5] text-[color:var(--dw-text-dim)]">
            Credits are used for AI image generation. Each generated image uses 1 credit.
          </p>

          <div className="grid gap-3">
            {CREDIT_PACKS.map((pack) => (
              <PackCard
                key={pack.id}
                pack={pack}
                selected={selectedPack.id === pack.id}
                onSelect={() => setSelectedPack(pack)}
              />
            ))}
          </div>

          <Button
            onClick={handlePurchase}
            className="mt-2 h-11 w-full gap-2 bg-[var(--dw-accent)] text-[13px] font-semibold text-[#0A0A0A] hover:bg-[var(--dw-accent-hover)]"
            disabled={createCheckout.isPending}
          >
            {createCheckout.isPending
              ? "Creating checkout…"
              : `Buy ${selectedPack.credits} credits for $${selectedPack.price}`}
          </Button>
          <p className="text-center text-[10.5px] text-[color:var(--dw-text-muted)]">
            Credits never expire. One-time purchase.
          </p>
        </div>
      </div>
    </div>
  );
};

const PackCard = ({
  pack,
  selected,
  onSelect,
}: {
  pack: CreditPack;
  selected: boolean;
  onSelect: () => void;
}) => {
  const perCredit = (pack.price / pack.credits).toFixed(2);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative flex items-center justify-between rounded-[10px] border p-4 text-left transition-all",
        selected
          ? "border-[color:var(--dw-accent)] bg-[color:var(--dw-accent-subtle)]/30"
          : "border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] hover:border-[color:var(--dw-accent)]/50",
      )}
    >
      {pack.popular && (
        <div className="absolute -top-2 left-4">
          <span className="rounded-full bg-[color:var(--dw-accent)] px-2 py-0.5 text-[9px] font-bold uppercase text-[#0A0A0A]">
            Best Value
          </span>
        </div>
      )}
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex size-5 items-center justify-center rounded-full border-2 transition-all",
            selected
              ? "border-[color:var(--dw-accent)] bg-[color:var(--dw-accent)]"
              : "border-[color:var(--dw-border)]",
          )}
        >
          {selected && <HugeiconsIcon icon={Tick02Icon} size={10} className="text-[#0A0A0A]" />}
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-[15px] font-semibold text-[color:var(--dw-text)]">
              {pack.credits} credits
            </span>
            <span className="text-[11px] text-[color:var(--dw-text-muted)]">
              ${perCredit}/credit
            </span>
          </div>
          <span className="text-[12px] text-[color:var(--dw-text-muted)]">{pack.name}</span>
        </div>
      </div>
      <span className="text-[18px] font-bold text-[color:var(--dw-text)]">${pack.price}</span>
    </button>
  );
};
