import { bundlePrice, formatPrice } from "@/lib/format";
import type { BundleData, BundlesVariant } from "@/types/store-sections";
import { cn } from "@/lib/utils";

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

const BundlesTiers = ({ data }: Props) => (
  <section className="border-t border-black/5 px-5 py-14 @3xl/store:px-12 @3xl/store:py-20">
    <div className="mx-auto max-w-[1100px]">
      <h2 className="mb-2 text-[26px] font-medium tracking-[-0.03em] @3xl/store:text-[36px] @5xl/store:text-[40px]">
        Bundle &amp; save
      </h2>
      <p className="mb-8 text-[14.5px] opacity-70 @3xl/store:mb-12 @3xl/store:text-[15px]">
        More items, bigger savings. Most popular is highlighted.
      </p>
      <div className="grid grid-cols-1 gap-3 @3xl/store:grid-cols-2 @3xl/store:gap-4 @5xl/store:grid-cols-4">
        {data.bundles.map((b, i) => {
          const price = bundlePrice(
            data.basePriceCents,
            b.quantity,
            b.discountPercent,
          );
          return (
            <div
              key={i}
              className={cn(
                "relative flex flex-col p-5 @3xl/store:p-6",
                b.recommended ? "ring-2" : "border",
              )}
              style={{
                borderColor: "rgba(10,10,10,0.1)",
                ...(b.recommended
                  ? { boxShadow: `0 0 0 2px var(--store-primary)` }
                  : {}),
                borderRadius: "var(--store-radius)",
                background: b.recommended ? "var(--store-bg)" : "transparent",
              }}
            >
              {b.badge && (
                <div
                  className="absolute -top-3 left-4 rounded-full px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.14em] @3xl/store:left-5 @3xl/store:px-3 @3xl/store:text-[10px]"
                  style={{
                    background: "var(--store-primary)",
                    color: "var(--store-bg)",
                  }}
                >
                  {b.badge}
                </div>
              )}
              <div className="text-[16.5px] font-semibold @3xl/store:text-[18px]">
                {b.name}
              </div>
              <div className="mt-1 text-[12.5px] opacity-65 @3xl/store:text-[13px]">
                {b.description}
              </div>
              <div className="my-5 @3xl/store:my-6">
                <div className="text-[28px] font-semibold @3xl/store:text-[32px]">
                  {formatPrice(price, data.currency)}
                </div>
                <div className="mt-1 text-[11.5px] opacity-60 @3xl/store:text-[12px]">
                  {b.quantity} × — {b.savings}
                </div>
              </div>
              <button
                className="mt-auto w-full px-4 py-2.5 text-[12.5px] font-semibold @3xl/store:py-3 @3xl/store:text-[13px]"
                style={{
                  background: b.recommended
                    ? "var(--store-primary)"
                    : "transparent",
                  color: b.recommended ? "var(--store-bg)" : "var(--store-text)",
                  border: b.recommended ? "none" : "1px solid rgba(10,10,10,0.18)",
                  borderRadius: "var(--store-radius)",
                }}
              >
                Add bundle
              </button>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

const BundlesCompact = ({ data }: Props) => (
  <section className="border-t border-black/5 px-5 py-14 @3xl/store:px-12 @3xl/store:py-20">
    <div className="mx-auto max-w-[680px]">
      <h2 className="mb-6 text-center text-[24px] font-medium tracking-[-0.03em] @3xl/store:mb-8 @3xl/store:text-[32px] @5xl/store:text-[36px]">
        Pick a bundle
      </h2>
      <div
        className="overflow-hidden border"
        style={{
          borderColor: "rgba(10,10,10,0.1)",
          borderRadius: "var(--store-radius)",
        }}
      >
        {data.bundles.map((b, i) => {
          const price = bundlePrice(
            data.basePriceCents,
            b.quantity,
            b.discountPercent,
          );
          const isLast = i === data.bundles.length - 1;
          return (
            <label
              key={i}
              className={cn(
                "flex cursor-pointer items-center gap-3 px-4 py-3.5 transition @3xl/store:gap-4 @3xl/store:px-5 @3xl/store:py-4",
                !isLast && "border-b border-black/5",
              )}
              style={{
                background: b.recommended
                  ? "color-mix(in oklab, var(--store-accent) 14%, transparent)"
                  : "transparent",
              }}
            >
              <input
                type="radio"
                name="bundle-compact"
                defaultChecked={b.recommended}
                className="size-4 accent-[color:var(--store-primary)]"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[14px] font-semibold @3xl/store:text-[15px]">
                    {b.name}
                  </span>
                  {b.badge && (
                    <span
                      className="rounded-full px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.12em] @3xl/store:text-[10px]"
                      style={{
                        background: "var(--store-primary)",
                        color: "var(--store-bg)",
                      }}
                    >
                      {b.badge}
                    </span>
                  )}
                </div>
                <div className="mt-0.5 text-[11.5px] opacity-65 @3xl/store:text-[12px]">
                  {b.savings}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-[15px] font-semibold @3xl/store:text-[16px]">
                  {formatPrice(price, data.currency)}
                </div>
                <div className="text-[10.5px] opacity-55 @3xl/store:text-[11px]">
                  {b.quantity} pack
                </div>
              </div>
            </label>
          );
        })}
      </div>
      <button
        className="mt-4 w-full px-4 py-3 text-[13.5px] font-semibold @3xl/store:mt-5 @3xl/store:py-3.5 @3xl/store:text-[14px]"
        style={{
          background: "var(--store-primary)",
          color: "var(--store-bg)",
          borderRadius: "var(--store-radius)",
        }}
      >
        Add to cart
      </button>
    </div>
  </section>
);

const BundlesShowcase = ({ data }: Props) => {
  const recommended = data.bundles.find((b) => b.recommended) ?? data.bundles[0];
  const others = data.bundles.filter((b) => b !== recommended).slice(0, 3);
  if (!recommended) return null;
  const recPrice = bundlePrice(
    data.basePriceCents,
    recommended.quantity,
    recommended.discountPercent,
  );
  return (
    <section className="border-t border-black/5 px-5 py-14 @3xl/store:px-12 @3xl/store:py-20">
      <div className="mx-auto max-w-[1100px]">
        <h2 className="mb-7 text-[26px] font-medium tracking-[-0.03em] @3xl/store:mb-10 @3xl/store:text-[36px] @5xl/store:text-[40px]">
          Bundle &amp; save
        </h2>
        <div className="grid grid-cols-1 gap-4 @3xl/store:gap-6 @5xl/store:grid-cols-[1.5fr_1fr]">
          <div
            className="relative flex flex-col justify-between p-6 @3xl/store:p-8"
            style={{
              background:
                "linear-gradient(135deg, color-mix(in oklab, var(--store-accent) 18%, var(--store-bg)) 0%, var(--store-bg) 100%)",
              borderRadius: "var(--store-radius)",
            }}
          >
            <div>
              {recommended.badge && (
                <div
                  className="mb-3 inline-flex items-center rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] @3xl/store:mb-4 @3xl/store:text-[11px]"
                  style={{
                    background: "var(--store-primary)",
                    color: "var(--store-bg)",
                  }}
                >
                  {recommended.badge}
                </div>
              )}
              <h3 className="text-[24px] font-semibold tracking-[-0.02em] @3xl/store:text-[32px] @5xl/store:text-[36px]">
                {recommended.name}
              </h3>
              <p className="mt-2 max-w-[440px] text-[14px] leading-[1.55] opacity-75 @3xl/store:mt-3 @3xl/store:text-[14.5px]">
                {recommended.description}
              </p>
            </div>
            <div className="mt-7 flex flex-wrap items-end justify-between gap-4 @3xl/store:mt-10">
              <div>
                <div className="text-[34px] font-semibold leading-none @3xl/store:text-[44px] @5xl/store:text-[52px]">
                  {formatPrice(recPrice, data.currency)}
                </div>
                <div className="mt-2 text-[11.5px] opacity-65 @3xl/store:text-[12px]">
                  {recommended.quantity} × — {recommended.savings}
                </div>
              </div>
              <button
                className="px-5 py-3 text-[13px] font-semibold @3xl/store:px-6 @3xl/store:py-3.5 @3xl/store:text-[14px]"
                style={{
                  background: "var(--store-primary)",
                  color: "var(--store-bg)",
                  borderRadius: "var(--store-radius)",
                }}
              >
                Add bundle
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {others.map((b, i) => {
              const price = bundlePrice(
                data.basePriceCents,
                b.quantity,
                b.discountPercent,
              );
              return (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 border p-4 @3xl/store:p-5"
                  style={{
                    borderColor: "rgba(10,10,10,0.1)",
                    borderRadius: "var(--store-radius)",
                  }}
                >
                  <div className="min-w-0">
                    <div className="truncate text-[14px] font-semibold @3xl/store:text-[15px]">
                      {b.name}
                    </div>
                    <div className="mt-0.5 text-[11.5px] opacity-60 @3xl/store:text-[12px]">
                      {b.savings}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-[16px] font-semibold @3xl/store:text-[18px]">
                      {formatPrice(price, data.currency)}
                    </div>
                    <div className="text-[10.5px] opacity-55 @3xl/store:text-[11px]">
                      {b.quantity} pack
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
