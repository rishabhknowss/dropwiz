import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  LinkSquare01Icon,
  MagicWand01Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validateProductUrl } from "@/lib/url-validation";
import { useOnboarding } from "./OnboardingContext";
import { COUNTRIES, CURRENCIES, TARGET_AUDIENCES, LANGUAGES } from "./types";

export const DetailsStep = () => {
  const {
    data,
    setUrl,
    setAiPrompt,
    setCountry,
    setCurrency,
    setTargetAudience,
    setTargetLanguage,
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

    goToStep("building");
  };

  const sourceLabels: Record<string, { title: string; placeholder: string; hint: string }> = {
    supplier: {
      title: "Import from supplier",
      placeholder: "https://www.amazon.com/dp/B0...",
      hint: "Paste your supplier product link",
    },
    competitor: {
      title: "Import from competitor",
      placeholder: "https://competitor.com/products/...",
      hint: "Paste competitor product URL",
    },
    shopify: {
      title: "Connect Shopify",
      placeholder: "https://your-shop.myshopify.com/products/...",
      hint: "Paste your Shopify product URL",
    },
    ai: {
      title: "Create with AI",
      placeholder: "A premium wireless noise-cancelling headphone...",
      hint: "Describe your product idea",
    },
  };

  const labels = sourceLabels[data.source ?? "supplier"];

  return (
    <div className="mx-auto max-w-[600px]">
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        type="button"
        onClick={handleBack}
        className="mb-8 inline-flex items-center gap-2 text-[13px] text-[var(--dw-text-muted)] transition-colors hover:text-[var(--dw-text)]"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
        Back
      </motion.button>

      <div className="block">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4 inline-flex items-center gap-2.5 rounded-full bg-[var(--dw-accent)]/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--dw-accent)]"
        >
          <span className="size-1.5 rounded-full bg-[var(--dw-accent)]" />
          {labels.title}
        </motion.div>
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-[32px] font-bold leading-tight tracking-tight text-[var(--dw-text)] md:text-[40px]"
      >
        {isAiMode ? "Describe your product" : "Paste your product link"}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-3 text-[15px] text-[var(--dw-text-muted)]"
      >
        {isAiMode
          ? "Tell us about your product idea and we'll generate everything."
          : "We'll scrape the product details and build your store."}
      </motion.p>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        onSubmit={handleSubmit}
        className="mt-8 space-y-6"
      >
        <div className="space-y-2">
          <label className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--dw-text-subtle)]">
            {labels.hint}
          </label>
          {isAiMode ? (
            <textarea
              value={localPrompt}
              onChange={(e) => setLocalPrompt(e.target.value)}
              placeholder={labels.placeholder}
              rows={4}
              autoFocus
              className="w-full rounded-xl border border-[var(--dw-border)] bg-[var(--dw-bg-tertiary)] p-4 text-[14px] text-[var(--dw-text)] placeholder:text-[var(--dw-text-subtle)] transition-all focus:border-[var(--dw-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--dw-accent)]/20"
            />
          ) : (
            <div className="relative">
              <HugeiconsIcon
                icon={LinkSquare01Icon}
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--dw-text-subtle)]"
              />
              <Input
                type="url"
                required
                autoFocus
                value={localUrl}
                onChange={(e) => setLocalUrl(e.target.value)}
                placeholder={labels.placeholder}
                className="h-13 rounded-xl border-[var(--dw-border)] bg-[var(--dw-bg-tertiary)] pl-11 text-[14px] transition-all focus:border-[var(--dw-accent)] focus:ring-[var(--dw-accent)]/20"
              />
            </div>
          )}
        </div>

        <div className="rounded-xl border border-[var(--dw-border)] bg-[var(--dw-surface)] p-5">
          <h3 className="mb-4 text-[14px] font-semibold text-[var(--dw-text)]">
            Customize your store
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Country"
              value={data.country}
              onChange={setCountry}
              options={COUNTRIES.map((c) => ({ value: c.code, label: c.label }))}
            />
            <SelectField
              label="Currency"
              value={data.currency}
              onChange={setCurrency}
              options={CURRENCIES.map((c) => ({ value: c.code, label: c.label }))}
            />
            <SelectField
              label="Language"
              value={data.targetLanguage}
              onChange={setTargetLanguage}
              options={LANGUAGES.map((l) => ({ value: l.code, label: l.label }))}
            />
            <SelectField
              label="Target audience"
              value={data.targetAudience}
              onChange={setTargetAudience}
              options={TARGET_AUDIENCES.map((a) => ({ value: a.id, label: a.label }))}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="h-13 w-full gap-2.5 rounded-xl bg-gradient-to-r from-[var(--dw-accent)] to-[var(--dw-accent-hover)] text-[14px] font-semibold text-[#0A0A0A] shadow-lg shadow-[var(--dw-accent)]/20 transition-all hover:shadow-[var(--dw-accent)]/30 hover:brightness-110"
        >
          {isAiMode ? (
            <>
              <HugeiconsIcon icon={MagicWand01Icon} size={16} />
              Create with AI
            </>
          ) : (
            <>
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
              Generate Store
            </>
          )}
        </Button>
      </motion.form>
    </div>
  );
};

const SelectField = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}) => (
  <div className="space-y-2">
    <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--dw-text-subtle)]">
      {label}
    </span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 w-full cursor-pointer rounded-lg border border-[var(--dw-border)] bg-[var(--dw-bg-tertiary)] px-3 text-[13px] text-[var(--dw-text)] transition-all focus:border-[var(--dw-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--dw-accent)]/20"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);
