import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUp01Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

type AnalyticsStatCardProps = {
  title: string;
  value: string;
  change?: number;
  icon: typeof ArrowUp01Icon;
  isLoading?: boolean;
};

export const AnalyticsStatCard = ({
  title,
  value,
  change,
  icon,
  isLoading,
}: AnalyticsStatCardProps) => {
  const isPositive = change !== undefined && change >= 0;

  if (isLoading) {
    return (
      <div className="rounded-lg border border-[var(--dw-border)] bg-[var(--dw-surface)] p-3">
        <div className="h-3 w-16 animate-pulse rounded bg-[var(--dw-bg-tertiary)]" />
        <div className="mt-2 h-6 w-20 animate-pulse rounded bg-[var(--dw-bg-tertiary)]" />
        <div className="mt-1.5 h-3 w-24 animate-pulse rounded bg-[var(--dw-bg-tertiary)]" />
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[var(--dw-border)] bg-[var(--dw-surface)] p-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-[var(--dw-text-muted)]">{title}</span>
        <HugeiconsIcon icon={icon} size={14} className="text-[var(--dw-text-subtle)]" />
      </div>
      <div className="mt-1 text-[20px] font-semibold tabular-nums text-[var(--dw-text)]">{value}</div>
      {change !== undefined && (
        <div className="mt-1 flex items-center gap-1">
          <HugeiconsIcon
            icon={isPositive ? ArrowUp01Icon : ArrowDown01Icon}
            size={12}
            className={cn(isPositive ? "text-[var(--dw-success)]" : "text-[var(--dw-error)]")}
          />
          <span
            className={cn(
              "text-[10px] font-medium tabular-nums",
              isPositive ? "text-[var(--dw-success)]" : "text-[var(--dw-error)]"
            )}
          >
            {Math.abs(change).toFixed(1)}%
          </span>
          <span className="text-[10px] text-[var(--dw-text-subtle)]">vs prev</span>
        </div>
      )}
    </div>
  );
};
