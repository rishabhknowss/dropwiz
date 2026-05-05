import { useRef, useState } from "react";
import axios from "axios";
import { HugeiconsIcon } from "@hugeicons/react";
import { AiImageIcon, Upload01Icon, SparklesIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { api } from "@/utils/api";
import { runWithToast } from "@/hooks/useToastMutation";
import { r2PublicUrl } from "@/lib/r2-url";
import { toast } from "sonner";

const COUNT_OPTIONS = [1, 2, 3, 4] as const;
const FREE_TIERS = ["free", "starter"];

type Kind = "hero" | "lifestyle" | "product" | "ad" | "logo";

type Props = {
  label: string;
  storeId: string;
  kind: Kind;
  currentUrl?: string;
  promptSeed?: string;
  onPick: (url: string) => void;
  maxCols?: 2 | 3 | 4;
};

const ACCEPTED = "image/png,image/jpeg,image/webp,image/gif";
const MAX_BYTES = 10 * 1024 * 1024;

export const ImagePickerField = ({
  label,
  storeId,
  kind,
  currentUrl,
  promptSeed,
  onPick,
  maxCols = 3,
}: Props) => {
  const me = api.auth.me.useQuery();
  const isFreeTier = FREE_TIERS.includes(me.data?.tier ?? "free");
  const assets = api.ads.listAssets.useQuery(
    { storeId, kind },
    { refetchOnWindowFocus: false },
  );
  const generate = api.stores.generateImage.useMutation();
  const utils = api.useUtils();
  const [prompt, setPrompt] = useState(promptSeed ?? "");
  const [showPrompt, setShowPrompt] = useState(false);
  const [count, setCount] = useState<1 | 2 | 3 | 4>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = () => {
    const finalPrompt =
      prompt.trim() ||
      promptSeed ||
      `Premium studio ${kind} shot, editorial lighting, clean background, no text, no watermark`;
    runWithToast(
      generate,
      { storeId, kind, prompt: finalPrompt, count },
      {
        loading: `Generating ${count} image${count > 1 ? "s" : ""}...`,
        success: (data) => {
          const remaining = data.creditsRemaining;
          const variantCount = data.variants?.length ?? 1;
          if (remaining !== null) {
            return `${variantCount} variant${variantCount > 1 ? "s" : ""} ready · ${remaining} credits left`;
          }
          return `${variantCount} variant${variantCount > 1 ? "s" : ""} ready`;
        },
        onSuccess: (data) => {
          utils.ads.listAssets.invalidate({ storeId });
          utils.auth.me.invalidate();
          onPick(data.imageUrl);
          setPrompt("");
          setShowPrompt(false);
        },
      },
    );
  };

  const handleFile = async (file: File) => {
    if (!ACCEPTED.split(",").includes(file.type)) {
      toast.error("Only PNG, JPEG, WebP or GIF allowed");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Max 10MB");
      return;
    }
    const id = toast.loading("Uploading...");
    setIsUploading(true);
    try {
      const url = `/api/upload/asset?storeId=${encodeURIComponent(storeId)}&kind=${encodeURIComponent(kind)}`;
      const res = await axios.post<{ imageUrl: string; assetId: string }>(
        url,
        file,
        {
          headers: { "Content-Type": file.type },
          withCredentials: true,
          maxContentLength: 20 * 1024 * 1024,
          maxBodyLength: 20 * 1024 * 1024,
        },
      );
      toast.success("Uploaded", { id });
      utils.ads.listAssets.invalidate({ storeId });
      onPick(res.data.imageUrl);
    } catch (err) {
      const msg =
        axios.isAxiosError(err)
          ? (err.response?.data as { message?: string })?.message ??
            err.message
          : err instanceof Error
            ? err.message
            : "Upload failed";
      toast.error(msg, { id });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const gridCols =
    maxCols === 4 ? "grid-cols-4" : maxCols === 2 ? "grid-cols-2" : "grid-cols-3";

  const images: Array<{ url: string; id: string }> = [];
  if (currentUrl) images.push({ url: currentUrl, id: "current" });
  for (const a of assets.data ?? []) {
    const url = r2PublicUrl(a.r2Key);
    if (!images.some((i) => i.url === url)) images.push({ url, id: a.id });
  }

  return (
    <div className="space-y-2">
      <Label className="text-[11px] text-[color:var(--dw-text-dim)]">{label}</Label>
      {images.length > 0 ? (
        <div className={`grid ${gridCols} gap-2`}>
          {images.slice(0, 9).map((img) => (
            <button
              key={img.id}
              onClick={() => onPick(img.url)}
              className={`aspect-square overflow-hidden rounded-md border transition ${
                img.url === currentUrl
                  ? "border-[color:var(--dw-accent)] ring-2 ring-[color:var(--dw-accent)]/30"
                  : "border-[color:var(--dw-border)] hover:border-[color:var(--dw-accent)]/40"
              }`}
            >
              <img src={img.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[10px] border border-dashed p-3 text-center transition ${
          isDragging
            ? "border-[color:var(--dw-accent)] bg-[color:var(--dw-accent)]/5"
            : "border-[color:var(--dw-border)] hover:border-[color:var(--dw-accent)]/40 hover:bg-[color:var(--dw-surface)]"
        }`}
      >
        <HugeiconsIcon
          icon={Upload01Icon}
          size={14}
          className="text-[color:var(--dw-text-muted)]"
        />
        <div className="text-[11px] text-[color:var(--dw-text-dim)]">
          {isUploading ? "Uploading..." : "Drop image or click to upload"}
        </div>
        <div className="dw-mono text-[9px] tracking-[0.1em] uppercase text-[color:var(--dw-text-muted)]">
          PNG · JPG · WebP · ≤10MB
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </div>

      {showPrompt ? (
        <div className="space-y-2 rounded-[10px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-2">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={promptSeed ?? "Prompt..."}
            rows={2}
            className="w-full rounded-md bg-transparent p-1.5 text-[12px] outline-none"
          />
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-[color:var(--dw-text-muted)]">Images:</span>
            {COUNT_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`size-6 rounded text-[11px] font-medium transition ${
                  count === n
                    ? "bg-[color:var(--dw-accent)] text-white"
                    : "bg-[color:var(--dw-surface2)] text-[color:var(--dw-text)] hover:bg-[color:var(--dw-surface2)]/80"
                }`}
              >
                {n}
              </button>
            ))}
            {me.data && (
              <span className="ml-auto flex items-center gap-1 text-[9px] text-[color:var(--dw-text-muted)]">
                <HugeiconsIcon icon={SparklesIcon} size={9} className="text-[color:var(--dw-accent)]" />
                {isFreeTier ? me.data.imageCredits : "∞"}
              </span>
            )}
          </div>
          <div className="flex gap-1.5">
            <Button
              size="sm"
              className="flex-1 gap-1.5"
              onClick={handleGenerate}
              disabled={generate.isPending || (isFreeTier && (me.data?.imageCredits ?? 0) < count)}
            >
              <HugeiconsIcon icon={AiImageIcon} size={11} />
              {generate.isPending ? "Generating..." : `Generate ${count}`}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowPrompt(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-1.5"
          onClick={() => setShowPrompt(true)}
        >
          <HugeiconsIcon icon={AiImageIcon} size={11} />
          Generate new
        </Button>
      )}
    </div>
  );
};

