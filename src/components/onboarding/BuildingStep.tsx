import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Tick02Icon,
  SparklesIcon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";
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

  const scrape = api.scrape.preview.useMutation({
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
  });
  const timerRefs = useRef<NodeJS.Timeout[]>([]);
  const startTimeRef = useRef(Date.now());
  const hasStartedRef = useRef(false);

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
    if (!data.url && !isAiMode) return;
    hasStartedRef.current = true;

    if (isAiMode) {
      setTimeout(() => {
        setScrapeComplete(true);
      }, 300);
    } else if (data.url) {
      scrape.mutate({ url: data.url });
    }
  }, [data.url, isAiMode, scrape]);

  const progress = Math.min(100, Math.round((completedSteps.length / steps.length) * 100));

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
    <div className="mx-auto max-w-[540px]">
      <div className="mb-10 flex items-center gap-4">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          type="button"
          onClick={() => goToStep("customize")}
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
          <span className="size-2 animate-pulse rounded-full bg-[var(--dw-accent)]" />
          Building
        </motion.div>
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-[32px] font-bold leading-[1.1] tracking-tight text-[#0A0A0A] md:text-[44px]"
      >
        Creating your store
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4 text-[16px] leading-relaxed text-[#666666]"
      >
        AI is writing conversion-optimized copy and generating imagery.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-8 flex items-center gap-4"
      >
        <span className="font-mono text-[56px] font-light tracking-tight text-[#0A0A0A]">
          {formatTime(elapsedSeconds)}
        </span>
        <span className="text-[14px] text-[#666666]">elapsed</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 h-1.5 overflow-hidden rounded-full bg-[#E5E5E5]"
      >
        <motion.div
          className="h-full bg-[#0A0A0A]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="mt-10 space-y-1"
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
                "flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-all duration-300",
                isCompleted
                  ? "bg-[#E8F5E9]"
                  : isActive || isScraping
                    ? "border-2 border-[#0A0A0A] bg-white"
                    : "bg-transparent"
              )}
            >
              <div
                className={cn(
                  "relative flex size-6 shrink-0 items-center justify-center rounded-full transition-all",
                  isCompleted
                    ? "bg-[#22C55E] text-white"
                    : isActive || isScraping
                      ? "bg-[#0A0A0A] text-white"
                      : "border border-[#D1D5DB] bg-white text-[#9CA3AF]"
                )}
              >
                {isCompleted ? (
                  <HugeiconsIcon icon={Tick02Icon} size={12} />
                ) : (isActive || isScraping) ? (
                  <>
                    <HugeiconsIcon icon={SparklesIcon} size={12} className="animate-pulse" />
                  </>
                ) : (
                  <span className="size-1.5 rounded-full bg-current" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div
                  className={cn(
                    "text-[14px] font-medium transition-colors",
                    isCompleted
                      ? "text-[#22C55E]"
                      : isActive || isScraping
                        ? "text-[#0A0A0A]"
                        : "text-[#9CA3AF]"
                  )}
                >
                  {isCompleted ? step.label : (isActive || isScraping) ? step.activeLabel : step.label}
                </div>
              </div>

              {detail && isCompleted && (
                <span className="rounded-full bg-white px-3 py-1 text-[11px] font-medium text-[#666666]">
                  {detail}
                </span>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};
