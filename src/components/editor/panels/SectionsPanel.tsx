import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PlusSignIcon,
  Delete01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Tick02Icon,
  DragDropVerticalIcon,
} from "@hugeicons/core-free-icons";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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

type SectionsPanelProps = {
  storeId: string;
  pageId: string | null;
};

export const SectionsPanel = ({ storeId, pageId }: SectionsPanelProps) => {
  const store = api.stores.getMine.useQuery({ storeId });
  const pagesQuery = api.stores.getPages.useQuery({ storeId });
  const utils = api.useUtils();
  const addLegacy = api.stores.addSection.useMutation();
  const addPage = api.stores.addPageSection.useMutation();
  const removeLegacy = api.stores.removeSection.useMutation();
  const removePage = api.stores.removePageSection.useMutation();
  const reorderLegacy = api.stores.reorderSections.useMutation();
  const reorderPage = api.stores.reorderPageSections.useMutation();
  const [view, setView] = useState<View>({ kind: "list" });
  const [pendingVariant, setPendingVariant] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  if (!store.data) return null;

  const pages = pagesQuery.data ?? [];
  const activePage = pageId ? pages.find((p) => p.id === pageId) : pages[0];
  const sections = activePage
    ? [...activePage.sections].sort((a, b) => a.order - b.order)
    : [...store.data.sections].sort((a, b) => a.order - b.order);

  const invalidate = () => {
    utils.stores.getMine.invalidate({ storeId });
    utils.stores.getPages.invalidate({ storeId });
  };

  const handleAddVariant = (type: SectionType, variantId: string) => {
    setPendingVariant(`${type}:${variantId}`);
    const effectivePageId = pageId ?? activePage?.id;
    if (effectivePageId) {
      runWithToast(
        addPage,
        { storeId, pageId: effectivePageId, type, variant: variantId },
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
    } else {
      runWithToast(
        addLegacy,
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
    }
  };

  const handleRemove = (sectionId: string) => {
    if (!confirm("Delete this section?")) return;
    const effectivePageId = pageId ?? activePage?.id;
    if (effectivePageId) {
      runWithToast(
        removePage,
        { storeId, pageId: effectivePageId, sectionId },
        {
          loading: "Deleting...",
          success: "Deleted",
          toastId: "section-delete",
          onSuccess: invalidate,
        },
      );
    } else {
      runWithToast(
        removeLegacy,
        { storeId, sectionId },
        {
          loading: "Deleting...",
          success: "Deleted",
          toastId: "section-delete",
          onSuccess: invalidate,
        },
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(sections, oldIndex, newIndex);
    const effectivePageId = pageId ?? activePage?.id;
    if (effectivePageId) {
      runSilent(
        reorderPage,
        { storeId, pageId: effectivePageId, sectionIds: reordered.map((s) => s.id) },
        { onSuccess: invalidate },
      );
    } else {
      runSilent(
        reorderLegacy,
        { storeId, sectionIds: reordered.map((s) => s.id) },
        { onSuccess: invalidate },
      );
    }
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sections.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            {sections.map((s, i) => (
              <SortableSectionRow
                key={s.id}
                id={s.id}
                index={i}
                section={s}
                onRemove={() => handleRemove(s.id)}
              />
            ))}
          </SortableContext>
        </DndContext>
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

const SortableSectionRow = ({
  id,
  index,
  section,
  onRemove,
}: {
  id: string;
  index: number;
  section: { type: string; data: Record<string, unknown> };
  onRemove: () => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const cat = SECTION_CATALOG.find((c) => c.type === section.type);
  const variantId =
    typeof section.data?.variant === "string" ? section.data.variant : null;
  const variant = variantId
    ? cat?.variants.find((v) => v.id === variantId)
    : cat?.variants[0];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-1 rounded-[10px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-2 text-[13px]"
    >
      <button
        {...attributes}
        {...listeners}
        className="flex size-7 cursor-grab items-center justify-center rounded-md text-[color:var(--dw-text-muted)] hover:bg-[color:var(--dw-surface2)] active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <HugeiconsIcon icon={DragDropVerticalIcon} size={14} />
      </button>
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
      <button
        onClick={onRemove}
        aria-label="Remove"
        className="flex size-7 items-center justify-center rounded-md text-[color:var(--dw-text-muted)] hover:bg-[color:var(--dw-signal)]/10 hover:text-[color:var(--dw-signal)]"
      >
        <HugeiconsIcon icon={Delete01Icon} size={12} />
      </button>
    </div>
  );
};

void Tick02Icon;
