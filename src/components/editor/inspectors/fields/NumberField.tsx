import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const NumberField = ({
  label,
  defaultValue,
  onCommit,
}: {
  label: string;
  defaultValue: number;
  onCommit: (value: number) => void;
}) => (
  <div className="space-y-1.5">
    <Label className="text-[11px] text-[color:var(--dw-text-dim)]">{label}</Label>
    <Input
      type="number"
      defaultValue={defaultValue}
      onBlur={(e) => {
        const v = parseInt(e.target.value, 10);
        if (!Number.isNaN(v) && v !== defaultValue) onCommit(v);
      }}
      className="h-9 bg-[color:var(--dw-surface)] text-[13px]"
    />
  </div>
);
