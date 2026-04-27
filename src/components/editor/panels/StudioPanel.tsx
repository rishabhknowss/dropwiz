import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { AiImageIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { runWithToast } from "@/hooks/useToastMutation";
import { r2PublicUrl } from "@/lib/r2-url";
import { Panel } from "./shared/Panel";
import { LabeledField } from "./shared/LabeledField";

export const StudioPanel = ({ storeId }: { storeId: string }) => {
  const utils = api.useUtils();
  const assets = api.ads.listAssets.useQuery(
    { storeId },
    { refetchOnWindowFocus: false },
  );
  const regenImage = api.stores.regenerateHeroImage.useMutation();
  const setHero = api.stores.setHeroImage.useMutation();
  const [prompt, setPrompt] = useState("");

  const invalidate = () => {
    utils.ads.listAssets.invalidate({ storeId });
    utils.stores.getMine.invalidate({ storeId });
  };

  const handleGenerate = () =>
    runWithToast(
      regenImage,
      { storeId, prompt: prompt || undefined },
      {
        loading: "Generating image...",
        success: "Image generated",
        onSuccess: () => {
          setPrompt("");
          invalidate();
        },
      },
    );

  const applyAsHero = (url: string) =>
    runWithToast(
      setHero,
      { storeId, imageUrl: url },
      { loading: "Applying...", success: "Set as hero", onSuccess: invalidate },
    );

  return (
    <Panel title="Studio">
      <LabeledField label="Prompt (optional)">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Studio product shot, cream background..."
          rows={3}
          className="w-full rounded-[8px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-2.5 text-[13px]"
        />
      </LabeledField>
      <Button
        onClick={handleGenerate}
        disabled={regenImage.isPending}
        className="w-full gap-1.5"
      >
        <HugeiconsIcon icon={AiImageIcon} size={12} />
        {regenImage.isPending ? "Generating..." : "Generate hero image"}
      </Button>

      <div className="dw-mono pt-4 text-[10px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
        Library ({assets.data?.length ?? 0})
      </div>
      {(assets.data?.length ?? 0) > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {assets.data?.map((a) => {
            const url = r2PublicUrl(a.r2Key);
            return (
              <button
                key={a.id}
                onClick={() => applyAsHero(url)}
                className="group aspect-square overflow-hidden rounded-md border border-[color:var(--dw-border)] transition hover:border-[color:var(--dw-accent)]/50"
              >
                <img src={url} alt={a.kind} className="h-full w-full object-cover" />
              </button>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[10px] border border-dashed border-[color:var(--dw-border)] p-4 text-center text-[11px] text-[color:var(--dw-text-muted)]">
          No images yet. Generate one above.
        </div>
      )}
    </Panel>
  );
};
