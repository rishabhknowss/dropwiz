import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon, Delete01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import type { StoreSection } from "@/db/schema";
import type {
  ValuePropsData,
  ValueProp,
  ValuePropsVariant,
} from "@/types/store-sections";
import { TextField, VariantPicker } from "./fields";

const VALUEPROPS_VARIANTS: Array<{
  id: ValuePropsVariant;
  label: string;
  desc: string;
}> = [
  { id: "grid", label: "Grid", desc: "3-up centered with icons" },
  { id: "alternating", label: "Alternating", desc: "Zig-zag rows" },
  { id: "list", label: "List", desc: "Two-column with header" },
];

type Commit = (data: Record<string, unknown>) => void;

export const ValuePropsInspector = ({
  section,
  onCommit,
}: {
  section: StoreSection;
  onCommit: Commit;
}) => {
  const data = section.data as ValuePropsData;
  const props = data.props ?? [];
  const variant: ValuePropsVariant = data.variant ?? "grid";

  const update = (idx: number, patch: Partial<ValueProp>) => {
    const next = props.map((p, i) => (i === idx ? { ...p, ...patch } : p));
    onCommit({ props: next });
  };

  const add = () =>
    onCommit({
      props: [
        ...props,
        { title: "New value", description: "Describe the benefit" },
      ],
    });

  const remove = (idx: number) =>
    onCommit({ props: props.filter((_, i) => i !== idx) });

  return (
    <div className="space-y-4">
      <VariantPicker
        value={variant}
        options={VALUEPROPS_VARIANTS}
        onChange={(id) => onCommit({ variant: id })}
      />
      <TextField
        label="Section title"
        defaultValue={data.title ?? ""}
        onCommit={(v) => onCommit({ title: v })}
      />
      {props.map((p, i) => (
        <div
          key={i}
          className="space-y-2 rounded-[10px] border border-[color:var(--dw-border)] p-3"
        >
          <div className="flex items-center justify-between">
            <div className="dw-mono text-[10px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
              Value {i + 1}
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
            label="Icon (emoji or symbol)"
            defaultValue={p.icon ?? ""}
            onCommit={(v) => update(i, { icon: v || undefined })}
          />
          <TextField
            label="Title"
            defaultValue={p.title ?? ""}
            onCommit={(v) => update(i, { title: v })}
          />
          <TextField
            label="Description"
            defaultValue={p.description ?? ""}
            multiline
            onCommit={(v) => update(i, { description: v })}
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
        Add value prop
      </Button>
    </div>
  );
};
