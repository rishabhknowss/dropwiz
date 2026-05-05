import { useState } from "react";
import type { HeroData, HeroVariant, FeatureBadge, HeroBundle } from "@/types/store-sections";
import { useCartOptional } from "../cart";
import { cn } from "@/lib/utils";

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
        className="flex items-center gap-1.5 rounded-full border border-black/8 bg-black/[0.02] px-2.5 py-1 text-[11px] font-medium @3xl/store:px-3 @3xl/store:text-[12px]"
      >
        <span className="text-[13px] @3xl/store:text-[14px]">{badge.icon}</span>
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
          className={cn(
            "text-[12px] @3xl/store:text-[13px]",
            star <= Math.round(rating) ? "text-amber-400" : "text-black/15"
          )}
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


const PrimaryCta = ({ label }: { label: string }) => (
  <button
    className="inline-flex items-center gap-2 px-5 py-3 text-[13px] font-semibold @3xl/store:px-6 @3xl/store:py-3.5 @3xl/store:text-[14px]"
    style={{
      background: "var(--store-primary)",
      color: "var(--store-bg)",
      borderRadius: "var(--store-radius)",
    }}
  >
    {label}
  </button>
);

const SecondaryCta = ({ label }: { label: string }) => (
  <button
    className="inline-flex items-center gap-2 border px-5 py-3 text-[13px] font-medium @3xl/store:px-6 @3xl/store:py-3.5 @3xl/store:text-[14px]"
    style={{
      borderColor: "rgba(10,10,10,0.18)",
      color: "var(--store-text)",
      borderRadius: "var(--store-radius)",
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
        <div className="h-px flex-1 bg-black/10" />
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-black/60">Bundle & Save</span>
        <div className="h-px flex-1 bg-black/10" />
      </div>

      <div className="space-y-2.5">
        {bundles.map((bundle, idx) => {
          const isSelected = selectedIdx === idx;
          const showFree = bundle.freeQuantity && bundle.freeQuantity > 0;
          return (
            <label
              key={idx}
              className={cn(
                "relative flex cursor-pointer items-center gap-4 rounded-xl border-2 px-4 py-4 transition-all",
                isSelected
                  ? "border-black bg-white shadow-sm"
                  : "border-black/10 bg-white/50 hover:border-black/20"
              )}
            >
              <input
                type="radio"
                name="hero-bundle"
                checked={isSelected}
                onChange={() => onSelect(idx)}
                className="sr-only"
              />
              <div
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  isSelected ? "border-black" : "border-black/30"
                )}
              >
                {isSelected && <div className="h-3 w-3 rounded-full bg-black" />}
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
                  <div className="text-[13px] text-black/40 line-through">{formatPrice(bundle.originalPriceCents)}</div>
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
        onClick={onAddToCart}
        className="mt-5 w-full py-4 text-[15px] font-bold uppercase tracking-wider text-white transition-transform hover:scale-[1.01] active:scale-[0.99]"
        style={{
          background: "var(--store-primary)",
          borderRadius: "var(--store-radius)",
        }}
      >
        {ctaLabel || "Add to Cart"}
      </button>

      <div className="mt-4 flex items-center justify-center gap-2">
        {["amex", "visa", "mastercard", "paypal", "shopify", "gpay", "applepay"].map((p) => (
          <div
            key={p}
            className="flex h-7 w-10 items-center justify-center rounded border border-black/8 bg-white"
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
                  className="border border-white/40 px-5 py-3 text-[13px] font-medium text-white @3xl/store:px-6 @3xl/store:py-3.5 @3xl/store:text-[14px]"
                  style={{ borderRadius: "var(--store-radius)" }}
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
        <div className="border-t border-black/15 pt-4 text-[14.5px] leading-[1.55] opacity-75 @3xl/store:pt-5 @3xl/store:text-[15px]">
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

const ProductHeroSideCard = ({ icon, label }: { icon: string; label: string }) => (
  <div
    className="flex items-center gap-3 rounded-xl border border-black/8 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm"
    style={{ borderRadius: "var(--store-radius)" }}
  >
    <span className="text-[20px]">{icon}</span>
    <span className="text-[13px] font-medium leading-tight">{label}</span>
  </div>
);

const PaymentBadges = () => (
  <div className="flex items-center gap-3">
    <div className="flex items-center gap-1.5 rounded border border-black/10 bg-white px-2 py-1">
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
    <div className="flex items-center gap-1 text-[11px] text-black/50">
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
      <span>Secure checkout</span>
    </div>
  </div>
);

const HeroProductHero = ({ data }: Props) => {
  const cart = useCartOptional();
  const [selectedBundleIdx, setSelectedBundleIdx] = useState(0);
  const bundles = data.bundles ?? [];
  const sideFeatures = data.sideFeatures ?? [];
  const selectedBundle = bundles[selectedBundleIdx] ?? null;
  const currency = data.currency ?? "USD";

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
    <section className="relative min-h-[100svh] overflow-hidden" style={{ background: "var(--store-bg)" }}>
      <div className="absolute inset-0 bg-gradient-to-b from-black/[0.02] to-transparent" />

      <header className="relative z-20 flex items-center justify-between px-5 py-4 @3xl/store:px-10 @3xl/store:py-5">
        <div className="flex items-center gap-2">
          <span className="text-[16px] font-bold tracking-[-0.02em] @3xl/store:text-[18px]" style={{ color: "var(--store-text)" }}>
            {data.brandName ?? "Brand"}
          </span>
        </div>
        <div className="hidden items-center gap-6 @3xl/store:flex">
          {data.navLinks?.map((link, i) => (
            <a key={i} href={link.href} className="text-[13px] font-medium text-black/70 hover:text-black">
              {link.label}
            </a>
          ))}
        </div>
        <button
          className="rounded-full border border-black/10 bg-white/80 px-4 py-2 text-[12px] font-medium shadow-sm backdrop-blur"
          style={{ borderRadius: "var(--store-radius)" }}
        >
          Shop Now
        </button>
      </header>

      <div className="relative z-10 px-5 pb-12 @3xl/store:px-10 @3xl/store:pb-16">
        <div className="mx-auto grid max-w-[1300px] grid-cols-1 items-center gap-8 @3xl/store:grid-cols-[1fr_auto_1fr] @3xl/store:gap-6">
          <div className="hidden flex-col gap-3 @3xl/store:flex">
            {sideFeatures.slice(0, 2).map((feat, i) => (
              <ProductHeroSideCard key={i} icon={feat.icon} label={feat.label} />
            ))}
          </div>

          <div className="relative mx-auto w-full max-w-[400px] @3xl/store:max-w-[480px]">
            {data.productBadge && (
              <div
                className="absolute left-4 top-4 z-10 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg @3xl/store:text-[11px]"
                style={{ background: "var(--store-primary)" }}
              >
                {data.productBadge}
              </div>
            )}
            <div className="aspect-square overflow-hidden rounded-2xl shadow-2xl" style={{ borderRadius: "var(--store-radius)" }}>
              {data.imageUrl ? (
                <img src={data.imageUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full" style={{ background: "linear-gradient(135deg, var(--store-accent) 0%, var(--store-primary) 100%)" }} />
              )}
            </div>
          </div>

          <div className="hidden flex-col gap-3 @3xl/store:flex">
            {sideFeatures.slice(2, 4).map((feat, i) => (
              <ProductHeroSideCard key={i} icon={feat.icon} label={feat.label} />
            ))}
          </div>
        </div>

        <div className="mx-auto mt-8 grid grid-cols-2 gap-2 @3xl/store:hidden">
          {sideFeatures.slice(0, 4).map((feat, i) => (
            <ProductHeroSideCard key={i} icon={feat.icon} label={feat.label} />
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-[520px] text-center @3xl/store:mt-12">
          {data.rating && data.reviewCount && (
            <div className="mb-4 flex items-center justify-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={cn("text-[14px]", star <= Math.round(data.rating!) ? "text-amber-400" : "text-black/15")}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-[12px] text-black/60">
                {data.rating.toFixed(1)} ({data.reviewCount.toLocaleString()}+ reviews)
              </span>
            </div>
          )}

          <h1
            className="text-[28px] font-semibold leading-[1.1] tracking-[-0.02em] @3xl/store:text-[36px]"
            style={{ color: "var(--store-text)" }}
          >
            {data.headline}
          </h1>

          <p className="mt-3 text-[14px] leading-[1.5] text-black/65 @3xl/store:text-[15px]">
            {data.subheadline}
          </p>

          <div className="mt-4 flex items-center justify-center gap-3">
            {selectedBundle ? (
              <>
                <span className="text-[24px] font-bold @3xl/store:text-[28px]" style={{ color: "var(--store-text)" }}>
                  {formatPrice(selectedBundle.priceCents)}
                </span>
                {selectedBundle.originalPriceCents && (
                  <span className="text-[16px] text-black/40 line-through @3xl/store:text-[18px]">
                    {formatPrice(selectedBundle.originalPriceCents)}
                  </span>
                )}
              </>
            ) : (
              <>
                {data.priceCents && (
                  <span className="text-[24px] font-bold @3xl/store:text-[28px]" style={{ color: "var(--store-text)" }}>
                    {formatPrice(data.priceCents)}
                  </span>
                )}
                {data.originalPriceCents && (
                  <span className="text-[16px] text-black/40 line-through @3xl/store:text-[18px]">
                    {formatPrice(data.originalPriceCents)}
                  </span>
                )}
              </>
            )}
            {selectedBundle?.savings && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700">
                Save {selectedBundle.savings}
              </span>
            )}
          </div>

          {bundles.length > 0 && (
            <div className="mx-auto mt-6 max-w-[400px] space-y-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-black/50">Bundle & Save</div>
              {bundles.map((bundle, idx) => (
                <label
                  key={idx}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-all",
                    selectedBundleIdx === idx
                      ? "border-2 bg-white shadow-sm"
                      : "border-black/10 bg-white/50 hover:border-black/20"
                  )}
                  style={{
                    borderRadius: "var(--store-radius)",
                    borderColor: selectedBundleIdx === idx ? "var(--store-primary)" : undefined,
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
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
                      selectedBundleIdx === idx ? "border-[var(--store-primary)]" : "border-black/20"
                    )}
                    style={{ borderColor: selectedBundleIdx === idx ? "var(--store-primary)" : undefined }}
                  >
                    {selectedBundleIdx === idx && (
                      <div className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--store-primary)" }} />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold">
                        {bundle.quantity}x {bundle.freeQuantity ? `+ ${bundle.freeQuantity} Free` : ""}
                      </span>
                      {bundle.badge && (
                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-700">
                          {bundle.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-black/50">{bundle.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[14px] font-bold">{formatPrice(bundle.priceCents)}</div>
                    {bundle.originalPriceCents && (
                      <div className="text-[11px] text-black/40 line-through">{formatPrice(bundle.originalPriceCents)}</div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          )}

          <button
            onClick={handleAddToCart}
            className="mt-6 w-full max-w-[400px] py-4 text-[14px] font-semibold uppercase tracking-wider transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "var(--store-primary)",
              color: "var(--store-bg)",
              borderRadius: "var(--store-radius)",
            }}
          >
            {data.primaryCta || "Add to Cart"}
          </button>

          <div className="mt-4 flex justify-center">
            <PaymentBadges />
          </div>

          {data.trustBadges && data.trustBadges.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              {data.trustBadges.map((badge, i) => (
                <span key={i} className="text-[11px] text-black/50">✓ {badge}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
