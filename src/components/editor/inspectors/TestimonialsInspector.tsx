import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon, Delete01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import type { StoreSection } from "@/db/schema";
import type {
  TestimonialsData,
  Testimonial,
  TestimonialsVariant,
} from "@/types/store-sections";
import { ImagePickerField, NumberField, TextField, VariantPicker } from "./fields";

const TESTIMONIALS_VARIANTS: Array<{
  id: TestimonialsVariant;
  label: string;
  desc: string;
}> = [
  { id: "grid", label: "Grid", desc: "3-up cards" },
  { id: "marquee", label: "Marquee", desc: "Horizontal auto-scroll" },
  { id: "feature", label: "Feature", desc: "Big quote + 3 alternates" },
];

type Commit = (data: Record<string, unknown>) => void;

export const TestimonialsInspector = ({
  section,
  storeId,
  onCommit,
}: {
  section: StoreSection;
  storeId: string;
  onCommit: Commit;
}) => {
  const data = section.data as TestimonialsData;
  const testimonials = data.testimonials ?? [];
  const variant: TestimonialsVariant = data.variant ?? "grid";

  const update = (idx: number, patch: Partial<Testimonial>) => {
    const next = testimonials.map((t, i) => (i === idx ? { ...t, ...patch } : t));
    onCommit({ testimonials: next });
  };

  const add = () =>
    onCommit({
      testimonials: [
        ...testimonials,
        { quote: "New testimonial", name: "Customer", rating: 5 },
      ],
    });

  const remove = (idx: number) =>
    onCommit({ testimonials: testimonials.filter((_, i) => i !== idx) });

  return (
    <div className="space-y-4">
      <VariantPicker
        value={variant}
        options={TESTIMONIALS_VARIANTS}
        onChange={(id) => onCommit({ variant: id })}
      />
      <TextField
        label="Section title"
        defaultValue={data.title ?? ""}
        onCommit={(v) => onCommit({ title: v })}
      />
      {testimonials.map((t, i) => (
        <div
          key={i}
          className="space-y-2 rounded-[10px] border border-[color:var(--dw-border)] p-3"
        >
          <div className="flex items-center justify-between">
            <div className="dw-mono text-[10px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
              Testimonial {i + 1}
            </div>
            <button
              onClick={() => remove(i)}
              aria-label="Remove"
              className="flex size-6 items-center justify-center rounded-md text-[color:var(--dw-text-muted)] hover:bg-[color:var(--dw-signal)]/10 hover:text-[color:var(--dw-signal)]"
            >
              <HugeiconsIcon icon={Delete01Icon} size={11} />
            </button>
          </div>
          <TextField
            label="Quote"
            defaultValue={t.quote ?? ""}
            multiline
            onCommit={(v) => update(i, { quote: v })}
          />
          <div className="grid grid-cols-2 gap-2">
            <TextField
              label="Name"
              defaultValue={t.name ?? ""}
              onCommit={(v) => update(i, { name: v })}
            />
            <TextField
              label="Role"
              defaultValue={t.role ?? ""}
              onCommit={(v) => update(i, { role: v })}
            />
          </div>
          <NumberField
            label="Rating (1-5)"
            defaultValue={t.rating ?? 5}
            onCommit={(v) => update(i, { rating: Math.max(1, Math.min(5, v)) })}
          />
          <ImagePickerField
            label="Avatar"
            storeId={storeId}
            kind="lifestyle"
            currentUrl={t.avatarUrl}
            maxCols={4}
            promptSeed={`Portrait photo of ${t.name}, natural light, clean background, authentic headshot`}
            onPick={(url) => update(i, { avatarUrl: url })}
          />
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        className="w-full gap-1.5"
        onClick={add}
      >
        <HugeiconsIcon icon={PlusSignIcon} size={11} />
        Add testimonial
      </Button>
    </div>
  );
};
