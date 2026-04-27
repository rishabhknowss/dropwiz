import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon, Delete01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import type { StoreSection } from "@/db/schema";
import type { GalleryData } from "@/types/store-sections";
import { ImagePickerField, TextField } from "./fields";

type Commit = (data: Record<string, unknown>) => void;

export const GalleryInspector = ({
  section,
  storeId,
  onCommit,
}: {
  section: StoreSection;
  storeId: string;
  onCommit: Commit;
}) => {
  const data = section.data as GalleryData;
  const images = data.images ?? [];

  const updateImage = (
    idx: number,
    patch: Partial<{ url: string; caption: string }>,
  ) => {
    const next = images.map((img, i) => (i === idx ? { ...img, ...patch } : img));
    onCommit({ images: next });
  };

  const addImage = () =>
    onCommit({ images: [...images, { url: "", caption: "" }] });

  const removeImage = (idx: number) =>
    onCommit({ images: images.filter((_, i) => i !== idx) });

  return (
    <div className="space-y-4">
      <TextField
        label="Section title"
        defaultValue={data.title ?? ""}
        onCommit={(v) => onCommit({ title: v })}
      />
      {images.map((img, i) => (
        <div
          key={i}
          className="space-y-2 rounded-[10px] border border-[color:var(--dw-border)] p-3"
        >
          <div className="flex items-center justify-between">
            <div className="dw-mono text-[10px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
              Image {i + 1}
            </div>
            <button
              onClick={() => removeImage(i)}
              aria-label="Remove image"
              className="flex size-6 items-center justify-center rounded-md text-[color:var(--dw-text-muted)] hover:bg-[color:var(--dw-signal)]/10 hover:text-[color:var(--dw-signal)]"
            >
              <HugeiconsIcon icon={Delete01Icon} size={11} />
            </button>
          </div>
          <ImagePickerField
            label="Image"
            storeId={storeId}
            kind="lifestyle"
            currentUrl={img.url}
            maxCols={4}
            promptSeed="Product lifestyle shot, editorial styled, premium"
            onPick={(url) => updateImage(i, { url })}
          />
          <TextField
            label="Caption"
            defaultValue={img.caption ?? ""}
            onCommit={(v) => updateImage(i, { caption: v })}
          />
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        className="w-full gap-1.5"
        onClick={addImage}
      >
        <HugeiconsIcon icon={PlusSignIcon} size={11} />
        Add image
      </Button>
    </div>
  );
};
