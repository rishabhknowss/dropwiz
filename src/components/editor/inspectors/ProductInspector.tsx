import type { StoreSection } from "@/db/schema";
import type { ProductData, ProductVariant } from "@/types/store-sections";
import { ImagePickerField, NumberField, TextField, VariantPicker } from "./fields";

type Commit = (data: Record<string, unknown>) => void;

const VARIANT_OPTIONS: { id: ProductVariant; label: string }[] = [
  { id: "default", label: "Default" },
  { id: "gallery", label: "Gallery" },
  { id: "compact", label: "Compact" },
];

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
      <VariantPicker
        label="Layout variant"
        value={data.variant ?? "default"}
        options={VARIANT_OPTIONS}
        onChange={(v) => onCommit({ variant: v })}
      />
      <TextField
        label="Product title"
        defaultValue={data.title ?? ""}
        onCommit={(v) => onCommit({ title: v })}
      />
      <TextField
        label="Subtitle"
        defaultValue={data.subtitle ?? ""}
        onCommit={(v) => onCommit({ subtitle: v || null })}
      />
      <TextField
        label="Description"
        defaultValue={data.description ?? ""}
        onCommit={(v) => onCommit({ description: v || null })}
        multiline
      />
      <div className="grid grid-cols-2 gap-2">
        <NumberField
          label="Price (cents)"
          defaultValue={data.priceCents ?? 0}
          onCommit={(v) => onCommit({ priceCents: v })}
        />
        <NumberField
          label="Compare at (cents)"
          defaultValue={data.originalPriceCents ?? 0}
          onCommit={(v) => onCommit({ originalPriceCents: v || null })}
        />
      </div>
      <TextField
        label="Currency"
        defaultValue={data.currency ?? "USD"}
        onCommit={(v) => onCommit({ currency: v })}
      />
      <TextField
        label="Badge"
        defaultValue={data.badge ?? ""}
        onCommit={(v) => onCommit({ badge: v || null })}
      />
      <div className="grid grid-cols-2 gap-2">
        <NumberField
          label="Rating (1-5)"
          defaultValue={data.rating ?? 0}
          onCommit={(v) => onCommit({ rating: v || null })}
        />
        <NumberField
          label="Review count"
          defaultValue={data.reviewCount ?? 0}
          onCommit={(v) => onCommit({ reviewCount: v || null })}
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
