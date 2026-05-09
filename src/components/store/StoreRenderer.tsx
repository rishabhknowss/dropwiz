import type { CSSProperties } from "react";
import type { Store } from "@/db/schema";
import { Section } from "./sections";
import { SelectableWrap } from "./SelectableWrap";
import { CartProvider, CartDrawer, StickyBuyBar } from "./cart";

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
  enableCart?: boolean;
  shopifyDomain?: string;
  shopifyProductId?: string;
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
  enableCart = true,
  shopifyDomain,
  shopifyProductId,
}: StoreRendererProps) => {
  const tokens = (store.themeTokens ?? {}) as {
    colors?: ThemeColors;
    radius?: number;
    buttonRadius?: number;
    typography?: ThemeTypography;
    buttons?: { style?: string };
    images?: { style?: string };
    cards?: { style?: string };
  };
  const colors = tokens.colors ?? {};
  const typography = tokens.typography ?? {};
  const style = {
    "--store-bg": colors.background ?? "#fafaf7",
    "--store-text": colors.text ?? "#0a0a0a",
    "--store-primary": colors.primary ?? "#0a0a0a",
    "--store-secondary": colors.secondary ?? "#1f2937",
    "--store-accent": colors.accent ?? "#c7ff3d",
    "--store-radius": `${tokens.radius ?? 12}px`,
    "--store-button-radius": `${tokens.buttonRadius ?? 8}px`,
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

  const buttonStyle = tokens.buttons?.style ?? "classic";
  const imageStyle = tokens.images?.style ?? "none";
  const cardStyle = tokens.cards?.style ?? "default";

  const sortedSections = [...store.sections].sort((a, b) => a.order - b.order);

  const getButtonStyleCss = () => {
    const primary = colors.primary ?? "#0a0a0a";
    switch (buttonStyle) {
      case "brick":
        return `border-radius: 0 !important; box-shadow: 4px 4px 0 rgba(0,0,0,0.8) !important;`;
      case "bubble":
        return `border-radius: 24px !important;`;
      case "gradient":
        return `background: linear-gradient(135deg, ${primary}, ${primary}99) !important;`;
      case "soft":
        return `background: ${primary}20 !important; color: ${primary} !important;`;
      case "ghost":
        return `background: transparent !important; border: 2px solid ${primary} !important; color: ${primary} !important;`;
      case "solid":
        return ``;
      case "classic":
      default:
        return `border: 2px solid ${primary} !important;`;
    }
  };

  const getImageStyleCss = () => {
    switch (imageStyle) {
      case "brick":
        return `.store-renderer [data-img-styled] { border-radius: 0 !important; box-shadow: 4px 4px 0 rgba(0,0,0,0.8) !important; }`;
      case "light":
        return `.store-renderer [data-img-styled] { border-radius: 16px !important; border: 3px solid rgba(255,255,255,0.8) !important; }`;
      case "solid":
        return `.store-renderer [data-img-styled] { border: 4px solid rgba(0,0,0,0.9) !important; }`;
      case "polaroid":
        return `.store-renderer [data-img-styled] { padding: 8px 8px 24px !important; background: #fff !important; box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important; }`;
      case "shadow":
        return `.store-renderer [data-img-styled] { box-shadow: 0 8px 32px rgba(0,0,0,0.2) !important; }`;
      default:
        return "";
    }
  };

  const getCardStyleCss = () => {
    switch (cardStyle) {
      case "brick":
        return `.store-renderer [data-card-styled] { border-radius: 0 !important; box-shadow: 4px 4px 0 rgba(0,0,0,0.8) !important; }`;
      case "solid":
        return `.store-renderer [data-card-styled] { border: 2px solid rgba(0,0,0,0.9) !important; }`;
      case "shadow":
        return `.store-renderer [data-card-styled] { box-shadow: 0 8px 32px rgba(0,0,0,0.15) !important; }`;
      default:
        return "";
    }
  };

  const content = (
    <div
      style={style}
      className="store-renderer @container/store min-h-screen"
      data-store-id={store.id}
      data-button-style={buttonStyle}
      data-image-style={imageStyle}
      data-card-style={cardStyle}
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
        .store-renderer [data-btn-styled] {
          ${getButtonStyleCss()}
        }
        ${getImageStyleCss()}
        ${getCardStyleCss()}
      `}</style>
      {sortedSections.map((section) => (
        <SelectableWrap
          key={section.id}
          sectionId={section.id}
          selectable={selectable}
          active={activeSectionId === section.id}
          onSelect={onSelectSection}
        >
          <Section section={section} store={store} allSections={sortedSections} />
        </SelectableWrap>
      ))}
      {enableCart && !selectable && (
        <>
          <CartDrawer />
          <StickyBuyBar />
        </>
      )}
    </div>
  );

  if (enableCart && !selectable) {
    return (
      <CartProvider shopifyDomain={shopifyDomain} shopifyProductId={shopifyProductId}>
        {content}
      </CartProvider>
    );
  }

  return content;
};
