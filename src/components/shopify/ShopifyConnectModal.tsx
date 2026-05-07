import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  ShoppingBag03Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClientPortal } from "@/components/ui/client-portal";
import { toast } from "sonner";

const SHOP_RE = /^[a-z0-9][a-z0-9-]{0,60}\.myshopify\.com$/i;

type Props = {
  onClose: () => void;
  storeIdForRedirect?: string;
};

export const ShopifyConnectModal = (props: Props) => (
  <ClientPortal>
    <Body {...props} />
  </ClientPortal>
);

const Body = ({ onClose, storeIdForRedirect }: Props) => {
  const [domain, setDomain] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = domain
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/\/.*/, "");
    if (!SHOP_RE.test(clean)) {
      toast.error("Domain must look like yourstore.myshopify.com");
      return;
    }
    setSubmitting(true);
    const params = new URLSearchParams({ shop: clean });
    if (storeIdForRedirect) params.set("storeId", storeIdForRedirect);
    window.location.href = `/api/shopify/install?${params.toString()}`;
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-[440px] flex-col overflow-hidden rounded-[14px] border border-[color:var(--dw-border)] bg-[color:var(--dw-bg)] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-[7px] bg-[color:var(--dw-surface2)] text-[color:var(--dw-text-muted)]">
              <HugeiconsIcon icon={ShoppingBag03Icon} size={13} />
            </div>
            <div className="text-[13px] font-medium tracking-[-0.01em]">
              Connect a Shopify shop
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-5">
          <p className="text-[12.5px] leading-[1.5] text-[color:var(--dw-text-dim)]">
            Enter the <span className="dw-mono">.myshopify.com</span> domain of
            the shop you want to connect. You&apos;ll be redirected to Shopify to
            authorize Dropwiz, then sent back here.
          </p>
          <div className="space-y-1.5">
            <span className="text-[11.5px] font-medium text-[color:var(--dw-text-dim)]">
              Shop domain
            </span>
            <Input
              type="text"
              autoFocus
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="yourstore.myshopify.com"
              className="h-11 bg-[color:var(--dw-surface)] text-[14px]"
              disabled={submitting}
            />
            <span className="dw-mono text-[10.5px] tracking-[0.06em] text-[color:var(--dw-text-muted)]">
              Don&apos;t have a shop?{" "}
              <a
                href="https://www.shopify.com/free-trial"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Start a 3-day free trial
              </a>
            </span>
          </div>
          <Button
            type="submit"
            size="sm"
            className="mt-2 h-10 w-full gap-1.5 text-[13px]"
            disabled={submitting || !domain.trim()}
          >
            {submitting ? "Redirecting…" : "Continue to Shopify"}
            {!submitting && <HugeiconsIcon icon={ArrowRight01Icon} size={12} />}
          </Button>
        </form>
      </div>
    </div>
  );
};
