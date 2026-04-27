import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon, Loading03Icon } from "@hugeicons/core-free-icons";
import { DWTopNav } from "@/components/dw/TopNav";
import { DWChip } from "@/components/dw/Chip";
import { api } from "@/utils/api";
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
      refetchInterval: 1500,
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

  return (
    <div className="min-h-screen bg-[color:var(--dw-bg)] text-[color:var(--dw-text)]">
      <DWTopNav active="Product" />
      <main
        className="mx-auto px-5 py-8 transition-[max-width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] md:px-6 md:py-12"
        style={{ maxWidth: productImage ? "1100px" : "560px" }}
      >
        <div
          className={`grid gap-10 transition-[grid-template-columns] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            productImage
              ? "grid-cols-1 md:grid-cols-[1.1fr_0.9fr]"
              : "grid-cols-1"
          }`}
        >
          <div>
          <DWChip variant={failed ? "signal" : "live"}>
            {failed ? "Failed" : "Generating"}
          </DWChip>
          <h1 className="dw-display-sm mt-4 text-[28px] leading-[1.05] tracking-[-0.02em] md:text-[36px] lg:text-[40px] lg:leading-[1.04]">
            {scrapeDone ? "Building your store" : "Analyzing the product"}
            <span className="text-[color:var(--dw-accent)]">.</span>
          </h1>
          <p className="mt-3 text-[14px] leading-[1.5] text-[color:var(--dw-text-dim)] md:text-[14.5px]">
            {scrapeDone
              ? "We've scored the product. Now writing copy, generating imagery, and assembling sections."
              : "Pulling the listing, checking margin, perceived value, social proof, and niche trend."}
          </p>

          <div className="dw-mono mt-6 text-[36px] leading-none tracking-[-0.02em] md:mt-7 md:text-[44px]">
            {String(Math.floor(elapsed / 60)).padStart(2, "0")}:
            {String(elapsed % 60).padStart(2, "0")}
          </div>

          <div className="mt-8 space-y-2.5">
            {STEPS.map((step, i) => (
              <StepRow
                key={step.id}
                step={step}
                done={i < stepIndex}
                active={i === stepIndex && !failed}
                detail={detailFor(step.id, analysis)}
              />
            ))}
          </div>

          {failed && (
            <div
              className="mt-7 rounded-[14px] border p-4"
              style={{
                borderColor: "var(--dw-signal)",
                background: "color-mix(in oklab, var(--dw-signal) 8%, transparent)",
              }}
            >
              <div className="text-[14px] font-medium">Generation failed</div>
              <div className="mt-1 text-[13px] opacity-75">
                {statusQuery.data?.failureReason ??
                  "Something went wrong. Try a different URL."}
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
}: {
  step: Step;
  done: boolean;
  active: boolean;
  detail: string | null;
}) => (
  <div
    className={`flex items-center gap-3.5 rounded-[12px] border px-4 py-3 transition-colors ${
      active
        ? "border-[color:var(--dw-accent)]/40 bg-[color:var(--dw-accent)]/8"
        : done
          ? "border-[color:var(--dw-border)] bg-[color:var(--dw-surface)]"
          : "border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] opacity-60"
    }`}
  >
    <div
      className={`flex size-5 shrink-0 items-center justify-center rounded-full ${
        done
          ? "bg-[color:var(--dw-jade)]/15 text-[color:var(--dw-jade)]"
          : active
            ? "bg-[color:var(--dw-accent)]/15 text-[color:var(--dw-accent)]"
            : "bg-[color:var(--dw-surface2)] text-[color:var(--dw-text-muted)]"
      }`}
    >
      {done ? (
        <HugeiconsIcon icon={Tick02Icon} size={11} />
      ) : active ? (
        <HugeiconsIcon icon={Loading03Icon} size={11} className="dw-spin" />
      ) : (
        <span className="size-1.5 rounded-full bg-current" />
      )}
    </div>
    <div className="flex-1">
      <div
        className={`text-[13px] transition ${
          done ? "text-[color:var(--dw-text-dim)] line-through" : ""
        }`}
      >
        {step.label}
      </div>
    </div>
    {detail && (
      <div className="dw-mono shrink-0 text-[10.5px] tracking-[0.05em] text-[color:var(--dw-text-muted)]">
        {detail}
      </div>
    )}
  </div>
);

const ProductImageCard = ({ productImage }: { productImage: string }) => (
  <div className="dw-product-card overflow-hidden rounded-[20px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)]">
    <div className="relative aspect-square w-full bg-[color:var(--dw-surface2)]">
      <img
        src={productImage}
        alt=""
        className="h-full w-full object-cover"
      />
    </div>
    <style jsx>{`
      .dw-product-card {
        animation: dw-card-in 700ms cubic-bezier(0.22, 1, 0.36, 1) both;
      }
      @keyframes dw-card-in {
        from {
          opacity: 0;
          transform: translateX(24px) scale(0.98);
        }
        to {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
      }
    `}</style>
  </div>
);

export default BuildGenerating;
