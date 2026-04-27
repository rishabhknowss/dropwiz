import { cn } from "@/lib/utils";
import type { ReactNode, CSSProperties } from "react";

type ChipVariant = "accent" | "live" | "neutral" | "signal";

type ChipProps = {
  variant?: ChipVariant;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export const DWChip = ({ variant = "neutral", children, className, style }: ChipProps) => {
  const styles: Record<ChipVariant, string> = {
    accent:
      "bg-[color:var(--dw-chip-bg)] text-[color:var(--dw-chip-text)] border-[color:var(--dw-chip-border)]",
    live: "bg-[color:var(--dw-jade)]/12 text-[color:var(--dw-jade)] border-[color:var(--dw-jade)]/30",
    neutral:
      "bg-[color:var(--dw-surface2)] text-[color:var(--dw-text-dim)] border-[color:var(--dw-border)]",
    signal:
      "bg-[color:var(--dw-signal)]/10 text-[color:var(--dw-signal)] border-[color:var(--dw-signal)]/30",
  };

  return (
    <span
      className={cn(
        "dw-mono inline-flex items-center gap-1.5 rounded-full border px-2.5 py-[3px] text-[10px] font-medium uppercase tracking-[0.1em]",
        styles[variant],
        className,
      )}
      style={style}
    >
      {variant === "live" && (
        <span className="dw-pulse size-1.5 rounded-full bg-[color:var(--dw-jade)]" />
      )}
      {children}
    </span>
  );
};
