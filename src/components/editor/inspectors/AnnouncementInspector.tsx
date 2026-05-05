import { useState } from "react";
import type { StoreSection } from "@/db/schema";
import type { AnnouncementData } from "@/types/store-sections";
import { TextField, VariantPicker } from "./fields";

type Commit = (data: Record<string, unknown>) => void;

type AnnouncementVariant = "bar" | "pills" | "marquee";

const VARIANT_OPTIONS: { id: AnnouncementVariant; label: string }[] = [
  { id: "bar", label: "Bar" },
  { id: "pills", label: "Pills" },
  { id: "marquee", label: "Marquee" },
];

export const AnnouncementInspector = ({
  section,
  onCommit,
}: {
  section: StoreSection;
  onCommit: Commit;
}) => {
  const data = section.data as AnnouncementData;
  const [badges, setBadges] = useState(data.badges ?? []);

  const updateBadge = (index: number, text: string) => {
    const updated = [...badges];
    updated[index] = { ...updated[index], text };
    setBadges(updated);
    onCommit({ badges: updated });
  };

  const addBadge = () => {
    const updated = [...badges, { text: "New badge" }];
    setBadges(updated);
    onCommit({ badges: updated });
  };

  const removeBadge = (index: number) => {
    const updated = badges.filter((_, i) => i !== index);
    setBadges(updated);
    onCommit({ badges: updated });
  };

  return (
    <div className="space-y-3">
      <VariantPicker
        label="Style"
        value={data.variant ?? "bar"}
        options={VARIANT_OPTIONS}
        onChange={(v) => onCommit({ variant: v })}
      />
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[12px] font-medium text-[color:var(--dw-text-secondary)]">
            Badges
          </label>
          <button
            onClick={addBadge}
            className="text-[11px] font-medium text-[color:var(--dw-accent)] hover:underline"
          >
            + Add
          </button>
        </div>
        {badges.map((badge, i) => (
          <div key={i} className="flex items-center gap-2">
            <TextField
              label=""
              defaultValue={badge.text}
              onCommit={(v) => updateBadge(i, v)}
            />
            <button
              onClick={() => removeBadge(i)}
              className="shrink-0 text-[11px] text-red-500 hover:underline"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
