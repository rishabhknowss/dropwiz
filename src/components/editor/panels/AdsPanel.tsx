import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AiImageIcon,
  Download04Icon,
  Copy01Icon,
  ArrowUp02Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { api } from "@/utils/api";
import { r2PublicUrl } from "@/lib/r2-url";
import { Panel } from "./shared/Panel";
import { getErrorMessage } from "@/lib/trpc-errors";

type AdFormat = "square" | "feed" | "story" | "landscape" | "wide";

const FORMATS: Array<{ value: AdFormat; label: string; sub: string }> = [
  { value: "square", label: "1:1", sub: "Square" },
  { value: "feed", label: "4:5", sub: "Feed" },
  { value: "story", label: "9:16", sub: "Story" },
  { value: "landscape", label: "16:9", sub: "Land." },
  { value: "wide", label: "21:9", sub: "Wide" },
];

export const AdsPanel = ({ storeId }: { storeId: string }) => {
  const generateAd = api.ads.generateStaticAd.useMutation();
  const adAssets = api.ads.listAssets.useQuery(
    { storeId, kind: "ad" },
    { refetchOnWindowFocus: false },
  );
  const utils = api.useUtils();

  const [brief, setBrief] = useState("");
  const [format, setFormat] = useState<AdFormat>("feed");
  const [isGenerating, setIsGenerating] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const toastIdRef = useRef<string | number | null>(null);

  const handleGenerate = () => {
    if (isGenerating) return;
    if (toastIdRef.current) toast.dismiss(toastIdRef.current);
    toastIdRef.current = toast.loading("Generating ad — ~30–60s…");
    setIsGenerating(true);
    generateAd.mutate(
      {
        storeId,
        format,
        tone: "premium",
        hook: brief.trim() || undefined,
      },
      {
        onSuccess: () => {
          if (toastIdRef.current) toast.dismiss(toastIdRef.current);
          toastIdRef.current = null;
          toast.success("Ad ready");
          utils.ads.listAssets.invalidate({ storeId });
          setIsGenerating(false);
        },
        onError: (err) => {
          if (toastIdRef.current) toast.dismiss(toastIdRef.current);
          toastIdRef.current = null;
          toast.error(getErrorMessage(err));
          setIsGenerating(false);
        },
      },
    );
  };

  const ads = (adAssets.data ?? []).map((a) => ({
    id: a.id,
    url: r2PublicUrl(a.r2Key),
  }));
  const hasContent = isGenerating || ads.length > 0;

  return (
    <Panel title="Ads studio" eyebrow="Generate static ads · GPT Image 2">
      {hasContent ? (
        <div className="grid grid-cols-3 gap-2">
          {isGenerating && <LoaderCell />}
          {ads.map((ad) => (
            <AdCell
              key={ad.id}
              url={ad.url}
              onOpen={() => setLightboxUrl(ad.url)}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}

      <ChatBox
        brief={brief}
        setBrief={setBrief}
        format={format}
        setFormat={setFormat}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
      />

      {lightboxUrl && (
        <Lightbox url={lightboxUrl} onClose={() => setLightboxUrl(null)} />
      )}
    </Panel>
  );
};

const Lightbox = ({ url, onClose }: { url: string; onClose: () => void }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const proxied = `/api/download/asset?url=${encodeURIComponent(url)}&filename=dropwiz-ad-${Date.now()}.png`;
    const a = document.createElement("a");
    a.href = proxied;
    a.download = `dropwiz-ad-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <div
      onClick={onClose}
      className="dw-ad-lightbox fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-12 backdrop-blur-md"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close"
        className="fixed top-5 right-5 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
      >
        <HugeiconsIcon icon={Cancel01Icon} size={16} />
      </button>
      <div className="fixed bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
        <button
          onClick={handleCopy}
          className="dw-mono inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[11px] tracking-[0.12em] uppercase text-white backdrop-blur transition hover:bg-white/20"
        >
          <HugeiconsIcon icon={Copy01Icon} size={12} />
          Copy link
        </button>
        <button
          onClick={handleDownload}
          className="dw-mono inline-flex items-center gap-2 rounded-full bg-[color:var(--dw-accent)] px-4 py-2 text-[11px] tracking-[0.12em] uppercase text-[color:var(--dw-accent-ink)] transition hover:scale-105"
        >
          <HugeiconsIcon icon={Download04Icon} size={12} />
          Download
        </button>
      </div>
      <img
        src={url}
        alt=""
        onClick={(e) => e.stopPropagation()}
        className="dw-ad-lightbox-img block max-h-[70vh] max-w-[60vw] rounded-[12px] object-contain shadow-2xl"
      />
      <style jsx>{`
        .dw-ad-lightbox {
          animation: dw-fade-in 200ms ease-out both;
        }
        .dw-ad-lightbox-img {
          animation: dw-zoom-in 240ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes dw-fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes dw-zoom-in {
          from {
            opacity: 0;
            transform: scale(0.92);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

const EmptyState = () => (
  <div className="flex aspect-square w-full max-w-[120px] items-center justify-center rounded-[10px] border border-dashed border-[color:var(--dw-border)] text-center">
    <div className="dw-mono px-2 text-[9px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
      No ads yet
    </div>
  </div>
);

const LoaderCell = () => (
  <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[10px] border border-[color:var(--dw-border)] bg-[#1a1a1a]">
    <div className="dw-ad-spinner">
      <span />
      <span />
      <span />
      <span />
    </div>
    <style jsx>{`
      .dw-ad-spinner {
        position: relative;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(#ee280e, #15a0f7, #6ed15a);
        animation: dw-ad-spin 1.2s linear infinite;
      }
      .dw-ad-spinner span {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        background: linear-gradient(#ee280e, #15a0f7, #5ad15a);
      }
      .dw-ad-spinner span:nth-child(1) {
        filter: blur(5px);
      }
      .dw-ad-spinner span:nth-child(2) {
        filter: blur(10px);
      }
      .dw-ad-spinner span:nth-child(3) {
        filter: blur(25px);
      }
      .dw-ad-spinner span:nth-child(4) {
        filter: blur(50px);
      }
      .dw-ad-spinner::after {
        content: "";
        position: absolute;
        inset: 10px;
        background: var(--dw-surface);
        border: solid var(--dw-surface) 10px;
        border-radius: 50%;
      }
      @keyframes dw-ad-spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    `}</style>
  </div>
);

const AdCell = ({ url, onOpen }: { url: string; onOpen: () => void }) => {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const proxied = `/api/download/asset?url=${encodeURIComponent(url)}&filename=dropwiz-ad-${Date.now()}.png`;
    const a = document.createElement("a");
    a.href = proxied;
    a.download = `dropwiz-ad-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Copy failed");
    }
  };
  return (
    <button
      onClick={onOpen}
      type="button"
      className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-[10px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] text-left transition hover:border-[color:var(--dw-accent)]/60"
    >
      <img
        src={url}
        alt=""
        className="h-full w-full object-cover transition group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-end gap-1 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-1.5 opacity-0 transition group-hover:opacity-100">
        <button
          onClick={handleCopy}
          aria-label="Copy link"
          className="flex size-6 items-center justify-center rounded-md bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
        >
          <HugeiconsIcon icon={Copy01Icon} size={11} />
        </button>
        <button
          onClick={handleDownload}
          aria-label="Download"
          className="flex size-6 items-center justify-center rounded-md bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
        >
          <HugeiconsIcon icon={Download04Icon} size={11} />
        </button>
      </div>
    </button>
  );
};

const ChatBox = ({
  brief,
  setBrief,
  format,
  setFormat,
  onGenerate,
  isGenerating,
}: {
  brief: string;
  setBrief: (v: string) => void;
  format: AdFormat;
  setFormat: (v: AdFormat) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}) => (
  <div className="rounded-[14px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-3 transition focus-within:border-[color:var(--dw-accent)]/60">
    <textarea
      value={brief}
      onChange={(e) => setBrief(e.target.value)}
      placeholder="Describe the ad — or leave blank to use your store strategy"
      rows={2}
      maxLength={400}
      onKeyDown={(e) => {
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          onGenerate();
        }
      }}
      className="w-full resize-none bg-transparent text-[13px] leading-[1.5] text-[color:var(--dw-text)] outline-none placeholder:text-[color:var(--dw-text-muted)]"
    />
    <div className="mt-2 flex items-center justify-between gap-2">
      <div className="flex flex-wrap items-center gap-1">
        <Pill
          options={FORMATS}
          value={format}
          onChange={(v) => setFormat(v as AdFormat)}
        />
      </div>
      <button
        onClick={onGenerate}
        disabled={isGenerating}
        aria-label="Generate ad"
        className="flex size-9 items-center justify-center rounded-full bg-[color:var(--dw-accent)] text-[color:var(--dw-accent-ink)] transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
      >
        <HugeiconsIcon
          icon={isGenerating ? AiImageIcon : ArrowUp02Icon}
          size={14}
          strokeWidth={2.5}
        />
      </button>
    </div>
  </div>
);

const Pill = ({
  options,
  value,
  onChange,
}: {
  options: Array<{ value: string; label: string; sub: string }>;
  value: string;
  onChange: (v: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 rounded-md border border-[color:var(--dw-border)] bg-transparent px-2 py-1 text-[11px] font-medium text-[color:var(--dw-text)] transition hover:border-[color:var(--dw-accent)]/50"
      >
        <span>{current?.label}</span>
        <span className="dw-mono text-[9px] tracking-[0.08em] uppercase opacity-55">
          {current?.sub}
        </span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full z-20 mb-1 min-w-[140px] overflow-hidden rounded-md border border-[color:var(--dw-border)] bg-[color:var(--dw-bg)] shadow-lg">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-[12px] transition ${
                  opt.value === value
                    ? "bg-[color:var(--dw-accent)]/10 text-[color:var(--dw-text)]"
                    : "hover:bg-[color:var(--dw-surface)]"
                }`}
              >
                <span>{opt.label}</span>
                <span className="dw-mono text-[10px] tracking-[0.08em] uppercase text-[color:var(--dw-text-muted)]">
                  {opt.sub}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
