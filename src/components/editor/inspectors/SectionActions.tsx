import { HugeiconsIcon } from "@hugeicons/react";
import { RefreshIcon, Delete01Icon } from "@hugeicons/core-free-icons";

type Props = {
  sectionType: string;
  regeneratable: boolean;
  regenLoading: boolean;
  onRegenerate: () => void;
  onDelete: () => void;
};

export const SectionActions = ({
  sectionType,
  regeneratable,
  regenLoading,
  onRegenerate,
  onDelete,
}: Props) => (
  <div className="flex items-center justify-between">
    <div>
      <div className="dw-mono text-[10px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
        Section
      </div>
      <div className="text-[14px] font-medium capitalize">{sectionType}</div>
    </div>
    <div className="flex items-center gap-1">
      {regeneratable && (
        <button
          onClick={onRegenerate}
          disabled={regenLoading}
          aria-label="Regenerate"
          className="flex size-7 items-center justify-center rounded-md text-[color:var(--dw-text-muted)] transition hover:bg-[color:var(--dw-surface2)] hover:text-[color:var(--dw-accent)]"
        >
          <HugeiconsIcon
            icon={RefreshIcon}
            size={13}
            className={regenLoading ? "animate-spin" : ""}
          />
        </button>
      )}
      <button
        onClick={onDelete}
        aria-label="Delete"
        className="flex size-7 items-center justify-center rounded-md text-[color:var(--dw-text-muted)] transition hover:bg-[color:var(--dw-signal)]/10 hover:text-[color:var(--dw-signal)]"
      >
        <HugeiconsIcon icon={Delete01Icon} size={13} />
      </button>
    </div>
  </div>
);
