import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  Add01Icon,
  Delete02Icon,
  Edit02Icon,
  Link01Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { api } from "@/utils/api";
import type { StorePage } from "@/db/schema";
import { AddProductModal } from "@/components/shopify/AddProductModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PageSelectorProps = {
  storeId: string;
  pages: StorePage[];
  activePageId: string | null;
  onSelectPage: (pageId: string) => void;
};

const PAGE_TYPE_ICONS: Record<StorePage["type"], string> = {
  product: "🛍️",
  landing: "🚀",
  about: "📖",
  faq: "❓",
  gallery: "🖼️",
  blog: "✍️",
};

export const PageSelector = ({
  storeId,
  pages,
  activePageId,
  onSelectPage,
}: PageSelectorProps) => {
  const utils = api.useUtils();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [importProductOpen, setImportProductOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [pageToRename, setPageToRename] = useState<StorePage | null>(null);
  const [newName, setNewName] = useState("");

  const shopsQuery = api.shopify.listShops.useQuery(undefined, {
    enabled: importProductOpen,
  });

  const activePage = pages.find((p) => p.id === activePageId) ?? pages[0];
  const templates = api.stores.listPageTemplates.useQuery();

  const addPageMutation = api.stores.addPage.useMutation();
  const updatePageMutation = api.stores.updatePage.useMutation();
  const deletePageMutation = api.stores.deletePage.useMutation();

  const handleAddPage = (type: StorePage["type"]) => {
    const toastId = toast.loading("Creating page...");
    addPageMutation.mutate(
      { storeId, type },
      {
        onSuccess: (data) => {
          toast.success("Page created", { id: toastId });
          utils.stores.getPages.invalidate({ storeId });
          utils.stores.getMine.invalidate({ storeId });
          onSelectPage(data.page.id);
          setAddDialogOpen(false);
        },
        onError: (error) => {
          toast.error(error.message, { id: toastId });
        },
      },
    );
  };

  const handleRenamePage = () => {
    if (!pageToRename || !newName.trim()) return;
    const toastId = toast.loading("Renaming page...");
    updatePageMutation.mutate(
      { storeId, pageId: pageToRename.id, name: newName.trim() },
      {
        onSuccess: () => {
          toast.success("Page renamed", { id: toastId });
          utils.stores.getPages.invalidate({ storeId });
          utils.stores.getMine.invalidate({ storeId });
          setRenameDialogOpen(false);
          setPageToRename(null);
          setNewName("");
        },
        onError: (error) => {
          toast.error(error.message, { id: toastId });
        },
      },
    );
  };

  const handleDeletePage = (page: StorePage) => {
    if (page.isDefault) {
      toast.error("Cannot delete the default page");
      return;
    }
    const toastId = toast.loading("Deleting page...");
    deletePageMutation.mutate(
      { storeId, pageId: page.id },
      {
        onSuccess: () => {
          toast.success("Page deleted", { id: toastId });
          utils.stores.getPages.invalidate({ storeId });
          utils.stores.getMine.invalidate({ storeId });
          if (activePageId === page.id) {
            const remaining = pages.filter((p) => p.id !== page.id);
            if (remaining[0]) onSelectPage(remaining[0].id);
          }
        },
        onError: (error) => {
          toast.error(error.message, { id: toastId });
        },
      },
    );
  };

  const openRenameDialog = (page: StorePage) => {
    setPageToRename(page);
    setNewName(page.name);
    setRenameDialogOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex shrink-0 items-center gap-1 rounded-md border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] px-2 py-1 text-[11px] font-medium text-[color:var(--dw-text)] transition hover:bg-[color:var(--dw-surface2)] md:gap-1.5 md:px-2.5 md:py-1.5 md:text-[12.5px]">
            <span>{PAGE_TYPE_ICONS[activePage?.type ?? "product"]}</span>
            <span className="hidden max-w-[120px] truncate md:inline">
              {activePage?.name ?? "Product Page"}
            </span>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              size={10}
              className="text-[color:var(--dw-text-muted)] md:size-[12px]"
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {pages.map((page) => (
            <DropdownMenuItem
              key={page.id}
              className="group flex items-center justify-between"
              onSelect={() => onSelectPage(page.id)}
            >
              <div className="flex items-center gap-2">
                <span>{PAGE_TYPE_ICONS[page.type]}</span>
                <span className="truncate">{page.name}</span>
                {page.isDefault && (
                  <span className="rounded bg-[color:var(--dw-surface2)] px-1.5 py-0.5 text-[10px] uppercase text-[color:var(--dw-text-muted)]">
                    Default
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openRenameDialog(page);
                  }}
                  className="rounded p-0.5 hover:bg-[color:var(--dw-surface2)]"
                >
                  <HugeiconsIcon icon={Edit02Icon} size={12} />
                </button>
                {!page.isDefault && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePage(page);
                    }}
                    className="rounded p-0.5 text-red-500 hover:bg-red-500/10"
                  >
                    <HugeiconsIcon icon={Delete02Icon} size={12} />
                  </button>
                )}
              </div>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setImportProductOpen(true)}>
            <HugeiconsIcon icon={Link01Icon} size={14} className="mr-2" />
            Import Product
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setAddDialogOpen(true)}>
            <HugeiconsIcon icon={Add01Icon} size={14} className="mr-2" />
            Add blank page
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Page</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            {templates.data?.map((template) => (
              <button
                key={template.type}
                onClick={() => handleAddPage(template.type as StorePage["type"])}
                disabled={addPageMutation.isPending}
                className="flex items-center gap-3 rounded-lg border border-[color:var(--dw-border)] p-3 text-left transition hover:border-[color:var(--dw-accent)] hover:bg-[color:var(--dw-surface)]"
              >
                <span className="text-2xl">{template.icon}</span>
                <div>
                  <div className="font-medium">{template.name}</div>
                  <div className="text-xs text-[color:var(--dw-text-muted)]">
                    {template.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Rename Page</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Page name"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRenamePage();
              }}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRenameDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleRenamePage}
                disabled={!newName.trim() || updatePageMutation.isPending}
              >
                Rename
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {importProductOpen && (
        <AddProductModal
          onClose={() => setImportProductOpen(false)}
          shops={(shopsQuery.data ?? []).map((s) => ({ id: s.id, shopDomain: s.shopDomain }))}
          storeId={storeId}
          onPageAdded={(pageId) => {
            setImportProductOpen(false);
            onSelectPage(pageId);
          }}
        />
      )}
    </>
  );
};
