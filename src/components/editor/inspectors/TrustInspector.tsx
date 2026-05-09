import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon, Delete01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import type { StoreSection } from "@/db/schema";
import type { TrustData, TrustBadge } from "@/types/store-sections";
import { TextField, IconPickerField } from "./fields";

type Commit = (data: Record<string, unknown>) => void;

const getBadge = (badge: string | TrustBadge): TrustBadge => {
  if (typeof badge === "string") {
    return { title: badge };
  }
  return badge;
};

export const TrustInspector = ({
  section,
  onCommit,
}: {
  section: StoreSection;
  onCommit: Commit;
}) => {
  const data = section.data as TrustData;
  const badges = data.badges ?? [];

  const update = (idx: number, patch: Partial<TrustBadge>) => {
    const next = badges.map((b, i) => {
      if (i !== idx) return b;
      const badge = getBadge(b);
      return { ...badge, ...patch };
    });
    onCommit({ badges: next });
  };

  const add = () => {
    onCommit({
      badges: [...badges, { icon: "ShieldCheckIcon", title: "New badge" }],
    });
  };

  const remove = (idx: number) => {
    onCommit({ badges: badges.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-4">
      {badges.map((b, i) => {
        const badge = getBadge(b);
        return (
          <div
            key={i}
            className="space-y-2 rounded-[10px] border border-[color:var(--dw-border)] p-3"
          >
            <div className="flex items-center justify-between">
              <div className="dw-mono text-[10px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
                Badge {i + 1}
              </div>
              <button
                onClick={() => remove(i)}
                aria-label="Remove"
                className="flex size-6 items-center justify-center rounded-md text-[color:var(--dw-text-muted)] hover:bg-[color:var(--dw-signal)]/10 hover:text-[color:var(--dw-signal)]"
              >
                <HugeiconsIcon icon={Delete01Icon} size={11} />
              </button>
            </div>
            <IconPickerField
              label="Icon"
              value={badge.icon ?? ""}
              onCommit={(v) => update(i, { icon: v || undefined })}
            />
            <TextField
              label="Title"
              defaultValue={badge.title ?? ""}
              onCommit={(v) => update(i, { title: v })}
            />
            <TextField
              label="Description (optional)"
              defaultValue={badge.description ?? ""}
              onCommit={(v) => update(i, { description: v || undefined })}
            />
          </div>
        );
      })}
      <Button
        variant="outline"
        size="sm"
        className="w-full gap-1.5"
        onClick={add}
      >
        <HugeiconsIcon icon={PlusSignIcon} size={11} />
        Add badge
      </Button>
    </div>
  );
};
