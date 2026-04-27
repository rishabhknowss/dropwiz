import { useState } from "react";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { RefreshIcon } from "@hugeicons/core-free-icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { runWithToast } from "@/hooks/useToastMutation";
import { getErrorMessage } from "@/lib/trpc-errors";
import { Panel } from "./shared/Panel";
import { LabeledField } from "./shared/LabeledField";

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
};

const Form = ({ storeId, data }: { storeId: string; data: FormData }) => {
  const utils = api.useUtils();
  const update = api.stores.updateStrategy.useMutation();
  const regen = api.stores.regenerateSection.useMutation();
  const [name, setName] = useState(data.name ?? "");
  const [persona, setPersona] = useState(data.persona ?? "");
  const [angle, setAngle] = useState(data.angle ?? "");
  const [regenerating, setRegenerating] = useState(false);

  const invalidate = () => utils.stores.getMine.invalidate({ storeId });

  const handleSave = () =>
    runWithToast(
      update,
      { storeId, name, persona, angle },
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
          rows={3}
          className="w-full rounded-[8px] border border-[color:var(--dw-border)] bg-[color:var(--dw-surface)] p-2.5 text-[13px]"
        />
      </LabeledField>
      <LabeledField label="Marketing angle">
        <Input
          value={angle}
          onChange={(e) => setAngle(e.target.value)}
          className="h-9 bg-[color:var(--dw-surface)] text-[13px]"
        />
      </LabeledField>
      <Button onClick={handleSave} disabled={update.isPending} className="w-full">
        {update.isPending ? "Saving..." : "Save strategy"}
      </Button>
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
