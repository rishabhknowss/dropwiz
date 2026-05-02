import { useState } from "react";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { RefreshIcon, LanguageSkillIcon, DollarCircleIcon } from "@hugeicons/core-free-icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { runWithToast } from "@/hooks/useToastMutation";
import { getErrorMessage } from "@/lib/trpc-errors";
import { Panel } from "./shared/Panel";
import { LabeledField } from "./shared/LabeledField";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "it", label: "Italian" },
  { code: "pt", label: "Portuguese" },
  { code: "nl", label: "Dutch" },
  { code: "pl", label: "Polish" },
  { code: "ja", label: "Japanese" },
  { code: "ko", label: "Korean" },
  { code: "zh", label: "Chinese" },
  { code: "ar", label: "Arabic" },
  { code: "hi", label: "Hindi" },
  { code: "ru", label: "Russian" },
];

const CURRENCIES = [
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "CAD", symbol: "C$", label: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", label: "Australian Dollar" },
  { code: "JPY", symbol: "¥", label: "Japanese Yen" },
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
  { code: "CNY", symbol: "¥", label: "Chinese Yuan" },
  { code: "BRL", symbol: "R$", label: "Brazilian Real" },
  { code: "MXN", symbol: "$", label: "Mexican Peso" },
];

const ANGLES = [
  { id: "problem-solution", label: "Problem-Solution" },
  { id: "transformation", label: "Transformation" },
  { id: "social-proof", label: "Social Proof" },
  { id: "urgency", label: "Urgency/Scarcity" },
  { id: "lifestyle", label: "Lifestyle" },
  { id: "value", label: "Value/Savings" },
  { id: "authority", label: "Authority/Expert" },
  { id: "emotional", label: "Emotional Appeal" },
];

export const StrategyPanel = ({ storeId }: { storeId: string }) => {
  const store = api.stores.getMine.useQuery({ storeId });
  if (!store.data) return null;
  const key = `${store.data.id}-${store.data.updatedAt.toISOString()}`;
  return <Form key={key} storeId={storeId} data={store.data} />;
};

type FormData = {
  name: string | null;
  persona: string | null;
  angle: string | null;
  targetLanguage: string;
  currency: string;
};

const Form = ({ storeId, data }: { storeId: string; data: FormData }) => {
  const utils = api.useUtils();
  const update = api.stores.updateStrategy.useMutation();
  const regen = api.stores.regenerateSection.useMutation();
  const [name, setName] = useState(data.name ?? "");
  const [persona, setPersona] = useState(data.persona ?? "");
  const [angle, setAngle] = useState(data.angle ?? "problem-solution");
  const [language, setLanguage] = useState(data.targetLanguage ?? "en");
  const [currency, setCurrency] = useState(data.currency ?? "USD");
  const [regenerating, setRegenerating] = useState(false);

  const invalidate = () => utils.stores.getMine.invalidate({ storeId });

  const handleSave = () =>
    runWithToast(
      update,
      { storeId, name, persona, angle, targetLanguage: language, currency },
      { loading: "Saving strategy...", success: "Saved", onSuccess: invalidate },
    );

  const handleRegenerateAll = async () => {
    setRegenerating(true);
    const id = toast.loading("Regenerating all copy...");
    try {
      const latest = await utils.stores.getMine.fetch({ storeId });
      const targets = latest.sections.filter((s) =>
        ["hero", "bundles", "faq"].includes(s.type),
      );
      for (const s of targets) {
        await regen.mutateAsync({ storeId, sectionId: s.id });
      }
      toast.success("All copy regenerated", { id });
      invalidate();
    } catch (err) {
      toast.error(
        getErrorMessage(err as Parameters<typeof getErrorMessage>[0]),
        { id },
      );
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <Panel title="Strategy">
      <LabeledField label="Store name">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-9 bg-[color:var(--dw-surface)] text-[13px]"
        />
      </LabeledField>

      <LabeledField label="Target persona">
        <textarea
          value={persona}
          onChange={(e) => setPersona(e.target.value)}
          placeholder="e.g., Health-conscious millennials looking for natural supplements"
          rows={2}
          className="w-full rounded-[8px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-2.5 text-[13px] placeholder:text-[color:var(--dw-text-muted)]"
        />
      </LabeledField>

      <LabeledField label="Marketing angle">
        <div className="grid grid-cols-2 gap-1.5">
          {ANGLES.map((a) => (
            <button
              key={a.id}
              onClick={() => setAngle(a.id)}
              className={cn(
                "rounded-lg border px-2.5 py-2 text-[11px] font-medium transition",
                angle === a.id
                  ? "border-[color:var(--dw-accent)] bg-[color:var(--dw-accent)]/10 text-[color:var(--dw-accent)]"
                  : "border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] text-[color:var(--dw-text-dim)] hover:border-[color:var(--dw-accent)]/30"
              )}
            >
              {a.label}
            </button>
          ))}
        </div>
      </LabeledField>

      <div className="grid grid-cols-2 gap-3">
        <LabeledField label="Language" icon={LanguageSkillIcon}>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="h-9 w-full rounded-[8px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] px-2.5 text-[13px] text-[color:var(--dw-text)] outline-none"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </LabeledField>

        <LabeledField label="Currency" icon={DollarCircleIcon}>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="h-9 w-full rounded-[8px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] px-2.5 text-[13px] text-[color:var(--dw-text)] outline-none"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.symbol} {c.code}
              </option>
            ))}
          </select>
        </LabeledField>
      </div>

      <div className="pt-2">
        <Button onClick={handleSave} disabled={update.isPending} className="w-full">
          {update.isPending ? "Saving..." : "Save strategy"}
        </Button>
      </div>

      <Button
        variant="outline"
        className="w-full gap-1.5"
        onClick={handleRegenerateAll}
        disabled={regenerating}
      >
        <HugeiconsIcon
          icon={RefreshIcon}
          size={12}
          className={regenerating ? "animate-spin" : ""}
        />
        {regenerating ? "Regenerating..." : "Regenerate all copy"}
      </Button>
    </Panel>
  );
};
