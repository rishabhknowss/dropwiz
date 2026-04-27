import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type KickerProps = {
  num?: string;
  children: ReactNode;
  className?: string;
};

export const DWKicker = ({ num, children, className }: KickerProps) => {
  return (
    <div
      className={cn(
        "dw-mono inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-[color:var(--dw-text-muted)]",
        className,
      )}
    >
      {num && (
        <span className="text-[color:var(--dw-accent)]">{num}</span>
      )}
      <span className="h-px w-8 bg-[color:var(--dw-border-strong)]" />
      <span>{children}</span>
    </div>
  );
};
