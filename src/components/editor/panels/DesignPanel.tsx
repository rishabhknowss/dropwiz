import { useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PaintBoardIcon,
  TextFontIcon,
  SquareIcon,
  Image01Icon,
  GridIcon,
  StarIcon,
  CropIcon,
} from "@hugeicons/core-free-icons";
import type { ThemeTokens, ButtonStyle, ImageStyle, CardStyle } from "@/db/schema";
import { api } from "@/utils/api";
import { runSilent, runWithToast } from "@/hooks/useToastMutation";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { FONT_PRESETS, type FontPreset } from "@/lib/font-presets";
import { cn } from "@/lib/utils";

type DesignTab = "colors" | "typography" | "buttons" | "images" | "cards" | "icons" | "radius";

const TABS: Array<{ id: DesignTab; label: string; icon: typeof PaintBoardIcon }> = [
  { id: "colors", label: "Colors", icon: PaintBoardIcon },
  { id: "typography", label: "Typography", icon: TextFontIcon },
  { id: "buttons", label: "Buttons", icon: SquareIcon },
  { id: "images", label: "Images", icon: Image01Icon },
  { id: "cards", label: "Cards", icon: GridIcon },
  { id: "icons", label: "Icons", icon: StarIcon },
  { id: "radius", label: "Radius", icon: CropIcon },
];

const BUTTON_STYLES: Array<{ id: ButtonStyle; label: string }> = [
  { id: "classic", label: "Classic" },
  { id: "brick", label: "Brick" },
  { id: "bubble", label: "Bubble" },
  { id: "gradient", label: "Gradient" },
  { id: "soft", label: "Soft" },
  { id: "ghost", label: "Ghost" },
  { id: "solid", label: "Solid" },
];

const IMAGE_STYLES: Array<{ id: ImageStyle; label: string }> = [
  { id: "none", label: "None" },
  { id: "brick", label: "Brick" },
  { id: "light", label: "Light" },
  { id: "solid", label: "Solid" },
  { id: "polaroid", label: "Polaroid" },
  { id: "shadow", label: "Shadow" },
];

const CARD_STYLES: Array<{ id: CardStyle; label: string }> = [
  { id: "default", label: "Default" },
  { id: "brick", label: "Brick" },
  { id: "solid", label: "Solid" },
  { id: "shadow", label: "Shadow" },
];

export const DesignPanel = ({ storeId }: { storeId: string }) => {
  const store = api.stores.getMine.useQuery({ storeId });
  if (!store.data) return null;
  return (
    <DesignForm
      key={storeId}
      storeId={storeId}
      initialTokens={(store.data.themeTokens ?? {}) as ThemeTokens}
    />
  );
};

const DesignForm = ({
  storeId,
  initialTokens,
}: {
  storeId: string;
  initialTokens: ThemeTokens;
}) => {
  const utils = api.useUtils();
  const update = api.stores.updateTheme.useMutation();
  const [tokens, setTokens] = useState<ThemeTokens>(initialTokens);
  const [activeTab, setActiveTab] = useState<DesignTab>("colors");

  const updateOptimisticCache = (next: ThemeTokens) => {
    utils.stores.getMine.setData({ storeId }, (old) => {
      if (!old) return old;
      return { ...old, themeTokens: next };
    });
  };

  const refetchStore = () => {
    utils.stores.getMine.invalidate({ storeId });
  };

  const pushSilent = useDebouncedCallback((next: ThemeTokens) => {
    runSilent(
      update,
      { storeId, themeTokens: next as Record<string, unknown> },
      { onSuccess: refetchStore },
    );
  }, 150);

  const pushWithToast = (next: ThemeTokens, label: string) =>
    runWithToast(
      update,
      { storeId, themeTokens: next as Record<string, unknown> },
      {
        loading: `${label}...`,
        success: label,
        onSuccess: refetchStore,
      },
    );

  const activeFontId = useMemo(() => {
    const display = tokens.typography?.display;
    return (
      FONT_PRESETS.find((f) => f.display === display)?.id ?? FONT_PRESETS[0].id
    );
  }, [tokens.typography?.display]);

  const setColor = (
    key: keyof NonNullable<ThemeTokens["colors"]>,
    value: string,
  ) => {
    const next: ThemeTokens = {
      ...tokens,
      colors: { ...(tokens.colors ?? {}), [key]: value },
    };
    setTokens(next);
    updateOptimisticCache(next);
    pushSilent(next);
  };

  const setRadius = (radius: number) => {
    const next: ThemeTokens = { ...tokens, radius };
    setTokens(next);
    updateOptimisticCache(next);
    pushSilent(next);
  };

  const setButtonRadius = (buttonRadius: number) => {
    const next: ThemeTokens = { ...tokens, buttonRadius };
    setTokens(next);
    updateOptimisticCache(next);
    pushSilent(next);
  };

  const setFont = (preset: FontPreset) => {
    const next: ThemeTokens = {
      ...tokens,
      typography: {
        display: preset.display,
        sans: preset.body,
        mono: preset.mono,
      },
    };
    setTokens(next);
    updateOptimisticCache(next);
    pushWithToast(next, `${preset.name} applied`);
  };

  const setButtonStyle = (style: ButtonStyle) => {
    const next: ThemeTokens = {
      ...tokens,
      buttons: { ...(tokens.buttons ?? {}), style },
    };
    setTokens(next);
    updateOptimisticCache(next);
    pushWithToast(next, `${style} buttons`);
  };

  const setImageStyle = (style: ImageStyle) => {
    const next: ThemeTokens = {
      ...tokens,
      images: { ...(tokens.images ?? {}), style },
    };
    setTokens(next);
    updateOptimisticCache(next);
    pushWithToast(next, `${style} images`);
  };

  const setCardStyle = (style: CardStyle) => {
    const next: ThemeTokens = {
      ...tokens,
      cards: { ...(tokens.cards ?? {}), style },
    };
    setTokens(next);
    updateOptimisticCache(next);
    pushWithToast(next, `${style} cards`);
  };

  const radius = tokens.radius ?? 12;
  const buttonRadius = tokens.buttonRadius ?? 8;
  const buttonStyle: ButtonStyle = tokens.buttons?.style ?? "classic";
  const imageStyle: ImageStyle = tokens.images?.style ?? "none";
  const cardStyle: CardStyle = tokens.cards?.style ?? "default";
  const primary = tokens.colors?.primary ?? "#2563eb";

  return (
    <div>
      <div className="mb-3">
        <div className="dw-mono text-[10px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
          Design
        </div>
      </div>
      <div className="flex -mx-4 border-t border-[color:var(--dw-border)]">
        <div className="flex w-[130px] shrink-0 flex-col gap-0.5 border-r border-[color:var(--dw-border)] py-2 px-1.5">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12px] transition",
                activeTab === tab.id
                  ? "bg-[#F0F0F0] text-[#0A0A0A] font-medium"
                  : "text-[#666666] hover:bg-[#F5F5F5] hover:text-[#0A0A0A]"
              )}
            >
              <HugeiconsIcon icon={tab.icon} size={14} strokeWidth={activeTab === tab.id ? 2 : 1.5} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {activeTab === "colors" && (
            <ColorsTab tokens={tokens} setColor={setColor} />
          )}
          {activeTab === "typography" && (
            <TypographyTab
              activeFontId={activeFontId}
              setFont={setFont}
              isPending={update.isPending}
            />
          )}
          {activeTab === "buttons" && (
            <ButtonsTab
              buttonStyle={buttonStyle}
              setButtonStyle={setButtonStyle}
              primary={primary}
            />
          )}
          {activeTab === "images" && (
            <ImagesTab
              imageStyle={imageStyle}
              setImageStyle={setImageStyle}
            />
          )}
          {activeTab === "cards" && (
            <CardsTab
              cardStyle={cardStyle}
              setCardStyle={setCardStyle}
            />
          )}
          {activeTab === "icons" && <IconsTab />}
          {activeTab === "radius" && (
            <RadiusTab
              radius={radius}
              buttonRadius={buttonRadius}
              setRadius={setRadius}
              setButtonRadius={setButtonRadius}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const ColorsTab = ({
  tokens,
  setColor,
}: {
  tokens: ThemeTokens;
  setColor: (key: keyof NonNullable<ThemeTokens["colors"]>, value: string) => void;
}) => {
  const primary = tokens.colors?.primary ?? "#2563eb";
  const secondary = tokens.colors?.secondary ?? "#1f2937";
  const accent = tokens.colors?.accent ?? "#f5f5f5";

  return (
    <div className="space-y-4">
      <div className="text-[13px] font-medium text-[#0A0A0A]">Color Palette</div>
      <div className="space-y-2">
        <ColorRow label="Primary" sublabel="Buttons, CTAs" color={primary} onChange={(v) => setColor("primary", v)} />
        <ColorRow label="Secondary" sublabel="Headings, text" color={secondary} onChange={(v) => setColor("secondary", v)} />
        <ColorRow label="Accent" sublabel="Backgrounds" color={accent} onChange={(v) => setColor("accent", v)} />
      </div>
    </div>
  );
};

const ColorRow = ({
  label,
  sublabel,
  color,
  onChange,
}: {
  label: string;
  sublabel: string;
  color: string;
  onChange: (v: string) => void;
}) => (
  <div className="group relative flex items-center gap-3 rounded-lg border border-[#E5E5E5] bg-white p-2.5 transition hover:border-[#CCCCCC]">
    <div
      className="relative size-9 shrink-0 overflow-hidden rounded-lg border border-[#E5E5E5] shadow-sm transition group-hover:scale-105"
      style={{ backgroundColor: color }}
    >
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 size-full cursor-pointer opacity-0"
      />
    </div>
    <div className="min-w-0 flex-1">
      <div className="text-[12px] font-medium text-[#0A0A0A]">{label}</div>
      <div className="text-[10px] text-[#999999]">{sublabel}</div>
    </div>
    <div className="rounded bg-[#F5F5F5] px-2 py-1 font-mono text-[10px] uppercase text-[#666666]">
      {color}
    </div>
  </div>
);

const TypographyTab = ({
  activeFontId,
  setFont,
  isPending,
}: {
  activeFontId: string;
  setFont: (preset: FontPreset) => void;
  isPending: boolean;
}) => {
  const activePreset = FONT_PRESETS.find((f) => f.id === activeFontId) ?? FONT_PRESETS[0];

  return (
    <div className="space-y-4">
      <div className="text-[13px] font-medium text-[#0A0A0A]">Font Pairing</div>
      <div className="space-y-2">
        <div className="flex items-center gap-3 rounded-lg border border-[#E5E5E5] bg-white p-2.5">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#F5F5F5] text-[16px] font-semibold text-[#0A0A0A]"
            style={{ fontFamily: activePreset.display }}
          >
            Aa
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[12px] font-medium text-[#0A0A0A]">Headings</div>
            <div className="truncate text-[10px] text-[#999999]" style={{ fontFamily: activePreset.display }}>
              {activePreset.display}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-[#E5E5E5] bg-white p-2.5">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#F5F5F5] text-[14px] text-[#0A0A0A]"
            style={{ fontFamily: activePreset.body }}
          >
            Aa
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[12px] font-medium text-[#0A0A0A]">Body</div>
            <div className="truncate text-[10px] text-[#999999]" style={{ fontFamily: activePreset.body }}>
              {activePreset.body}
            </div>
          </div>
        </div>
      </div>
      <div className="text-[13px] font-medium text-[#0A0A0A]">Presets</div>
      <div className="space-y-1.5">
        {FONT_PRESETS.map((preset) => {
          const active = activeFontId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => setFont(preset)}
              disabled={isPending}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg border bg-white p-2.5 text-left transition",
                active
                  ? "border-[#0A0A0A] ring-1 ring-[#0A0A0A]"
                  : "border-[#E5E5E5] hover:border-[#CCCCCC]"
              )}
            >
              <div
                className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[#F5F5F5] text-[14px] font-semibold"
                style={{ fontFamily: preset.display }}
              >
                Aa
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[12px] font-medium text-[#0A0A0A]">{preset.name}</div>
                <div className="truncate text-[10px] text-[#999999]">{preset.vibe}</div>
              </div>
              {active && (
                <div className="size-2 shrink-0 rounded-full bg-[#0A0A0A]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const ButtonsTab = ({
  buttonStyle,
  setButtonStyle,
  primary,
}: {
  buttonStyle: ButtonStyle;
  setButtonStyle: (style: ButtonStyle) => void;
  primary: string;
}) => {
  const getButtonStyles = (style: ButtonStyle) => {
    const base = {
      background: primary,
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      boxShadow: "none",
    };
    switch (style) {
      case "classic":
        return { ...base, border: `2px solid ${primary}` };
      case "brick":
        return { ...base, borderRadius: "0px", boxShadow: "4px 4px 0 rgba(0,0,0,0.8)" };
      case "bubble":
        return { ...base, borderRadius: "24px", background: `${primary}dd` };
      case "gradient":
        return { ...base, background: `linear-gradient(135deg, ${primary}, ${primary}99)` };
      case "soft":
        return { ...base, background: `${primary}20`, color: primary };
      case "ghost":
        return { ...base, background: "transparent", border: `2px solid ${primary}`, color: primary };
      case "solid":
        return base;
      default:
        return base;
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-[13px] font-medium text-[#0A0A0A]">Button Styles</div>
      <div className="grid grid-cols-2 gap-2">
        {BUTTON_STYLES.map((style) => {
          const active = buttonStyle === style.id;
          const btnStyles = getButtonStyles(style.id);
          return (
            <button
              key={style.id}
              onClick={() => setButtonStyle(style.id)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-lg border bg-white p-2.5 transition",
                active
                  ? "border-[#0A0A0A] ring-1 ring-[#0A0A0A]"
                  : "border-[#E5E5E5] hover:border-[#CCCCCC]"
              )}
            >
              <div
                className="flex h-9 w-full items-center justify-center rounded-md text-[12px] font-medium"
                style={btnStyles}
              >
                Button
              </div>
              <span className="text-[10px] text-[#666666]">{style.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const ImagesTab = ({
  imageStyle,
  setImageStyle,
}: {
  imageStyle: ImageStyle;
  setImageStyle: (style: ImageStyle) => void;
}) => {
  const getImageStyles = (style: ImageStyle) => {
    const base = { borderRadius: "8px", border: "none", boxShadow: "none", padding: "0" };
    switch (style) {
      case "none":
        return base;
      case "brick":
        return { ...base, borderRadius: "0", boxShadow: "4px 4px 0 rgba(0,0,0,0.8)" };
      case "light":
        return { ...base, borderRadius: "16px", border: "3px solid rgba(255,255,255,0.8)" };
      case "solid":
        return { ...base, border: "4px solid rgba(0,0,0,0.9)" };
      case "polaroid":
        return { ...base, padding: "8px 8px 24px", background: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" };
      case "shadow":
        return { ...base, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" };
      default:
        return base;
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-[13px] font-medium text-[#0A0A0A]">Image Styles</div>
      <div className="grid grid-cols-2 gap-2">
        {IMAGE_STYLES.map((style) => {
          const active = imageStyle === style.id;
          const imgStyles = getImageStyles(style.id);
          return (
            <button
              key={style.id}
              onClick={() => setImageStyle(style.id)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-lg border bg-white p-2.5 transition",
                active
                  ? "border-[#0A0A0A] ring-1 ring-[#0A0A0A]"
                  : "border-[#E5E5E5] hover:border-[#CCCCCC]"
              )}
            >
              <div className="aspect-[4/3] w-full overflow-hidden rounded-md bg-[#F5F5F5] p-1">
                <div
                  className="size-full bg-gradient-to-br from-[#E0E0E0] to-[#CCCCCC]"
                  style={imgStyles}
                />
              </div>
              <span className="text-[10px] text-[#666666]">{style.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const CardsTab = ({
  cardStyle,
  setCardStyle,
}: {
  cardStyle: CardStyle;
  setCardStyle: (style: CardStyle) => void;
}) => {
  const getCardStyles = (style: CardStyle) => {
    const base = { borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "none" };
    switch (style) {
      case "default":
        return base;
      case "brick":
        return { ...base, borderRadius: "0", boxShadow: "4px 4px 0 rgba(0,0,0,0.8)" };
      case "solid":
        return { ...base, border: "2px solid rgba(0,0,0,0.9)" };
      case "shadow":
        return { ...base, boxShadow: "0 8px 32px rgba(0,0,0,0.3)" };
      default:
        return base;
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-[13px] font-medium text-[#0A0A0A]">Card Styles</div>
      <div className="grid grid-cols-2 gap-2">
        {CARD_STYLES.map((style) => {
          const active = cardStyle === style.id;
          const cardStyles = getCardStyles(style.id);
          return (
            <button
              key={style.id}
              onClick={() => setCardStyle(style.id)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-lg border bg-white p-2.5 transition",
                active
                  ? "border-[#0A0A0A] ring-1 ring-[#0A0A0A]"
                  : "border-[#E5E5E5] hover:border-[#CCCCCC]"
              )}
            >
              <div className="relative aspect-[4/3] w-full rounded-md bg-[#F5F5F5] p-1">
                <div
                  className="absolute left-1.5 top-1.5 h-2/3 w-2/3 bg-[#E0E0E0]"
                  style={cardStyles}
                />
                <div
                  className="absolute bottom-1.5 right-1.5 h-2/3 w-2/3 bg-[#D0D0D0]"
                  style={cardStyles}
                />
              </div>
              <span className="text-[10px] text-[#666666]">{style.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const IconsTab = () => (
  <div className="space-y-4">
    <div className="text-[13px] font-medium text-[#0A0A0A]">Icon Style</div>
    <div className="flex items-center gap-3 rounded-lg border border-[#E5E5E5] bg-white p-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#F5F5F5]">
        <HugeiconsIcon icon={StarIcon} size={16} className="text-[#999999]" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[12px] font-medium text-[#0A0A0A]">Coming soon</div>
        <div className="text-[10px] text-[#999999]">Icon customization is in development</div>
      </div>
    </div>
  </div>
);

const RadiusTab = ({
  radius,
  buttonRadius,
  setRadius,
  setButtonRadius,
}: {
  radius: number;
  buttonRadius: number;
  setRadius: (r: number) => void;
  setButtonRadius: (r: number) => void;
}) => (
  <div className="space-y-4">
    <div className="text-[13px] font-medium text-[#0A0A0A]">Border Radius</div>
    <div className="space-y-2">
      <div className="rounded-lg border border-[#E5E5E5] bg-white p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[12px] font-medium text-[#0A0A0A]">Theme radius</span>
          <span className="rounded bg-[#F5F5F5] px-2 py-0.5 font-mono text-[10px] text-[#666666]">{radius}px</span>
        </div>
        <input
          type="range"
          min={0}
          max={32}
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="w-full cursor-pointer accent-[#0A0A0A]"
        />
      </div>
      <div className="rounded-lg border border-[#E5E5E5] bg-white p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[12px] font-medium text-[#0A0A0A]">Button radius</span>
          <span className="rounded bg-[#F5F5F5] px-2 py-0.5 font-mono text-[10px] text-[#666666]">{buttonRadius}px</span>
        </div>
        <input
          type="range"
          min={0}
          max={32}
          value={buttonRadius}
          onChange={(e) => setButtonRadius(Number(e.target.value))}
          className="w-full cursor-pointer accent-[#0A0A0A]"
        />
      </div>
    </div>
  </div>
);
