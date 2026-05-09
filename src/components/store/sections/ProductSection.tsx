import { useState } from "react";
import { formatPrice } from "@/lib/format";
import type { ProductData, ProductVariant, PaymentMethod, ProductSideFeature } from "@/types/store-sections";
import { cn } from "@/lib/utils";
import { StoreIcon } from "@/components/editor/inspectors/fields/IconPickerField";

type Props = { data: ProductData };

export const ProductSection = ({ data }: Props) => {
  const variant: ProductVariant = data.variant ?? "default";
  switch (variant) {
    case "gallery":
      return <ProductGallery data={data} />;
    case "compact":
      return <ProductCompact data={data} />;
    case "rich":
      return <ProductRich data={data} />;
    default:
      return <ProductDefault data={data} />;
  }
};

const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = ["visa", "mastercard", "amex", "paypal", "applepay", "googlepay"];

const PAYMENT_METHOD_MAP: Record<string, string> = {
  visa: "visa",
  mastercard: "mastercard",
  amex: "amex",
  paypal: "paypal",
  applepay: "applepay",
  googlepay: "gpay",
  discover: "discover",
  stripe: "stripe",
};

const PaymentBadges = ({
  methods,
  show = true,
}: {
  methods?: PaymentMethod[];
  show?: boolean;
}) => {
  if (!show) return null;
  const activePayments = methods ?? DEFAULT_PAYMENT_METHODS;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {activePayments.map((p) => (
        <div
          key={p}
          className="flex h-10 w-14 items-center justify-center rounded-md"
          style={{
            border: "1px solid color-mix(in srgb, var(--store-text) 8%, transparent)",
            background: "var(--store-bg)",
          }}
        >
          <img
            src={`/payment/${PAYMENT_METHOD_MAP[p] ?? p}.png`}
            alt={p}
            className="h-5 w-auto"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      ))}
    </div>
  );
};

const RatingDisplay = ({ rating, reviewCount }: { rating: number; reviewCount: number }) => (
  <div className="flex items-center gap-2">
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className="text-[13px] @3xl/store:text-[14px]"
          style={{ color: star <= Math.round(rating) ? "#fbbf24" : "color-mix(in srgb, var(--store-text) 15%, transparent)" }}
        >
          ★
        </span>
      ))}
    </div>
    <span className="text-[12px] @3xl/store:text-[13px]" style={{ color: "color-mix(in srgb, var(--store-text) 60%, transparent)" }}>
      {rating.toFixed(1)}/5 ({reviewCount.toLocaleString()}+ reviews)
    </span>
  </div>
);

const ProductBadge = ({ label }: { label: string }) => (
  <span
    className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.06em] @3xl/store:px-3 @3xl/store:text-[11px]"
    style={{
      background: "var(--store-primary)",
      color: "var(--store-bg)",
    }}
  >
    {label}
  </span>
);

const FeatureBadges = ({ features }: { features: Array<{ icon: string; label: string }> }) => (
  <div className="flex flex-wrap gap-2 @3xl/store:gap-2.5">
    {features.map((f, i) => (
      <div
        key={i}
        className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] @3xl/store:px-3 @3xl/store:text-[12px]"
        style={{
          borderColor: "color-mix(in srgb, var(--store-text) 8%, transparent)",
          background: "color-mix(in srgb, var(--store-text) 2%, transparent)",
        }}
      >
        <StoreIcon name={f.icon} size={14} />
        <span className="font-medium">{f.label}</span>
      </div>
    ))}
  </div>
);

const ImageGallery = ({ images, mainImage }: { images?: string[]; mainImage: string }) => {
  const allImages = images?.length ? images : [mainImage];
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col gap-3 @3xl/store:flex-row @3xl/store:gap-4">
      <div className="order-2 flex gap-2 overflow-x-auto pb-1 @3xl/store:order-1 @3xl/store:w-[72px] @3xl/store:flex-col @3xl/store:overflow-visible @3xl/store:pb-0">
        {allImages.slice(0, 6).map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={cn(
              "relative size-14 shrink-0 overflow-hidden transition @3xl/store:size-[72px]",
              activeIndex === i
                ? "ring-2 ring-[color:var(--store-primary)] ring-offset-2"
                : "opacity-60 hover:opacity-100"
            )}
            style={{ borderRadius: "calc(var(--store-radius) * 0.5)" }}
          >
            <img src={img} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
      <div
        data-img-styled
        className="relative order-1 aspect-square flex-1 overflow-hidden @3xl/store:order-2"
        style={{ borderRadius: "var(--store-radius)" }}
      >
        <img
          src={allImages[activeIndex] ?? mainImage}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

const ProductDefault = ({ data }: Props) => (
  <section
    className="border-t px-5 py-12 @3xl/store:px-12 @3xl/store:py-16"
    style={{ borderColor: "color-mix(in srgb, var(--store-text) 5%, transparent)" }}
  >
    <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-8 @3xl/store:gap-12 @5xl/store:grid-cols-[1.1fr_1fr]">
      <ImageGallery images={data.images} mainImage={data.imageUrl} />
      <div className="@5xl/store:sticky @5xl/store:top-8">
        {data.rating && data.reviewCount && (
          <div className="mb-3 @3xl/store:mb-4">
            <RatingDisplay rating={data.rating} reviewCount={data.reviewCount} />
          </div>
        )}
        <h2 className="text-[26px] font-medium leading-[1.15] tracking-[-0.02em] @3xl/store:text-[32px] @5xl/store:text-[36px]">
          {data.title}
        </h2>
        {data.subtitle && (
          <p className="mt-1.5 text-[13px] font-medium uppercase tracking-[0.08em] opacity-50 @3xl/store:mt-2 @3xl/store:text-[14px]">
            {data.subtitle}
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-baseline gap-3 @3xl/store:mt-5">
          <span className="text-[28px] font-semibold @3xl/store:text-[34px]">
            {formatPrice(data.priceCents, data.currency)}
          </span>
          {data.originalPriceCents && data.originalPriceCents > data.priceCents && (
            <span
              className="text-[16px] line-through @3xl/store:text-[18px]"
              style={{ color: "color-mix(in srgb, var(--store-text) 40%, transparent)" }}
            >
              {formatPrice(data.originalPriceCents, data.currency)}
            </span>
          )}
          {data.badge && <ProductBadge label={data.badge} />}
        </div>
        {data.description && (
          <p className="mt-4 max-w-[480px] text-[14px] leading-[1.6] opacity-75 @3xl/store:mt-5 @3xl/store:text-[15px]">
            {data.description}
          </p>
        )}
        {data.features && data.features.length > 0 && (
          <div className="mt-5 @3xl/store:mt-6">
            <FeatureBadges features={data.features} />
          </div>
        )}
        <button
          data-btn-styled
          className="mt-6 w-full px-5 py-3.5 text-[14px] font-semibold @3xl/store:mt-8 @3xl/store:px-6 @3xl/store:py-4 @3xl/store:text-[15px]"
          style={{
            background: "var(--store-primary)",
            color: "var(--store-bg)",
            borderRadius: "var(--store-button-radius)",
          }}
        >
          Add to cart — {formatPrice(data.priceCents, data.currency)}
        </button>
        <div className="mt-4 @3xl/store:mt-5">
          <PaymentBadges show={data.showPaymentBadges !== false} methods={data.paymentMethods} />
        </div>
      </div>
    </div>
  </section>
);

const ProductGallery = ({ data }: Props) => {
  const allImages = data.images?.length ? data.images : [data.imageUrl];
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      className="border-t px-5 py-12 @3xl/store:px-12 @3xl/store:py-16"
      style={{ borderColor: "color-mix(in srgb, var(--store-text) 5%, transparent)" }}
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="grid grid-cols-1 gap-8 @3xl/store:gap-10 @5xl/store:grid-cols-2">
          <div className="space-y-3 @3xl/store:space-y-4">
            <div
              data-img-styled
              className="relative aspect-square overflow-hidden"
              style={{ borderRadius: "var(--store-radius)" }}
            >
              <img
                src={allImages[activeIndex] ?? data.imageUrl}
                alt=""
                className="h-full w-full object-cover"
              />
              {data.badge && (
                <div className="absolute left-3 top-3 @3xl/store:left-4 @3xl/store:top-4">
                  <ProductBadge label={data.badge} />
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2 @3xl/store:gap-3">
              {allImages.slice(0, 4).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                    "relative aspect-square overflow-hidden transition",
                    activeIndex === i
                      ? "ring-2 ring-[color:var(--store-primary)]"
                      : "opacity-60 hover:opacity-100"
                  )}
                  style={{ borderRadius: "calc(var(--store-radius) * 0.6)" }}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-center">
            {data.rating && data.reviewCount && (
              <div className="mb-4">
                <RatingDisplay rating={data.rating} reviewCount={data.reviewCount} />
              </div>
            )}
            <h2 className="text-[28px] font-medium leading-[1.1] tracking-[-0.02em] @3xl/store:text-[36px] @5xl/store:text-[42px]">
              {data.title}
            </h2>
            {data.subtitle && (
              <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.1em] opacity-50 @3xl/store:text-[13px]">
                {data.subtitle}
              </p>
            )}
            <div className="mt-5 flex flex-wrap items-baseline gap-3 @3xl/store:mt-6">
              <span className="text-[32px] font-semibold @3xl/store:text-[40px]">
                {formatPrice(data.priceCents, data.currency)}
              </span>
              {data.originalPriceCents && data.originalPriceCents > data.priceCents && (
                <span
                  className="text-[18px] line-through @3xl/store:text-[20px]"
                  style={{ color: "color-mix(in srgb, var(--store-text) 40%, transparent)" }}
                >
                  {formatPrice(data.originalPriceCents, data.currency)}
                </span>
              )}
            </div>
            {data.description && (
              <p className="mt-4 text-[14.5px] leading-[1.6] opacity-72 @3xl/store:mt-5 @3xl/store:text-[15px]">
                {data.description}
              </p>
            )}
            {data.features && data.features.length > 0 && (
              <div className="mt-5 @3xl/store:mt-6">
                <FeatureBadges features={data.features} />
              </div>
            )}
            <button
              data-btn-styled
              className="mt-7 w-full px-5 py-4 text-[14px] font-semibold @3xl/store:mt-8 @3xl/store:py-4.5 @3xl/store:text-[15px]"
              style={{
                background: "var(--store-primary)",
                color: "var(--store-bg)",
                borderRadius: "var(--store-button-radius)",
              }}
            >
              Add to cart
            </button>
            <div className="mt-4">
              <PaymentBadges show={data.showPaymentBadges !== false} methods={data.paymentMethods} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ProductCompact = ({ data }: Props) => (
  <section
    className="border-t px-5 py-10 @3xl/store:px-12 @3xl/store:py-14"
    style={{ borderColor: "color-mix(in srgb, var(--store-text) 5%, transparent)" }}
  >
    <div className="mx-auto max-w-[720px]">
      <div className="flex flex-col items-center text-center">
        {data.rating && data.reviewCount && (
          <div className="mb-4">
            <RatingDisplay rating={data.rating} reviewCount={data.reviewCount} />
          </div>
        )}
        <h2 className="text-[26px] font-medium leading-[1.1] tracking-[-0.02em] @3xl/store:text-[34px]">
          {data.title}
        </h2>
        <div className="mt-3 flex flex-wrap items-baseline justify-center gap-3 @3xl/store:mt-4">
          <span className="text-[26px] font-semibold @3xl/store:text-[32px]">
            {formatPrice(data.priceCents, data.currency)}
          </span>
          {data.originalPriceCents && data.originalPriceCents > data.priceCents && (
            <span
              className="text-[16px] line-through"
              style={{ color: "color-mix(in srgb, var(--store-text) 40%, transparent)" }}
            >
              {formatPrice(data.originalPriceCents, data.currency)}
            </span>
          )}
          {data.badge && <ProductBadge label={data.badge} />}
        </div>
        {data.description && (
          <p className="mt-4 max-w-[520px] text-[14px] leading-[1.6] opacity-70 @3xl/store:text-[15px]">
            {data.description}
          </p>
        )}
        <button
          data-btn-styled
          className="mt-6 px-8 py-3.5 text-[14px] font-semibold @3xl/store:mt-7 @3xl/store:px-10 @3xl/store:py-4 @3xl/store:text-[15px]"
          style={{
            background: "var(--store-primary)",
            color: "var(--store-bg)",
            borderRadius: "var(--store-button-radius)",
          }}
        >
          Add to cart — {formatPrice(data.priceCents, data.currency)}
        </button>
        <div className="mt-4 flex justify-center">
          <PaymentBadges show={data.showPaymentBadges !== false} methods={data.paymentMethods} />
        </div>
      </div>
    </div>
  </section>
);

const SideFeatureCard = ({ icon, label }: ProductSideFeature) => (
  <div
    data-card-styled
    className="flex flex-col items-center justify-center gap-2 border px-4 py-5 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    style={{
      borderRadius: "var(--store-radius)",
      borderColor: "color-mix(in srgb, var(--store-text) 8%, transparent)",
      background: "var(--store-bg)",
    }}
  >
    <span style={{ color: "var(--store-primary)" }}>
      <StoreIcon name={icon} size={28} />
    </span>
    <span
      className="text-[12px] font-semibold leading-tight"
      style={{ color: "var(--store-text)" }}
    >
      {label}
    </span>
  </div>
);

const ProductRich = ({ data }: Props) => {
  const allImages = data.images?.length ? data.images : [data.imageUrl];
  const galleryImages = data.galleryImages ?? [];
  const sideFeatures = data.sideFeatures ?? [];
  const [activeIndex, setActiveIndex] = useState(0);
  const hasSideFeatures = sideFeatures.length > 0;

  return (
    <section
      className="border-t px-5 py-12 @3xl/store:px-10 @3xl/store:py-16"
      style={{ borderColor: "color-mix(in srgb, var(--store-text) 5%, transparent)" }}
    >
      <div className="mx-auto max-w-[1300px]">
        <div
          className={cn(
            "grid grid-cols-1 gap-8 @3xl/store:gap-6",
            hasSideFeatures
              ? "@3xl/store:grid-cols-[120px_1fr_1fr]"
              : "@3xl/store:grid-cols-2"
          )}
        >
          {hasSideFeatures && (
            <div className="hidden flex-col gap-3 @3xl/store:flex">
              {sideFeatures.slice(0, 4).map((feat, i) => (
                <SideFeatureCard key={i} icon={feat.icon} label={feat.label} />
              ))}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <div
              data-img-styled
              className="relative aspect-square w-full overflow-hidden"
              style={{ borderRadius: "var(--store-radius)" }}
            >
              <img
                src={allImages[activeIndex] ?? data.imageUrl}
                alt=""
                className="h-full w-full object-cover"
              />
              {data.badge && (
                <div className="absolute left-3 top-3 @3xl/store:left-4 @3xl/store:top-4">
                  <ProductBadge label={data.badge} />
                </div>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.slice(0, 6).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={cn(
                      "relative size-16 shrink-0 overflow-hidden transition @3xl/store:size-[72px]",
                      activeIndex === i
                        ? "ring-2 ring-[color:var(--store-primary)] ring-offset-2"
                        : "opacity-60 hover:opacity-100"
                    )}
                    style={{ borderRadius: "calc(var(--store-radius) * 0.5)" }}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {hasSideFeatures && (
              <div className="mt-2 grid grid-cols-2 gap-2 @3xl/store:hidden">
                {sideFeatures.slice(0, 4).map((feat, i) => (
                  <SideFeatureCard key={i} icon={feat.icon} label={feat.label} />
                ))}
              </div>
            )}
          </div>

          <div className="@3xl/store:sticky @3xl/store:top-8 @3xl/store:self-start">
            {data.rating && data.reviewCount && (
              <div className="mb-3 @3xl/store:mb-4">
                <RatingDisplay rating={data.rating} reviewCount={data.reviewCount} />
              </div>
            )}
            <h2 className="text-[24px] font-bold leading-[1.15] tracking-[-0.02em] @3xl/store:text-[28px] @5xl/store:text-[32px]">
              {data.title}
            </h2>
            {data.subtitle && (
              <p className="mt-1.5 text-[12px] font-medium uppercase tracking-[0.08em] opacity-50 @3xl/store:mt-2 @3xl/store:text-[13px]">
                {data.subtitle}
              </p>
            )}
            <div className="mt-4 flex flex-wrap items-baseline gap-3 @3xl/store:mt-5">
              <span className="text-[26px] font-bold @3xl/store:text-[30px]">
                {formatPrice(data.priceCents, data.currency)}
              </span>
              {data.originalPriceCents && data.originalPriceCents > data.priceCents && (
                <span
                  className="text-[15px] line-through @3xl/store:text-[17px]"
                  style={{ color: "color-mix(in srgb, var(--store-text) 40%, transparent)" }}
                >
                  {formatPrice(data.originalPriceCents, data.currency)}
                </span>
              )}
              {data.badge && <ProductBadge label={data.badge} />}
            </div>
            {data.description && (
              <p className="mt-4 text-[14px] leading-[1.6] opacity-75 @3xl/store:mt-5 @3xl/store:text-[15px]">
                {data.description}
              </p>
            )}
            {data.features && data.features.length > 0 && (
              <div className="mt-5 @3xl/store:mt-6">
                <FeatureBadges features={data.features} />
              </div>
            )}
            <button
              data-btn-styled
              className="mt-6 w-full px-5 py-4 text-[14px] font-bold uppercase tracking-wider @3xl/store:mt-8 @3xl/store:py-4.5 @3xl/store:text-[15px]"
              style={{
                background: "var(--store-primary)",
                color: "var(--store-bg)",
                borderRadius: "var(--store-button-radius)",
              }}
            >
              Add to cart
            </button>
            <div className="mt-4 @3xl/store:mt-5">
              <PaymentBadges show={data.showPaymentBadges !== false} methods={data.paymentMethods} />
            </div>
          </div>
        </div>

        {galleryImages.length > 0 && (
          <div className="mt-10 @3xl/store:mt-14">
            <div className="grid grid-cols-2 gap-3 @3xl/store:grid-cols-4 @3xl/store:gap-4">
              {galleryImages.map((img, i) => (
                <div
                  key={i}
                  data-img-styled
                  className="relative aspect-square overflow-hidden transition-transform hover:scale-[1.02]"
                  style={{ borderRadius: "var(--store-radius)" }}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
