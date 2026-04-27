import { useState } from "react";
import { api } from "@/utils/api";
import { runWithToast } from "@/hooks/useToastMutation";
import { STORE_TEMPLATES, type StoreTemplate } from "@/lib/store-templates";
import { Panel } from "./shared/Panel";

export const TemplatesPanel = ({ storeId }: { storeId: string }) => {
  const utils = api.useUtils();
  const apply = api.stores.applyTemplate.useMutation();
  const [includeLayout, setIncludeLayout] = useState(true);

  const applyTemplate = (tpl: StoreTemplate) =>
    runWithToast(
      apply,
      {
        storeId,
        themeTokens: tpl.tokens as Record<string, unknown>,
        layout: includeLayout ? tpl.layout : undefined,
      },
      {
        loading: `Applying ${tpl.name}...`,
        success: `Applied ${tpl.name}`,
        onSuccess: () => utils.stores.getMine.invalidate({ storeId }),
      },
    );

  return (
    <Panel title="Templates">
      <label className="flex cursor-pointer items-start gap-2.5 rounded-[10px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-3">
        <input
          type="checkbox"
          checked={includeLayout}
          onChange={(e) => setIncludeLayout(e.target.checked)}
          className="mt-0.5"
        />
        <div className="flex-1">
          <div className="text-[12px] font-medium">Also swap section layout</div>
          <div className="mt-0.5 text-[11px] text-[color:var(--dw-text-muted)]">
            Adds/removes sections to match the template. Your content is kept where
            sections already exist.
          </div>
        </div>
      </label>

      <div className="grid grid-cols-1 gap-2.5">
        {STORE_TEMPLATES.map((tpl) => (
          <TemplateCard
            key={tpl.id}
            template={tpl}
            onApply={() => applyTemplate(tpl)}
            disabled={apply.isPending}
          />
        ))}
      </div>
    </Panel>
  );
};

const TemplateCard = ({
  template,
  onApply,
  disabled,
}: {
  template: StoreTemplate;
  onApply: () => void;
  disabled: boolean;
}) => (
  <button
    onClick={onApply}
    disabled={disabled}
    className="group flex cursor-pointer items-center gap-3 overflow-hidden rounded-[12px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-3 text-left transition hover:border-[color:var(--dw-accent)]/50 disabled:opacity-60"
  >
    <div
      className="flex h-16 w-20 shrink-0 items-center justify-center rounded-md"
      style={{ background: template.preview.bg }}
    >
      <div
        className="text-[18px] font-semibold"
        style={{
          color: template.preview.primary,
          fontFamily: template.tokens.typography?.display,
        }}
      >
        Aa
      </div>
      <div
        className="ml-2 size-3 rounded-sm"
        style={{ background: template.preview.accent }}
      />
    </div>
    <div className="flex-1 overflow-hidden">
      <div className="text-[13px] font-medium">{template.name}</div>
      <div className="mt-0.5 truncate text-[11px] text-[color:var(--dw-text-muted)]">
        {template.vibe}
      </div>
      <div className="dw-mono mt-1 truncate text-[10px] tracking-[0.06em] text-[color:var(--dw-text-muted)]">
        {template.layout.length} sections · {template.tokens.typography?.display}
      </div>
    </div>
  </button>
);
