import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const TextField = ({
  label,
  defaultValue,
  multiline,
  placeholder,
  onCommit,
}: {
  label: string;
  defaultValue: string;
  multiline?: boolean;
  placeholder?: string;
  onCommit: (value: string) => void;
}) => {
  const handleBlur = (value: string) => {
    if (value !== defaultValue) onCommit(value);
  };
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] text-[color:var(--dw-text-dim)]">{label}</Label>
      {multiline ? (
        <textarea
          defaultValue={defaultValue}
          rows={3}
          placeholder={placeholder}
          onBlur={(e) => handleBlur(e.target.value)}
          className="w-full rounded-[8px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-2.5 text-[13px]"
        />
      ) : (
        <Input
          defaultValue={defaultValue}
          placeholder={placeholder}
          onBlur={(e) => handleBlur(e.target.value)}
          className="h-9 bg-[color:var(--dw-surface)] text-[13px]"
        />
      )}
    </div>
  );
};
