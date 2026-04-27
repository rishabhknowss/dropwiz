import type { StoreSection } from "@/db/schema";
import type { TrustData } from "@/types/store-sections";
import { TextField } from "./fields";

type Commit = (data: Record<string, unknown>) => void;

export const TrustInspector = ({
  section,
  onCommit,
}: {
  section: StoreSection;
  onCommit: Commit;
}) => {
  const data = section.data as TrustData;
  const update = (idx: number, v: string) => {
    const next = data.badges.map((b, i) => (i === idx ? v : b));
    onCommit({ badges: next });
  };
  return (
    <div className="space-y-3">
      {data.badges.map((b, i) => (
        <TextField
          key={i}
          label={`Badge ${i + 1}`}
          defaultValue={b}
          onCommit={(v) => update(i, v)}
        />
      ))}
    </div>
  );
};
