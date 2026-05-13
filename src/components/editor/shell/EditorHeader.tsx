import Link from "next/link";
import { useIsMutating } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { DWChip } from "@/components/dw/Chip";
import { PublishButton } from "../publish/PublishButton";
import { PageSelector } from "../PageSelector";
import type { Store, StorePage } from "@/db/schema";

type EditorHeaderProps = {
  store: Store;
  pages: StorePage[];
  activePageId: string | null;
  onSelectPage: (pageId: string) => void;
};

export const EditorHeader = ({
  store,
  pages,
  activePageId,
  onSelectPage,
}: EditorHeaderProps) => (
  <header className="flex h-12 items-center gap-2 border-b border-[color:var(--dw-border)] bg-[color:var(--dw-bg)]/80 px-3 backdrop-blur md:h-14 md:gap-4 md:px-5">
    <Link
      href="/app/stores"
      className="flex size-7 shrink-0 items-center justify-center rounded-md text-[color:var(--dw-text-dim)] hover:bg-[color:var(--dw-surface2)] md:size-8"
      aria-label="Back to stores"
    >
      <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
    </Link>
    <Link href="/app/stores" className="hidden items-center gap-1.5 md:flex">
      <img src="/logo.png" alt="dropwiz" className="h-6 w-auto" />
      <span className="text-[15px] font-semibold text-[var(--dw-text)]">dropwiz</span>
    </Link>
    <div className="flex min-w-0 flex-1 items-center gap-1.5 text-[12px] text-[color:var(--dw-text-dim)] md:flex-none md:gap-2 md:text-[13px]">
      <span className="hidden opacity-50 md:inline">/</span>
      <span className="max-w-[100px] truncate text-[color:var(--dw-text)] md:max-w-[180px]">
        {store.name ?? "Untitled"}
      </span>
      {store.status === "published" ? (
        <DWChip variant="live">Live</DWChip>
      ) : (
        <DWChip variant="accent">Draft</DWChip>
      )}
    </div>
    {pages.length > 0 && (
      <PageSelector
        storeId={store.id}
        pages={pages}
        activePageId={activePageId}
        onSelectPage={onSelectPage}
      />
    )}
    <div className="hidden md:block">
      <SaveIndicator />
    </div>
    <div className="ml-auto flex shrink-0 items-center gap-1.5 md:gap-2">
      <Button asChild variant="outline" size="sm" className="hidden h-8 md:inline-flex">
        <Link href={`/p/${store.slug}`} target="_blank">
          Preview
        </Link>
      </Button>
      <PublishButton storeId={store.id} />
    </div>
  </header>
);

const SaveIndicator = () => {
  const pending = useIsMutating();
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (pending === 0) {
      setShowSaved(true);
      const t = setTimeout(() => setShowSaved(false), 1600);
      return () => clearTimeout(t);
    }
  }, [pending]);

  if (pending > 0) {
    return (
      <span className="dw-mono inline-flex items-center gap-1.5 text-[10.5px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
        <span className="size-1.5 rounded-full bg-[color:var(--dw-accent)] dw-pulse" />
        Saving
      </span>
    );
  }
  if (showSaved) {
    return (
      <span className="dw-mono inline-flex items-center gap-1.5 text-[10.5px] tracking-[0.14em] uppercase text-[color:var(--dw-jade)]">
        <span className="size-1.5 rounded-full bg-[color:var(--dw-jade)]" />
        Saved
      </span>
    );
  }
  return null;
};
