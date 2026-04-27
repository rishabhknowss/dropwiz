import { HugeiconsIcon } from "@hugeicons/react";
import {
  PaintBrush02Icon,
  Target02Icon,
  Image01Icon,
  DashboardSquare01Icon,
  PlayIcon,
  Layers01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

export type TabKey =
  | "design"
  | "strategy"
  | "studio"
  | "sections"
  | "ads"
  | "templates";

export const TABS: Array<{
  key: TabKey;
  icon: typeof PaintBrush02Icon;
  label: string;
  desc: string;
}> = [
  {
    key: "strategy",
    icon: Target02Icon,
    label: "Strategy",
    desc: "Persona · angle · regenerate",
  },
  {
    key: "templates",
    icon: Layers01Icon,
    label: "Templates",
    desc: "Pre-made style presets",
  },
  {
    key: "design",
    icon: PaintBrush02Icon,
    label: "Design",
    desc: "Colors · fonts · radius",
  },
  {
    key: "sections",
    icon: DashboardSquare01Icon,
    label: "Sections",
    desc: "Add · reorder · delete",
  },
  {
    key: "studio",
    icon: Image01Icon,
    label: "Studio",
    desc: "Images · AI generate",
  },
  {
    key: "ads",
    icon: PlayIcon,
    label: "Ads",
    desc: "Hooks · Meta ads",
  },
];

export const EditorSidebar = ({
  activeTab,
  hasActiveSection,
  onSelectTab,
}: {
  activeTab: TabKey;
  hasActiveSection: boolean;
  onSelectTab: (tab: TabKey) => void;
}) => (
  <aside className="flex w-[72px] flex-col items-stretch justify-center border-r border-[color:var(--dw-border)] py-3">
    {TABS.map((tab) => {
      const active = activeTab === tab.key && !hasActiveSection;
      return (
        <button
          key={tab.key}
          onClick={() => onSelectTab(tab.key)}
          aria-label={tab.label}
          title={tab.desc}
          className={cn(
            "mx-2 mb-1 flex cursor-pointer flex-col items-center gap-1 rounded-lg px-1 py-2 transition",
            active
              ? "bg-[color:var(--dw-surface2)] text-[color:var(--dw-accent)]"
              : "text-[color:var(--dw-text-muted)] hover:bg-[color:var(--dw-surface2)] hover:text-[color:var(--dw-text)]",
          )}
        >
          <HugeiconsIcon icon={tab.icon} size={17} />
          <span className="text-[10px] font-medium leading-none">{tab.label}</span>
        </button>
      );
    })}
  </aside>
);
