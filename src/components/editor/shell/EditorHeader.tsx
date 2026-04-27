import Link from "next/link";
import { useIsMutating } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { DWLogo } from "@/components/dw/Logo";
import { DWChip } from "@/components/dw/Chip";
import { PublishButton } from "../publish/PublishButton";
import type { Store } from "@/db/schema";

export const EditorHeader = ({ store }: { store: Store }) => (
  <header className="flex h-14 items-center gap-4 border-b border-[color:var(--dw-border)] bg-[color:var(--dw-bg)]/80 px-5 backdrop-blur">
    <Link
      href="/app/stores"
      className="flex size-8 items-center justify-center rounded-md text-[color:var(--dw-text-dim)] hover:bg-[color:var(--dw-surface2)]"
      aria-label="Back to stores"
    >
      <HugeiconsIcon icon={ArrowLeft01Icon} size={15} />
    </Link>
    <DWLogo size={16} />
    <div className="flex items-center gap-2 text-[13px] text-[color:var(--dw-text-dim)]">
      <span className="opacity-50">/</span>
      <span className="max-w-[280px] truncate text-[color:var(--dw-text)]">
        {store.name ?? "Untitled"}
      </span>
      {store.status === "published" ? (
        <DWChip variant="live">Live</DWChip>
      ) : (
        <DWChip variant="accent">Draft</DWChip>
      )}
    </div>
    <SaveIndicator />
    <div className="ml-auto flex items-center gap-2">
      <Button asChild variant="outline" size="sm" className="h-8">
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
