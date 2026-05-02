import type { ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Home01Icon } from "@hugeicons/core-free-icons";
import { Label } from "@/components/ui/label";

export const LabeledField = ({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: typeof Home01Icon;
  children: ReactNode;
}) => (
  <div className="space-y-1.5">
    <Label className="flex items-center gap-1.5 text-[11px] text-[color:var(--dw-text-dim)]">
      {icon && <HugeiconsIcon icon={icon} size={10} />}
      {label}
    </Label>
    {children}
  </div>
);
