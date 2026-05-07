import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Image01Icon,
  SparklesIcon,
  GridIcon,
  ArrowRight01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { AnimatePresence, motion } from "motion/react";
import { api } from "@/utils/api";
import { runWithToast } from "@/hooks/useToastMutation";
import { r2PublicUrl } from "@/lib/r2-url";
import { cn } from "@/lib/utils";

const FORMAT_OPTIONS = [
  { id: "square", label: "1:1", ratio: "1:1" },
  { id: "portrait", label: "4:5", ratio: "4:5" },
  { id: "landscape", label: "16:9", ratio: "16:9" },
] as const;

const STYLE_OPTIONS = [
  { id: "minimal", label: "Minimal" },
  { id: "bold", label: "Bold" },
  { id: "premium", label: "Premium" },
  { id: "playful", label: "Playful" },
] as const;

const FREE_TIERS = ["free", "starter"];

export const StudioPanel = ({ storeId }: { storeId: string }) => {
  const utils = api.useUtils();
  const me = api.auth.me.useQuery();
  const isFreeTier = FREE_TIERS.includes(me.data?.tier ?? "free");
  const assets = api.ads.listAssets.useQuery(
    { storeId },
    { refetchOnWindowFocus: false },
  );
  const regenImage = api.stores.regenerateHeroImage.useMutation();
  const setHero = api.stores.setHeroImage.useMutation();

  const [prompt, setPrompt] = useState("");
  const [format, setFormat] = useState<"square" | "portrait" | "landscape">("square");
  const [style, setStyle] = useState<string>("minimal");
  const [gridCols, setGridCols] = useState(2);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [showStyleMenu, setShowStyleMenu] = useState(false);

  const invalidate = () => {
    utils.ads.listAssets.invalidate({ storeId });
    utils.stores.getMine.invalidate({ storeId });
    utils.auth.me.invalidate();
  };

  const handleGenerate = () => {
    const fullPrompt = prompt || `Product shot, ${style} style`;
    runWithToast(
      regenImage,
      { storeId, prompt: fullPrompt, count: 1 },
      {
        loading: "Generating image...",
        success: (data) => {
          const remaining = data.creditsRemaining;
          return remaining !== null
            ? `Generated! ${remaining} credits left`
            : "Image generated";
        },
        onSuccess: () => {
          setPrompt("");
          invalidate();
        },
      },
    );
  };

  const applyAsHero = (url: string, assetId: string) => {
    setSelectedId(assetId);
    runWithToast(
      setHero,
      { storeId, imageUrl: url },
      { loading: "Applying...", success: "Set as hero", onSuccess: invalidate },
    );
  };

  const selectedFormat = FORMAT_OPTIONS.find((f) => f.id === format);
  const selectedStyle = STYLE_OPTIONS.find((s) => s.id === style);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-[color:var(--dw-border)] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="dw-mono text-[10px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
            Library ({assets.data?.length ?? 0})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={GridIcon} size={12} className="text-[color:var(--dw-text-muted)]" />
          <input
            type="range"
            min={2}
            max={4}
            value={gridCols}
            onChange={(e) => setGridCols(Number(e.target.value))}
            className="h-1 w-16 cursor-pointer appearance-none rounded-full bg-[color:var(--dw-border)] accent-[color:var(--dw-accent)]"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-2">
        {(assets.data?.length ?? 0) === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-[color:var(--dw-surface2)]">
              <HugeiconsIcon icon={Image01Icon} size={20} className="text-[color:var(--dw-text-muted)]" />
            </div>
            <p className="text-[13px] text-[color:var(--dw-text-muted)]">No images yet</p>
            <p className="mt-1 text-[11px] text-[color:var(--dw-text-muted)]/60">
              Generate your first image below
            </p>
          </div>
        ) : (
          <div
            className="grid gap-1.5"
            style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}
          >
            {assets.data?.map((a) => {
              const url = r2PublicUrl(a.r2Key);
              const isSelected = selectedId === a.id;
              return (
                <motion.button
                  key={a.id}
                  layout
                  onClick={() => applyAsHero(url, a.id)}
                  disabled={setHero.isPending}
                  className={cn(
                    "group relative aspect-square overflow-hidden rounded-lg border bg-[color:var(--dw-surface2)] transition",
                    isSelected
                      ? "border-[color:var(--dw-accent)] ring-2 ring-[color:var(--dw-accent)]/30"
                      : "border-[color:var(--dw-border)] hover:border-[color:var(--dw-accent)]/50"
                  )}
                >
                  <img
                    src={url}
                    alt={a.kind}
                    className="size-full object-cover"
                    loading="lazy"
                    onLoad={(e) => {
                      (e.target as HTMLImageElement).dataset.loaded = "true";
                    }}
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      const parent = img.closest("button");
                      if (parent) parent.remove();
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100">
                    <span className="rounded-full bg-white/20 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                      Set as hero
                    </span>
                  </div>
                  {isSelected && (
                    <div className="absolute right-1.5 top-1.5 flex size-5 items-center justify-center rounded-full bg-[color:var(--dw-accent)]">
                      <HugeiconsIcon icon={Tick02Icon} size={10} className="text-white" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-t border-[color:var(--dw-border)] p-4">
        <div className="mx-auto max-w-md rounded-2xl border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to generate..."
            rows={2}
            className="w-full resize-none bg-transparent text-[13px] text-[color:var(--dw-text)] placeholder-[color:var(--dw-text-muted)] outline-none"
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleGenerate())}
          />
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="relative">
                <button
                  onClick={() => setShowFormatMenu(!showFormatMenu)}
                  className="flex items-center gap-1 rounded-full border border-[color:var(--dw-border)] bg-[color:var(--dw-surface2)] px-2.5 py-1 text-[11px] text-[color:var(--dw-text-dim)] hover:border-[color:var(--dw-accent)]/30"
                >
                  <HugeiconsIcon icon={GridIcon} size={10} />
                  {selectedFormat?.label}
                </button>
                <AnimatePresence>
                  {showFormatMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="absolute bottom-full left-0 mb-1 rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-1 shadow-lg"
                    >
                      {FORMAT_OPTIONS.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => {
                            setFormat(f.id);
                            setShowFormatMenu(false);
                          }}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-[11px] transition",
                            format === f.id
                              ? "bg-[color:var(--dw-accent)]/10 text-[color:var(--dw-accent)]"
                              : "text-[color:var(--dw-text-dim)] hover:bg-[color:var(--dw-surface2)]"
                          )}
                        >
                          {f.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowStyleMenu(!showStyleMenu)}
                  className="flex items-center gap-1 rounded-full border border-[color:var(--dw-border)] bg-[color:var(--dw-surface2)] px-2.5 py-1 text-[11px] text-[color:var(--dw-text-dim)] hover:border-[color:var(--dw-accent)]/30"
                >
                  <HugeiconsIcon icon={SparklesIcon} size={10} />
                  {selectedStyle?.label}
                </button>
                <AnimatePresence>
                  {showStyleMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="absolute bottom-full left-0 mb-1 rounded-lg border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-1 shadow-lg"
                    >
                      {STYLE_OPTIONS.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => {
                            setStyle(s.id);
                            setShowStyleMenu(false);
                          }}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-[11px] transition",
                            style === s.id
                              ? "bg-[color:var(--dw-accent)]/10 text-[color:var(--dw-accent)]"
                              : "text-[color:var(--dw-text-dim)] hover:bg-[color:var(--dw-surface2)]"
                          )}
                        >
                          {s.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {me.data && isFreeTier && (
                <span className="flex items-center gap-1 text-[10px] text-[color:var(--dw-text-muted)]">
                  <HugeiconsIcon icon={SparklesIcon} size={9} className="text-[color:var(--dw-accent)]" />
                  {me.data.imageCredits}
                </span>
              )}
            </div>

            <button
              onClick={handleGenerate}
              disabled={regenImage.isPending || (isFreeTier && (me.data?.imageCredits ?? 0) < 1)}
              className="flex size-7 items-center justify-center rounded-full bg-[color:var(--dw-accent)] text-[color:var(--dw-accent-ink)] transition hover:opacity-90 disabled:opacity-50"
            >
              {regenImage.isPending ? (
                <span className="size-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
