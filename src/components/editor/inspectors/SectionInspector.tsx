import { useState, useCallback, useRef, useEffect } from "react";
import type { Store, StoreSection, StorePage } from "@/db/schema";
import { api, type RouterOutputs } from "@/utils/api";
import { runSilent, runWithToast } from "@/hooks/useToastMutation";
import { SectionActions } from "./SectionActions";
import { HeaderInspector } from "./HeaderInspector";
import { HeroInspector } from "./HeroInspector";
import { ProductInspector } from "./ProductInspector";
import { BundlesInspector } from "./BundlesInspector";
import { TrustInspector } from "./TrustInspector";
import { FaqInspector } from "./FaqInspector";
import { FooterInspector } from "./FooterInspector";
import { GenericInspector } from "./GenericInspector";
import { LifestyleInspector } from "./LifestyleInspector";
import { GalleryInspector } from "./GalleryInspector";
import { TestimonialsInspector } from "./TestimonialsInspector";
import { ValuePropsInspector } from "./ValuePropsInspector";
import { AnnouncementInspector } from "./AnnouncementInspector";
import { HowItWorksInspector } from "./HowItWorksInspector";
import { VideoInspector } from "./VideoInspector";

type Props = {
  section: StoreSection;
  store: Store;
  pageId: string | null;
  onClose: () => void;
};

const REGENERATABLE: Array<StoreSection["type"]> = ["hero", "bundles", "faq"];

export const SectionInspector = ({ section, store, pageId, onClose }: Props) => {
  const key = `${store.id}-${section.id}`;
  return (
    <SectionForm
      key={key}
      section={section}
      store={store}
      pageId={pageId}
      onClose={onClose}
    />
  );
};

const SectionForm = ({ section: initialSection, store, pageId, onClose }: Props) => {
  const utils = api.useUtils();
  const pagesQuery = api.stores.getPages.useQuery({ storeId: store.id });
  const updateLegacy = api.stores.updateSection.useMutation();
  const updatePage = api.stores.updatePageSection.useMutation();
  const regen = api.stores.regenerateSection.useMutation();
  const removeLegacy = api.stores.removeSection.useMutation();
  const removePage = api.stores.removePageSection.useMutation();

  const pages = pagesQuery.data ?? [];
  const effectivePageId = pageId ?? pages[0]?.id ?? null;

  const [localData, setLocalData] = useState<Record<string, unknown>>(
    initialSection.data as Record<string, unknown>
  );
  const pendingRef = useRef<Record<string, unknown>>({});
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const section = { ...initialSection, data: localData };

  const updateOptimisticCache = useCallback((data: Record<string, unknown>) => {
    const newSectionData = { ...localData, ...data };

    utils.stores.getPages.setData({ storeId: store.id }, (old) => {
      if (!old) return old;
      return old.map((page) => ({
        ...page,
        sections: page.sections.map((s) =>
          s.id === initialSection.id
            ? { ...s, data: newSectionData }
            : s
        ),
      }));
    });

    utils.stores.getMine.setData({ storeId: store.id }, (old) => {
      if (!old) return old;
      return {
        ...old,
        sections: old.sections.map((s) =>
          s.id === initialSection.id
            ? { ...s, data: newSectionData }
            : s
        ),
      };
    });
  }, [utils, store.id, initialSection.id, localData]);

  const sendToServer = useCallback(() => {
    const data = { ...pendingRef.current };
    pendingRef.current = {};

    if (Object.keys(data).length === 0) return;

    if (effectivePageId) {
      runSilent(
        updatePage,
        { storeId: store.id, pageId: effectivePageId, sectionId: initialSection.id, data },
        {},
      );
    } else {
      runSilent(
        updateLegacy,
        { storeId: store.id, sectionId: initialSection.id, data },
        {},
      );
    }
  }, [effectivePageId, store.id, initialSection.id, updatePage, updateLegacy]);

  const commit = useCallback((data: Record<string, unknown>) => {
    setLocalData((prev) => ({ ...prev, ...data }));
    pendingRef.current = { ...pendingRef.current, ...data };
    updateOptimisticCache(data);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(sendToServer, 150);
  }, [updateOptimisticCache, sendToServer]);

  const invalidate = useCallback(() => {
    utils.stores.getMine.invalidate({ storeId: store.id });
    utils.stores.getPages.invalidate({ storeId: store.id });
  }, [utils, store.id]);

  const handleRegenerate = () =>
    runWithToast(
      regen,
      { storeId: store.id, sectionId: initialSection.id },
      {
        loading: "Regenerating with Claude...",
        success: "Regenerated",
        onSuccess: invalidate,
      },
    );

  const handleDelete = () => {
    if (!confirm("Delete this section? This can't be undone.")) return;
    if (effectivePageId) {
      runWithToast(
        removePage,
        { storeId: store.id, pageId: effectivePageId, sectionId: initialSection.id },
        {
          loading: "Deleting...",
          success: "Deleted",
          onSuccess: () => {
            invalidate();
            onClose();
          },
        },
      );
    } else {
      runWithToast(
        removeLegacy,
        { storeId: store.id, sectionId: initialSection.id },
        {
          loading: "Deleting...",
          success: "Deleted",
          onSuccess: () => {
            invalidate();
            onClose();
          },
        },
      );
    }
  };

  return (
    <div className="space-y-4">
      <SectionActions
        sectionType={section.type}
        regeneratable={REGENERATABLE.includes(section.type)}
        regenLoading={regen.isPending}
        onRegenerate={handleRegenerate}
        onDelete={handleDelete}
      />
      <div className="space-y-4 border-t border-[color:var(--dw-border)] pt-4">
        {section.type === "header" && (
          <HeaderInspector
            section={section}
            storeId={store.id}
            onCommit={commit}
          />
        )}
        {section.type === "hero" && (
          <HeroInspector
            section={section}
            storeId={store.id}
            onCommit={commit}
          />
        )}
        {section.type === "product" && (
          <ProductInspector
            section={section}
            storeId={store.id}
            onCommit={commit}
          />
        )}
        {section.type === "bundles" && (
          <BundlesInspector section={section} onCommit={commit} />
        )}
        {section.type === "trust" && (
          <TrustInspector section={section} onCommit={commit} />
        )}
        {section.type === "faq" && (
          <FaqInspector section={section} onCommit={commit} />
        )}
        {section.type === "footer" && (
          <FooterInspector section={section} storeId={store.id} onCommit={commit} />
        )}
        {section.type === "lifestyle" && (
          <LifestyleInspector
            section={section}
            storeId={store.id}
            onCommit={commit}
          />
        )}
        {section.type === "gallery" && (
          <GalleryInspector
            section={section}
            storeId={store.id}
            onCommit={commit}
          />
        )}
        {section.type === "testimonials" && (
          <TestimonialsInspector
            section={section}
            storeId={store.id}
            onCommit={commit}
          />
        )}
        {section.type === "valueProps" && (
          <ValuePropsInspector section={section} onCommit={commit} />
        )}
        {section.type === "announcement" && (
          <AnnouncementInspector section={section} onCommit={commit} />
        )}
        {section.type === "howItWorks" && (
          <HowItWorksInspector section={section} onCommit={commit} />
        )}
        {section.type === "video" && (
          <VideoInspector section={section} onCommit={commit} />
        )}
        {(section.type === "countdown" ||
          section.type === "comparison" ||
          section.type === "featureMarquee" ||
          section.type === "reviewStats") && (
          <GenericInspector section={section} onCommit={commit} />
        )}
      </div>
    </div>
  );
};
