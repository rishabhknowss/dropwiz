import { useMemo, useState } from "react";
import type { ThemeTokens } from "@/db/schema";
import { api } from "@/utils/api";
import { runSilent, runWithToast } from "@/hooks/useToastMutation";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";
import { FONT_PRESETS, type FontPreset } from "@/lib/font-presets";
import { Panel } from "./shared/Panel";
import { Label } from "@/components/ui/label";

type ButtonShape = NonNullable<NonNullable<ThemeTokens["buttons"]>["shape"]>;

const BUTTON_SHAPES: ButtonShape[] = ["sharp", "rounded", "pill"];

const COLOR_ROLES: Array<{
  key: keyof NonNullable<ThemeTokens["colors"]>;
  label: string;
}> = [
  { key: "background", label: "Background" },
  { key: "text", label: "Text" },
  { key: "primary", label: "Primary" },
  { key: "accent", label: "Accent" },
];

export const DesignPanel = ({ storeId }: { storeId: string }) => {
  const store = api.stores.getMine.useQuery({ storeId });
  if (!store.data) return null;
  const key = `${store.data.id}-${store.data.updatedAt.toISOString()}`;
  return (
    <DesignForm
      key={key}
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

  const invalidate = () => utils.stores.getMine.invalidate({ storeId });

  const pushSilent = useDebouncedCallback((next: ThemeTokens) => {
    runSilent(
      update,
      { storeId, themeTokens: next as Record<string, unknown> },
      { onSuccess: invalidate },
    );
  }, 300);

  const pushWithToast = (next: ThemeTokens, label: string) =>
    runWithToast(
      update,
      { storeId, themeTokens: next as Record<string, unknown> },
      {
        loading: `${label}...`,
        success: label,
        onSuccess: invalidate,
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
    pushSilent(next);
  };

  const setRadius = (radius: number) => {
    const next: ThemeTokens = { ...tokens, radius };
    setTokens(next);
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
    pushWithToast(next, `${preset.name} applied`);
  };

  const setButtonShape = (shape: ButtonShape) => {
    const next: ThemeTokens = {
      ...tokens,
      buttons: { ...(tokens.buttons ?? {}), shape },
    };
    setTokens(next);
    pushWithToast(next, `${shape} buttons`);
  };

  const radius = tokens.radius ?? 12;
  const buttonShape: ButtonShape = tokens.buttons?.shape ?? "rounded";

  return (
    <Panel title="Design">
      <Section label="Colors">
        <div className="grid grid-cols-2 gap-3">
          {COLOR_ROLES.map((role) => (
            <ColorSwatch
              key={role.key}
              label={role.label}
              value={tokens.colors?.[role.key] ?? ""}
              onChange={(v) => setColor(role.key, v)}
            />
          ))}
        </div>
      </Section>

      <Section label="Typography">
        <div className="space-y-1.5">
          {FONT_PRESETS.map((preset) => {
            const active = activeFontId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => setFont(preset)}
                disabled={update.isPending}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-[10px] border p-2.5 text-left transition ${
                  active
                    ? "border-[color:var(--dw-accent)] bg-[color:var(--dw-surface2)]"
                    : "border-[color:var(--dw-border)] hover:border-[color:var(--dw-accent)]/40"
                }`}
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
      </Section>

      <Section label={`Radius · ${radius}px`}>
        <input
          type="range"
          min={0}
          max={32}
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="w-full cursor-pointer accent-[color:var(--dw-accent)]"
        />
      </Section>

      <Section label="Button shape">
        <div className="grid grid-cols-3 gap-2">
          {BUTTON_SHAPES.map((shape) => {
            const active = buttonShape === shape;
            const demoRadius =
              shape === "sharp" ? 0 : shape === "pill" ? 999 : 8;
            return (
              <button
                key={shape}
                onClick={() => setButtonShape(shape)}
                className={`flex cursor-pointer flex-col items-center gap-2 rounded-[10px] border py-3 transition ${
                  active
                    ? "border-[color:var(--dw-accent)] bg-[color:var(--dw-surface2)]"
                    : "border-[color:var(--dw-border)] hover:border-[color:var(--dw-accent)]/40"
                }`}
              >
                <div
                  className="h-5 w-12 bg-[color:var(--dw-text)]"
                  style={{ borderRadius: demoRadius }}
                />
                <span className="text-[11px] capitalize">{shape}</span>
              </button>
            );
          })}
        </div>
      </Section>
    </Panel>
  );
};

const Section = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <div className="dw-mono mb-2 text-[10px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
      {label}
    </div>
    {children}
  </div>
);

const ColorSwatch = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => {
  const [local, setLocal] = useState(value);
  const [lastProp, setLastProp] = useState(value);
  if (value !== lastProp) {
    setLocal(value);
    setLastProp(value);
  }

  const handleText = (v: string) => {
    setLocal(v);
    if (/^#[0-9a-fA-F]{6}$/.test(v)) onChange(v);
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] text-[color:var(--dw-text-dim)]">
        {label}
      </Label>
      <div className="flex items-center gap-2 rounded-[10px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-1.5">
        <div className="relative size-7 overflow-hidden rounded-md border border-[color:var(--dw-border)]">
          <input
            type="color"
            value={local || "#ffffff"}
            onChange={(e) => {
              setLocal(e.target.value);
              onChange(e.target.value);
            }}
            className="absolute inset-0 h-full w-full cursor-pointer"
          />
        </div>
        <input
          type="text"
          value={local}
          onChange={(e) => handleText(e.target.value)}
          className="dw-mono w-full bg-transparent text-[11px] uppercase tracking-[0.06em] outline-none"
        />
      </div>
    </div>
  );
};
