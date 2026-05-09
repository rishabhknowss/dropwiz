import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon, Delete01Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import type { StoreSection } from "@/db/schema";
import type {
  HeroData,
  HeroNavLink,
  HeroVariant,
  HeroCtaMode,
  FeatureBadge,
  HeroBundle,
  HeroBenefit,
  HeroQuickFeature,
  HeroInlineFaq,
  HeroTrustCard,
  HeroSideFeature,
} from "@/types/store-sections";
import { ImagePickerField, NumberField, TextField, CheckboxField, VariantPicker } from "./fields";

type Commit = (data: Record<string, unknown>) => void;

const VARIANTS: Array<{ id: HeroVariant; label: string; desc: string }> = [
  { id: "split", label: "Split", desc: "Text left, image right" },
  { id: "centered", label: "Centered", desc: "Text above image" },
  { id: "full-bleed", label: "Full image", desc: "BG image + navbar + CTA" },
  { id: "minimal", label: "Minimal", desc: "Tight grid, image below" },
  { id: "magazine", label: "Magazine", desc: "Editorial cover with hero photo" },
  { id: "product-hero", label: "Product", desc: "Product showcase with bundles" },
];

type RatingSource = "customers" | "trustpilot" | "google" | "judgeme" | "loox";

const RATING_SOURCES: Array<{ id: RatingSource; label: string }> = [
  { id: "customers", label: "Customers" },
  { id: "trustpilot", label: "Trustpilot" },
  { id: "google", label: "Google" },
  { id: "judgeme", label: "Judge.me" },
  { id: "loox", label: "Loox" },
];

const CTA_MODES: Array<{ id: HeroCtaMode; label: string; desc: string }> = [
  { id: "cart", label: "Add to Cart", desc: "Adds product to cart" },
  { id: "navigate", label: "Navigate", desc: "Link to product page" },
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
  const benefits = data.benefits ?? [];
  const quickFeatures = data.quickFeatures ?? [];
  const inlineFaqs = data.inlineFaqs ?? [];
  const trustCards = data.trustCards ?? [];
  const additionalImages = data.additionalImages ?? [];

  const galleryImages = data.galleryImages ?? [];

  const setLinks = (next: HeroNavLink[]) => onCommit({ navLinks: next });
  const setSideFeatures = (next: (FeatureBadge | HeroSideFeature)[]) => onCommit({ sideFeatures: next });
  const setBundles = (next: HeroBundle[]) => onCommit({ bundles: next });
  const setBenefits = (next: HeroBenefit[]) => onCommit({ benefits: next });
  const setQuickFeatures = (next: HeroQuickFeature[]) => onCommit({ quickFeatures: next });
  const setInlineFaqs = (next: HeroInlineFaq[]) => onCommit({ inlineFaqs: next });
  const setTrustCards = (next: HeroTrustCard[]) => onCommit({ trustCards: next });
  const setAdditionalImages = (next: string[]) => onCommit({ additionalImages: next });
  const setGalleryImages = (next: string[]) => onCommit({ galleryImages: next });

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

      {isProductHero && (
        <>
          <div className="space-y-1.5">
            <div className="text-[11px] text-[color:var(--dw-text-dim)]">CTA Mode</div>
            <div className="grid grid-cols-2 gap-1.5">
              {CTA_MODES.map((m) => {
                const active = (data.ctaMode ?? "cart") === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => onCommit({ ctaMode: m.id })}
                    title={m.desc}
                    className={`rounded-[8px] border p-2 text-[11px] font-medium transition ${
                      active
                        ? "border-[color:var(--dw-accent)] bg-[color:var(--dw-surface2)] text-[color:var(--dw-text)]"
                        : "border-[color:var(--dw-border)] text-[color:var(--dw-text-muted)] hover:border-[color:var(--dw-accent)]/40"
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
            <div className="dw-mono text-[10px] tracking-[0.1em] uppercase text-[color:var(--dw-text-muted)]">
              {CTA_MODES.find((m) => m.id === (data.ctaMode ?? "cart"))?.desc}
            </div>
          </div>
          {data.ctaMode === "navigate" && (
            <TextField
              label="CTA Link"
              defaultValue={data.ctaLink ?? "/products"}
              onCommit={(v) => onCommit({ ctaLink: v || "/products" })}
            />
          )}
        </>
      )}

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
          <CheckboxField
            label="Show header"
            defaultChecked={data.showHeader !== false}
            onCommit={(v) => onCommit({ showHeader: v })}
          />
          <TextField
            label="Brand name"
            defaultValue={data.brandName ?? ""}
            onCommit={(v) => onCommit({ brandName: v || null })}
          />

          <div className="h-px bg-[color:var(--dw-border)]" />
          <div className="dw-mono text-[10px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
            Pricing
          </div>
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
          <TextField
            label="Stock badge"
            defaultValue={data.stockBadge ?? ""}
            onCommit={(v) => onCommit({ stockBadge: v || undefined })}
          />

          <div className="h-px bg-[color:var(--dw-border)]" />
          <div className="dw-mono text-[10px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
            Reviews
          </div>
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
          <VariantPicker
            label="Rating source"
            value={(data.ratingSource as RatingSource) || "customers"}
            options={RATING_SOURCES}
            onChange={(v) => onCommit({ ratingSource: v })}
          />

          <div className="h-px bg-[color:var(--dw-border)]" />
          <div className="dw-mono text-[10px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
            Image Badge
          </div>
          <TextField
            label="Badge icon"
            defaultValue={data.imageBadge?.icon ?? ""}
            onCommit={(v) => onCommit({ imageBadge: { ...data.imageBadge, icon: v || undefined, text: data.imageBadge?.text ?? "" } })}
          />
          <TextField
            label="Badge text"
            defaultValue={data.imageBadge?.text ?? ""}
            onCommit={(v) => onCommit({ imageBadge: v ? { ...data.imageBadge, text: v } : undefined })}
          />

          <div className="h-px bg-[color:var(--dw-border)]" />
          <div className="space-y-2">
            <div className="text-[11px] text-[color:var(--dw-text-dim)]">
              Benefits (checkmarks)
            </div>
            {benefits.map((b, i) => (
              <div
                key={i}
                className="space-y-1.5 rounded-[10px] border border-[color:var(--dw-border)] p-2"
              >
                <div className="flex items-center justify-between">
                  <div className="dw-mono text-[10px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
                    Benefit {i + 1}
                  </div>
                  <button
                    onClick={() => setBenefits(benefits.filter((_, idx) => idx !== i))}
                    className="flex size-6 items-center justify-center rounded-md text-[color:var(--dw-text-muted)] hover:bg-[color:var(--dw-signal)]/10 hover:text-[color:var(--dw-signal)]"
                    aria-label="Remove benefit"
                  >
                    <HugeiconsIcon icon={Delete01Icon} size={11} />
                  </button>
                </div>
                <TextField
                  label="Icon"
                  defaultValue={b.icon ?? ""}
                  onCommit={(v) => {
                    const next = [...benefits];
                    next[i] = { ...next[i], icon: v || undefined };
                    setBenefits(next);
                  }}
                />
                <TextField
                  label="Text"
                  defaultValue={b.text}
                  onCommit={(v) => {
                    const next = [...benefits];
                    next[i] = { ...next[i], text: v };
                    setBenefits(next);
                  }}
                />
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1.5"
              onClick={() => setBenefits([...benefits, { text: "New benefit" }])}
            >
              <HugeiconsIcon icon={PlusSignIcon} size={11} />
              Add benefit
            </Button>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] text-[color:var(--dw-text-dim)]">
              Quick Features (below CTA)
            </div>
            {quickFeatures.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <TextField
                  label=""
                  defaultValue={f.text}
                  onCommit={(v) => {
                    const next = [...quickFeatures];
                    next[i] = { text: v };
                    setQuickFeatures(next);
                  }}
                />
                <button
                  onClick={() => setQuickFeatures(quickFeatures.filter((_, idx) => idx !== i))}
                  className="flex size-6 shrink-0 items-center justify-center rounded-md text-[color:var(--dw-text-muted)] hover:bg-[color:var(--dw-signal)]/10 hover:text-[color:var(--dw-signal)]"
                  aria-label="Remove"
                >
                  <HugeiconsIcon icon={Delete01Icon} size={11} />
                </button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1.5"
              onClick={() => setQuickFeatures([...quickFeatures, { text: "New feature" }])}
            >
              <HugeiconsIcon icon={PlusSignIcon} size={11} />
              Add quick feature
            </Button>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] text-[color:var(--dw-text-dim)]">
              Inline FAQ
            </div>
            {inlineFaqs.map((faq, i) => (
              <div
                key={i}
                className="space-y-1.5 rounded-[10px] border border-[color:var(--dw-border)] p-2"
              >
                <div className="flex items-center justify-between">
                  <div className="dw-mono text-[10px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
                    FAQ {i + 1}
                  </div>
                  <button
                    onClick={() => setInlineFaqs(inlineFaqs.filter((_, idx) => idx !== i))}
                    className="flex size-6 items-center justify-center rounded-md text-[color:var(--dw-text-muted)] hover:bg-[color:var(--dw-signal)]/10 hover:text-[color:var(--dw-signal)]"
                    aria-label="Remove FAQ"
                  >
                    <HugeiconsIcon icon={Delete01Icon} size={11} />
                  </button>
                </div>
                <TextField
                  label="Question"
                  defaultValue={faq.question}
                  onCommit={(v) => {
                    const next = [...inlineFaqs];
                    next[i] = { ...next[i], question: v };
                    setInlineFaqs(next);
                  }}
                />
                <TextField
                  label="Answer"
                  defaultValue={faq.answer}
                  multiline
                  onCommit={(v) => {
                    const next = [...inlineFaqs];
                    next[i] = { ...next[i], answer: v };
                    setInlineFaqs(next);
                  }}
                />
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1.5"
              onClick={() => setInlineFaqs([...inlineFaqs, { question: "New question?", answer: "Answer here." }])}
            >
              <HugeiconsIcon icon={PlusSignIcon} size={11} />
              Add FAQ
            </Button>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] text-[color:var(--dw-text-dim)]">
              Trust Cards
            </div>
            {trustCards.map((card, i) => (
              <div
                key={i}
                className="space-y-1.5 rounded-[10px] border border-[color:var(--dw-border)] p-2"
              >
                <div className="flex items-center justify-between">
                  <div className="dw-mono text-[10px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
                    Card {i + 1}
                  </div>
                  <button
                    onClick={() => setTrustCards(trustCards.filter((_, idx) => idx !== i))}
                    className="flex size-6 items-center justify-center rounded-md text-[color:var(--dw-text-muted)] hover:bg-[color:var(--dw-signal)]/10 hover:text-[color:var(--dw-signal)]"
                    aria-label="Remove card"
                  >
                    <HugeiconsIcon icon={Delete01Icon} size={11} />
                  </button>
                </div>
                <TextField
                  label="Icon"
                  defaultValue={card.icon ?? ""}
                  onCommit={(v) => {
                    const next = [...trustCards];
                    next[i] = { ...next[i], icon: v || undefined };
                    setTrustCards(next);
                  }}
                />
                <TextField
                  label="Title"
                  defaultValue={card.title}
                  onCommit={(v) => {
                    const next = [...trustCards];
                    next[i] = { ...next[i], title: v };
                    setTrustCards(next);
                  }}
                />
                <TextField
                  label="Description"
                  defaultValue={card.description}
                  onCommit={(v) => {
                    const next = [...trustCards];
                    next[i] = { ...next[i], description: v };
                    setTrustCards(next);
                  }}
                />
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1.5"
              onClick={() => setTrustCards([...trustCards, { icon: "✓", title: "Trust badge", description: "Description here" }])}
            >
              <HugeiconsIcon icon={PlusSignIcon} size={11} />
              Add trust card
            </Button>
          </div>

          <div className="h-px bg-[color:var(--dw-border)]" />
          <div className="dw-mono text-[10px] tracking-[0.14em] uppercase text-[color:var(--dw-text-muted)]">
            Bottom Message
          </div>
          <TextField
            label="Icon"
            defaultValue={data.bottomMessage?.icon ?? ""}
            onCommit={(v) => onCommit({ bottomMessage: { ...data.bottomMessage, icon: v || undefined, text: data.bottomMessage?.text ?? "" } })}
          />
          <TextField
            label="Text"
            defaultValue={data.bottomMessage?.text ?? ""}
            onCommit={(v) => onCommit({ bottomMessage: v ? { ...data.bottomMessage, text: v } : undefined })}
          />

          <div className="h-px bg-[color:var(--dw-border)]" />
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
                <TextField
                  label="Description (optional)"
                  defaultValue={"description" in feat ? feat.description ?? "" : ""}
                  onCommit={(v) => {
                    const next = [...sideFeatures];
                    next[i] = { ...next[i], description: v || undefined };
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
                setSideFeatures([...sideFeatures, { icon: "⚡", label: "New feature", description: "" }])
              }
            >
              <HugeiconsIcon icon={PlusSignIcon} size={11} />
              Add feature
            </Button>
          </div>

          <CheckboxField
            label="Show bundle selector"
            defaultChecked={data.showBundleSelector ?? (bundles.length > 0)}
            onCommit={(v) => onCommit({ showBundleSelector: v })}
          />

          <CheckboxField
            label="Show payment badges"
            defaultChecked={data.showPaymentBadges !== false}
            onCommit={(v) => onCommit({ showPaymentBadges: v })}
          />

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

          <div className="space-y-2">
            <div className="text-[11px] text-[color:var(--dw-text-dim)]">
              Additional Images
            </div>
            {additionalImages.map((img, i) => (
              <div key={i} className="flex items-center gap-2">
                <ImagePickerField
                  label=""
                  storeId={storeId}
                  kind="hero"
                  currentUrl={img}
                  promptSeed={`Additional product image for "${data.headline ?? "product"}"`}
                  onPick={(url) => {
                    const next = [...additionalImages];
                    next[i] = url;
                    setAdditionalImages(next);
                  }}
                />
                <button
                  onClick={() => setAdditionalImages(additionalImages.filter((_, idx) => idx !== i))}
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
              onClick={() => setAdditionalImages([...additionalImages, ""])}
            >
              <HugeiconsIcon icon={PlusSignIcon} size={11} />
              Add image
            </Button>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] text-[color:var(--dw-text-dim)]">
              Gallery Images (scrollable strip)
            </div>
            {galleryImages.map((img, i) => (
              <div key={i} className="flex items-center gap-2">
                <ImagePickerField
                  label=""
                  storeId={storeId}
                  kind="hero"
                  currentUrl={img}
                  promptSeed={`Product gallery image for "${data.headline ?? "product"}"`}
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
