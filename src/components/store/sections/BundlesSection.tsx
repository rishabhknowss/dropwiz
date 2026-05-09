import { useEffect, useState } from "react";
import { bundlePrice, formatPrice } from "@/lib/format";
import type { BundleData, BundlesVariant } from "@/types/store-sections";
import { cn } from "@/lib/utils";
import { useCartOptional, type CartItem } from "../cart";

type Props = { data: BundleData };

export const BundlesSection = ({ data }: Props) => {
  const variant: BundlesVariant = data.variant ?? "tiers";
  switch (variant) {
    case "compact":
      return <BundlesCompact data={data} />;
    case "showcase":
      return <BundlesShowcase data={data} />;
    default:
      return <BundlesTiers data={data} />;
  }
};

const SavingsBadge = ({ text, recommended }: { text: string; recommended?: boolean }) => (
  <span
    className={cn(
      "rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] @3xl/store:px-2.5 @3xl/store:text-[10px]",
      recommended
        ? "bg-[color:var(--store-primary)] text-[color:var(--store-bg)]"
        : "bg-emerald-500/10 text-emerald-600"
    )}
  >
    {text}
  </span>
);

const BundleQuantityDisplay = ({ quantity, freeQuantity }: { quantity: number; freeQuantity?: number }) => {
  if (freeQuantity && freeQuantity > 0) {
    return (
      <div className="text-[15px] font-semibold @3xl/store:text-[17px]">
        Buy {quantity}, get {freeQuantity} free
      </div>
    );
  }
  return (
    <div className="text-[15px] font-semibold @3xl/store:text-[17px]">
      {quantity} {quantity === 1 ? "item" : "items"}
    </div>
  );
};

const PaymentBadgesSmall = () => (
  <div className="flex items-center justify-center gap-2">
    {["visa", "mastercard", "amex", "paypal", "applepay", "gpay"].map((p) => (
      <div
        key={p}
        className="flex h-10 w-14 items-center justify-center rounded-md"
        style={{
          border: "1px solid color-mix(in srgb, var(--store-text) 8%, transparent)",
          background: "var(--store-bg)",
        }}
      >
        <img
          src={`/payment/${p}.png`}
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

const SecureCheckoutBadge = () => (
  <div className="flex items-center justify-center gap-2 text-[12px] opacity-50">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
    <span>Secure 256-bit SSL checkout</span>
  </div>
);

const BundlesTiers = ({ data }: Props) => {
  const cart = useCartOptional();
  const [selected, setSelected] = useState(() => {
    const recommendedIdx = data.bundles.findIndex((b) => b.recommended);
    return recommendedIdx >= 0 ? recommendedIdx : 0;
  });
  const [addingIndex, setAddingIndex] = useState<number | null>(null);

  useEffect(() => {
    cart?.setBundleData(data);
    cart?.setSelectedBundleIndex(selected);
  }, [data, cart, selected]);

  const handleSelect = (index: number) => {
    setSelected(index);
    cart?.setSelectedBundleIndex(index);
  };

  const handleAddToCart = (index: number) => {
    if (!cart) return;
    const bundle = data.bundles[index];
    const price = bundlePrice(
      data.basePriceCents,
      bundle.quantity + (bundle.freeQuantity ?? 0),
      bundle.discountPercent
    );

    setAddingIndex(index);
    setTimeout(() => setAddingIndex(null), 300);

    const item: CartItem = {
      bundleIndex: index,
      bundle,
      quantity: 1,
      unitPrice: price,
      totalPrice: price,
      currency: data.currency,
      productImage: data.productImage,
      productTitle: cart.productData?.title,
    };
    cart.addToCart(item);
  };

  return (
    <section
      className="px-5 py-14 @3xl/store:px-12 @3xl/store:py-20"
      style={{ borderTop: "1px solid color-mix(in srgb, var(--store-text) 5%, transparent)" }}
    >
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-8 text-center @3xl/store:mb-12">
          <h2 className="text-[26px] font-semibold tracking-[-0.02em] @3xl/store:text-[34px] @5xl/store:text-[38px]">
            BUNDLE &amp; SAVE
          </h2>
          <p className="mt-2 text-[14px] opacity-60 @3xl/store:text-[15px]">
            The more you buy, the more you save
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 @3xl/store:grid-cols-3 @3xl/store:gap-4">
          {data.bundles.map((b, i) => {
            const price = bundlePrice(
              data.basePriceCents,
              b.quantity + (b.freeQuantity ?? 0),
              b.discountPercent,
            );
            const originalPrice = data.basePriceCents * (b.quantity + (b.freeQuantity ?? 0));
            const savingsPercent = Math.round(
              ((originalPrice - price) / originalPrice) * 100
            );
            const isSelected = selected === i;
            return (
              <div
                key={i}
                onClick={() => handleSelect(i)}
                className={cn(
                  "relative flex cursor-pointer flex-col overflow-hidden p-5 transition @3xl/store:p-6",
                  isSelected && "ring-2 ring-[color:var(--store-primary)]",
                )}
                style={{
                  borderRadius: "var(--store-radius)",
                  background: isSelected
                    ? "linear-gradient(to bottom, color-mix(in oklab, var(--store-accent) 8%, var(--store-bg)), var(--store-bg))"
                    : "var(--store-bg)",
                  border: isSelected ? "none" : "1px solid color-mix(in srgb, var(--store-text) 10%, transparent)",
                }}
              >
                {b.badge && (
                  <div className="absolute right-0 top-0 overflow-hidden" style={{ width: "100px", height: "100px" }}>
                    <div
                      className="absolute right-[-35px] top-[18px] w-[140px] rotate-45 py-1.5 text-center text-[9px] font-bold uppercase tracking-[0.08em] shadow-sm @3xl/store:text-[10px]"
                      style={{
                        background: "var(--store-primary)",
                        color: "var(--store-bg)",
                      }}
                    >
                      {b.badge}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition",
                      isSelected && "border-[color:var(--store-primary)] bg-[color:var(--store-primary)]",
                    )}
                    style={{
                      borderColor: isSelected ? undefined : "color-mix(in srgb, var(--store-text) 20%, transparent)",
                    }}
                  >
                    {isSelected && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--store-bg)" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <BundleQuantityDisplay quantity={b.quantity} freeQuantity={b.freeQuantity} />
                </div>
                <div className="mt-1.5 pl-8 text-[12px] opacity-60 @3xl/store:text-[13px]">
                  {b.description}
                </div>
                <div className="my-5 pl-8 @3xl/store:my-6">
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-[28px] font-bold @3xl/store:text-[34px]">
                      {formatPrice(price, data.currency)}
                    </span>
                    <span
                      className="text-[14px] line-through @3xl/store:text-[15px]"
                      style={{ color: "color-mix(in srgb, var(--store-text) 40%, transparent)" }}
                    >
                      {formatPrice(originalPrice, data.currency)}
                    </span>
                  </div>
                  {savingsPercent > 0 && (
                    <div className="mt-2">
                      <SavingsBadge
                        text={`SAVE ${savingsPercent}%`}
                        recommended={isSelected}
                      />
                    </div>
                  )}
                </div>
                {data.productImage && (
                  <div className="mb-4 flex gap-1 pl-8 @3xl/store:mb-5">
                    {Array.from({ length: Math.min(b.quantity + (b.freeQuantity ?? 0), 4) }).map(
                      (_, idx) => (
                        <div
                          key={idx}
                          className="size-12 overflow-hidden rounded-md @3xl/store:size-14"
                          style={{ border: "1px solid color-mix(in srgb, var(--store-text) 5%, transparent)" }}
                        >
                          <img
                            src={data.productImage}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )
                    )}
                    {b.quantity + (b.freeQuantity ?? 0) > 4 && (
                      <div
                        className="flex size-12 items-center justify-center rounded-md text-[11px] font-medium opacity-60 @3xl/store:size-14"
                        style={{
                          border: "1px solid color-mix(in srgb, var(--store-text) 5%, transparent)",
                          background: "color-mix(in srgb, var(--store-text) 2%, transparent)",
                        }}
                      >
                        +{b.quantity + (b.freeQuantity ?? 0) - 4}
                      </div>
                    )}
                  </div>
                )}
                <button
                  data-btn-styled
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(i);
                  }}
                  className={cn(
                    "mt-auto w-full px-4 py-3 text-[13px] font-semibold transition @3xl/store:py-3.5 @3xl/store:text-[14px]",
                    addingIndex === i && "scale-95"
                  )}
                  style={{
                    background: isSelected
                      ? "var(--store-primary)"
                      : "transparent",
                    color: isSelected ? "var(--store-bg)" : "var(--store-text)",
                    border: isSelected ? "none" : "1.5px solid var(--store-primary)",
                    borderRadius: "var(--store-button-radius)",
                  }}
                >
                  Add to cart
                </button>
              </div>
            );
          })}
        </div>
        <div className="mt-6 space-y-3 @3xl/store:mt-8">
          <PaymentBadgesSmall />
          <SecureCheckoutBadge />
        </div>
      </div>
    </section>
  );
};

const BundlesCompact = ({ data }: Props) => {
  const cart = useCartOptional();
  const [selected, setSelected] = useState(() => {
    const recommendedIdx = data.bundles.findIndex((b) => b.recommended);
    return recommendedIdx >= 0 ? recommendedIdx : 0;
  });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    cart?.setBundleData(data);
    cart?.setSelectedBundleIndex(selected);
  }, [data, cart, selected]);

  const handleSelect = (index: number) => {
    setSelected(index);
    cart?.setSelectedBundleIndex(index);
  };

  const handleAddToCart = () => {
    if (!cart) return;
    const bundle = data.bundles[selected];
    const price = bundlePrice(
      data.basePriceCents,
      bundle.quantity + (bundle.freeQuantity ?? 0),
      bundle.discountPercent
    );

    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 300);

    const item: CartItem = {
      bundleIndex: selected,
      bundle,
      quantity: 1,
      unitPrice: price,
      totalPrice: price,
      currency: data.currency,
      productImage: data.productImage,
      productTitle: cart.productData?.title,
    };
    cart.addToCart(item);
  };

  return (
    <section
      className="px-5 py-14 @3xl/store:px-12 @3xl/store:py-20"
      style={{ borderTop: "1px solid color-mix(in srgb, var(--store-text) 5%, transparent)" }}
    >
      <div className="mx-auto max-w-[680px]">
        <h2 className="mb-6 text-center text-[24px] font-semibold tracking-[-0.02em] @3xl/store:mb-8 @3xl/store:text-[30px]">
          BUNDLE &amp; SAVE
        </h2>
        <div
          className="overflow-hidden"
          style={{
            border: "1px solid color-mix(in srgb, var(--store-text) 10%, transparent)",
            borderRadius: "var(--store-radius)",
          }}
        >
          {data.bundles.map((b, i) => {
            const price = bundlePrice(
              data.basePriceCents,
              b.quantity + (b.freeQuantity ?? 0),
              b.discountPercent,
            );
            const originalPrice = data.basePriceCents * (b.quantity + (b.freeQuantity ?? 0));
            const savingsPercent = Math.round(
              ((originalPrice - price) / originalPrice) * 100
            );
            const isLast = i === data.bundles.length - 1;
            const isSelected = selected === i;
            return (
              <label
                key={i}
                onClick={() => handleSelect(i)}
                className="flex cursor-pointer items-center gap-3 px-4 py-4 transition @3xl/store:gap-4 @3xl/store:px-5 @3xl/store:py-5"
                style={{
                  background: isSelected
                    ? "color-mix(in oklab, var(--store-accent) 14%, transparent)"
                    : "transparent",
                  borderBottom: isLast ? "none" : "1px solid color-mix(in srgb, var(--store-text) 5%, transparent)",
                }}
              >
                <div
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition",
                    isSelected && "border-[color:var(--store-primary)] bg-[color:var(--store-primary)]",
                  )}
                  style={{
                    borderColor: isSelected ? undefined : "color-mix(in srgb, var(--store-text) 20%, transparent)",
                  }}
                >
                  {isSelected && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--store-bg)" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <BundleQuantityDisplay quantity={b.quantity} freeQuantity={b.freeQuantity} />
                    {b.badge && (
                      <span
                        className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] @3xl/store:text-[10px]"
                        style={{
                          background: "var(--store-primary)",
                          color: "var(--store-bg)",
                        }}
                      >
                        {b.badge}
                      </span>
                    )}
                  </div>
                  {savingsPercent > 0 && (
                    <div className="mt-1">
                      <SavingsBadge text={`SAVE ${savingsPercent}%`} />
                    </div>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-[17px] font-bold @3xl/store:text-[19px]">
                    {formatPrice(price, data.currency)}
                  </div>
                  <div
                    className="text-[12px] line-through @3xl/store:text-[13px]"
                    style={{ color: "color-mix(in srgb, var(--store-text) 40%, transparent)" }}
                  >
                    {formatPrice(originalPrice, data.currency)}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
        <button
          data-btn-styled
          onClick={handleAddToCart}
          className={cn(
            "mt-5 w-full px-4 py-3.5 text-[14px] font-semibold transition @3xl/store:mt-6 @3xl/store:py-4 @3xl/store:text-[15px]",
            isAdding && "scale-[0.98]"
          )}
          style={{
            background: "var(--store-primary)",
            color: "var(--store-bg)",
            borderRadius: "var(--store-button-radius)",
          }}
        >
          Add to cart
        </button>
        <div className="mt-4 space-y-2">
          <PaymentBadgesSmall />
          <SecureCheckoutBadge />
        </div>
      </div>
    </section>
  );
};

const BundlesShowcase = ({ data }: Props) => {
  const cart = useCartOptional();
  const recommended = data.bundles.find((b) => b.recommended) ?? data.bundles[0];
  const recommendedIndex = data.bundles.indexOf(recommended);
  const others = data.bundles.filter((b) => b !== recommended).slice(0, 3);
  const [selected, setSelected] = useState(recommendedIndex >= 0 ? recommendedIndex : 0);
  const [addingIndex, setAddingIndex] = useState<number | null>(null);

  useEffect(() => {
    cart?.setBundleData(data);
    cart?.setSelectedBundleIndex(selected);
  }, [data, cart, selected]);

  if (!recommended) return null;

  const handleAddToCart = (index: number) => {
    if (!cart) return;
    const bundle = data.bundles[index];
    const price = bundlePrice(
      data.basePriceCents,
      bundle.quantity + (bundle.freeQuantity ?? 0),
      bundle.discountPercent
    );

    setAddingIndex(index);
    setTimeout(() => setAddingIndex(null), 300);
    setSelected(index);
    cart.setSelectedBundleIndex(index);

    const item: CartItem = {
      bundleIndex: index,
      bundle,
      quantity: 1,
      unitPrice: price,
      totalPrice: price,
      currency: data.currency,
      productImage: data.productImage,
      productTitle: cart.productData?.title,
    };
    cart.addToCart(item);
  };

  const recPrice = bundlePrice(
    data.basePriceCents,
    recommended.quantity + (recommended.freeQuantity ?? 0),
    recommended.discountPercent,
  );
  const recOriginalPrice = data.basePriceCents * (recommended.quantity + (recommended.freeQuantity ?? 0));
  const recSavingsPercent = Math.round(
    ((recOriginalPrice - recPrice) / recOriginalPrice) * 100
  );

  return (
    <section
      className="px-5 py-14 @3xl/store:px-12 @3xl/store:py-20"
      style={{ borderTop: "1px solid color-mix(in srgb, var(--store-text) 5%, transparent)" }}
    >
      <div className="mx-auto max-w-[1100px]">
        <h2 className="mb-7 text-center text-[26px] font-semibold tracking-[-0.02em] @3xl/store:mb-10 @3xl/store:text-[34px]">
          BUNDLE &amp; SAVE
        </h2>
        <div className="grid grid-cols-1 gap-4 @3xl/store:gap-6 @5xl/store:grid-cols-[1.5fr_1fr]">
          <div
            className="relative flex flex-col justify-between overflow-hidden p-6 @3xl/store:p-8"
            style={{
              background:
                "linear-gradient(135deg, color-mix(in oklab, var(--store-accent) 18%, var(--store-bg)) 0%, var(--store-bg) 100%)",
              borderRadius: "var(--store-radius)",
            }}
          >
            {recommended.badge && (
              <div className="absolute right-0 top-0 overflow-hidden" style={{ width: "120px", height: "120px" }}>
                <div
                  className="absolute right-[-40px] top-[22px] w-[160px] rotate-45 py-1.5 text-center text-[10px] font-bold uppercase tracking-[0.08em] shadow-sm @3xl/store:text-[11px]"
                  style={{
                    background: "var(--store-primary)",
                    color: "var(--store-bg)",
                  }}
                >
                  {recommended.badge}
                </div>
              </div>
            )}
            <div>
              <BundleQuantityDisplay
                quantity={recommended.quantity}
                freeQuantity={recommended.freeQuantity}
              />
              <p className="mt-2 max-w-[440px] text-[14px] leading-[1.55] opacity-75 @3xl/store:mt-3 @3xl/store:text-[14.5px]">
                {recommended.description}
              </p>
            </div>
            {data.productImage && (
              <div className="my-5 flex gap-2 @3xl/store:my-6">
                {Array.from({ length: Math.min(recommended.quantity + (recommended.freeQuantity ?? 0), 5) }).map(
                  (_, idx) => (
                    <div
                      key={idx}
                      className="size-14 overflow-hidden rounded-lg @3xl/store:size-16"
                      style={{ border: "1px solid color-mix(in srgb, var(--store-text) 5%, transparent)" }}
                    >
                      <img
                        src={data.productImage}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )
                )}
              </div>
            )}
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-[34px] font-bold leading-none @3xl/store:text-[44px]">
                    {formatPrice(recPrice, data.currency)}
                  </span>
                  <span
                    className="text-[16px] line-through @3xl/store:text-[18px]"
                    style={{ color: "color-mix(in srgb, var(--store-text) 40%, transparent)" }}
                  >
                    {formatPrice(recOriginalPrice, data.currency)}
                  </span>
                </div>
                {recSavingsPercent > 0 && (
                  <div className="mt-2">
                    <SavingsBadge text={`SAVE ${recSavingsPercent}%`} recommended />
                  </div>
                )}
              </div>
              <button
                data-btn-styled
                onClick={() => handleAddToCart(recommendedIndex)}
                className={cn(
                  "px-6 py-3.5 text-[14px] font-semibold transition @3xl/store:px-8 @3xl/store:py-4 @3xl/store:text-[15px]",
                  addingIndex === recommendedIndex && "scale-95"
                )}
                style={{
                  background: "var(--store-primary)",
                  color: "var(--store-bg)",
                  borderRadius: "var(--store-button-radius)",
                }}
              >
                Add to cart
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {others.map((b) => {
              const bundleIndex = data.bundles.indexOf(b);
              const price = bundlePrice(
                data.basePriceCents,
                b.quantity + (b.freeQuantity ?? 0),
                b.discountPercent,
              );
              const originalPrice = data.basePriceCents * (b.quantity + (b.freeQuantity ?? 0));
              const savingsPercent = Math.round(
                ((originalPrice - price) / originalPrice) * 100
              );
              return (
                <div
                  key={bundleIndex}
                  onClick={() => {
                    setSelected(bundleIndex);
                    cart?.setSelectedBundleIndex(bundleIndex);
                  }}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-3 p-4 transition @3xl/store:p-5",
                    selected === bundleIndex && "ring-2 ring-[color:var(--store-primary)]"
                  )}
                  style={{
                    border: "1px solid color-mix(in srgb, var(--store-text) 10%, transparent)",
                    borderRadius: "var(--store-radius)",
                  }}
                >
                  <div className="min-w-0">
                    <BundleQuantityDisplay quantity={b.quantity} freeQuantity={b.freeQuantity} />
                    {savingsPercent > 0 && (
                      <div className="mt-1">
                        <SavingsBadge text={`SAVE ${savingsPercent}%`} />
                      </div>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <div className="text-right">
                      <div className="text-[17px] font-bold @3xl/store:text-[19px]">
                        {formatPrice(price, data.currency)}
                      </div>
                      <div
                        className="text-[12px] line-through @3xl/store:text-[13px]"
                        style={{ color: "color-mix(in srgb, var(--store-text) 40%, transparent)" }}
                      >
                        {formatPrice(originalPrice, data.currency)}
                      </div>
                    </div>
                    <button
                      data-btn-styled
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(bundleIndex);
                      }}
                      className={cn(
                        "px-3 py-2 text-[12px] font-medium transition",
                        addingIndex === bundleIndex && "scale-95"
                      )}
                      style={{
                        borderRadius: "var(--store-button-radius)",
                        border: "1px solid color-mix(in srgb, var(--store-text) 20%, transparent)",
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-6 space-y-3 @3xl/store:mt-8">
          <PaymentBadgesSmall />
          <SecureCheckoutBadge />
        </div>
      </div>
    </section>
  );
};
