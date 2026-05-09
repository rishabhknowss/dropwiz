import { useState } from "react";
import type {
  HeroData,
  HeroVariant,
  FeatureBadge,
  HeroBundle,
  HeroBenefit,
  HeroQuickFeature,
  HeroInlineFaq,
  HeroTrustCard,
  HeroSideFeature,
} from "@/types/store-sections";
import { useCartOptional } from "../cart";
import { cn } from "@/lib/utils";
import { StoreIcon } from "@/components/editor/inspectors/fields/IconPickerField";

type Props = { data: HeroData };

export const HeroSection = ({ data }: Props) => {
  const variant: HeroVariant = data.variant ?? "split";
  switch (variant) {
    case "centered":
      return <HeroCentered data={data} />;
    case "full-bleed":
      return <HeroFullBleed data={data} />;
    case "minimal":
      return <HeroMinimal data={data} />;
    case "magazine":
      return <HeroMagazine data={data} />;
    case "product-hero":
      return <HeroProductHero data={data} />;
    default:
      return <HeroSplit data={data} />;
  }
};

const FeatureBadges = ({ badges }: { badges: FeatureBadge[] }) => (
  <div className="flex flex-wrap items-center gap-2 @3xl/store:gap-3">
    {badges.map((badge, i) => (
      <div
        key={i}
        className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium @3xl/store:px-3 @3xl/store:text-[12px]"
        style={{
          borderColor: "color-mix(in srgb, var(--store-text) 8%, transparent)",
          border: "1px solid color-mix(in srgb, var(--store-text) 8%, transparent)",
          background: "color-mix(in srgb, var(--store-text) 2%, transparent)",
        }}
      >
        <StoreIcon name={badge.icon} size={14} className="@3xl/store:!h-[15px] @3xl/store:!w-[15px]" />
        <span>{badge.label}</span>
      </div>
    ))}
  </div>
);

const RatingBadge = ({ rating, reviewCount }: { rating: number; reviewCount: number }) => (
  <div className="flex items-center gap-2">
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className="text-[12px] @3xl/store:text-[13px]"
          style={{
            color: star <= Math.round(rating) ? "#fbbf24" : "color-mix(in srgb, var(--store-text) 15%, transparent)"
          }}
        >
          ★
        </span>
      ))}
    </div>
    <span className="text-[11px] opacity-60 @3xl/store:text-[12px]">
      {rating.toFixed(1)}/5 ({reviewCount.toLocaleString()}+ reviews)
    </span>
  </div>
);

const RATING_SOURCE_STYLES: Record<string, { bg: string; text: string; starColor: string; label: string }> = {
  trustpilot: { bg: "bg-[#00b67a]", text: "text-white", starColor: "text-white", label: "Trustpilot" },
  google: { bg: "bg-white border border-gray-200", text: "text-gray-700", starColor: "text-amber-400", label: "Google" },
  judgeme: { bg: "bg-[#6366f1]", text: "text-white", starColor: "text-white", label: "Judge.me" },
  loox: { bg: "bg-[#ff6b00]", text: "text-white", starColor: "text-white", label: "Loox" },
  customers: { bg: "bg-green-600", text: "text-white", starColor: "text-white", label: "customers" },
};

const RatingSourceBadge = ({
  rating,
  reviewCount,
  source = "customers"
}: {
  rating: number;
  reviewCount: number;
  source?: string;
}) => {
  const style = RATING_SOURCE_STYLES[source] || RATING_SOURCE_STYLES.customers;
  return (
    <div className="flex items-center gap-2">
      <div className={cn("flex items-center rounded px-1.5 py-0.5", style.bg)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={cn("text-[10px]", style.starColor)}>★</span>
        ))}
      </div>
      <span className="text-[13px] font-medium">
        {rating.toFixed(1)}/5 stars by {reviewCount.toLocaleString()}+ {style.label}
      </span>
    </div>
  );
};


const PrimaryCta = ({ label }: { label: string }) => (
  <button
    data-btn-styled
    className="inline-flex items-center gap-2 px-5 py-3 text-[13px] font-semibold @3xl/store:px-6 @3xl/store:py-3.5 @3xl/store:text-[14px]"
    style={{
      background: "var(--store-primary)",
      color: "var(--store-bg)",
      borderRadius: "var(--store-button-radius)",
    }}
  >
    {label}
  </button>
);

const SecondaryCta = ({ label }: { label: string }) => (
  <button
    data-btn-styled
    className="inline-flex items-center gap-2 px-5 py-3 text-[13px] font-medium @3xl/store:px-6 @3xl/store:py-3.5 @3xl/store:text-[14px]"
    style={{
      border: "1px solid color-mix(in srgb, var(--store-text) 18%, transparent)",
      color: "var(--store-text)",
      borderRadius: "var(--store-button-radius)",
    }}
  >
    {label}
  </button>
);

const Badge = ({ label }: { label: string }) => (
  <div
    className="inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] @3xl/store:text-[11px]"
    style={{
      background: "var(--store-accent)",
      color: "var(--store-primary)",
    }}
  >
    {label}
  </div>
);

const HeroImage = ({
  url,
  aspect = "square",
}: {
  url?: string;
  aspect?: "square" | "video" | "tall";
}) => {
  const ratio =
    aspect === "video"
      ? "aspect-[16/10]"
      : aspect === "tall"
        ? "aspect-[3/4]"
        : "aspect-square";
  return (
    <div
      data-img-styled
      className={`relative w-full overflow-hidden ${ratio}`}
      style={{ borderRadius: "var(--store-radius)" }}
    >
      {url ? (
        <img src={url} alt="" className="h-full w-full object-cover" />
      ) : (
        <div
          className="h-full w-full"
          style={{
            background:
              "linear-gradient(135deg, var(--store-accent) 0%, var(--store-primary) 100%)",
          }}
        />
      )}
    </div>
  );
};

const HeroBundleSelector = ({
  bundles,
  selectedIdx,
  onSelect,
  currency,
  onAddToCart,
  ctaLabel,
}: {
  bundles: HeroBundle[];
  selectedIdx: number;
  onSelect: (idx: number) => void;
  currency: string;
  onAddToCart: () => void;
  ctaLabel: string;
}) => {
  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(cents / 100);
  };

  return (
    <div className="mt-6 @3xl/store:mt-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1" style={{ background: "color-mix(in srgb, var(--store-text) 10%, transparent)" }} />
        <span className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: "color-mix(in srgb, var(--store-text) 60%, transparent)" }}>Bundle & Save</span>
        <div className="h-px flex-1" style={{ background: "color-mix(in srgb, var(--store-text) 10%, transparent)" }} />
      </div>

      <div className="space-y-2.5">
        {bundles.map((bundle, idx) => {
          const isSelected = selectedIdx === idx;
          const showFree = bundle.freeQuantity && bundle.freeQuantity > 0;
          return (
            <label
              key={idx}
              className="relative flex cursor-pointer items-center gap-4 rounded-xl border-2 px-4 py-4 transition-all"
              style={{
                borderColor: isSelected ? "var(--store-primary)" : "color-mix(in srgb, var(--store-text) 10%, transparent)",
                background: isSelected ? "var(--store-bg)" : "color-mix(in srgb, var(--store-bg) 50%, transparent)",
                boxShadow: isSelected ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              }}
            >
              <input
                type="radio"
                name="hero-bundle"
                checked={isSelected}
                onChange={() => onSelect(idx)}
                className="sr-only"
              />
              <div
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
                style={{
                  borderColor: isSelected ? "var(--store-primary)" : "color-mix(in srgb, var(--store-text) 30%, transparent)",
                }}
              >
                {isSelected && <div className="h-3 w-3 rounded-full" style={{ background: "var(--store-primary)" }} />}
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-semibold">
                  {showFree ? `Buy ${bundle.quantity}, get ${bundle.freeQuantity} free` : `${bundle.quantity}x ${bundle.name}`}
                </div>
                {bundle.savings && (
                  <div className="text-[13px] font-medium" style={{ color: "var(--store-primary)" }}>
                    SAVE {bundle.savings}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-[17px] font-bold">{formatPrice(bundle.priceCents)}</div>
                {bundle.originalPriceCents && (
                  <div className="text-[13px] line-through" style={{ color: "color-mix(in srgb, var(--store-text) 40%, transparent)" }}>{formatPrice(bundle.originalPriceCents)}</div>
                )}
              </div>
              {bundle.badge && (
                <div
                  className="absolute -right-2 -top-3 rounded-md px-3 py-1.5 text-[11px] font-bold text-white shadow-lg"
                  style={{ background: "var(--store-primary)" }}
                >
                  {bundle.badge}
                </div>
              )}
            </label>
          );
        })}
      </div>

      <button
        data-btn-styled
        onClick={onAddToCart}
        className="mt-5 w-full py-4 text-[15px] font-bold uppercase tracking-wider text-white transition-transform hover:scale-[1.01] active:scale-[0.99]"
        style={{
          background: "var(--store-primary)",
          borderRadius: "var(--store-button-radius)",
        }}
      >
        {ctaLabel || "Add to Cart"}
      </button>

      <div className="mt-4 flex items-center justify-center gap-2">
        {["amex", "visa", "mastercard", "paypal", "shopify", "gpay", "applepay"].map((p) => (
          <div
            key={p}
            className="flex h-7 w-10 items-center justify-center rounded"
            style={{
              border: "1px solid color-mix(in srgb, var(--store-text) 8%, transparent)",
              background: "var(--store-bg)",
            }}
          >
            <img
              src={`/payment/${p}.png`}
              alt={p}
              className="h-4 w-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const HeroSplit = ({ data }: Props) => {
  const cart = useCartOptional();
  const [selectedBundleIdx, setSelectedBundleIdx] = useState(0);
  const bundles = data.bundles ?? [];
  const hasBundles = bundles.length > 0;
  const currency = data.currency ?? "USD";
  const selectedBundle = bundles[selectedBundleIdx] ?? null;

  const handleAddToCart = () => {
    if (!cart || !selectedBundle) return;
    const bundleForCart = {
      name: selectedBundle.name,
      description: selectedBundle.name,
      quantity: selectedBundle.quantity,
      freeQuantity: selectedBundle.freeQuantity,
      discountPercent: 0,
      badge: selectedBundle.badge ?? null,
      savings: selectedBundle.savings ?? "",
      recommended: selectedBundleIdx === 0,
    };
    cart.addToCart({
      bundleIndex: selectedBundleIdx,
      bundle: bundleForCart,
      quantity: 1,
      unitPrice: selectedBundle.priceCents,
      totalPrice: selectedBundle.priceCents,
      currency,
      productImage: data.imageUrl,
      productTitle: data.headline,
    });
  };

  return (
    <section className="relative overflow-hidden">
      <div className="px-5 pt-10 pb-12 @3xl/store:px-12 @3xl/store:pt-16 @3xl/store:pb-20">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-8 @3xl/store:grid-cols-2 @3xl/store:gap-10">
          <div>
            {data.rating && data.reviewCount && (
              <div className="mb-4 @3xl/store:mb-5">
                <RatingBadge rating={data.rating} reviewCount={data.reviewCount} />
              </div>
            )}
            <h1
              className="text-[34px] font-medium leading-[1.05] tracking-[-0.03em] @3xl/store:text-[52px] @3xl/store:leading-[1.02] @3xl/store:tracking-[-0.035em] @5xl/store:text-[64px]"
              style={{ color: "var(--store-text)" }}
            >
              {data.headline}
            </h1>
            <p className="mt-4 max-w-[520px] text-[15px] leading-[1.5] opacity-70 @3xl/store:mt-5 @3xl/store:text-[17px]">
              {data.subheadline}
            </p>
            {data.featureBadges && data.featureBadges.length > 0 && (
              <div className="mt-5 @3xl/store:mt-6">
                <FeatureBadges badges={data.featureBadges} />
              </div>
            )}

            {hasBundles ? (
              <HeroBundleSelector
                bundles={bundles}
                selectedIdx={selectedBundleIdx}
                onSelect={setSelectedBundleIdx}
                currency={currency}
                onAddToCart={handleAddToCart}
                ctaLabel={data.primaryCta}
              />
            ) : (
              <>
                <div className="mt-6 flex flex-wrap items-center gap-3 @3xl/store:mt-8">
                  <PrimaryCta label={data.primaryCta} />
                  {data.secondaryCta && <SecondaryCta label={data.secondaryCta} />}
                </div>
                {data.socialProof && (
                  <div className="mt-5 text-[12.5px] opacity-60 @3xl/store:mt-6 @3xl/store:text-[13px]">
                    {data.socialProof}
                  </div>
                )}
              </>
            )}
          </div>
          <HeroImage url={data.imageUrl} aspect="square" />
        </div>
      </div>
    </section>
  );
};

const HeroCentered = ({ data }: Props) => (
  <section className="relative overflow-hidden px-5 pt-12 pb-12 @3xl/store:px-12 @3xl/store:pt-24 @3xl/store:pb-24">
    <div className="mx-auto flex max-w-[920px] flex-col items-center text-center">
      {data.urgencyBadge && (
        <div className="mb-5 @3xl/store:mb-6">
          <Badge label={data.urgencyBadge} />
        </div>
      )}
      <h1
        className="text-[36px] font-medium leading-[1.05] tracking-[-0.03em] @3xl/store:text-[60px] @3xl/store:leading-[1.02] @3xl/store:tracking-[-0.035em] @5xl/store:text-[72px]"
        style={{ color: "var(--store-text)" }}
      >
        {data.headline}
      </h1>
      <p className="mt-4 max-w-[620px] text-[15px] leading-[1.5] opacity-70 @3xl/store:mt-5 @3xl/store:text-[18px]">
        {data.subheadline}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 @3xl/store:mt-8">
        <PrimaryCta label={data.primaryCta} />
        {data.secondaryCta && <SecondaryCta label={data.secondaryCta} />}
      </div>
      {data.socialProof && (
        <div className="mt-5 text-[12.5px] opacity-60 @3xl/store:mt-6 @3xl/store:text-[13px]">
          {data.socialProof}
        </div>
      )}
      <div className="mt-9 w-full max-w-[860px] @3xl/store:mt-12">
        <HeroImage url={data.imageUrl} aspect="video" />
      </div>
    </div>
  </section>
);

const HeroFullBleed = ({ data }: Props) => {
  const overlay = data.overlayDarkness ?? 0.45;
  const navLinks = data.navLinks ?? [];
  return (
    <section className="relative h-[88svh] min-h-[520px] w-full overflow-hidden @3xl/store:h-[100svh] @3xl/store:min-h-[640px]">
      <div className="absolute inset-0">
        {data.imageUrl ? (
          <img
            src={data.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="h-full w-full"
            style={{
              background:
                "linear-gradient(135deg, var(--store-accent) 0%, var(--store-primary) 100%)",
            }}
          />
        )}
      </div>
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, rgba(0,0,0,${overlay * 0.6}) 0%, rgba(0,0,0,${overlay}) 60%, rgba(0,0,0,${overlay * 1.2}) 100%)`,
        }}
      />
      <div className="relative z-10 flex h-full flex-col">
        <nav className="flex items-center justify-between gap-3 px-5 pt-5 @3xl/store:px-12 @3xl/store:pt-6">
          <span className="text-[14px] font-semibold tracking-[-0.01em] text-white @3xl/store:text-[15px]">
            {data.brandName ?? "Brand"}
          </span>
          <div className="hidden items-center gap-7 @3xl/store:flex">
            {navLinks.map((l, i) => (
              <a
                key={i}
                href={l.href}
                className="text-[13px] text-white/85 hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </div>
          <button
            className="rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-[11.5px] font-medium text-white backdrop-blur @3xl/store:px-4 @3xl/store:text-[12px]"
            style={{ borderRadius: "var(--store-radius)" }}
          >
            {data.primaryCta}
          </button>
        </nav>
        <div className="mt-auto px-5 pb-12 @3xl/store:px-12 @3xl/store:pb-24">
          <div className="max-w-[820px] text-white">
            {data.urgencyBadge && (
              <div className="mb-4 inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] backdrop-blur @3xl/store:mb-5 @3xl/store:text-[11px]">
                {data.urgencyBadge}
              </div>
            )}
            <h1 className="text-[38px] font-medium leading-[1.02] tracking-[-0.03em] @3xl/store:text-[64px] @3xl/store:leading-[1] @3xl/store:tracking-[-0.035em] @5xl/store:text-[80px]">
              {data.headline}
            </h1>
            <p className="mt-4 max-w-[560px] text-[15px] leading-[1.5] text-white/85 @3xl/store:mt-5 @3xl/store:text-[17px]">
              {data.subheadline}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 @3xl/store:mt-7">
              <PrimaryCta label={data.primaryCta} />
              {data.secondaryCta && (
                <button
                  data-btn-styled
                  className="border border-white/40 px-5 py-3 text-[13px] font-medium text-white @3xl/store:px-6 @3xl/store:py-3.5 @3xl/store:text-[14px]"
                  style={{ borderRadius: "var(--store-button-radius)" }}
                >
                  {data.secondaryCta}
                </button>
              )}
            </div>
            {data.socialProof && (
              <div className="mt-4 text-[12.5px] text-white/70 @3xl/store:mt-5 @3xl/store:text-[13px]">
                {data.socialProof}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const HeroMinimal = ({ data }: Props) => (
  <section className="relative overflow-hidden px-5 pt-10 pb-10 @3xl/store:px-12 @3xl/store:pt-20 @3xl/store:pb-16">
    <div className="mx-auto max-w-[1100px]">
      {data.urgencyBadge && (
        <div className="dw-mono mb-3 text-[10px] tracking-[0.16em] uppercase opacity-60 @3xl/store:mb-4 @3xl/store:text-[11px]">
          {data.urgencyBadge}
        </div>
      )}
      <div className="grid grid-cols-1 items-end gap-8 @3xl/store:grid-cols-[1.4fr_1fr] @3xl/store:gap-12">
        <h1
          className="text-[34px] font-medium leading-[1.05] tracking-[-0.03em] @3xl/store:text-[60px] @3xl/store:leading-[1.02] @3xl/store:tracking-[-0.035em] @5xl/store:text-[76px]"
          style={{ color: "var(--store-text)" }}
        >
          {data.headline}
        </h1>
        <div className="space-y-4 @3xl/store:space-y-5">
          <p className="text-[14.5px] leading-[1.55] opacity-70 @3xl/store:text-[15px]">
            {data.subheadline}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <PrimaryCta label={data.primaryCta} />
            {data.secondaryCta && <SecondaryCta label={data.secondaryCta} />}
          </div>
          {data.socialProof && (
            <div className="text-[12px] opacity-55">{data.socialProof}</div>
          )}
        </div>
      </div>
      {data.imageUrl && (
        <div className="mt-8 @3xl/store:mt-10">
          <HeroImage url={data.imageUrl} aspect="video" />
        </div>
      )}
    </div>
  </section>
);

const HeroMagazine = ({ data }: Props) => (
  <section className="relative overflow-hidden px-5 pt-10 pb-14 @3xl/store:px-12 @3xl/store:pt-16 @3xl/store:pb-20">
    <div className="mx-auto max-w-[1200px]">
      <div className="dw-mono mb-6 flex items-center justify-between text-[10px] tracking-[0.16em] uppercase opacity-60 @3xl/store:mb-8 @3xl/store:text-[11px]">
        <span>{data.urgencyBadge ?? "Volume 01"}</span>
        <span>{data.brandName ?? "Editorial"}</span>
      </div>
      <div
        data-img-styled
        className="overflow-hidden"
        style={{ borderRadius: "var(--store-radius)" }}
      >
        <div className="relative aspect-[4/5] w-full @3xl/store:aspect-[16/9]">
          {data.imageUrl ? (
            <img
              src={data.imageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, var(--store-accent) 0%, var(--store-primary) 100%)",
              }}
            />
          )}
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-8 @3xl/store:mt-10 @3xl/store:grid-cols-[1.5fr_1fr] @3xl/store:gap-10">
        <h1
          className="text-[36px] font-medium leading-[1.02] tracking-[-0.035em] @3xl/store:text-[68px] @3xl/store:leading-[1] @3xl/store:tracking-[-0.04em] @5xl/store:text-[88px]"
          style={{
            fontFamily: "var(--store-font-display)",
            color: "var(--store-text)",
          }}
        >
          {data.headline}
        </h1>
        <div
          className="pt-4 text-[14.5px] leading-[1.55] opacity-75 @3xl/store:pt-5 @3xl/store:text-[15px]"
          style={{ borderTop: "1px solid color-mix(in srgb, var(--store-text) 15%, transparent)" }}
        >
          <p>{data.subheadline}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3 @3xl/store:mt-6">
            <PrimaryCta label={data.primaryCta} />
            {data.secondaryCta && <SecondaryCta label={data.secondaryCta} />}
          </div>
          {data.socialProof && (
            <div className="mt-4 text-[12px] opacity-55 @3xl/store:mt-5">
              {data.socialProof}
            </div>
          )}
        </div>
      </div>
    </div>
  </section>
);

const ProductHeroSideCard = ({
  icon,
  label,
  description,
}: {
  icon: string;
  label: string;
  description?: string;
}) => (
  <div
    data-card-styled
    className="group relative flex flex-col items-center gap-2.5 overflow-hidden px-3 py-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
    style={{
      borderRadius: "var(--store-radius)",
      border: "1px solid color-mix(in srgb, var(--store-text) 6%, transparent)",
      background: "var(--store-bg)",
    }}
  >
    <div
      className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      style={{
        background: "linear-gradient(180deg, var(--store-accent) 0%, transparent 100%)",
        opacity: 0.08,
      }}
    />
    <div
      className="relative flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
      style={{
        background: "linear-gradient(135deg, var(--store-accent) 0%, var(--store-primary) 100%)",
        color: "var(--store-bg)",
      }}
    >
      <StoreIcon name={icon} size={22} />
    </div>
    <div className="relative text-center">
      <span
        className="block text-[12px] font-semibold leading-tight tracking-tight"
        style={{ color: "var(--store-text)" }}
      >
        {label}
      </span>
      {description && (
        <span
          className="mt-1 block text-[10px] leading-tight"
          style={{ color: "color-mix(in srgb, var(--store-text) 50%, transparent)" }}
        >
          {description}
        </span>
      )}
    </div>
  </div>
);

const HeroImageGallery = ({ images }: { images: string[] }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  if (images.length === 0) return null;

  return (
    <div className="relative">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-black/10">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            className={cn(
              "relative shrink-0 overflow-hidden transition-all duration-200",
              activeIdx === i
                ? "ring-2 ring-[color:var(--store-primary)] ring-offset-2"
                : "opacity-70 hover:opacity-100"
            )}
            style={{
              borderRadius: "var(--store-radius)",
              width: "120px",
              height: "120px",
            }}
          >
            <img
              src={img}
              alt=""
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
      {images.length > 4 && (
        <div
          className="pointer-events-none absolute bottom-0 right-0 top-0 w-16"
          style={{
            background: "linear-gradient(90deg, transparent 0%, var(--store-bg) 100%)",
          }}
        />
      )}
    </div>
  );
};

const PaymentBadges = ({ show = true }: { show?: boolean }) => {
  if (!show) return null;

  return (
    <div className="flex items-center gap-3">
      <div
        className="flex items-center gap-1.5 rounded px-2 py-1"
        style={{
          border: "1px solid color-mix(in srgb, var(--store-text) 10%, transparent)",
          background: "var(--store-bg)",
        }}
      >
        <svg className="h-4 w-auto" viewBox="0 0 38 24" fill="none">
          <rect width="38" height="24" rx="3" fill="#1434CB"/>
          <path d="M15.4 16.5l1.9-11h3l-1.9 11h-3z" fill="#fff"/>
          <path d="M26.5 5.7c-.6-.2-1.5-.5-2.7-.5-3 0-5.1 1.5-5.1 3.7 0 1.6 1.5 2.5 2.6 3.1 1.2.6 1.6 1 1.6 1.5 0 .8-1 1.2-1.9 1.2-1.2 0-1.9-.2-2.9-.6l-.4-.2-.4 2.5c.7.3 2 .6 3.4.6 3.2 0 5.2-1.5 5.2-3.8 0-1.3-.8-2.3-2.6-3.1-1.1-.5-1.7-.9-1.7-1.4 0-.5.5-1 1.7-1 1 0 1.7.2 2.2.4l.3.1.5-2.5z" fill="#fff"/>
          <path d="M30.6 5.5h-2.3c-.7 0-1.3.2-1.6 1l-4.5 10h3.2s.5-1.4.6-1.7h3.9c.1.4.4 1.7.4 1.7h2.8l-2.5-11zm-3.7 7.1c.3-.7 1.2-3.2 1.2-3.2l.4-1 .2 1s.6 2.7.7 3.2h-2.5z" fill="#fff"/>
          <path d="M12.3 5.5l-3 7.5-.3-1.6c-.6-1.8-2.3-3.8-4.2-4.8l2.7 9.9h3.2l4.8-11h-3.2z" fill="#fff"/>
          <path d="M6.3 5.5H1.1l-.1.3c3.8.9 6.4 3.2 7.4 5.9l-1.1-5.2c-.2-.7-.7-1-1-1z" fill="#F9A533"/>
        </svg>
        <svg className="h-4 w-auto" viewBox="0 0 38 24" fill="none">
          <rect width="38" height="24" rx="3" fill="#fff"/>
          <circle cx="15" cy="12" r="7" fill="#EB001B"/>
          <circle cx="23" cy="12" r="7" fill="#F79E1B"/>
          <path d="M19 7a7 7 0 000 10 7 7 0 000-10z" fill="#FF5F00"/>
        </svg>
        <svg className="h-4 w-auto" viewBox="0 0 38 24" fill="none">
          <rect width="38" height="24" rx="3" fill="#000"/>
          <path d="M12 8h4l1.5 4.5L19 8h4v8h-2.5v-5l-2 5h-2l-2-5v5H12V8z" fill="#fff"/>
        </svg>
      </div>
      <div className="flex items-center gap-1 text-[11px]" style={{ color: "color-mix(in srgb, var(--store-text) 50%, transparent)" }}>
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>Secure checkout</span>
      </div>
    </div>
  );
};

const BenefitsList = ({ benefits }: { benefits: HeroBenefit[] }) => (
  <div className="space-y-2.5">
    {benefits.map((b, i) => (
      <div key={i} className="flex items-start gap-2.5">
        <span
          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
          style={{ background: "var(--store-primary)", color: "var(--store-bg)" }}
        >
          {b.icon ? <StoreIcon name={b.icon} size={11} /> : <span className="text-[11px]">✓</span>}
        </span>
        <span className="text-[14px] font-medium leading-[1.4]">{b.text}</span>
      </div>
    ))}
  </div>
);

const QuickFeaturesGrid = ({ features }: { features: HeroQuickFeature[] }) => (
  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
    {features.slice(0, 4).map((f, i) => (
      <div key={i} className="flex items-center gap-1.5">
        <span className="text-[12px]" style={{ color: "color-mix(in srgb, var(--store-text) 60%, transparent)" }}>✓</span>
        <span className="text-[12px] font-medium" style={{ color: "color-mix(in srgb, var(--store-text) 70%, transparent)" }}>{f.text}</span>
      </div>
    ))}
  </div>
);

const InlineFaqAccordion = ({ faqs }: { faqs: HeroInlineFaq[] }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <div
      className="rounded-xl"
      style={{
        border: "1px solid color-mix(in srgb, var(--store-text) 8%, transparent)",
        background: "var(--store-bg)",
      }}
    >
      {faqs.map((faq, i) => (
        <div
          key={i}
          style={{
            borderBottom: i < faqs.length - 1 ? "1px solid color-mix(in srgb, var(--store-text) 5%, transparent)" : "none",
          }}
        >
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="flex w-full items-center justify-between px-4 py-3.5 text-left"
          >
            <span className="text-[14px] font-medium" style={{ color: "var(--store-text)" }}>{faq.question}</span>
            <span className="text-[18px]" style={{ color: "color-mix(in srgb, var(--store-text) 40%, transparent)" }}>{openIdx === i ? "−" : "+"}</span>
          </button>
          {openIdx === i && (
            <div
              className="px-4 pb-4 pt-0 text-[13px] leading-[1.55]"
              style={{ color: "color-mix(in srgb, var(--store-text) 60%, transparent)" }}
            >
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const TrustCardsRow = ({ cards }: { cards: HeroTrustCard[] }) => (
  <div className="grid grid-cols-1 gap-3 @2xl/store:grid-cols-2">
    {cards.map((card, i) => (
      <div
        key={i}
        data-card-styled
        className="flex items-start gap-3 rounded-xl p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
        style={{
          border: "1px solid color-mix(in srgb, var(--store-text) 8%, transparent)",
          background: "var(--store-bg)",
        }}
      >
        {card.icon && (
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
            style={{ background: "var(--store-primary)", color: "var(--store-bg)" }}
          >
            <StoreIcon name={card.icon} size={18} />
          </span>
        )}
        <div>
          <div className="text-[13px] font-semibold" style={{ color: "var(--store-primary)" }}>
            {card.title}
          </div>
          <div
            className="mt-0.5 text-[12px] leading-[1.4]"
            style={{ color: "color-mix(in srgb, var(--store-text) 60%, transparent)" }}
          >
            {card.description}
          </div>
        </div>
      </div>
    ))}
  </div>
);

const HeroProductHero = ({ data }: Props) => {
  const cart = useCartOptional();
  const [selectedBundleIdx, setSelectedBundleIdx] = useState(0);
  const bundles = data.bundles ?? [];
  const sideFeatures = data.sideFeatures ?? [];
  const additionalImages = data.additionalImages ?? [];
  const galleryImages = data.galleryImages ?? [];
  const benefits = data.benefits ?? [];
  const quickFeatures = data.quickFeatures ?? [];
  const inlineFaqs = data.inlineFaqs ?? [];
  const trustCards = data.trustCards ?? [];
  const selectedBundle = bundles[selectedBundleIdx] ?? null;
  const currency = data.currency ?? "USD";
  const showHeader = data.showHeader !== false;
  const showBundleSelector = data.showBundleSelector ?? (bundles.length > 0);
  const ctaMode = data.ctaMode ?? "cart";
  const ctaLink = data.ctaLink ?? "/products";

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(cents / 100);
  };

  const handleAddToCart = () => {
    if (!cart) return;
    if (selectedBundle) {
      const bundleForCart = {
        name: selectedBundle.name,
        description: selectedBundle.name,
        quantity: selectedBundle.quantity,
        freeQuantity: selectedBundle.freeQuantity,
        discountPercent: 0,
        badge: selectedBundle.badge ?? null,
        savings: selectedBundle.savings ?? "",
        recommended: selectedBundleIdx === 0,
      };
      cart.addToCart({
        bundleIndex: selectedBundleIdx,
        bundle: bundleForCart,
        quantity: 1,
        unitPrice: selectedBundle.priceCents,
        totalPrice: selectedBundle.priceCents,
        currency,
        productImage: data.imageUrl,
        productTitle: data.headline,
      });
    } else if (data.priceCents) {
      const singleBundle = {
        name: data.headline,
        description: data.subheadline,
        quantity: 1,
        discountPercent: 0,
        badge: null,
        savings: "",
        recommended: true,
      };
      cart.addToCart({
        bundleIndex: 0,
        bundle: singleBundle,
        quantity: 1,
        unitPrice: data.priceCents,
        totalPrice: data.priceCents,
        currency,
        productImage: data.imageUrl,
        productTitle: data.headline,
      });
    }
  };

  return (
    <section className="relative overflow-hidden" style={{ background: "var(--store-bg)" }}>
      {showHeader && (
        <header className="relative z-20 flex items-center justify-between px-5 py-4 @3xl/store:px-10 @3xl/store:py-5">
          <div className="flex items-center gap-2">
            <span className="text-[16px] font-bold tracking-[-0.02em] @3xl/store:text-[18px]" style={{ color: "var(--store-text)" }}>
              {data.brandName ?? "Brand"}
            </span>
          </div>
          <div className="hidden items-center gap-6 @3xl/store:flex">
            {data.navLinks?.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="text-[13px] font-medium transition-colors"
                style={{ color: "color-mix(in srgb, var(--store-text) 70%, transparent)" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--store-text)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "color-mix(in srgb, var(--store-text) 70%, transparent)"}
              >
                {link.label}
              </a>
            ))}
          </div>
          <button
            className="px-4 py-2 text-[12px] font-medium shadow-sm backdrop-blur"
            style={{
              borderRadius: "var(--store-radius)",
              border: "1px solid color-mix(in srgb, var(--store-text) 10%, transparent)",
              background: "color-mix(in srgb, var(--store-bg) 80%, transparent)",
              color: "var(--store-text)",
            }}
          >
            Shop Now
          </button>
        </header>
      )}

      <div className="relative z-10 px-5 pb-12 pt-10 @3xl/store:px-10 @3xl/store:pb-16 @3xl/store:pt-12">
        <div className="mx-auto grid max-w-[1300px] grid-cols-1 gap-10 @3xl/store:grid-cols-[1fr_1fr] @3xl/store:gap-12">
          <div className="order-2 @3xl/store:order-1">
            <div className="flex gap-3">
              {sideFeatures.length > 0 && (
                <div className="hidden w-[130px] shrink-0 flex-col gap-2.5 @2xl/store:flex">
                  {sideFeatures.slice(0, 4).map((feat, i) => (
                    <ProductHeroSideCard
                      key={i}
                      icon={feat.icon}
                      label={feat.label}
                      description={"description" in feat ? feat.description : undefined}
                    />
                  ))}
                </div>
              )}

              <div className="relative flex-1">
                {data.imageBadge && (
                  <div
                    className="absolute right-3 top-3 z-10 flex items-center gap-1.5 px-3 py-2 shadow-lg backdrop-blur"
                    style={{
                      borderRadius: "var(--store-radius)",
                      background: "color-mix(in srgb, var(--store-bg) 95%, transparent)",
                      color: "var(--store-text)",
                    }}
                  >
                    {data.imageBadge.icon && <StoreIcon name={data.imageBadge.icon} size={14} />}
                    <span className="text-[11px] font-bold uppercase tracking-wide">{data.imageBadge.text}</span>
                  </div>
                )}

                <div
                  data-img-styled
                  className="aspect-square overflow-hidden"
                  style={{ borderRadius: "var(--store-radius)" }}
                >
                  {data.imageUrl ? (
                    <img src={data.imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full" style={{ background: "linear-gradient(135deg, var(--store-accent) 0%, var(--store-primary) 100%)" }} />
                  )}
                </div>
              </div>
            </div>

            {additionalImages.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-3 @2xl/store:grid-cols-3">
                {additionalImages.slice(0, 3).map((img, i) => (
                  <div
                    key={i}
                    data-img-styled
                    className="aspect-[4/3] overflow-hidden"
                    style={{ borderRadius: "var(--store-radius)" }}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            {sideFeatures.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-2 @2xl/store:hidden">
                {sideFeatures.slice(0, 4).map((feat, i) => (
                  <ProductHeroSideCard
                    key={i}
                    icon={feat.icon}
                    label={feat.label}
                    description={"description" in feat ? feat.description : undefined}
                  />
                ))}
              </div>
            )}

            {galleryImages.length > 0 && (
              <div className="mt-6">
                <HeroImageGallery images={galleryImages} />
              </div>
            )}
          </div>

          <div className="order-1 @3xl/store:order-2">
            {data.rating && data.reviewCount && (
              <div className="mb-3">
                <RatingSourceBadge
                  rating={data.rating}
                  reviewCount={data.reviewCount}
                  source={data.ratingSource}
                />
              </div>
            )}

            <h1
              className="text-[26px] font-bold leading-[1.1] tracking-[-0.02em] @2xl/store:text-[32px] @3xl/store:text-[36px]"
              style={{ color: "var(--store-text)" }}
            >
              {data.headline}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {(selectedBundle || data.priceCents) && (
                <>
                  <span
                    className="text-[26px] font-bold @2xl/store:text-[32px]"
                    style={{ color: "var(--store-primary)" }}
                  >
                    {formatPrice(selectedBundle?.priceCents ?? data.priceCents ?? 0)}
                  </span>
                  {(selectedBundle?.originalPriceCents || data.originalPriceCents) && (
                    <span
                      className="text-[18px] line-through"
                      style={{ color: "color-mix(in srgb, var(--store-text) 40%, transparent)" }}
                    >
                      {formatPrice(selectedBundle?.originalPriceCents ?? data.originalPriceCents ?? 0)}
                    </span>
                  )}
                </>
              )}
              {data.stockBadge && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  {data.stockBadge}
                </span>
              )}
            </div>

            {benefits.length > 0 && (
              <div className="mt-5">
                <BenefitsList benefits={benefits} />
              </div>
            )}

            {ctaMode === "navigate" ? (
              <a
                href={ctaLink}
                data-btn-styled
                className="mt-6 block w-full py-4 text-center text-[15px] font-bold uppercase tracking-wider transition-transform hover:scale-[1.01] active:scale-[0.99]"
                style={{
                  background: "var(--store-primary)",
                  color: "var(--store-bg)",
                  borderRadius: "var(--store-button-radius)",
                }}
              >
                {data.primaryCta || "SHOP NOW"}
              </a>
            ) : (
              <button
                data-btn-styled
                onClick={handleAddToCart}
                className="mt-6 w-full py-4 text-[15px] font-bold uppercase tracking-wider transition-transform hover:scale-[1.01] active:scale-[0.99]"
                style={{
                  background: "var(--store-primary)",
                  color: "var(--store-bg)",
                  borderRadius: "var(--store-button-radius)",
                }}
              >
                {data.primaryCta || "ADD TO CART"}
              </button>
            )}

            {quickFeatures.length > 0 && (
              <div className="mt-4">
                <QuickFeaturesGrid features={quickFeatures} />
              </div>
            )}

            {inlineFaqs.length > 0 && (
              <div className="mt-5">
                <InlineFaqAccordion faqs={inlineFaqs} />
              </div>
            )}

            {trustCards.length > 0 && (
              <div className="mt-5">
                <TrustCardsRow cards={trustCards} />
              </div>
            )}

            {data.bottomMessage && (
              <div className="mt-5 flex items-center gap-2 text-[13px]">
                {data.bottomMessage.icon && <StoreIcon name={data.bottomMessage.icon} size={16} />}
                <span className="font-medium">{data.bottomMessage.text}</span>
              </div>
            )}

            {data.rating && data.reviewCount && (
              <div className="mt-3 flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className="text-[14px]"
                      style={{
                        color: star <= Math.round(data.rating!) ? "#fbbf24" : "color-mix(in srgb, var(--store-text) 15%, transparent)"
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span
                  className="text-[12px]"
                  style={{ color: "color-mix(in srgb, var(--store-text) 60%, transparent)" }}
                >
                  {data.rating.toFixed(1)}/5 {data.ratingSource ? `by ${data.reviewCount.toLocaleString()}+ ${data.ratingSource}` : `(${data.reviewCount.toLocaleString()}+ reviews)`}
                </span>
              </div>
            )}

            {showBundleSelector && bundles.length > 0 && (
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1" style={{ background: "color-mix(in srgb, var(--store-text) 10%, transparent)" }} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: "color-mix(in srgb, var(--store-text) 50%, transparent)" }}>Bundle & Save</span>
                  <div className="h-px flex-1" style={{ background: "color-mix(in srgb, var(--store-text) 10%, transparent)" }} />
                </div>
                {bundles.map((bundle, idx) => (
                  <label
                    key={idx}
                    className="relative flex cursor-pointer items-center gap-3 overflow-hidden border px-4 py-3.5 transition-all"
                    style={{
                      borderRadius: "var(--store-radius)",
                      borderWidth: selectedBundleIdx === idx ? "2px" : "1px",
                      borderColor: selectedBundleIdx === idx ? "var(--store-primary)" : "color-mix(in srgb, var(--store-text) 10%, transparent)",
                      background: selectedBundleIdx === idx ? "var(--store-bg)" : "color-mix(in srgb, var(--store-bg) 50%, transparent)",
                      boxShadow: selectedBundleIdx === idx ? "0 4px 6px -1px rgb(0 0 0 / 0.1)" : "none",
                    }}
                  >
                    <input
                      type="radio"
                      name="bundle"
                      checked={selectedBundleIdx === idx}
                      onChange={() => setSelectedBundleIdx(idx)}
                      className="sr-only"
                    />
                    <div
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
                      style={{ borderColor: selectedBundleIdx === idx ? "var(--store-primary)" : "color-mix(in srgb, var(--store-text) 20%, transparent)" }}
                    >
                      {selectedBundleIdx === idx && (
                        <div className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--store-primary)" }} />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-semibold" style={{ color: "var(--store-text)" }}>
                          {bundle.freeQuantity
                            ? `Buy ${bundle.quantity}, Get ${bundle.freeQuantity} Free`
                            : `${bundle.quantity}x ${bundle.name}`}
                        </span>
                      </div>
                      {bundle.savings && (
                        <div className="text-[11px] font-medium" style={{ color: "var(--store-primary)" }}>
                          SAVE {bundle.savings}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-[15px] font-bold" style={{ color: "var(--store-text)" }}>{formatPrice(bundle.priceCents)}</div>
                      {bundle.originalPriceCents && (
                        <div className="text-[11px] line-through" style={{ color: "color-mix(in srgb, var(--store-text) 40%, transparent)" }}>{formatPrice(bundle.originalPriceCents)}</div>
                      )}
                    </div>
                    {bundle.badge && (
                      <div
                        className="absolute -right-1 -top-1 rounded-bl-lg rounded-tr px-2 py-1 text-[9px] font-bold uppercase text-white shadow-sm"
                        style={{ background: "var(--store-primary)" }}
                      >
                        {bundle.badge}
                      </div>
                    )}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
