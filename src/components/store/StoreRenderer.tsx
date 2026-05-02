import type { CSSProperties } from "react";
import type { Store } from "@/db/schema";
import { Section } from "./sections";
import { SelectableWrap } from "./SelectableWrap";

type ThemeColors = {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  text?: string;
};

type ThemeTypography = {
  display?: string;
  sans?: string;
  mono?: string;
};

export type StoreRendererProps = {
  store: Store;
  selectable?: boolean;
  activeSectionId?: string | null;
  onSelectSection?: (sectionId: string) => void;
};

function fontStack(fam: string | undefined, fallback: string): string {
  if (!fam) return fallback;
  return `"${fam}", ${fallback}`;
}

export const StoreRenderer = ({
  store,
  selectable,
  activeSectionId,
  onSelectSection,
}: StoreRendererProps) => {
  const tokens = (store.themeTokens ?? {}) as {
    colors?: ThemeColors;
    radius?: number;
    typography?: ThemeTypography;
  };
  const colors = tokens.colors ?? {};
  const typography = tokens.typography ?? {};
  const style = {
    "--store-bg": colors.background ?? "#fafaf7",
    "--store-text": colors.text ?? "#0a0a0a",
    "--store-primary": colors.primary ?? "#0a0a0a",
    "--store-accent": colors.accent ?? "#c7ff3d",
    "--store-radius": `${tokens.radius ?? 12}px`,
    "--store-font-sans": fontStack(
      typography.sans,
      "var(--font-geist-sans), system-ui, sans-serif",
    ),
    "--store-font-display": fontStack(
      typography.display ?? typography.sans,
      "var(--font-geist-sans), system-ui, sans-serif",
    ),
    "--store-font-mono": fontStack(
      typography.mono,
      "var(--font-geist-mono), ui-monospace, monospace",
    ),
  } as CSSProperties;

  const sortedSections = [...store.sections].sort((a, b) => a.order - b.order);

  return (
    <div
      style={style}
      className="store-renderer @container/store min-h-screen"
      data-store-id={store.id}
    >
      <style jsx>{`
        .store-renderer {
          background: var(--store-bg);
          color: var(--store-text);
          font-family: var(--store-font-sans);
        }
      `}</style>
      <style>{`
        .store-renderer h1,
        .store-renderer h2,
        .store-renderer h3 {
          font-family: var(--store-font-display);
        }
      `}</style>
      {sortedSections.map((section) => (
        <SelectableWrap
          key={section.id}
          sectionId={section.id}
          selectable={selectable}
          active={activeSectionId === section.id}
          onSelect={onSelectSection}
        >
          <Section section={section} store={store} />
        </SelectableWrap>
      ))}
    </div>
  );
};
