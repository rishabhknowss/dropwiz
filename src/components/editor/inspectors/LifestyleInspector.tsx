import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon, Delete01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import type { StoreSection } from "@/db/schema";
import type { LifestyleData, LifestyleVariant } from "@/types/store-sections";
import { ImagePickerField, TextField, IconPickerField } from "./fields";

type Commit = (data: Record<string, unknown>) => void;

const VARIANTS: Array<{ id: LifestyleVariant; label: string; desc: string }> = [
  { id: "split", label: "Split", desc: "Text and image side by side" },
  { id: "circular", label: "Circular", desc: "Circular image with feature badges" },
  { id: "full", label: "Full", desc: "Full-width image background" },
];

export const LifestyleInspector = ({
  section,
  storeId,
  onCommit,
}: {
  section: StoreSection;
  storeId: string;
  onCommit: Commit;
}) => {
  const data = section.data as LifestyleData;
  const variant = data.variant ?? "circular";
  const features = data.features ?? [];

  const setFeatures = (next: Array<{ icon: string; label: string }>) =>
    onCommit({ features: next });

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <div className="text-[11px] text-[color:var(--dw-text-dim)]">Layout</div>
        <div className="grid grid-cols-3 gap-1.5">
          {VARIANTS.map((v) => {
            const active = variant === v.id;
            return (
              <button
                key={v.id}
                onClick={() => onCommit({ variant: v.id })}
                title={v.desc}
                className={`rounded-[8px] border p-2 text-[11px] font-medium transition ${
                  active
                    ? "border-[color:var(--dw-accent)] bg-[color:var(--dw-surface2)] text-[color:var(--dw-text)]"
                    : "border-[color:var(--dw-border)] text-[color:var(--dw-text-muted)] hover:border-[color:var(--dw-accent)]/40"
                }`}
              >
                {v.label}
              </button>
            );
          })}
        </div>
        <div className="dw-mono text-[10px] tracking-[0.1em] uppercase text-[color:var(--dw-text-muted)]">
          {VARIANTS.find((v) => v.id === variant)?.desc}
        </div>
      </div>

      <TextField
        label="Headline"
        defaultValue={data.headline ?? ""}
        multiline
        onCommit={(v) => onCommit({ headline: v })}
      />
      <TextField
        label="Body"
        defaultValue={data.body ?? ""}
        multiline
        onCommit={(v) => onCommit({ body: v })}
      />

      {variant !== "full" && (
        <div className="space-y-1.5">
          <div className="text-[11px] text-[color:var(--dw-text-dim)]">
            Image position
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(["left", "right"] as const).map((pos) => {
              const active = (data.imagePosition ?? "right") === pos;
              return (
                <button
                  key={pos}
                  onClick={() => onCommit({ imagePosition: pos })}
                  className={`rounded-[8px] border p-2 text-[12px] capitalize transition ${
                    active
                      ? "border-[color:var(--dw-accent)] bg-[color:var(--dw-surface2)]"
                      : "border-[color:var(--dw-border)] hover:border-[color:var(--dw-accent)]/40"
                  }`}
                >
                  {pos}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {variant === "circular" && (
        <div className="space-y-2">
          <div className="text-[11px] text-[color:var(--dw-text-dim)]">
            Feature badges
          </div>
          {features.map((feature, i) => (
            <div
              key={i}
              className="space-y-1.5 rounded-[10px] border border-[color:var(--dw-border)] p-2"
            >
              <div className="flex items-center justify-between">
                <div className="dw-mono text-[10px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
                  Badge {i + 1}
                </div>
                <button
                  onClick={() => setFeatures(features.filter((_, idx) => idx !== i))}
                  className="flex size-6 items-center justify-center rounded-md text-[color:var(--dw-text-muted)] hover:bg-[color:var(--dw-signal)]/10 hover:text-[color:var(--dw-signal)]"
                  aria-label="Remove badge"
                >
                  <HugeiconsIcon icon={Delete01Icon} size={11} />
                </button>
              </div>
              <IconPickerField
                label="Icon"
                value={feature.icon}
                onCommit={(v) => {
                  const next = [...features];
                  next[i] = { ...next[i], icon: v };
                  setFeatures(next);
                }}
              />
              <TextField
                label="Label"
                defaultValue={feature.label}
                onCommit={(v) => {
                  const next = [...features];
                  next[i] = { ...next[i], label: v };
                  setFeatures(next);
                }}
              />
            </div>
          ))}
          {features.length < 4 && (
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1.5"
              onClick={() =>
                setFeatures([...features, { icon: "SparklesIcon", label: "New feature" }])
              }
            >
              <HugeiconsIcon icon={PlusSignIcon} size={11} />
              Add badge
            </Button>
          )}
        </div>
      )}

      <ImagePickerField
        label="Lifestyle image"
        storeId={storeId}
        kind="lifestyle"
        currentUrl={data.imageUrl}
        promptSeed={`Authentic lifestyle photograph of someone using the product, natural light, shallow depth of field, candid documentary style`}
        onPick={(url) => onCommit({ imageUrl: url })}
      />
    </div>
  );
};
