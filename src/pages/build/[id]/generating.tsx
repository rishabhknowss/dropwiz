import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon, Loading03Icon, SparklesIcon } from "@hugeicons/core-free-icons";
import { api } from "@/utils/api";
import { ProgressLoader } from "@/components/ui/loaders";
import type { ProductAnalysis } from "@/lib/scraper";

type Step = {
  id: string;
  label: string;
  phase: "scrape" | "build" | "render";
};

const STEPS: Step[] = [
  { id: "fetch", label: "Fetching product data", phase: "scrape" },
  { id: "margin", label: "Margin constraints", phase: "scrape" },
  { id: "perceived", label: "Perceived value", phase: "scrape" },
  { id: "reviews", label: "Analyzing reviews", phase: "scrape" },
  { id: "trend", label: "Trend analysis", phase: "scrape" },
  { id: "copy", label: "Writing hook copy and bundles", phase: "build" },
  { id: "images", label: "Composing hero imagery", phase: "build" },
  { id: "render", label: "Rendering store", phase: "render" },
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
    if (status === "ready") return STEPS.length - 1;
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
      stepIndex >= STEPS.length - 1 &&
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

  const scrapeStepIndices = STEPS.map((s, i) => (s.phase === "scrape" ? i : -1)).filter(
    (i) => i >= 0,
  );
  const scrapeDone = stepIndex >= scrapeStepIndices[scrapeStepIndices.length - 1];

  const failed = status === "failed";
  const progress = (stepIndex / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-[var(--dw-bg)] text-[var(--dw-text)]">
      <div className="dw-grid-pattern fixed inset-0 opacity-30" />
      <main
        className="relative mx-auto px-5 py-10 transition-[max-width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:px-6 md:py-14"
        style={{ maxWidth: productImage ? "1100px" : "600px" }}
      >
        <div
          className={`grid gap-12 transition-[grid-template-columns] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            productImage
              ? "grid-cols-1 md:grid-cols-[1.1fr_0.9fr]"
              : "grid-cols-1"
          }`}
        >
          <div className="animate-fade-up">
            <div className={`mb-5 inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-wide ${
              failed
                ? "bg-[var(--dw-error)]/10 text-[var(--dw-error)]"
                : "bg-[var(--dw-accent)]/10 text-[var(--dw-accent)]"
            }`}>
              {failed ? (
                <span className="size-2 rounded-full bg-[var(--dw-error)]" />
              ) : (
                <HugeiconsIcon icon={SparklesIcon} size={14} className="animate-pulse" />
              )}
              {failed ? "Generation Failed" : "Building Store"}
            </div>

            <h1 className="dw-display text-[32px] text-[var(--dw-text)] md:text-[42px] lg:text-[48px]">
              {scrapeDone ? "Building your store" : "Analyzing product"}
              <span className="dw-gradient-text">.</span>
            </h1>
            <p className="mt-4 max-w-[480px] text-[15px] leading-relaxed text-[var(--dw-text-muted)]">
              {scrapeDone
                ? "Writing conversion-optimized copy, generating imagery, and assembling your store."
                : "Analyzing listing, margins, perceived value, and market trends."}
            </p>

            <div className="mt-8 flex items-end gap-3">
              <div className="dw-mono text-[48px] font-bold leading-none tracking-tight text-[var(--dw-text)] md:text-[56px]">
                {String(Math.floor(elapsed / 60)).padStart(2, "0")}
                <span className="animate-pulse">:</span>
                {String(elapsed % 60).padStart(2, "0")}
              </div>
              <div className="mb-2 text-[12px] font-medium text-[var(--dw-text-subtle)]">elapsed</div>
            </div>

            <div className="mt-8">
              <ProgressLoader progress={progress} />
            </div>

            <div className="mt-8 space-y-3">
              {STEPS.map((step, i) => (
                <StepRow
                  key={step.id}
                  step={step}
                  done={i < stepIndex}
                  active={i === stepIndex && !failed}
                  detail={detailFor(step.id, analysis)}
                  index={i}
                />
              ))}
            </div>

            {failed && (
              <div className="mt-8 rounded-2xl border border-[var(--dw-error)]/30 bg-[var(--dw-error)]/5 p-5">
                <div className="text-[15px] font-semibold text-[var(--dw-error)]">Generation failed</div>
                <div className="mt-2 text-[13px] text-[var(--dw-text-muted)]">
                  {statusQuery.data?.failureReason ??
                    "Something went wrong. Please try a different product URL."}
                </div>
              </div>
            )}
          </div>

          {productImage && (
            <div className="md:sticky md:top-10 md:self-start">
              <ProductImageCard productImage={productImage} />
            </div>
          )}
        </div>
      </main>
    </div>
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

const StepRow = ({
  step,
  done,
  active,
  detail,
  index = 0,
}: {
  step: Step;
  done: boolean;
  active: boolean;
  detail: string | null;
  index?: number;
}) => (
  <div
    className={`animate-slide-up flex items-center gap-4 rounded-xl border px-4 py-3.5 transition-all duration-300 ${
      active
        ? "border-[var(--dw-accent)]/30 bg-[var(--dw-accent)]/5 shadow-lg shadow-[var(--dw-accent)]/5"
        : done
          ? "border-[var(--dw-border)] bg-[var(--dw-surface)]"
          : "border-[var(--dw-border)] bg-[var(--dw-surface)] opacity-50"
    }`}
    style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
  >
    <div
      className={`flex size-6 shrink-0 items-center justify-center rounded-lg transition-all ${
        done
          ? "bg-[var(--dw-success)]/15 text-[var(--dw-success)]"
          : active
            ? "bg-[var(--dw-accent)]/15 text-[var(--dw-accent)]"
            : "bg-[var(--dw-surface2)] text-[var(--dw-text-subtle)]"
      }`}
    >
      {done ? (
        <HugeiconsIcon icon={Tick02Icon} size={12} />
      ) : active ? (
        <HugeiconsIcon icon={Loading03Icon} size={12} className="dw-spin" />
      ) : (
        <span className="size-1.5 rounded-full bg-current" />
      )}
    </div>
    <div className="flex-1">
      <div
        className={`text-[13px] font-medium transition-all ${
          done ? "text-[var(--dw-text-muted)] line-through" : active ? "text-[var(--dw-text)]" : "text-[var(--dw-text-muted)]"
        }`}
      >
        {step.label}
      </div>
    </div>
    {detail && (
      <div className="dw-mono shrink-0 rounded-md bg-[var(--dw-surface2)] px-2 py-1 text-[10px] font-medium tracking-wide text-[var(--dw-text-muted)]">
        {detail}
      </div>
    )}
  </div>
);

const ProductImageCard = ({ productImage }: { productImage: string }) => (
  <div className="animate-slide-in-right relative overflow-hidden rounded-2xl border border-[var(--dw-border)] bg-[var(--dw-surface)]">
    <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[var(--dw-accent)] opacity-10 blur-3xl" />
    <div className="relative aspect-square w-full overflow-hidden bg-[var(--dw-surface2)]">
      <img
        src={productImage}
        alt=""
        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
      />
    </div>
    <div className="p-4">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-[var(--dw-success)] animate-pulse" />
        <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--dw-text-muted)]">
          Product detected
        </span>
      </div>
    </div>
  </div>
);

export default BuildGenerating;
