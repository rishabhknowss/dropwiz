import { useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  MagicWand01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "./OnboardingContext";

export const CompleteStep = () => {
  const router = useRouter();
  const { data, saveToStorage } = useOnboarding();

  const isAiMode = data.source === "ai";
  const productImage = data.scrapedProduct?.images?.[0];
  const productTitle = isAiMode
    ? data.aiPrompt?.slice(0, 50) + (data.aiPrompt && data.aiPrompt.length > 50 ? "..." : "")
    : data.scrapedProduct?.title ?? "Your store";

  useEffect(() => {
    saveToStorage();
  }, [saveToStorage]);

  const handleOpenStore = () => {
    router.push("/auth/signup?redirect=/build/claim");
  };

  return (
    <div className="mx-auto max-w-[500px] text-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-3 inline-flex items-center gap-2 rounded-full bg-[var(--dw-jade)]/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--dw-jade)]"
      >
        Store Ready
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-[32px] font-bold leading-tight tracking-tight text-[var(--dw-text)] md:text-[40px]"
      >
        Your store is built<span className="text-[var(--dw-accent)]">!</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-3 text-[15px] text-[var(--dw-text-muted)]"
      >
        Sign up to access your store, customize it, and export to Shopify.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-8 flex items-start gap-4 rounded-2xl border border-[var(--dw-border)] bg-[var(--dw-surface)] p-5 text-left"
      >
        {isAiMode ? (
          <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-[var(--dw-accent)]/10">
            <HugeiconsIcon icon={MagicWand01Icon} size={28} className="text-[var(--dw-accent)]" />
          </div>
        ) : productImage ? (
          <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-[var(--dw-border)] bg-white">
            <Image
              src={productImage}
              alt="Product"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="text-[14px] font-semibold text-[var(--dw-text)]">
            {productTitle}
          </div>
          <div className="mt-1 text-[13px] text-[var(--dw-text-muted)]">
            {data.currency} · {data.country} · {data.targetLanguage.toUpperCase()}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {["Hero images", "Product copy", "FAQ", "Testimonials"].map((feature) => (
              <span
                key={feature}
                className="rounded-md bg-[var(--dw-surface2)] px-2 py-1 text-[10px] font-medium text-[var(--dw-text-muted)]"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6"
      >
        <Button
          onClick={handleOpenStore}
          className="h-14 w-full gap-2.5 rounded-xl bg-gradient-to-r from-[var(--dw-accent)] to-[var(--dw-accent-hover)] text-[15px] font-semibold text-[#0A0A0A] shadow-lg shadow-[var(--dw-accent)]/20 transition-all hover:shadow-[var(--dw-accent)]/30 hover:brightness-110"
        >
          Open my store
          <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
        </Button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="mt-4 text-[12px] text-[var(--dw-text-subtle)]"
      >
        Free · No credit card required
      </motion.p>
    </div>
  );
};
