import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon, Delete01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import type { StoreSection } from "@/db/schema";
import type { AnnouncementData } from "@/types/store-sections";
import { TextField, VariantPicker, IconPickerField } from "./fields";

type Commit = (data: Record<string, unknown>) => void;

type AnnouncementVariant = "bar" | "pills" | "marquee";

const VARIANT_OPTIONS: { id: AnnouncementVariant; label: string }[] = [
  { id: "bar", label: "Bar" },
  { id: "pills", label: "Pills" },
  { id: "marquee", label: "Marquee" },
];

type Badge = { icon?: string; text: string };

export const AnnouncementInspector = ({
  section,
  onCommit,
}: {
  section: StoreSection;
  onCommit: Commit;
}) => {
  const data = section.data as AnnouncementData;
  const [badges, setBadges] = useState<Badge[]>(data.badges ?? []);

  const updateBadge = (index: number, patch: Partial<Badge>) => {
    const updated = [...badges];
    updated[index] = { ...updated[index], ...patch };
    setBadges(updated);
    onCommit({ badges: updated });
  };

  const addBadge = () => {
    const updated = [...badges, { icon: "Truck01Icon", text: "New badge" }];
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
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[12px] font-medium text-[color:var(--dw-text-secondary)]">
            Badges
          </label>
        </div>
        {badges.map((badge, i) => (
          <div
            key={i}
            className="space-y-2 rounded-[10px] border border-[color:var(--dw-border)] p-3"
          >
            <div className="flex items-center justify-between">
              <div className="dw-mono text-[10px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
                Badge {i + 1}
              </div>
              <button
                onClick={() => removeBadge(i)}
                aria-label="Remove"
                className="flex size-6 items-center justify-center rounded-md text-[color:var(--dw-text-muted)] hover:bg-[color:var(--dw-signal)]/10 hover:text-[color:var(--dw-signal)]"
              >
                <HugeiconsIcon icon={Delete01Icon} size={11} />
              </button>
            </div>
            <IconPickerField
              label="Icon"
              value={badge.icon ?? ""}
              onCommit={(v) => updateBadge(i, { icon: v || undefined })}
            />
            <TextField
              label="Text"
              defaultValue={badge.text}
              onCommit={(v) => updateBadge(i, { text: v })}
            />
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-1.5"
          onClick={addBadge}
        >
          <HugeiconsIcon icon={PlusSignIcon} size={11} />
          Add badge
        </Button>
      </div>
    </div>
  );
};
