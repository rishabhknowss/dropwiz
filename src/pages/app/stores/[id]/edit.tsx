import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ComputerIcon,
  Tablet01Icon,
  SmartPhone01Icon,
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
  const me = api.auth.me.useQuery();
  const store = api.stores.getMine.useQuery(
    { storeId: storeId ?? "" },
    { enabled: !!storeId && !!me.data, refetchOnWindowFocus: false },
  );
  const [activeTab, setActiveTab] = useState<TabKey>("strategy");
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [viewport, setViewport] = useState<Viewport>("desktop");

  useEffect(() => {
    if (!me.isLoading && !me.data) router.replace("/auth/signin");
  }, [me.isLoading, me.data, router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveSectionId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
    ? (store.data.sections.find((s) => s.id === activeSectionId) ?? null)
    : null;

  const selectTab = (tab: TabKey) => {
    setActiveTab(tab);
    setActiveSectionId(null);
  };

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[color:var(--dw-bg)] text-[color:var(--dw-text)]">
      <EditorHeader store={store.data} />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <EditorSidebar
          activeTab={activeTab}
          hasActiveSection={!!activeSection}
          onSelectTab={selectTab}
        />
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[color:var(--dw-surface2)]/30">
          <ViewportToolbar value={viewport} onChange={setViewport} />
          <div className="flex-1 overflow-y-auto px-6 pb-10">
            <div
              onClick={() => setActiveSectionId(null)}
              className="mx-auto overflow-hidden rounded-[14px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] shadow-lg transition-[max-width] duration-300"
              style={{ maxWidth: VIEWPORT_WIDTHS[viewport] }}
            >
              <StoreRenderer
                store={store.data}
                selectable
                activeSectionId={activeSectionId}
                onSelectSection={(id) => setActiveSectionId(id)}
              />
            </div>
          </div>
        </main>
        <aside className="w-[360px] shrink-0 overflow-y-auto border-l border-[color:var(--dw-border)] p-5">
          {activeSection ? (
            <SectionInspector
              section={activeSection}
              store={store.data}
              onClose={() => setActiveSectionId(null)}
            />
          ) : (
            <InspectorByTab tab={activeTab} storeId={store.data.id} />
          )}
        </aside>
      </div>
      <OnboardingTour onNavigate={(t) => setActiveTab(t)} />
    </div>
  );
};

const InspectorByTab = ({
  tab,
  storeId,
}: {
  tab: TabKey;
  storeId: string;
}) => {
  switch (tab) {
    case "strategy":
      return <StrategyPanel storeId={storeId} />;
    case "templates":
      return <TemplatesPanel storeId={storeId} />;
    case "design":
      return <DesignPanel storeId={storeId} />;
    case "sections":
      return <SectionsPanel storeId={storeId} />;
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
