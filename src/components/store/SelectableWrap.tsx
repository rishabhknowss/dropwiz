import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const SelectableWrap = ({
  sectionId,
  selectable,
  active,
  onSelect,
  children,
}: {
  sectionId: string;
  selectable?: boolean;
  active?: boolean;
  onSelect?: (id: string) => void;
  children: ReactNode;
}) => {
  if (!selectable) return <>{children}</>;
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(sectionId);
      }}
      className={cn(
        "group relative cursor-pointer outline-none transition-all duration-200",
        active ? "z-10" : "",
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-2 rounded-[12px] transition-all duration-200",
          active
            ? "ring-2 ring-[color:var(--dw-accent)] ring-offset-4 ring-offset-[color:var(--dw-bg)]"
            : "ring-1 ring-transparent group-hover:ring-[color:var(--dw-accent)]/40",
        )}
      />
      {!active && (
        <div
          aria-hidden
          className="dw-mono pointer-events-none absolute right-6 top-6 z-20 rounded-full border border-[color:var(--dw-accent)]/30 bg-[color:var(--dw-bg)]/80 px-2.5 py-1 text-[10px] tracking-[0.14em] uppercase text-[color:var(--dw-accent)] opacity-0 shadow-md backdrop-blur-sm transition-opacity duration-150 group-hover:opacity-100"
        >
          Click to edit
        </div>
      )}
      {children}
    </div>
  );
};
