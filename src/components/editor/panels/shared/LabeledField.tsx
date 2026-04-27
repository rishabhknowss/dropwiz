import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

export const LabeledField = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="space-y-1.5">
    <Label className="text-[11px] text-[color:var(--dw-text-dim)]">{label}</Label>
    {children}
  </div>
);
