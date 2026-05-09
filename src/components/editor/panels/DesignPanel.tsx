import { useMemo, useState } from "react";
import type { ThemeTokens, ButtonStyle, ImageStyle, CardStyle } from "@/db/schema";
import { api } from "@/utils/api";
import { runSilent, runWithToast } from "@/hooks/useToastMutation";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { FONT_PRESETS, type FontPreset } from "@/lib/font-presets";
import { cn } from "@/lib/utils";

type DesignTab = "colors" | "typography" | "buttons" | "images" | "cards" | "icons" | "radius";

const TABS: Array<{ id: DesignTab; label: string; icon: string }> = [
  { id: "colors", label: "Colors", icon: "≡" },
  { id: "typography", label: "Typography", icon: "Aa" },
  { id: "buttons", label: "Buttons", icon: "▢" },
  { id: "images", label: "Images", icon: "⬚" },
  { id: "cards", label: "Cards", icon: "▣" },
  { id: "icons", label: "Icons", icon: "☆" },
  { id: "radius", label: "Border Radius", icon: "◼" },
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
        <div className="flex w-[140px] shrink-0 flex-col gap-1 border-r border-[color:var(--dw-border)] p-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[13px] transition",
                activeTab === tab.id
                  ? "bg-[color:var(--dw-surface2)] text-[color:var(--dw-text)]"
                  : "text-[color:var(--dw-text-muted)] hover:bg-[color:var(--dw-surface2)]/50"
              )}
            >
              <span className="w-5 text-center text-[14px] opacity-60">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
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
      <div className="text-[15px] font-medium">Color Palette</div>
      <div className="space-y-3">
        <ColorPaletteButton
          label="Primary"
          color={primary}
          onChange={(v) => setColor("primary", v)}
          variant="primary"
        />
        <ColorPaletteButton
          label="Secondary"
          color={secondary}
          onChange={(v) => setColor("secondary", v)}
          variant="secondary"
        />
        <ColorPaletteButton
          label="Accent"
          color={accent}
          onChange={(v) => setColor("accent", v)}
          variant="accent"
        />
      </div>
    </div>
  );
};

const ColorPaletteButton = ({
  label,
  color,
  onChange,
  variant,
}: {
  label: string;
  color: string;
  onChange: (v: string) => void;
  variant: "primary" | "secondary" | "accent";
}) => {
  const bgColor = variant === "primary" ? color : variant === "secondary" ? color : "#f5f5f5";
  const textColor = variant === "accent" ? "rgba(0,0,0,0.4)" : "#fff";

  return (
    <div
      className="relative flex h-14 cursor-pointer items-center rounded-xl px-4 transition hover:opacity-90"
      style={{ background: bgColor }}
    >
      <span className="text-[14px] font-medium" style={{ color: textColor }}>
        {label}
      </span>
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
    </div>
  );
};

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
      <div className="text-[15px] font-medium">Fonts</div>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="w-16 text-[13px] text-[color:var(--dw-text-muted)]">Titles</span>
          <div className="flex flex-1 items-center gap-2">
            <div
              className="flex-1 rounded-lg bg-[color:var(--dw-surface2)] px-4 py-3 text-[14px]"
              style={{ fontFamily: activePreset.display }}
            >
              {activePreset.display}
            </div>
            <div
              className="flex h-11 w-11 items-center justify-center rounded-lg bg-[color:var(--dw-surface2)] text-[14px] font-semibold"
              style={{ fontFamily: activePreset.display }}
            >
              AA
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-16 text-[13px] text-[color:var(--dw-text-muted)]">Content</span>
          <div
            className="flex-1 rounded-lg bg-[color:var(--dw-surface2)] px-4 py-3 text-[14px]"
            style={{ fontFamily: activePreset.body }}
          >
            {activePreset.body}
          </div>
        </div>
      </div>
      <div className="h-px bg-[color:var(--dw-border)]" />
      <div className="space-y-1.5">
        {FONT_PRESETS.map((preset) => {
          const active = activeFontId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => setFont(preset)}
              disabled={isPending}
              className={cn(
                "flex w-full cursor-pointer items-center gap-3 rounded-[10px] border p-2.5 text-left transition",
                active
                  ? "border-[color:var(--dw-accent)] bg-[color:var(--dw-surface2)]"
                  : "border-[color:var(--dw-border)] hover:border-[color:var(--dw-accent)]/40"
              )}
            >
              <div
                className="w-10 shrink-0 text-[20px] font-semibold leading-none"
                style={{ fontFamily: preset.display }}
              >
                Aa
              </div>
              <div className="flex-1 overflow-hidden">
                <div
                  className="text-[13px] font-medium"
                  style={{ fontFamily: preset.display }}
                >
                  {preset.name}
                </div>
                <div className="dw-mono truncate text-[10px] text-[color:var(--dw-text-muted)]">
                  {preset.vibe}
                </div>
              </div>
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
      <div className="text-[15px] font-medium">Styles</div>
      <div className="space-y-2">
        {BUTTON_STYLES.map((style) => {
          const active = buttonStyle === style.id;
          const btnStyles = getButtonStyles(style.id);
          return (
            <button
              key={style.id}
              onClick={() => setButtonStyle(style.id)}
              className={cn(
                "w-full rounded-xl border-2 p-1 transition",
                active ? "border-white" : "border-transparent"
              )}
            >
              <div
                className="flex h-12 items-center justify-center rounded-lg text-[14px] font-medium transition"
                style={btnStyles}
              >
                {style.label}
              </div>
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
      <div className="text-[15px] font-medium">Styles</div>
      <div className="grid grid-cols-2 gap-3">
        {IMAGE_STYLES.map((style) => {
          const active = imageStyle === style.id;
          const imgStyles = getImageStyles(style.id);
          return (
            <button
              key={style.id}
              onClick={() => setImageStyle(style.id)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition",
                active ? "border-white" : "border-transparent hover:border-[color:var(--dw-border)]"
              )}
            >
              <div
                className="aspect-[4/3] w-full overflow-hidden bg-[#9ca3af]"
                style={imgStyles}
              >
                <div className="h-full w-full bg-gradient-to-br from-[#d1d5db] to-[#9ca3af]" />
              </div>
              <span className="text-[12px] text-[color:var(--dw-text-muted)]">{style.label}</span>
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
      <div className="text-[15px] font-medium">Styles</div>
      <div className="grid grid-cols-2 gap-3">
        {CARD_STYLES.map((style) => {
          const active = cardStyle === style.id;
          const cardStyles = getCardStyles(style.id);
          return (
            <button
              key={style.id}
              onClick={() => setCardStyle(style.id)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition",
                active ? "border-white" : "border-transparent hover:border-[color:var(--dw-border)]"
              )}
            >
              <div className="relative aspect-[4/3] w-full">
                <div
                  className="absolute left-0 top-0 h-3/4 w-3/4 bg-[#6b7280]"
                  style={cardStyles}
                />
                <div
                  className="absolute bottom-0 right-0 h-3/4 w-3/4 bg-[#9ca3af]"
                  style={cardStyles}
                />
              </div>
              <span className="text-[12px] text-[color:var(--dw-text-muted)]">{style.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const IconsTab = () => (
  <div className="space-y-4">
    <div className="text-[15px] font-medium">Icon Style</div>
    <div className="text-[13px] text-[color:var(--dw-text-muted)]">
      Icon customization coming soon
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
    <div className="text-[15px] font-medium">Rounded corners</div>
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-lg bg-[color:var(--dw-surface2)] px-4 py-3">
        <span className="text-[14px]">Theme radius</span>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={32}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-24 cursor-pointer accent-[color:var(--dw-accent)]"
          />
          <span className="w-6 text-right text-[14px] text-[color:var(--dw-text-muted)]">{radius}</span>
        </div>
      </div>
      <div className="flex items-center justify-between rounded-lg bg-[color:var(--dw-surface2)] px-4 py-3">
        <span className="text-[14px]">Button radius</span>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={32}
            value={buttonRadius}
            onChange={(e) => setButtonRadius(Number(e.target.value))}
            className="w-24 cursor-pointer accent-[color:var(--dw-accent)]"
          />
          <span className="w-6 text-right text-[14px] text-[color:var(--dw-text-muted)]">{buttonRadius}</span>
        </div>
      </div>
    </div>
  </div>
);
