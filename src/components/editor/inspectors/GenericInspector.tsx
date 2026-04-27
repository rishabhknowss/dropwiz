import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import type { StoreSection } from "@/db/schema";

type Commit = (data: Record<string, unknown>) => void;

export const GenericInspector = ({
  section,
  onCommit,
}: {
  section: StoreSection;
  onCommit: Commit;
}) => (
  <div className="space-y-3">
    <Label className="text-[11px] text-[color:var(--dw-text-dim)]">Raw JSON</Label>
    <textarea
      defaultValue={JSON.stringify(section.data, null, 2)}
      rows={8}
      onBlur={(e) => {
        try {
          onCommit(JSON.parse(e.target.value));
        } catch {
          toast.error("Invalid JSON");
        }
      }}
      className="dw-mono w-full rounded-[8px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-2 text-[11px]"
    />
  </div>
);
