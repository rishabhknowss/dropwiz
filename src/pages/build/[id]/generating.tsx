import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { motion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon, SparklesIcon } from "@hugeicons/core-free-icons";
import { api } from "@/utils/api";
import type { ProductAnalysis } from "@/lib/scraper";

type Step = {
  id: string;
  label: string;
  activeLabel: string;
  phase: "scrape" | "build" | "render";
};

const STEPS: Step[] = [
  { id: "fetch", label: "Product data fetched", activeLabel: "Fetching product data", phase: "scrape" },
  { id: "margin", label: "Margin calculated", activeLabel: "Calculating margins", phase: "scrape" },
  { id: "perceived", label: "Features extracted", activeLabel: "Extracting features", phase: "scrape" },
  { id: "reviews", label: "Reviews analyzed", activeLabel: "Analyzing reviews", phase: "scrape" },
  { id: "trend", label: "Market analyzed", activeLabel: "Analyzing market", phase: "scrape" },
  { id: "copy", label: "Copy written", activeLabel: "Writing conversion copy", phase: "build" },
  { id: "images", label: "Images generated", activeLabel: "Generating hero images", phase: "build" },
  { id: "render", label: "Store assembled", activeLabel: "Assembling store", phase: "render" },
];

const STEP_DURATION_MS = 900;

const BuildGenerating = () => {
  const router = useRouter();
  const storeId = typeof router.query.id === "string" ? router.query.id : null;
  const claim = typeof router.query.claim === "string" ? router.query.claim : null;
  const [stepIndex, setStepIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  const statusQuery = api.stores.getStatus.useQuery(
    { storeId: storeId ?? "" },
    {
      enabled: !!storeId,
      refetchInterval: 750,
      refetchOnWindowFocus: false,
    },
  );
  const me = api.auth.me.useQuery(undefined, { refetchOnWindowFocus: false });

  const status = statusQuery.data?.status;
  const analysis = (statusQuery.data?.analysis as ProductAnalysis | null) ?? null;
  const productImage = statusQuery.data?.productImage ?? null;

  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const phaseCeiling = useMemo(() => {
    if (status === "scraping") return 4;
    if (status === "generating") return 6;
    if (status === "ready") return STEPS.length;
    return 0;
  }, [status]);

  useEffect(() => {
    if (stepIndex >= phaseCeiling) return;
    const t = setTimeout(() => {
      setStepIndex((i) => Math.min(phaseCeiling, i + 1));
    }, STEP_DURATION_MS);
    return () => clearTimeout(t);
  }, [stepIndex, phaseCeiling]);

  useEffect(() => {
    if (
      status === "ready" &&
      statusQuery.data?.slug &&
      stepIndex >= STEPS.length &&
      !me.isLoading
    ) {
      const target =
        me.data && storeId
          ? `/app/stores/${storeId}/edit`
          : `/p/${statusQuery.data.slug}${claim ? `?claim=${encodeURIComponent(claim)}` : ""}`;
      const t = setTimeout(() => router.replace(target), 600);
      return () => clearTimeout(t);
    }
  }, [
    status,
    statusQuery.data?.slug,
    stepIndex,
    claim,
    router,
    me.data,
    me.isLoading,
    storeId,
  ]);

  const failed = status === "failed";
  const progress = Math.min(100, Math.round((stepIndex / STEPS.length) * 100));

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

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

        <main className="relative z-10 mx-auto max-w-[900px] px-5 pb-16 pt-8 md:px-8 md:pb-20 md:pt-12">
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-16">
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-5 inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-wider ${
                  failed
                    ? "border-red-200 bg-red-50 text-red-600"
                    : "border-[#E5E5E5] bg-white text-[#0A0A0A]"
                }`}
              >
                {failed ? (
                  <span className="size-2 rounded-full bg-red-500" />
                ) : (
                  <span className="size-2 animate-pulse rounded-full bg-[#0A0A0A]" />
                )}
                {failed ? "Generation Failed" : "Building Store"}
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
                  {formatTime(elapsed)}
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
                {STEPS.map((step, i) => {
                  const done = i < stepIndex;
                  const active = i === stepIndex && !failed;
                  const detail = detailFor(step.id, analysis);

                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + i * 0.05 }}
                      className={`flex items-center gap-4 rounded-xl px-4 py-3.5 transition-all duration-300 ${
                        done
                          ? "bg-[#F5F5F5]"
                          : active
                            ? "border border-[#0A0A0A] bg-white"
                            : "bg-transparent"
                      }`}
                    >
                      <div
                        className={`relative flex size-6 shrink-0 items-center justify-center rounded-full transition-all ${
                          done
                            ? "bg-[#0A0A0A] text-white"
                            : active
                              ? "bg-[#0A0A0A] text-white"
                              : "border border-[#D1D5DB] bg-white text-[#9CA3AF]"
                        }`}
                      >
                        {done ? (
                          <HugeiconsIcon icon={Tick02Icon} size={12} />
                        ) : active ? (
                          <HugeiconsIcon icon={SparklesIcon} size={12} className="animate-pulse" />
                        ) : (
                          <span className="size-1.5 rounded-full bg-current" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div
                          className={`text-[14px] font-medium transition-colors ${
                            done
                              ? "text-[#0A0A0A]"
                              : active
                                ? "text-[#0A0A0A]"
                                : "text-[#9CA3AF]"
                          }`}
                        >
                          {done ? step.label : active ? step.activeLabel : step.label}
                        </div>
                      </div>

                      {detail && done && (
                        <span className="rounded-full bg-white px-3 py-1 text-[11px] font-medium text-[#666666]">
                          {detail}
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>

              {failed && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5"
                >
                  <div className="text-[15px] font-semibold text-red-600">Generation failed</div>
                  <div className="mt-2 text-[13px] text-[#666666]">
                    {statusQuery.data?.failureReason ??
                      "Something went wrong. Please try a different product URL."}
                  </div>
                  <button
                    onClick={() => router.push("/build/new")}
                    className="mt-4 rounded-xl bg-[#0A0A0A] px-5 py-2.5 text-[13px] font-semibold text-white transition-all hover:bg-[#1a1a1a]"
                  >
                    Try Again
                  </button>
                </motion.div>
              )}
            </div>

            {productImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 20 }}
                className="flex flex-col items-center lg:w-[320px]"
              >
                <div className="relative w-full overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white p-5 shadow-lg shadow-black/5">
                  <div className="relative aspect-square rounded-xl bg-[#FAFAFA]">
                    <img
                      src={productImage}
                      alt="Product"
                      className="h-full w-full object-contain p-2"
                    />
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#0A0A0A]">
                  <span className="size-2 rounded-full bg-[#22C55E] animate-pulse" />
                  Product Detected
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

const detailFor = (id: string, analysis: ProductAnalysis | null): string | null => {
  if (!analysis) return null;
  switch (id) {
    case "margin":
      return analysis.margin.detail;
    case "perceived":
      return analysis.perceivedValue.detail;
    case "reviews":
      return analysis.reviews.detail;
    case "trend":
      return analysis.trend.detail;
    default:
      return null;
  }
};

export default BuildGenerating;
