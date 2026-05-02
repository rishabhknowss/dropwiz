import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ComputerIcon,
  Tablet01Icon,
  SmartPhone01Icon,
  Menu01Icon,
  Cancel01Icon,
  Settings02Icon,
} from "@hugeicons/core-free-icons";
import { StoreRenderer } from "@/components/store/StoreRenderer";
import { SectionInspector } from "@/components/editor/inspectors";
import { OnboardingTour } from "@/components/editor/OnboardingTour";
import { EditorHeader } from "@/components/editor/shell/EditorHeader";
import {
  EditorSidebar,
  type TabKey,
} from "@/components/editor/shell/EditorSidebar";
import {
  StrategyPanel,
  DesignPanel,
  TemplatesPanel,
  SectionsPanel,
  StudioPanel,
  AdsPanel,
} from "@/components/editor/panels";
import { api } from "@/utils/api";

const EditStore = () => {
  const router = useRouter();
  const storeId = typeof router.query.id === "string" ? router.query.id : null;
  const pageIdFromUrl =
    typeof router.query.page === "string" ? router.query.page : null;

  const me = api.auth.me.useQuery();
  const store = api.stores.getMine.useQuery(
    { storeId: storeId ?? "" },
    { enabled: !!storeId && !!me.data, refetchOnWindowFocus: false },
  );
  const pagesQuery = api.stores.getPages.useQuery(
    { storeId: storeId ?? "" },
    { enabled: !!storeId && !!me.data, refetchOnWindowFocus: false },
  );

  const [activeTab, setActiveTab] = useState<TabKey>("strategy");
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileInspectorOpen, setMobileInspectorOpen] = useState(false);

  const pages = pagesQuery.data ?? [];
  const activePageId = pageIdFromUrl ?? pages[0]?.id ?? null;
  const activePage = pages.find((p) => p.id === activePageId) ?? pages[0];
  const activeSections = activePage?.sections ?? store.data?.sections ?? [];

  const handleSelectPage = (pageId: string) => {
    router.push(
      { pathname: router.pathname, query: { ...router.query, page: pageId } },
      undefined,
      { shallow: true },
    );
    setActiveSectionId(null);
  };

  useEffect(() => {
    if (!me.isLoading && !me.data) router.replace("/auth/signin");
  }, [me.isLoading, me.data, router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveSectionId(null);
        setMobileSidebarOpen(false);
        setMobileInspectorOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (activeSectionId) setMobileInspectorOpen(true);
  }, [activeSectionId]);

  if (!me.data || !store.data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[color:var(--dw-bg)]">
        <div className="dw-mono text-xs tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
          Loading editor…
        </div>
      </div>
    );
  }

  const activeSection = activeSectionId
    ? (activeSections.find((s) => s.id === activeSectionId) ?? null)
    : null;

  const selectTab = (tab: TabKey) => {
    setActiveTab(tab);
    setActiveSectionId(null);
    setMobileSidebarOpen(false);
    setMobileInspectorOpen(true);
  };

  const storeWithActiveSections = {
    ...store.data,
    sections: activeSections,
  };

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[color:var(--dw-bg)] text-[color:var(--dw-text)]">
      <EditorHeader
        store={store.data}
        pages={pages}
        activePageId={activePageId}
        onSelectPage={handleSelectPage}
      />

      <MobileEditorBar
        onOpenSidebar={() => setMobileSidebarOpen(true)}
        onOpenInspector={() => setMobileInspectorOpen(true)}
        viewport={viewport}
        onChangeViewport={setViewport}
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div
          className={`fixed inset-y-0 left-0 z-30 transition-transform duration-300 md:static md:translate-x-0 ${
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <EditorSidebar
            activeTab={activeTab}
            hasActiveSection={!!activeSection}
            onSelectTab={selectTab}
          />
        </div>
        {mobileSidebarOpen && (
          <button
            aria-label="Close sidebar"
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm md:hidden"
          />
        )}

        {activeTab !== "studio" && (
          <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[color:var(--dw-surface2)]/30">
            <div className="hidden md:block">
              <ViewportToolbar value={viewport} onChange={setViewport} />
            </div>
            <div className="flex-1 overflow-y-auto px-3 pb-10 md:px-6">
              <div
                onClick={() => setActiveSectionId(null)}
                className="mx-auto overflow-hidden rounded-[14px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] shadow-lg transition-[max-width] duration-300"
                style={{ maxWidth: VIEWPORT_WIDTHS[viewport] }}
              >
                <StoreRenderer
                  store={storeWithActiveSections}
                  selectable
                  activeSectionId={activeSectionId}
                  onSelectSection={(id) => setActiveSectionId(id)}
                />
              </div>
            </div>
          </main>
        )}

        <aside
          className={`fixed inset-x-0 bottom-0 z-30 max-h-[80vh] overflow-y-auto rounded-t-[20px] border-t border-[color:var(--dw-border)] bg-[color:var(--dw-bg)] p-5 transition-transform duration-300 md:static md:max-h-none md:shrink-0 md:translate-y-0 md:rounded-none md:border-l md:border-t-0 ${
            mobileInspectorOpen ? "translate-y-0" : "translate-y-full md:translate-y-0"
          } ${activeTab === "studio" ? "md:flex-1" : "md:w-[360px]"}`}
        >
          <button
            aria-label="Close inspector"
            onClick={() => setMobileInspectorOpen(false)}
            className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-md text-[color:var(--dw-text-muted)] transition hover:bg-[color:var(--dw-surface)] hover:text-[color:var(--dw-text)] md:hidden"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} />
          </button>
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[color:var(--dw-border-strong)] md:hidden" />
          {activeSection ? (
            <SectionInspector
              section={activeSection}
              store={storeWithActiveSections}
              pageId={activePageId}
              onClose={() => {
                setActiveSectionId(null);
                setMobileInspectorOpen(false);
              }}
            />
          ) : (
            <InspectorByTab
              tab={activeTab}
              storeId={store.data.id}
              pageId={activePageId}
            />
          )}
        </aside>
        {mobileInspectorOpen && (
          <button
            aria-label="Close inspector"
            onClick={() => setMobileInspectorOpen(false)}
            className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm md:hidden"
          />
        )}
      </div>
      <OnboardingTour onNavigate={(t) => setActiveTab(t)} />
    </div>
  );
};

const MobileEditorBar = ({
  onOpenSidebar,
  onOpenInspector,
  viewport,
  onChangeViewport,
}: {
  onOpenSidebar: () => void;
  onOpenInspector: () => void;
  viewport: Viewport;
  onChangeViewport: (v: Viewport) => void;
}) => (
  <div className="flex h-11 shrink-0 items-center justify-between border-b border-[color:var(--dw-border)] bg-[color:var(--dw-bg)]/80 px-3 backdrop-blur md:hidden">
    <button
      onClick={onOpenSidebar}
      aria-label="Open sidebar"
      className="flex size-8 items-center justify-center rounded-md text-[color:var(--dw-text-muted)] transition hover:bg-[color:var(--dw-surface)] hover:text-[color:var(--dw-text)]"
    >
      <HugeiconsIcon icon={Menu01Icon} size={16} />
    </button>
    <div className="inline-flex items-center gap-0.5 rounded-[8px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-0.5">
      {VIEWPORT_OPTIONS.map((opt) => {
        const active = viewport === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChangeViewport(opt.id)}
            aria-label={opt.label}
            title={opt.label}
            className={`flex size-7 items-center justify-center rounded-[6px] transition ${
              active
                ? "bg-[color:var(--dw-surface2)] text-[color:var(--dw-text)]"
                : "text-[color:var(--dw-text-muted)] hover:text-[color:var(--dw-text)]"
            }`}
          >
            <HugeiconsIcon icon={opt.icon} size={13} />
          </button>
        );
      })}
    </div>
    <button
      onClick={onOpenInspector}
      aria-label="Open inspector"
      className="flex size-8 items-center justify-center rounded-md text-[color:var(--dw-text-muted)] transition hover:bg-[color:var(--dw-surface)] hover:text-[color:var(--dw-text)]"
    >
      <HugeiconsIcon icon={Settings02Icon} size={16} />
    </button>
  </div>
);

const InspectorByTab = ({
  tab,
  storeId,
  pageId,
}: {
  tab: TabKey;
  storeId: string;
  pageId: string | null;
}) => {
  switch (tab) {
    case "strategy":
      return <StrategyPanel storeId={storeId} />;
    case "templates":
      return <TemplatesPanel storeId={storeId} />;
    case "design":
      return <DesignPanel storeId={storeId} />;
    case "sections":
      return <SectionsPanel storeId={storeId} pageId={pageId} />;
    case "studio":
      return <StudioPanel storeId={storeId} />;
    case "ads":
      return <AdsPanel storeId={storeId} />;
    default:
      return null;
  }
};

type Viewport = "desktop" | "tablet" | "mobile";

const VIEWPORT_WIDTHS: Record<Viewport, string> = {
  desktop: "1100px",
  tablet: "820px",
  mobile: "414px",
};

const VIEWPORT_OPTIONS: Array<{ id: Viewport; icon: typeof ComputerIcon; label: string }> = [
  { id: "desktop", icon: ComputerIcon, label: "Desktop" },
  { id: "tablet", icon: Tablet01Icon, label: "Tablet" },
  { id: "mobile", icon: SmartPhone01Icon, label: "Mobile" },
];

const ViewportToolbar = ({
  value,
  onChange,
}: {
  value: Viewport;
  onChange: (v: Viewport) => void;
}) => (
  <div className="flex h-11 shrink-0 items-center justify-center border-b border-[color:var(--dw-border)] bg-[color:var(--dw-bg)]/60 px-4 backdrop-blur">
    <div className="inline-flex items-center gap-0.5 rounded-[10px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-0.5">
      {VIEWPORT_OPTIONS.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            aria-label={opt.label}
            title={opt.label}
            className={`flex h-7 items-center gap-1.5 rounded-[7px] px-2.5 text-[11.5px] font-medium transition ${
              active
                ? "bg-[color:var(--dw-surface2)] text-[color:var(--dw-text)]"
                : "text-[color:var(--dw-text-muted)] hover:text-[color:var(--dw-text)]"
            }`}
          >
            <HugeiconsIcon icon={opt.icon} size={13} />
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  </div>
);

export default EditStore;
