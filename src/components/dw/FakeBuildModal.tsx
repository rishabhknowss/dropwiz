"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Tick02Icon,
  Cancel01Icon,
  MagicWand01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { DWLogo } from "@/components/dw/Logo";
import { cn } from "@/lib/utils";
import { api, type RouterOutputs } from "@/utils/api";

export const PENDING_BUILD_KEY = "dropwiz_pending_build";

type ScrapedProduct = RouterOutputs["scrape"]["preview"];

type PendingBuild = {
  mode: "url" | "ai";
  url?: string;
  aiPrompt?: string;
  source: "shopify" | "supplier" | "competitor" | "ai";
  language: string;
  currency: string;
  scrapedProduct?: ScrapedProduct;
};

export const savePendingBuild = (data: PendingBuild) => {
  localStorage.setItem(PENDING_BUILD_KEY, JSON.stringify(data));
};

export const getPendingBuild = (): PendingBuild | null => {
  const stored = localStorage.getItem(PENDING_BUILD_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as PendingBuild;
  } catch {
    return null;
  }
};

export const clearPendingBuild = () => {
  localStorage.removeItem(PENDING_BUILD_KEY);
};

type FakeBuildStep = {
  id: string;
  label: string;
  activeLabel: string;
  duration: number;
  isReal?: boolean;
};

const URL_STEPS: FakeBuildStep[] = [
  { id: "scrape", label: "Product data fetched", activeLabel: "Getting product data", duration: 0, isReal: true },
  { id: "persona", label: "Buyer persona generated", activeLabel: "Generating buyer persona", duration: 1500 },
  { id: "copy", label: "Conversion copy written", activeLabel: "Writing conversion copy", duration: 2000 },
  { id: "images", label: "Hero images created", activeLabel: "Creating hero images", duration: 2500 },
  { id: "sections", label: "Sections built", activeLabel: "Building sections", duration: 1500 },
  { id: "store", label: "Store assembled", activeLabel: "Assembling storefront", duration: 1000 },
];

const AI_STEPS: FakeBuildStep[] = [
  { id: "understand", label: "Prompt analyzed", activeLabel: "Understanding your idea", duration: 1800 },
  { id: "product", label: "Product created", activeLabel: "Creating product details", duration: 2200 },
  { id: "persona", label: "Buyer persona generated", activeLabel: "Generating buyer persona", duration: 1500 },
  { id: "copy", label: "Conversion copy written", activeLabel: "Writing conversion copy", duration: 2000 },
  { id: "images", label: "Hero images created", activeLabel: "Creating hero images", duration: 2500 },
  { id: "store", label: "Store assembled", activeLabel: "Assembling storefront", duration: 1200 },
];

type FakeBuildModalProps = {
  mode: "url" | "ai";
  url?: string;
  aiPrompt?: string;
  source: "shopify" | "supplier" | "competitor" | "ai";
  onClose: () => void;
};

export const FakeBuildModal = ({ mode, url, aiPrompt, source, onClose }: FakeBuildModalProps) => {
  const router = useRouter();
  const steps = mode === "ai" ? AI_STEPS : URL_STEPS;
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [phase, setPhase] = useState<"building" | "ready" | "error">("building");
  const [isVisible, setIsVisible] = useState(false);
  const [scrapedProduct, setScrapedProduct] = useState<ScrapedProduct | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const scrape = api.scrape.preview.useMutation();
  const timerRefs = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const runFakeSteps = useCallback((startIndex: number, stepList: FakeBuildStep[]) => {
    let cumulativeDelay = 0;

    for (let i = startIndex; i < stepList.length; i++) {
      const step = stepList[i];
      if (step.isReal) continue;

      const currentIndex = i;
      const stepDelay = cumulativeDelay;
      const completionDelay = cumulativeDelay + step.duration;

      const stepTimer = setTimeout(() => {
        setCurrentStep(currentIndex);
      }, stepDelay);

      const completeTimer = setTimeout(() => {
        setCompletedSteps((prev) => [...prev, step.id]);
      }, completionDelay);

      timerRefs.current.push(stepTimer, completeTimer);
      cumulativeDelay = completionDelay;
    }

    const readyTimer = setTimeout(() => {
      setPhase("ready");
    }, cumulativeDelay);
    timerRefs.current.push(readyTimer);
  }, []);

  useEffect(() => {
    return () => {
      timerRefs.current.forEach(clearTimeout);
      timerRefs.current = [];
    };
  }, []);

  useEffect(() => {
    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];

    if (mode === "ai") {
      setTimeout(() => runFakeSteps(0, AI_STEPS), 300);
    } else if (url) {
      scrape.mutate(
        { url },
        {
          onSuccess: (data) => {
            setScrapedProduct(data);
            setCompletedSteps(["scrape"]);
            setTimeout(() => runFakeSteps(1, URL_STEPS), 300);
          },
          onError: (err) => {
            setErrorMessage(err.message || "Failed to scrape product. Please try a different URL.");
            setPhase("error");
          },
        },
      );
    }
  }, [mode, url, runFakeSteps, scrape]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  const handleOpenStore = () => {
    savePendingBuild({
      mode,
      url: mode === "url" ? url : undefined,
      aiPrompt: mode === "ai" ? aiPrompt : undefined,
      source,
      language: "en",
      currency: "USD",
      scrapedProduct: scrapedProduct ?? undefined,
    });
    router.push("/auth/signin?redirect=build");
  };

  const productImage = scrapedProduct?.images?.[0];
  const displayTitle = mode === "ai"
    ? (aiPrompt?.slice(0, 50) + (aiPrompt && aiPrompt.length > 50 ? "..." : ""))
    : scrapedProduct?.title;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm transition-opacity duration-200",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      <div
        className={cn(
          "relative w-full max-w-[480px] overflow-hidden rounded-[24px] border border-[color:var(--dw-border)] bg-[color:var(--dw-bg)] shadow-2xl transition-all duration-200",
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        )}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--dw-accent)]/50 to-transparent" />

        <div className="flex items-center justify-between border-b border-[color:var(--dw-border)] px-6 py-4">
          <DWLogo size={28} />
          {(phase === "building" || phase === "error") && (
            <button
              onClick={handleClose}
              className="dw-mono text-[10px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)] transition hover:text-[color:var(--dw-text)]"
            >
              Cancel
            </button>
          )}
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {phase === "error" ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="mb-6 flex justify-center">
                  <div className="flex size-16 items-center justify-center rounded-full border-2 border-red-500/50 bg-red-500/10">
                    <HugeiconsIcon icon={Cancel01Icon} size={28} className="text-red-500" />
                  </div>
                </div>

                <h2 className="dw-display-sm text-[24px]">
                  Couldn&apos;t scrape product
                </h2>
                <p className="mt-3 text-[14px] text-[color:var(--dw-text-dim)]">
                  {errorMessage}
                </p>

                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="mt-6 h-11 w-full text-[14px] font-medium"
                >
                  Try another URL
                </Button>
              </motion.div>
            ) : phase === "building" ? (
              <motion.div
                key="building"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="dw-display-sm text-[20px] tracking-[-0.02em]">
                      {mode === "ai" ? "Creating with AI" : "Building store"}
                    </h2>
                    <p className="mt-0.5 text-[12px] text-[color:var(--dw-text-muted)]">
                      {mode === "ai" ? "Generating your product" : "AI processing your product"}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="dw-mono text-[28px] font-light tracking-tight text-[color:var(--dw-accent)]">
                      {Math.min(100, Math.round((completedSteps.length / steps.length) * 100))}%
                    </div>
                  </div>
                </div>

                {mode === "ai" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-4 flex justify-center"
                  >
                    <div className="relative flex size-24 items-center justify-center overflow-hidden rounded-[12px] border border-[color:var(--dw-border)] bg-[var(--dw-accent)]/10">
                      <HugeiconsIcon icon={MagicWand01Icon} size={36} className="text-[var(--dw-accent)]" />
                    </div>
                  </motion.div>
                ) : productImage && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-4 flex justify-center"
                  >
                    <div className="relative size-24 overflow-hidden rounded-[12px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)]">
                      <Image
                        src={productImage}
                        alt={scrapedProduct?.title ?? "Product"}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  </motion.div>
                )}

                <div className="space-y-1.5">
                  {steps.map((step, index) => {
                    const isCompleted = completedSteps.includes(step.id);
                    const isActive = currentStep === index && !isCompleted;
                    const isScraping = step.id === "scrape" && scrape.isPending;
                    const stepNum = String(index + 1).padStart(2, "0");

                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 30 }}
                        className={cn(
                          "group relative flex items-center gap-3 rounded-[10px] px-3 py-2.5 transition-all duration-300",
                          isCompleted
                            ? "bg-[color:var(--dw-jade)]/8"
                            : isActive || isScraping
                              ? "bg-[color:var(--dw-accent)]/8"
                              : "bg-transparent"
                        )}
                      >
                        <div
                          className={cn(
                            "dw-mono relative flex size-7 shrink-0 items-center justify-center rounded-md text-[11px] font-semibold tracking-tight transition-all duration-300",
                            isCompleted
                              ? "bg-[color:var(--dw-jade)] text-[#0a0a0a]"
                              : isActive || isScraping
                                ? "bg-[color:var(--dw-accent)] text-[color:var(--dw-accent-ink)]"
                                : "bg-[color:var(--dw-surface2)] text-[color:var(--dw-text-muted)]"
                          )}
                        >
                          {isCompleted ? (
                            <HugeiconsIcon icon={Tick02Icon} size={13} />
                          ) : (
                            stepNum
                          )}
                          {(isActive || isScraping) && (
                            <span className="absolute inset-0 animate-ping rounded-md bg-[color:var(--dw-accent)] opacity-30" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div
                            className={cn(
                              "text-[13px] font-medium tracking-[-0.01em] transition-colors duration-200",
                              isCompleted
                                ? "text-[color:var(--dw-jade)]"
                                : isActive || isScraping
                                  ? "text-[color:var(--dw-text)]"
                                  : "text-[color:var(--dw-text-muted)]"
                            )}
                          >
                            {isCompleted ? step.label : (isActive || isScraping) ? step.activeLabel : step.label}
                          </div>
                        </div>
                        {(isActive || isScraping) && (
                          <div className="flex items-center gap-1.5">
                            <span className="h-1 w-8 overflow-hidden rounded-full bg-[color:var(--dw-surface2)]">
                              <motion.span
                                className="block h-full bg-[color:var(--dw-accent)]"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: step.isReal ? 3 : step.duration / 1000, ease: "linear" }}
                              />
                            </span>
                          </div>
                        )}
                        {isCompleted && (
                          <span className="dw-mono text-[10px] tracking-[0.05em] text-[color:var(--dw-jade)]">
                            done
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-[12px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-3">
                  <div className="dw-mono mb-1 text-[9px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
                    {mode === "ai" ? "Your prompt" : "Source URL"}
                  </div>
                  <div className="truncate text-[12px] text-[color:var(--dw-text-dim)]">
                    {mode === "ai" ? aiPrompt : url}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="ready"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="mb-5 flex items-start gap-4">
                  {mode === "ai" ? (
                    <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-[12px] border border-[color:var(--dw-border)] bg-[var(--dw-accent)]/10">
                      <HugeiconsIcon icon={MagicWand01Icon} size={32} className="text-[var(--dw-accent)]" />
                    </div>
                  ) : productImage && (
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-[12px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)]">
                      <Image
                        src={productImage}
                        alt={scrapedProduct?.title ?? "Product"}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1 pt-1">
                    <div className="dw-mono mb-1 flex items-center gap-2 text-[10px] tracking-[0.1em] uppercase text-[color:var(--dw-jade)]">
                      <span className="size-1.5 rounded-full bg-[color:var(--dw-jade)]" />
                      Ready
                    </div>
                    <h2 className="dw-display-sm truncate text-[18px] tracking-[-0.02em]">
                      {displayTitle ?? "Your store"}
                    </h2>
                    {mode === "url" && scrapedProduct?.priceCents && scrapedProduct.priceCents > 0 && (
                      <p className="mt-0.5 text-[13px] text-[color:var(--dw-text-muted)]">
                        {scrapedProduct.currency} {(scrapedProduct.priceCents / 100).toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleOpenStore}
                  className="h-12 w-full gap-2 text-[14px] font-medium"
                >
                  Open store
                  <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                </Button>

                <p className="mt-4 text-center text-[11px] text-[color:var(--dw-text-muted)]">
                  Free · No card required
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
