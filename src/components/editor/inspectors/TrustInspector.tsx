import type { StoreSection } from "@/db/schema";
import type { TrustData, TrustBadge } from "@/types/store-sections";
import { TextField } from "./fields";

type Commit = (data: Record<string, unknown>) => void;

const getBadgeText = (badge: string | TrustBadge): string =>
  typeof badge === "string" ? badge : badge.title;

export const TrustInspector = ({
  section,
  onCommit,
}: {
  section: StoreSection;
  onCommit: Commit;
}) => {
  const data = section.data as TrustData;
  const update = (idx: number, v: string) => {
    const next = data.badges.map((b, i) => {
      if (i !== idx) return b;
      if (typeof b === "string") return v;
      return { ...b, title: v };
    });
    onCommit({ badges: next });
  };
  return (
    <div className="space-y-3">
      {data.badges.map((b, i) => (
        <TextField
          key={i}
          label={`Badge ${i + 1}`}
          defaultValue={getBadgeText(b)}
          onCommit={(v) => update(i, v)}
        />
      ))}
    </div>
  );
};
