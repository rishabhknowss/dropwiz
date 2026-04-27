import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PlusSignIcon,
  Delete01Icon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { runSilent, runWithToast } from "@/hooks/useToastMutation";
import {
  SECTION_CATALOG,
  type SectionCategory,
  type Variant,
  VARIANT_TOTAL,
} from "@/lib/section-variants";
import type { SectionType } from "@/types/store-sections";
import { Panel } from "./shared/Panel";
import { Wireframe } from "./sections/Wireframe";

type View =
  | { kind: "list" }
  | { kind: "library" }
  | { kind: "variants"; category: SectionType };

export const SectionsPanel = ({ storeId }: { storeId: string }) => {
  const store = api.stores.getMine.useQuery({ storeId });
  const utils = api.useUtils();
  const add = api.stores.addSection.useMutation();
  const remove = api.stores.removeSection.useMutation();
  const reorder = api.stores.reorderSections.useMutation();
  const [view, setView] = useState<View>({ kind: "list" });
  const [pendingVariant, setPendingVariant] = useState<string | null>(null);

  if (!store.data) return null;
  const sections = [...store.data.sections].sort((a, b) => a.order - b.order);
  const invalidate = () => utils.stores.getMine.invalidate({ storeId });

  const handleAddVariant = (type: SectionType, variantId: string) => {
    setPendingVariant(`${type}:${variantId}`);
    runWithToast(
      add,
      { storeId, type, variant: variantId },
      {
        loading: "Adding section...",
        success: "Section added",
        toastId: "section-add",
        onSuccess: () => {
          invalidate();
          setPendingVariant(null);
          setView({ kind: "list" });
        },
        onError: () => setPendingVariant(null),
      },
    );
  };

  const handleRemove = (sectionId: string) => {
    if (!confirm("Delete this section?")) return;
    runWithToast(
      remove,
      { storeId, sectionId },
      {
        loading: "Deleting...",
        success: "Deleted",
        toastId: "section-delete",
        onSuccess: invalidate,
      },
    );
  };

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...sections];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    runSilent(
      reorder,
      { storeId, sectionIds: next.map((s) => s.id) },
      { onSuccess: invalidate },
    );
  };

  if (view.kind === "library") {
    return (
      <Panel
        title="Section library"
        eyebrow={`${SECTION_CATALOG.length} categories · ${VARIANT_TOTAL} variants`}
      >
        <NavBack onClick={() => setView({ kind: "list" })} label="Sections" />
        <div className="mt-3 grid grid-cols-1 gap-2">
          {SECTION_CATALOG.map((cat) => (
            <CategoryCard
              key={cat.type}
              category={cat}
              onClick={() => setView({ kind: "variants", category: cat.type })}
            />
          ))}
        </div>
      </Panel>
    );
  }

  if (view.kind === "variants") {
    const cat = SECTION_CATALOG.find((c) => c.type === view.category);
    if (!cat) return null;
    return (
      <Panel title={cat.label} eyebrow={cat.description}>
        <NavBack onClick={() => setView({ kind: "library" })} label="Library" />
        <div className="mt-3 grid grid-cols-1 gap-3">
          {cat.variants.map((v) => (
            <VariantCard
              key={v.id}
              variant={v}
              loading={pendingVariant === `${cat.type}:${v.id}`}
              onAdd={() => handleAddVariant(cat.type, v.id)}
            />
          ))}
        </div>
      </Panel>
    );
  }

  return (
    <Panel title="Sections" eyebrow={`${sections.length} on this page`}>
      <Button
        size="sm"
        className="w-full gap-1.5"
        onClick={() => setView({ kind: "library" })}
      >
        <HugeiconsIcon icon={PlusSignIcon} size={12} />
        Browse section library
      </Button>

      <div className="mt-4 space-y-1.5">
        {sections.map((s, i) => (
          <SectionRow
            key={s.id}
            index={i}
            section={s}
            total={sections.length}
            loading={reorder.isPending}
            onMoveUp={() => move(i, -1)}
            onMoveDown={() => move(i, 1)}
            onRemove={() => handleRemove(s.id)}
          />
        ))}
        {sections.length === 0 && (
          <div className="rounded-[10px] border border-dashed border-[color:var(--dw-border)] p-5 text-center text-[12px] text-[color:var(--dw-text-muted)]">
            No sections yet. Browse the library to add one.
          </div>
        )}
      </div>
    </Panel>
  );
};

const NavBack = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <button
    onClick={onClick}
    className="dw-mono inline-flex items-center gap-1.5 text-[10.5px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)] hover:text-[color:var(--dw-text)]"
  >
    <HugeiconsIcon icon={ArrowLeft01Icon} size={11} />
    {label}
  </button>
);

const CategoryCard = ({
  category,
  onClick,
}: {
  category: SectionCategory;
  onClick: () => void;
}) => {
  const sample = category.variants[0];
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-3 rounded-[12px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-2.5 text-left transition hover:border-[color:var(--dw-accent)]/40"
    >
      <div className="w-[88px] shrink-0">
        <Wireframe kind={sample.preview} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="truncate text-[13.5px] font-medium">{category.label}</div>
          <span className="dw-mono shrink-0 text-[9.5px] tracking-[0.12em] uppercase text-[color:var(--dw-text-muted)]">
            {category.variants.length}
            {category.variants.length === 1 ? " variant" : " variants"}
          </span>
        </div>
        <div className="mt-0.5 truncate text-[11.5px] text-[color:var(--dw-text-dim)]">
          {category.description}
        </div>
      </div>
      <HugeiconsIcon
        icon={ArrowRight01Icon}
        size={11}
        className="text-[color:var(--dw-text-muted)] transition group-hover:translate-x-0.5"
      />
    </button>
  );
};

const VariantCard = ({
  variant,
  loading,
  onAdd,
}: {
  variant: Variant;
  loading: boolean;
  onAdd: () => void;
}) => (
  <div className="overflow-hidden rounded-[12px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)]">
    <Wireframe kind={variant.preview} />
    <div className="space-y-2 p-3">
      <div>
        <div className="text-[13px] font-medium">{variant.label}</div>
        <div className="mt-0.5 text-[11.5px] leading-[1.4] text-[color:var(--dw-text-dim)]">
          {variant.description}
        </div>
      </div>
      <Button
        size="sm"
        className="h-8 w-full gap-1.5 text-[12px]"
        onClick={onAdd}
        disabled={loading}
      >
        {loading ? (
          "Adding…"
        ) : (
          <>
            <HugeiconsIcon icon={PlusSignIcon} size={11} />
            Add to page
          </>
        )}
      </Button>
    </div>
  </div>
);

const SectionRow = ({
  index,
  section,
  total,
  loading,
  onMoveUp,
  onMoveDown,
  onRemove,
}: {
  index: number;
  section: { type: string; data: Record<string, unknown> };
  total: number;
  loading: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}) => {
  const cat = SECTION_CATALOG.find((c) => c.type === section.type);
  const variantId =
    typeof section.data?.variant === "string" ? section.data.variant : null;
  const variant = variantId
    ? cat?.variants.find((v) => v.id === variantId)
    : cat?.variants[0];
  return (
    <div className="flex items-center gap-1 rounded-[10px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-2 text-[13px]">
      <span className="dw-mono w-6 text-[10.5px] text-[color:var(--dw-text-muted)]">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] capitalize">
          {cat?.label ?? section.type}
        </div>
        {variant && (
          <div className="dw-mono truncate text-[10px] tracking-[0.08em] uppercase text-[color:var(--dw-text-muted)]">
            {variant.label}
          </div>
        )}
      </div>
      <IconButton
        label="Move up"
        icon={ArrowUp01Icon}
        onClick={onMoveUp}
        disabled={index === 0 || loading}
      />
      <IconButton
        label="Move down"
        icon={ArrowDown01Icon}
        onClick={onMoveDown}
        disabled={index === total - 1 || loading}
      />
      <IconButton
        label="Remove"
        icon={Delete01Icon}
        onClick={onRemove}
        tone="destructive"
      />
    </div>
  );
};

const IconButton = ({
  label,
  icon,
  onClick,
  disabled,
  tone,
}: {
  label: string;
  icon: typeof ArrowUp01Icon;
  onClick: () => void;
  disabled?: boolean;
  tone?: "destructive";
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    className={
      tone === "destructive"
        ? "flex size-7 items-center justify-center rounded-md text-[color:var(--dw-text-muted)] hover:bg-[color:var(--dw-signal)]/10 hover:text-[color:var(--dw-signal)]"
        : "flex size-7 items-center justify-center rounded-md text-[color:var(--dw-text-muted)] hover:bg-[color:var(--dw-surface2)] disabled:opacity-30"
    }
  >
    <HugeiconsIcon icon={icon} size={12} />
  </button>
);

void Tick02Icon;
