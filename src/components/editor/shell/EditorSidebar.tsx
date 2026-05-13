import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PaintBrush02Icon,
  Target02Icon,
  Image01Icon,
  DashboardSquare01Icon,
  PlayIcon,
  Layers01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { api } from "@/utils/api";

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

const TIER_COLORS: Record<string, string> = {
  free: "var(--dw-text-muted)",
  starter: "var(--dw-accent)",
  pro: "#a78bfa",
  agency: "#f59e0b",
  enterprise: "#ef4444",
};

export const EditorSidebar = ({
  activeTab,
  hasActiveSection,
  onSelectTab,
}: {
  activeTab: TabKey;
  hasActiveSection: boolean;
  onSelectTab: (tab: TabKey) => void;
}) => {
  const me = api.auth.me.useQuery();
  const tierColor = TIER_COLORS[me.data?.tier ?? "free"] ?? TIER_COLORS.free;

  return (
    <aside className="flex h-full w-[72px] flex-col items-stretch border-r border-[color:var(--dw-border)] bg-[color:var(--dw-bg)] py-3">
      <div className="flex flex-1 flex-col items-stretch justify-center">
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
                  ? "bg-[#F0F0F0] text-[#0A0A0A]"
                  : "text-[#999999] hover:bg-[#F5F5F5] hover:text-[#666666]",
              )}
            >
              <HugeiconsIcon icon={tab.icon} size={17} strokeWidth={active ? 2 : 1.5} />
              <span className="text-[10px] font-medium leading-none">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {me.data && (
        <div className="mx-2 mt-auto border-t border-[color:var(--dw-border)] pt-3">
          <Link
            href="/app/settings"
            className="group flex flex-col items-center gap-2 rounded-lg p-2 transition hover:bg-[color:var(--dw-surface2)]"
            title={`${me.data.email}\n${me.data.imageCredits} credits · ${me.data.tier}`}
          >
            <div
              className="flex size-8 items-center justify-center rounded-full border-2 text-[11px] font-bold uppercase transition group-hover:scale-105"
              style={{
                borderColor: tierColor,
                backgroundColor: `${tierColor}15`,
                color: tierColor,
              }}
            >
              {me.data.email.charAt(0)}
            </div>
            <div className="flex items-center gap-1 rounded-full bg-[color:var(--dw-surface2)] px-2 py-0.5">
              <HugeiconsIcon icon={SparklesIcon} size={9} className="text-[color:var(--dw-accent)]" />
              <span className="text-[9px] font-semibold text-[color:var(--dw-text)]">
                {me.data.imageCredits}
              </span>
            </div>
          </Link>
        </div>
      )}
    </aside>
  );
};
