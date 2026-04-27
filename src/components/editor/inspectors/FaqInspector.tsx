import type { StoreSection } from "@/db/schema";
import type { FaqData, FaqItem, FaqVariant } from "@/types/store-sections";
import { TextField, VariantPicker } from "./fields";

type Commit = (data: Record<string, unknown>) => void;

const FAQ_VARIANTS: Array<{ id: FaqVariant; label: string; desc: string }> = [
  { id: "accordion", label: "Accordion", desc: "Single column, expand on click" },
  { id: "two-column", label: "Two-column", desc: "Header left, all answers visible" },
  { id: "cards", label: "Cards", desc: "Grid of expandable cards" },
];

export const FaqInspector = ({
  section,
  onCommit,
}: {
  section: StoreSection;
  onCommit: Commit;
}) => {
  const data = section.data as FaqData;
  const variant: FaqVariant = data.variant ?? "accordion";
  const update = (idx: number, patch: Partial<FaqItem>) => {
    const next = data.faqs.map((f, i) => (i === idx ? { ...f, ...patch } : f));
    onCommit({ faqs: next });
  };
  return (
    <div className="space-y-3">
      <VariantPicker
        value={variant}
        options={FAQ_VARIANTS}
        onChange={(id) => onCommit({ variant: id })}
      />
      {data.faqs.map((f, i) => (
        <div
          key={i}
          className="space-y-2 rounded-[10px] border border-[color:var(--dw-border)] p-3"
        >
          <TextField
            label="Question"
            defaultValue={f.question}
            onCommit={(v) => update(i, { question: v })}
          />
          <TextField
            label="Answer"
            defaultValue={f.answer}
            multiline
            onCommit={(v) => update(i, { answer: v })}
          />
        </div>
      ))}
    </div>
  );
};
