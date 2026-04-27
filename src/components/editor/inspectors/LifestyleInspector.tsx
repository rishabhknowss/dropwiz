import type { StoreSection } from "@/db/schema";
import type { LifestyleData } from "@/types/store-sections";
import { ImagePickerField, TextField } from "./fields";

type Commit = (data: Record<string, unknown>) => void;

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
  return (
    <div className="space-y-3">
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
