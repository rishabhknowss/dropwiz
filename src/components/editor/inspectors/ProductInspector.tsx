import type { StoreSection } from "@/db/schema";
import type { ProductData } from "@/types/store-sections";
import { ImagePickerField, NumberField, TextField } from "./fields";

type Commit = (data: Record<string, unknown>) => void;

export const ProductInspector = ({
  section,
  storeId,
  onCommit,
}: {
  section: StoreSection;
  storeId: string;
  onCommit: Commit;
}) => {
  const data = section.data as ProductData;
  return (
    <div className="space-y-3">
      <TextField
        label="Product title"
        defaultValue={data.title ?? ""}
        onCommit={(v) => onCommit({ title: v })}
      />
      <div className="grid grid-cols-2 gap-2">
        <NumberField
          label="Price (cents)"
          defaultValue={data.priceCents ?? 0}
          onCommit={(v) => onCommit({ priceCents: v })}
        />
        <TextField
          label="Currency"
          defaultValue={data.currency ?? "USD"}
          onCommit={(v) => onCommit({ currency: v })}
        />
      </div>
      <ImagePickerField
        label="Product image"
        storeId={storeId}
        kind="product"
        currentUrl={data.imageUrl}
        promptSeed={`Clean product shot of ${data.title ?? "the item"}, isolated on seamless background, studio lighting`}
        onPick={(url) => onCommit({ imageUrl: url })}
      />
    </div>
  );
};
