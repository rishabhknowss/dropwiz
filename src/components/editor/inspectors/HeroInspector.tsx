import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon, Delete01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import type { StoreSection } from "@/db/schema";
import type { HeroData, HeroNavLink, HeroVariant, FeatureBadge, HeroBundle } from "@/types/store-sections";
import { ImagePickerField, NumberField, TextField } from "./fields";

type Commit = (data: Record<string, unknown>) => void;

const VARIANTS: Array<{ id: HeroVariant; label: string; desc: string }> = [
  { id: "split", label: "Split", desc: "Text left, image right" },
  { id: "centered", label: "Centered", desc: "Text above image" },
  { id: "full-bleed", label: "Full image", desc: "BG image + navbar + CTA" },
  { id: "minimal", label: "Minimal", desc: "Tight grid, image below" },
  { id: "magazine", label: "Magazine", desc: "Editorial cover with hero photo" },
  { id: "product-hero", label: "Product", desc: "Product showcase with bundles" },
];

export const HeroInspector = ({
  section,
  storeId,
  onCommit,
}: {
  section: StoreSection;
  storeId: string;
  onCommit: Commit;
}) => {
  const data = section.data as HeroData;
  const variant: HeroVariant = data.variant ?? "split";
  const isFullBleed = variant === "full-bleed";
  const isProductHero = variant === "product-hero";
  const navLinks = data.navLinks ?? [];
  const sideFeatures = data.sideFeatures ?? [];
  const bundles = data.bundles ?? [];

  const setLinks = (next: HeroNavLink[]) => onCommit({ navLinks: next });
  const setSideFeatures = (next: FeatureBadge[]) => onCommit({ sideFeatures: next });
  const setBundles = (next: HeroBundle[]) => onCommit({ bundles: next });

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <div className="text-[11px] text-[color:var(--dw-text-dim)]">Layout</div>
        <div className="grid grid-cols-3 gap-1.5">
          {VARIANTS.map((v) => {
            const active = variant === v.id;
            return (
              <button
                key={v.id}
                onClick={() => onCommit({ variant: v.id })}
                title={v.desc}
                className={`rounded-[8px] border p-2 text-[11px] font-medium transition ${
                  active
                    ? "border-[color:var(--dw-accent)] bg-[color:var(--dw-surface2)] text-[color:var(--dw-text)]"
                    : "border-[color:var(--dw-border)] text-[color:var(--dw-text-muted)] hover:border-[color:var(--dw-accent)]/40"
                }`}
              >
                {v.label}
              </button>
            );
          })}
        </div>
        <div className="dw-mono text-[10px] tracking-[0.1em] uppercase text-[color:var(--dw-text-muted)]">
          {VARIANTS.find((v) => v.id === variant)?.desc}
        </div>
      </div>

      <TextField
        label="Headline"
        defaultValue={data.headline ?? ""}
        multiline
        onCommit={(v) => onCommit({ headline: v })}
      />
      <TextField
        label="Subheadline"
        defaultValue={data.subheadline ?? ""}
        multiline
        onCommit={(v) => onCommit({ subheadline: v })}
      />
      <TextField
        label="Primary CTA"
        defaultValue={data.primaryCta ?? ""}
        onCommit={(v) => onCommit({ primaryCta: v })}
      />
      <TextField
        label="Secondary CTA"
        defaultValue={data.secondaryCta ?? ""}
        onCommit={(v) => onCommit({ secondaryCta: v || null })}
      />
      <TextField
        label="Urgency badge"
        defaultValue={data.urgencyBadge ?? ""}
        onCommit={(v) => onCommit({ urgencyBadge: v || null })}
      />
      <TextField
        label="Social proof"
        defaultValue={data.socialProof ?? ""}
        onCommit={(v) => onCommit({ socialProof: v || null })}
      />

      {isFullBleed && (
        <>
          <TextField
            label="Brand name (nav)"
            defaultValue={data.brandName ?? ""}
            onCommit={(v) => onCommit({ brandName: v || null })}
          />
          <NumberField
            label="Overlay darkness × 100 (0–90)"
            defaultValue={Math.round((data.overlayDarkness ?? 0.45) * 100)}
            onCommit={(v) =>
              onCommit({
                overlayDarkness: Math.max(0, Math.min(0.9, v / 100)),
              })
            }
          />
          <div className="space-y-2">
            <div className="text-[11px] text-[color:var(--dw-text-dim)]">
              Nav links
            </div>
            {navLinks.map((link, i) => (
              <div
                key={i}
                className="space-y-1.5 rounded-[10px] border border-[color:var(--dw-border)] p-2"
              >
                <div className="flex items-center justify-between">
                  <div className="dw-mono text-[10px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
                    Link {i + 1}
                  </div>
                  <button
                    onClick={() =>
                      setLinks(navLinks.filter((_, idx) => idx !== i))
                    }
                    className="flex size-6 items-center justify-center rounded-md text-[color:var(--dw-text-muted)] hover:bg-[color:var(--dw-signal)]/10 hover:text-[color:var(--dw-signal)]"
                    aria-label="Remove link"
                  >
                    <HugeiconsIcon icon={Delete01Icon} size={11} />
                  </button>
                </div>
                <TextField
                  label="Label"
                  defaultValue={link.label}
                  onCommit={(v) => {
                    const next = [...navLinks];
                    next[i] = { ...next[i], label: v };
                    setLinks(next);
                  }}
                />
                <TextField
                  label="Href"
                  defaultValue={link.href}
                  onCommit={(v) => {
                    const next = [...navLinks];
                    next[i] = { ...next[i], href: v };
                    setLinks(next);
                  }}
                />
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1.5"
              onClick={() =>
                setLinks([...navLinks, { label: "New link", href: "#" }])
              }
            >
              <HugeiconsIcon icon={PlusSignIcon} size={11} />
              Add link
            </Button>
          </div>
        </>
      )}

      {isProductHero && (
        <>
          <TextField
            label="Brand name"
            defaultValue={data.brandName ?? ""}
            onCommit={(v) => onCommit({ brandName: v || null })}
          />
          <TextField
            label="Product badge"
            defaultValue={data.productBadge ?? ""}
            onCommit={(v) => onCommit({ productBadge: v || null })}
          />
          <NumberField
            label="Price (cents)"
            defaultValue={data.priceCents ?? 0}
            onCommit={(v) => onCommit({ priceCents: v })}
          />
          <NumberField
            label="Original price (cents)"
            defaultValue={data.originalPriceCents ?? 0}
            onCommit={(v) => onCommit({ originalPriceCents: v || null })}
          />
          <NumberField
            label="Rating (1-5)"
            defaultValue={data.rating ?? 0}
            onCommit={(v) => onCommit({ rating: Math.max(0, Math.min(5, v)) })}
          />
          <NumberField
            label="Review count"
            defaultValue={data.reviewCount ?? 0}
            onCommit={(v) => onCommit({ reviewCount: v })}
          />

          <div className="space-y-2">
            <div className="text-[11px] text-[color:var(--dw-text-dim)]">
              Side Features
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
                    onClick={() =>
                      setSideFeatures(sideFeatures.filter((_, idx) => idx !== i))
                    }
                    className="flex size-6 items-center justify-center rounded-md text-[color:var(--dw-text-muted)] hover:bg-[color:var(--dw-signal)]/10 hover:text-[color:var(--dw-signal)]"
                    aria-label="Remove feature"
                  >
                    <HugeiconsIcon icon={Delete01Icon} size={11} />
                  </button>
                </div>
                <TextField
                  label="Icon"
                  defaultValue={feat.icon}
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
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1.5"
              onClick={() =>
                setSideFeatures([...sideFeatures, { icon: "⚡", label: "New feature" }])
              }
            >
              <HugeiconsIcon icon={PlusSignIcon} size={11} />
              Add feature
            </Button>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] text-[color:var(--dw-text-dim)]">
              Bundle Options
            </div>
            {bundles.map((bundle, i) => (
              <div
                key={i}
                className="space-y-1.5 rounded-[10px] border border-[color:var(--dw-border)] p-2"
              >
                <div className="flex items-center justify-between">
                  <div className="dw-mono text-[10px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
                    Bundle {i + 1}
                  </div>
                  <button
                    onClick={() =>
                      setBundles(bundles.filter((_, idx) => idx !== i))
                    }
                    className="flex size-6 items-center justify-center rounded-md text-[color:var(--dw-text-muted)] hover:bg-[color:var(--dw-signal)]/10 hover:text-[color:var(--dw-signal)]"
                    aria-label="Remove bundle"
                  >
                    <HugeiconsIcon icon={Delete01Icon} size={11} />
                  </button>
                </div>
                <TextField
                  label="Name"
                  defaultValue={bundle.name}
                  onCommit={(v) => {
                    const next = [...bundles];
                    next[i] = { ...next[i], name: v };
                    setBundles(next);
                  }}
                />
                <NumberField
                  label="Quantity"
                  defaultValue={bundle.quantity}
                  onCommit={(v) => {
                    const next = [...bundles];
                    next[i] = { ...next[i], quantity: v };
                    setBundles(next);
                  }}
                />
                <NumberField
                  label="Free quantity"
                  defaultValue={bundle.freeQuantity ?? 0}
                  onCommit={(v) => {
                    const next = [...bundles];
                    next[i] = { ...next[i], freeQuantity: v || undefined };
                    setBundles(next);
                  }}
                />
                <NumberField
                  label="Price (cents)"
                  defaultValue={bundle.priceCents}
                  onCommit={(v) => {
                    const next = [...bundles];
                    next[i] = { ...next[i], priceCents: v };
                    setBundles(next);
                  }}
                />
                <NumberField
                  label="Original price (cents)"
                  defaultValue={bundle.originalPriceCents ?? 0}
                  onCommit={(v) => {
                    const next = [...bundles];
                    next[i] = { ...next[i], originalPriceCents: v || undefined };
                    setBundles(next);
                  }}
                />
                <TextField
                  label="Savings text"
                  defaultValue={bundle.savings ?? ""}
                  onCommit={(v) => {
                    const next = [...bundles];
                    next[i] = { ...next[i], savings: v || undefined };
                    setBundles(next);
                  }}
                />
                <TextField
                  label="Badge"
                  defaultValue={bundle.badge ?? ""}
                  onCommit={(v) => {
                    const next = [...bundles];
                    next[i] = { ...next[i], badge: v || null };
                    setBundles(next);
                  }}
                />
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1.5"
              onClick={() =>
                setBundles([
                  ...bundles,
                  {
                    name: "New bundle",
                    quantity: 1,
                    priceCents: 4900,
                    originalPriceCents: 6900,
                    savings: "Save 30%",
                    badge: null,
                  },
                ])
              }
            >
              <HugeiconsIcon icon={PlusSignIcon} size={11} />
              Add bundle
            </Button>
          </div>
        </>
      )}

      <ImagePickerField
        label="Hero image"
        storeId={storeId}
        kind="hero"
        currentUrl={data.imageUrl}
        promptSeed={
          isFullBleed
            ? `Cinematic full-bleed hero background for "${data.headline ?? "product"}", rich atmospheric scene, space for text overlay on left`
            : isProductHero
              ? `Premium product shot for "${data.headline ?? "product"}", centered on white/gradient background, studio lighting`
              : `Premium editorial hero shot for "${data.headline ?? "product"}", studio lighting, clean background`
        }
        onPick={(url) => onCommit({ imageUrl: url })}
      />
    </div>
  );
};
