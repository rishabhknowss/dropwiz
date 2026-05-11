import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon, Delete01Icon, SparklesIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import type { StoreSection } from "@/db/schema";
import type { ProductData, ProductVariant, ProductSideFeature } from "@/types/store-sections";
import { ImagePickerField, NumberField, TextField, VariantPicker, CheckboxField, IconPickerField } from "./fields";
import { PaymentStatus } from "./PaymentStatus";
import { api } from "@/utils/api";
import { toast } from "sonner";

type Commit = (data: Record<string, unknown>) => void;

const VARIANT_OPTIONS: { id: ProductVariant; label: string }[] = [
  { id: "default", label: "Default" },
  { id: "gallery", label: "Gallery" },
  { id: "compact", label: "Compact" },
  { id: "rich", label: "Rich" },
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
  const sideFeatures = data.sideFeatures ?? [];
  const galleryImages = data.galleryImages ?? [];
  const isRichVariant = data.variant === "rich";
  const [isGenerating, setIsGenerating] = useState(false);

  const generateFeaturesMutation = api.stores.generateFeatureCardsForSection.useMutation();

  const setSideFeatures = (next: ProductSideFeature[]) => onCommit({ sideFeatures: next });
  const setGalleryImages = (next: string[]) => onCommit({ galleryImages: next });

  const handleGenerateFeatures = () => {
    setIsGenerating(true);
    const toastId = toast.loading("Generating feature cards...");
    generateFeaturesMutation.mutate(
      { storeId, count: 4 },
      {
        onSuccess: (result) => {
          setSideFeatures(result.features);
          toast.success("Feature cards generated", { id: toastId });
          setIsGenerating(false);
        },
        onError: (error) => {
          toast.error(error.message, { id: toastId });
          setIsGenerating(false);
        },
      }
    );
  };

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
        onPick={(url) => {
          const currentImages = (data.images as string[] | undefined) ?? [];
          const filtered = currentImages.filter((img) => img !== url);
          onCommit({ imageUrl: url, images: [url, ...filtered] });
        }}
      />
      <CheckboxField
        label="Show payment badges"
        defaultChecked={data.showPaymentBadges !== false}
        onCommit={(v) => onCommit({ showPaymentBadges: v })}
      />
      {data.showPaymentBadges !== false && (
        <PaymentStatus storeId={storeId} />
      )}

      {isRichVariant && (
        <>
          <div className="h-px bg-[color:var(--dw-border)]" />
          <div className="space-y-2">
            <div className="text-[11px] text-[color:var(--dw-text-dim)]">
              Side Feature Cards
            </div>
            {sideFeatures.map((feat, i) => (
              <div
                key={i}
                className="space-y-1.5 rounded-[10px] border border-[color:var(--dw-border)] p-2"
              >
                <div className="flex items-center justify-between">
                  <div className="dw-mono text-[10px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
                    Feature {i + 1}
                  </div>
                  <button
                    onClick={() => setSideFeatures(sideFeatures.filter((_, idx) => idx !== i))}
                    className="flex size-6 items-center justify-center rounded-md text-[color:var(--dw-text-muted)] hover:bg-[color:var(--dw-signal)]/10 hover:text-[color:var(--dw-signal)]"
                    aria-label="Remove feature"
                  >
                    <HugeiconsIcon icon={Delete01Icon} size={11} />
                  </button>
                </div>
                <IconPickerField
                  label="Icon"
                  value={feat.icon}
                  onCommit={(v) => {
                    const next = [...sideFeatures];
                    next[i] = { ...next[i], icon: v };
                    setSideFeatures(next);
                  }}
                />
                <TextField
                  label="Label"
                  defaultValue={feat.label}
                  onCommit={(v) => {
                    const next = [...sideFeatures];
                    next[i] = { ...next[i], label: v };
                    setSideFeatures(next);
                  }}
                />
              </div>
            ))}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5"
                onClick={() => setSideFeatures([...sideFeatures, { icon: "ZapIcon", label: "Feature" }])}
              >
                <HugeiconsIcon icon={PlusSignIcon} size={11} />
                Add
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5"
                onClick={handleGenerateFeatures}
                disabled={isGenerating}
              >
                <HugeiconsIcon icon={SparklesIcon} size={11} />
                {isGenerating ? "Generating..." : "Generate AI"}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] text-[color:var(--dw-text-dim)]">
              Gallery Images (below product)
            </div>
            {galleryImages.map((img, i) => (
              <div key={i} className="flex items-center gap-2">
                <ImagePickerField
                  label=""
                  storeId={storeId}
                  kind="product"
                  currentUrl={img}
                  promptSeed={`Product gallery image for "${data.title ?? "product"}"`}
                  onPick={(url) => {
                    const next = [...galleryImages];
                    next[i] = url;
                    setGalleryImages(next);
                  }}
                />
                <button
                  onClick={() => setGalleryImages(galleryImages.filter((_, idx) => idx !== i))}
                  className="flex size-6 shrink-0 items-center justify-center rounded-md text-[color:var(--dw-text-muted)] hover:bg-[color:var(--dw-signal)]/10 hover:text-[color:var(--dw-signal)]"
                  aria-label="Remove image"
                >
                  <HugeiconsIcon icon={Delete01Icon} size={11} />
                </button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1.5"
              onClick={() => setGalleryImages([...galleryImages, ""])}
            >
              <HugeiconsIcon icon={PlusSignIcon} size={11} />
              Add gallery image
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
