import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar01Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export type DateRange = "today" | "7d" | "30d" | "90d";

const RANGE_LABELS: Record<DateRange, string> = {
  today: "Today",
  "7d": "7 days",
  "30d": "30 days",
  "90d": "90 days",
};

type DateRangePickerProps = {
  value: DateRange;
  onChange: (value: DateRange) => void;
};

export const DateRangePicker = ({ value, onChange }: DateRangePickerProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 border-[var(--dw-border)] text-[12px]">
          <HugeiconsIcon icon={Calendar01Icon} size={14} className="text-[var(--dw-text-muted)]" />
          {RANGE_LABELS[value]}
          <HugeiconsIcon icon={ArrowDown01Icon} size={12} className="text-[var(--dw-text-subtle)]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.entries(RANGE_LABELS) as [DateRange, string][]).map(([key, label]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => onChange(key)}
            className={value === key ? "bg-[var(--dw-accent-subtle)]" : ""}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
