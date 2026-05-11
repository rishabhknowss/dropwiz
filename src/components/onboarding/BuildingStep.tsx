import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon, SparklesIcon, MagicWand01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { api } from "@/utils/api";
import { useOnboarding } from "./OnboardingContext";

type BuildStep = {
  id: string;
  label: string;
  activeLabel: string;
  duration: number;
  isReal?: boolean;
  showDetail?: boolean;
};

const URL_STEPS: BuildStep[] = [
  { id: "scrape", label: "Product data fetched", activeLabel: "Fetching product data", duration: 0, isReal: true },
  { id: "margin", label: "Margin calculated", activeLabel: "Margin constraints", duration: 1800, showDetail: true },
  { id: "value", label: "Features extracted", activeLabel: "Perceived value", duration: 1500, showDetail: true },
  { id: "reviews", label: "Reviews analyzed", activeLabel: "Analyzing reviews", duration: 2000, showDetail: true },
  { id: "trends", label: "Market analyzed", activeLabel: "Trend analysis", duration: 1800, showDetail: true },
  { id: "copy", label: "Copy written", activeLabel: "Writing hook copy and bundles", duration: 2500 },
  { id: "images", label: "Images generated", activeLabel: "Composing hero imagery", duration: 3000 },
  { id: "render", label: "Store assembled", activeLabel: "Rendering store", duration: 1500 },
];

const AI_STEPS: BuildStep[] = [
  { id: "understand", label: "Prompt analyzed", activeLabel: "Understanding your idea", duration: 2000 },
  { id: "product", label: "Product created", activeLabel: "Creating product details", duration: 2500 },
  { id: "persona", label: "Persona generated", activeLabel: "Building buyer persona", duration: 1800 },
  { id: "copy", label: "Copy written", activeLabel: "Writing hook copy and bundles", duration: 2500 },
  { id: "images", label: "Images generated", activeLabel: "Composing hero imagery", duration: 3000 },
  { id: "render", label: "Store assembled", activeLabel: "Rendering store", duration: 1500 },
];

export const BuildingStep = () => {
  const { data, setScrapedProduct, goToStep, saveToStorage } = useOnboarding();
  const isAiMode = data.source === "ai";
  const steps = isAiMode ? AI_STEPS : URL_STEPS;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [stepDetails, setStepDetails] = useState<Record<string, string>>({});
  const [scrapeError, setScrapeError] = useState<string | null>(null);
  const [scrapeComplete, setScrapeComplete] = useState(false);

  const scrape = api.scrape.preview.useMutation();
  const timerRefs = useRef<NodeJS.Timeout[]>([]);
  const startTimeRef = useRef(Date.now());
  const hasStartedRef = useRef(false);
  const urlRef = useRef(data.url);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!scrapeComplete) return;

    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];

    const stepList = isAiMode ? AI_STEPS : URL_STEPS;
    const startIndex = isAiMode ? 0 : 1;
    let cumulativeDelay = 0;

    for (let i = startIndex; i < stepList.length; i++) {
      const step = stepList[i];
      if (step.isReal) continue;

      const currentIndex = i;
      const stepDelay = cumulativeDelay;
      const completionDelay = cumulativeDelay + step.duration;

      const stepTimer = setTimeout(() => {
        setCurrentStepIndex(currentIndex);
      }, stepDelay);

      const completeTimer = setTimeout(() => {
        setCompletedSteps((prev) => [...prev, step.id]);

        if (step.showDetail) {
          const fakeDetails: Record<string, string> = {
            margin: "65% est. margin",
            value: "6 images · 5 features",
            reviews: "4.2★ · 4,386 reviews",
            trends: "Niche evergreen",
          };
          setStepDetails((prev) => ({ ...prev, [step.id]: fakeDetails[step.id] ?? "" }));
        }
      }, completionDelay);

      timerRefs.current.push(stepTimer, completeTimer);
      cumulativeDelay = completionDelay;
    }

    const readyTimer = setTimeout(() => {
      saveToStorage();
      goToStep("complete");
    }, cumulativeDelay + 500);
    timerRefs.current.push(readyTimer);

    return () => {
      timerRefs.current.forEach(clearTimeout);
      timerRefs.current = [];
    };
  }, [scrapeComplete, isAiMode, saveToStorage, goToStep]);

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    if (isAiMode) {
      setTimeout(() => {
        setScrapeComplete(true);
      }, 300);
    } else if (urlRef.current) {
      scrape.mutate(
        { url: urlRef.current },
        {
          onSuccess: (result) => {
            setScrapedProduct(result);
            setCompletedSteps(["scrape"]);
            setStepDetails((prev) => ({ ...prev, scrape: "Product detected" }));
            setTimeout(() => {
              setScrapeComplete(true);
            }, 400);
          },
          onError: (err) => {
            setScrapeError(err.message || "Failed to fetch");
          },
        },
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progress = Math.min(100, Math.round((completedSteps.length / steps.length) * 100));
  const productImage = data.scrapedProduct?.images?.[0];

  if (scrapeError) {
    return (
      <div className="mx-auto max-w-[500px] text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex size-16 items-center justify-center rounded-full border-2 border-red-500/50 bg-red-500/10">
            <svg className="size-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
        <h2 className="text-[24px] font-bold text-[var(--dw-text)]">Couldn&apos;t fetch product</h2>
        <p className="mt-3 text-[14px] text-[var(--dw-text-muted)]">{scrapeError}</p>
        <button
          onClick={() => goToStep("details")}
          className="mt-6 rounded-xl border border-[var(--dw-border)] bg-[var(--dw-surface)] px-6 py-3 text-[14px] font-medium text-[var(--dw-text)] transition-colors hover:bg-[var(--dw-surface2)]"
        >
          Try another URL
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[900px]">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4 inline-flex items-center gap-2.5 rounded-full bg-[var(--dw-accent)]/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--dw-accent)]"
          >
            <HugeiconsIcon icon={SparklesIcon} size={12} className="animate-pulse" />
            Building Store
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-[32px] font-bold leading-tight tracking-tight text-[var(--dw-text)] md:text-[40px]"
          >
            Building your store<span className="text-[var(--dw-accent)]">.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-[15px] text-[var(--dw-text-muted)]"
          >
            Writing conversion-optimized copy, generating imagery, and assembling your store.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-6 flex items-baseline gap-3"
          >
            <span className="dw-mono text-[48px] font-light tracking-tight text-[var(--dw-text)]">
              {formatTime(elapsedSeconds)}
            </span>
            <span className="text-[14px] text-[var(--dw-text-muted)]">elapsed</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--dw-surface2)]"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-[var(--dw-accent)] to-[var(--dw-accent-hover)]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-8 space-y-2"
          >
            {steps.map((step, index) => {
              const isCompleted = completedSteps.includes(step.id);
              const isActive = currentStepIndex === index && !isCompleted;
              const isScraping = step.id === "scrape" && scrape.isPending;
              const detail = stepDetails[step.id];

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className={cn(
                    "flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-300",
                    isCompleted
                      ? "bg-[var(--dw-jade)]/8"
                      : isActive || isScraping
                        ? "border border-[var(--dw-accent)]/30 bg-[var(--dw-accent)]/8"
                        : "bg-transparent"
                  )}
                >
                  <div
                    className={cn(
                      "relative flex size-7 shrink-0 items-center justify-center rounded-lg transition-all",
                      isCompleted
                        ? "bg-[var(--dw-jade)] text-[#0a0a0a]"
                        : isActive || isScraping
                          ? "bg-[var(--dw-accent)] text-[#0a0a0a]"
                          : "bg-[var(--dw-surface2)] text-[var(--dw-text-muted)]"
                    )}
                  >
                    {isCompleted ? (
                      <HugeiconsIcon icon={Tick02Icon} size={14} />
                    ) : (isActive || isScraping) ? (
                      <>
                        <HugeiconsIcon icon={SparklesIcon} size={14} className="animate-pulse" />
                        <span className="absolute inset-0 animate-ping rounded-lg bg-[var(--dw-accent)] opacity-30" />
                      </>
                    ) : (
                      <span className="size-1.5 rounded-full bg-current animate-pulse" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div
                      className={cn(
                        "text-[14px] font-medium transition-colors",
                        isCompleted
                          ? "text-[var(--dw-jade)] line-through decoration-[var(--dw-jade)]/40"
                          : isActive || isScraping
                            ? "text-[var(--dw-text)]"
                            : "text-[var(--dw-text-muted)]"
                      )}
                    >
                      {isCompleted ? step.label : (isActive || isScraping) ? step.activeLabel : step.label}
                    </div>
                  </div>

                  {detail && isCompleted && (
                    <span className="rounded-md bg-[var(--dw-surface2)] px-2.5 py-1 text-[11px] font-medium text-[var(--dw-text-muted)]">
                      {detail}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        <AnimatePresence>
          {(productImage || isAiMode) && completedSteps.length >= 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
              className="flex flex-col items-center lg:w-[340px]"
            >
              <div className="relative w-full overflow-hidden rounded-2xl border border-[var(--dw-border)] bg-white p-4 shadow-xl shadow-black/20">
                {isAiMode ? (
                  <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-[var(--dw-accent)]/10 to-[var(--dw-accent)]/5 rounded-xl">
                    <HugeiconsIcon icon={MagicWand01Icon} size={64} className="text-[var(--dw-accent)]" />
                  </div>
                ) : productImage && (
                  <div className="relative aspect-square">
                    <Image
                      src={productImage}
                      alt="Product"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center gap-2 text-[12px] font-medium text-[var(--dw-jade)]">
                <span className="size-2 rounded-full bg-[var(--dw-jade)] animate-pulse" />
                {isAiMode ? "AI GENERATING" : "PRODUCT DETECTED"}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
