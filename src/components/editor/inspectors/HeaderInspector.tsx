import type { StoreSection } from "@/db/schema";
import type { HeaderData } from "@/types/store-sections";
import { CheckboxField, ImagePickerField, TextField } from "./fields";

type Commit = (data: Record<string, unknown>) => void;

export const HeaderInspector = ({
  section,
  storeId,
  onCommit,
}: {
  section: StoreSection;
  storeId: string;
  onCommit: Commit;
}) => {
  const data = section.data as HeaderData;
  return (
    <div className="space-y-3">
      <TextField
        label="Store name"
        defaultValue={data.storeName ?? ""}
        onCommit={(v) => onCommit({ storeName: v })}
      />
      <ImagePickerField
        label="Logo"
        storeId={storeId}
        kind="logo"
        currentUrl={data.logoUrl}
        promptSeed="Minimal modern logo design, clean typography, white background"
        onPick={(url) => onCommit({ logoUrl: url })}
      />
      <CheckboxField
        label="Show name with logo"
        defaultChecked={data.showNameWithLogo === true}
        onCommit={(v) => onCommit({ showNameWithLogo: v })}
      />
      <CheckboxField
        label="Show cart icon"
        defaultChecked={data.showCartIcon !== false}
        onCommit={(v) => onCommit({ showCartIcon: v })}
      />
    </div>
  );
};
