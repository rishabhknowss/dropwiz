import { useState } from "react";
import type { StoreSection } from "@/db/schema";
import type { HowItWorksData, HowItWorksVariant } from "@/types/store-sections";
import { TextField, VariantPicker, IconPickerField } from "./fields";

type Commit = (data: Record<string, unknown>) => void;

const VARIANT_OPTIONS: { id: HowItWorksVariant; label: string }[] = [
  { id: "cards", label: "Cards" },
  { id: "timeline", label: "Timeline" },
  { id: "numbered", label: "Numbered" },
];

export const HowItWorksInspector = ({
  section,
  onCommit,
}: {
  section: StoreSection;
  onCommit: Commit;
}) => {
  const data = section.data as HowItWorksData;
  const [steps, setSteps] = useState(data.steps ?? []);

  const updateStep = (index: number, field: "title" | "description" | "icon", value: string) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], [field]: value };
    setSteps(updated);
    onCommit({ steps: updated });
  };

  const addStep = () => {
    const updated = [...steps, { title: "New step", description: "Description", icon: "SparklesIcon" }];
    setSteps(updated);
    onCommit({ steps: updated });
  };

  const removeStep = (index: number) => {
    const updated = steps.filter((_, i) => i !== index);
    setSteps(updated);
    onCommit({ steps: updated });
  };

  return (
    <div className="space-y-3">
      <VariantPicker
        label="Layout"
        value={data.variant ?? "cards"}
        options={VARIANT_OPTIONS}
        onChange={(v) => onCommit({ variant: v })}
      />
      <TextField
        label="Title"
        defaultValue={data.title ?? ""}
        onCommit={(v) => onCommit({ title: v || null })}
      />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[12px] font-medium text-[color:var(--dw-text-secondary)]">
            Steps
          </label>
          <button
            onClick={addStep}
            className="text-[11px] font-medium text-[color:var(--dw-accent)] hover:underline"
          >
            + Add step
          </button>
        </div>
        {steps.map((step, i) => (
          <div
            key={i}
            className="space-y-2 rounded-lg border border-[color:var(--dw-border)] p-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[color:var(--dw-text-secondary)]">
                Step {i + 1}
              </span>
              <button
                onClick={() => removeStep(i)}
                className="text-[11px] text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
            <IconPickerField
              label="Icon"
              value={step.icon ?? ""}
              onCommit={(v) => updateStep(i, "icon", v)}
            />
            <TextField
              label="Title"
              defaultValue={step.title}
              onCommit={(v) => updateStep(i, "title", v)}
            />
            <TextField
              label="Description"
              defaultValue={step.description}
              onCommit={(v) => updateStep(i, "description", v)}
              multiline
            />
          </div>
        ))}
      </div>
    </div>
  );
};
