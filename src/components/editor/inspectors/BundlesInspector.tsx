import type { StoreSection } from "@/db/schema";
import type { Bundle, BundleData, BundlesVariant } from "@/types/store-sections";
import { CheckboxField, NumberField, TextField, VariantPicker } from "./fields";

type Commit = (data: Record<string, unknown>) => void;

const BUNDLE_VARIANTS: Array<{ id: BundlesVariant; label: string; desc: string }> = [
  { id: "tiers", label: "Tiers", desc: "4-card grid with recommended highlight" },
  { id: "compact", label: "Compact", desc: "Radio list with single CTA" },
  { id: "showcase", label: "Showcase", desc: "Big featured + 3 alternates" },
];

export const BundlesInspector = ({
  section,
  onCommit,
}: {
  section: StoreSection;
  onCommit: Commit;
}) => {
  const data = section.data as BundleData;
  const variant: BundlesVariant = data.variant ?? "tiers";

  const updateBundle = (idx: number, patch: Partial<Bundle>) => {
    const next = data.bundles.map((b, i) => (i === idx ? { ...b, ...patch } : b));
    onCommit({ bundles: next });
  };

  return (
    <div className="space-y-4">
      <VariantPicker
        value={variant}
        options={BUNDLE_VARIANTS}
        onChange={(id) => onCommit({ variant: id })}
      />
      {data.bundles.map((b, i) => (
        <div
          key={i}
          className="space-y-2 rounded-[10px] border border-[color:var(--dw-border)] p-3"
        >
          <div className="dw-mono text-[10px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
            Bundle {i + 1}
          </div>
          <TextField
            label="Name"
            defaultValue={b.name}
            onCommit={(v) => updateBundle(i, { name: v })}
          />
          <TextField
            label="Description"
            defaultValue={b.description}
            multiline
            onCommit={(v) => updateBundle(i, { description: v })}
          />
          <div className="grid grid-cols-2 gap-2">
            <NumberField
              label="Quantity"
              defaultValue={b.quantity}
              onCommit={(v) => updateBundle(i, { quantity: v })}
            />
            <NumberField
              label="Discount %"
              defaultValue={b.discountPercent}
              onCommit={(v) => updateBundle(i, { discountPercent: v })}
            />
          </div>
          <TextField
            label="Badge"
            defaultValue={b.badge ?? ""}
            onCommit={(v) => updateBundle(i, { badge: v || null })}
          />
          <CheckboxField
            label="Recommended"
            defaultChecked={b.recommended}
            onCommit={(v) => updateBundle(i, { recommended: v })}
          />
        </div>
      ))}
    </div>
  );
};
