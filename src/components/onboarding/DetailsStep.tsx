import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  SparklesIcon,
  LinkSquare01Icon,
  MagicWand01Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validateProductUrl } from "@/lib/url-validation";
import { useOnboarding } from "./OnboardingContext";

export const DetailsStep = () => {
  const {
    data,
    setUrl,
    setAiPrompt,
    goToStep,
  } = useOnboarding();

  const [localUrl, setLocalUrl] = useState(data.url);
  const [localPrompt, setLocalPrompt] = useState(data.aiPrompt);

  const isAiMode = data.source === "ai";

  const handleBack = () => {
    goToStep("source");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isAiMode) {
      if (localPrompt.trim().length < 10) {
        toast.error("Describe your product in at least 10 characters");
        return;
      }
      setAiPrompt(localPrompt.trim());
    } else {
      const validation = validateProductUrl(localUrl);
      if (!validation.valid) {
        toast.error(validation.error ?? "Enter a valid product URL");
        return;
      }
      setUrl(validation.normalizedUrl ?? localUrl.trim());
    }

    goToStep("customize");
  };

  const sourceLabels: Record<string, { badge: string; title: string; subtitle: string; placeholder: string }> = {
    supplier: {
      badge: "Product URL",
      title: "Paste your link",
      subtitle: "We'll extract product details and generate your store.",
      placeholder: "https://www.amazon.com/dp/B0...",
    },
    competitor: {
      badge: "Competitor Store",
      title: "Drop the link",
      subtitle: "We'll analyze their listing and build something better.",
      placeholder: "https://competitor.myshopify.com/products/...",
    },
    shopify: {
      badge: "Shopify Product",
      title: "Paste your link",
      subtitle: "We'll enhance your existing product page.",
      placeholder: "https://your-shop.myshopify.com/products/...",
    },
    ai: {
      badge: "AI Mode",
      title: "Describe your product",
      subtitle: "Tell us about your product idea and we'll generate everything.",
      placeholder: "A premium wireless noise-cancelling headphone...",
    },
  };

  const labels = sourceLabels[data.source ?? "supplier"];

  return (
    <div className="mx-auto max-w-[540px]">
      <div className="mb-10 flex items-center gap-4">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          type="button"
          onClick={handleBack}
          className="flex size-10 items-center justify-center rounded-full border border-[var(--dw-border)] bg-white text-[#666666] transition-all hover:border-[#0A0A0A] hover:text-[#0A0A0A]"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
        </motion.button>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--dw-border)] bg-white px-4 py-2 text-[12px] font-semibold uppercase tracking-wider text-[#0A0A0A]"
        >
          <span className="size-2 rounded-full bg-[var(--dw-accent)]" />
          {labels.badge}
        </motion.div>
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-[32px] font-bold leading-[1.1] tracking-tight text-[#0A0A0A] md:text-[44px]"
      >
        {labels.title}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4 text-[16px] leading-relaxed text-[#666666]"
      >
        {labels.subtitle}
      </motion.p>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        onSubmit={handleSubmit}
        className="mt-10 space-y-6"
      >
        {isAiMode ? (
          <textarea
            value={localPrompt}
            onChange={(e) => setLocalPrompt(e.target.value)}
            placeholder={labels.placeholder}
            rows={4}
            autoFocus
            className="w-full rounded-2xl border-2 border-[var(--dw-border)] bg-white p-5 text-[15px] text-[#0A0A0A] placeholder:text-[#999999] transition-all focus:border-[#0A0A0A] focus:outline-none"
          />
        ) : (
          <div className="relative">
            <HugeiconsIcon
              icon={LinkSquare01Icon}
              size={18}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-[#999999]"
            />
            <Input
              type="url"
              required
              autoFocus
              value={localUrl}
              onChange={(e) => setLocalUrl(e.target.value)}
              placeholder={labels.placeholder}
              className="h-14 rounded-2xl border-2 border-[var(--dw-border)] bg-white pl-13 text-[15px] transition-all focus:border-[#0A0A0A] focus:ring-0"
            />
          </div>
        )}

        <Button
          type="submit"
          className="h-14 w-full gap-2.5 rounded-2xl bg-[#0A0A0A] text-[15px] font-semibold text-white transition-all hover:bg-[#1a1a1a]"
        >
          <HugeiconsIcon icon={SparklesIcon} size={18} />
          Generate Store
        </Button>
      </motion.form>
    </div>
  );
};
