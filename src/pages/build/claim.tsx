import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon, SparklesIcon, MagicWand01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { api } from "@/utils/api";
import { ONBOARDING_STORAGE_KEY, type OnboardingData } from "@/components/onboarding/types";

const BUILD_STEPS = [
  { id: "create", label: "Store created", activeLabel: "Creating store" },
  { id: "hero", label: "Hero images generated", activeLabel: "Generating hero images" },
  { id: "copy", label: "Conversion copy written", activeLabel: "Writing conversion copy" },
  { id: "sections", label: "Sections built", activeLabel: "Building sections" },
  { id: "render", label: "Store rendered", activeLabel: "Rendering store" },
];

const ClaimStorePage = () => {
  const router = useRouter();
  const me = api.auth.me.useQuery();
  const createStore = api.stores.create.useMutation();
  const getStatus = api.stores.getStatus.useQuery(
    { storeId: createStore.data?.storeId ?? "" },
    { enabled: !!createStore.data?.storeId, refetchInterval: 1500 }
  );

  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const buildStarted = useRef(false);
  const startTimeRef = useRef(Date.now());
  const redirectingRef = useRef(false);

  useEffect(() => {
    const stored = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as OnboardingData;
        setOnboardingData(parsed);
      } catch {
        router.replace("/build/new");
      }
    } else {
      router.replace("/build/new");
    }
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!me.data || !onboardingData || buildStarted.current) return;
    buildStarted.current = true;

    const isAiMode = onboardingData.source === "ai";

    createStore.mutate(
      {
        url: isAiMode ? undefined : onboardingData.url || undefined,
        aiPrompt: isAiMode ? onboardingData.aiPrompt : undefined,
        targetLanguage: onboardingData.targetLanguage,
        currency: onboardingData.currency,
        persona: onboardingData.targetAudience,
      },
      {
        onSuccess: () => {
          setCompletedSteps(["create"]);
          setCurrentStep(1);
        },
        onError: () => {
          router.replace("/build/new");
        },
      }
    );
  }, [me.data, onboardingData, createStore, router]);

  useEffect(() => {
    if (!getStatus.data || redirectingRef.current) return;

    const status = getStatus.data.status;
    const storeId = getStatus.data.id;

    if (status === "ready" || status === "published") {
      redirectingRef.current = true;
      localStorage.removeItem(ONBOARDING_STORAGE_KEY);
      setCompletedSteps(BUILD_STEPS.map((s) => s.id));

      setTimeout(() => {
        router.push(`/app/stores/${storeId}/edit`);
      }, 1000);
    } else if (status === "failed") {
      redirectingRef.current = true;
      localStorage.removeItem(ONBOARDING_STORAGE_KEY);
      router.push(`/build/${storeId}/generating`);
    } else if (status === "generating") {
      setCompletedSteps((prev) => {
        if (!prev.includes("hero")) {
          setCurrentStep(2);
          return [...prev, "hero"];
        }
        return prev;
      });
    }
  }, [getStatus.data, router]);

  useEffect(() => {
    if (getStatus.data?.status !== "generating" || redirectingRef.current) return;

    const progress = completedSteps.length;
    if (progress >= BUILD_STEPS.length - 1) return;

    const timer = setTimeout(() => {
      const nextStep = BUILD_STEPS[progress];
      if (nextStep && !completedSteps.includes(nextStep.id)) {
        setCompletedSteps((prev) => [...prev, nextStep.id]);
        setCurrentStep(progress + 1);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [completedSteps, getStatus.data?.status]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const isAiMode = onboardingData?.source === "ai";
  const productImage = onboardingData?.scrapedProduct?.images?.[0];
  const progress = Math.min(100, Math.round((completedSteps.length / BUILD_STEPS.length) * 100));

  if (!me.data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white">
        <div className="relative mb-4">
          <div className="relative h-8 w-8 rounded-full border-2 border-[#E5E5E5] border-t-[#0A0A0A] animate-spin" />
        </div>
        <div className="text-[13px] font-medium text-[#666666]">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Building Your Store | Dropwiz</title>
      </Head>
      <div className="relative min-h-screen bg-white">
        <header className="relative z-10 flex items-center border-b border-[#E5E5E5] px-6 py-4 md:px-10">
          <div className="flex items-center gap-1">
            <img src="/logo.png" alt="dropwiz" className="h-7 w-auto" />
            <span className="text-[18px] font-bold text-[#0A0A0A]">dropwiz</span>
          </div>
        </header>

        <main className="relative z-10 mx-auto max-w-[900px] px-5 pb-16 pt-4 md:px-8 md:pb-20 md:pt-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-16">
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-[#E5E5E5] bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#0A0A0A]"
              >
                <span className="size-2 animate-pulse rounded-full bg-[#0A0A0A]" />
                Building Store
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-[32px] font-bold leading-tight tracking-tight text-[#0A0A0A] md:text-[44px]"
              >
                Building your store<span className="text-[#0A0A0A]">.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mt-4 text-[15px] leading-relaxed text-[#666666]"
              >
                AI is generating hero images, writing conversion copy, and assembling your store.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8 flex items-baseline gap-3"
              >
                <span className="font-mono text-[56px] font-light tracking-tight text-[#0A0A0A]">
                  {formatTime(elapsedSeconds)}
                </span>
                <span className="text-[14px] text-[#666666]">elapsed</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#E5E5E5]"
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
                transition={{ delay: 0.3 }}
                className="mt-10 space-y-1.5"
              >
                {BUILD_STEPS.map((step, index) => {
                  const isCompleted = completedSteps.includes(step.id);
                  const isActive = currentStep === index && !isCompleted;

                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + index * 0.05 }}
                      className={cn(
                        "flex items-center gap-4 rounded-xl px-4 py-3.5 transition-all duration-300",
                        isCompleted
                          ? "bg-[#F5F5F5]"
                          : isActive
                            ? "border border-[#0A0A0A] bg-white"
                            : "bg-transparent"
                      )}
                    >
                      <div
                        className={cn(
                          "relative flex size-6 shrink-0 items-center justify-center rounded-full transition-all",
                          isCompleted
                            ? "bg-[#0A0A0A] text-white"
                            : isActive
                              ? "bg-[#0A0A0A] text-white"
                              : "border border-[#D1D5DB] bg-white text-[#9CA3AF]"
                        )}
                      >
                        {isCompleted ? (
                          <HugeiconsIcon icon={Tick02Icon} size={12} />
                        ) : isActive ? (
                          <HugeiconsIcon icon={SparklesIcon} size={12} className="animate-pulse" />
                        ) : (
                          <span className="size-1.5 rounded-full bg-current" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div
                          className={cn(
                            "text-[14px] font-medium transition-colors",
                            isCompleted
                              ? "text-[#0A0A0A]"
                              : isActive
                                ? "text-[#0A0A0A]"
                                : "text-[#9CA3AF]"
                          )}
                        >
                          {isCompleted ? step.label : isActive ? step.activeLabel : step.label}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            {(productImage || isAiMode) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 20 }}
                className="flex flex-col items-center lg:w-[320px]"
              >
                <div className="relative w-full overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white p-5 shadow-lg shadow-black/5">
                  {isAiMode ? (
                    <div className="flex aspect-square items-center justify-center rounded-xl bg-gradient-to-br from-[#F5F5F5] to-[#FAFAFA]">
                      <HugeiconsIcon icon={MagicWand01Icon} size={56} className="text-[#0A0A0A]" />
                    </div>
                  ) : productImage && (
                    <div className="relative aspect-square rounded-xl bg-[#FAFAFA]">
                      <Image
                        src={productImage}
                        alt="Product"
                        fill
                        className="object-contain p-2"
                        unoptimized
                      />
                    </div>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#0A0A0A]">
                  <span className="size-2 rounded-full bg-[#22C55E] animate-pulse" />
                  {isAiMode ? "AI Generating" : "Product Detected"}
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default ClaimStorePage;
