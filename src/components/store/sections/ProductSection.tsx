import { formatPrice } from "@/lib/format";
import type { ProductData } from "@/types/store-sections";

export const ProductSection = ({ data }: { data: ProductData }) => (
  <section className="border-t border-black/5 px-5 py-12 @3xl/store:px-12 @3xl/store:py-16">
    <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-7 @3xl/store:gap-10 @5xl/store:grid-cols-[1fr_1fr]">
      <div
        className="aspect-square overflow-hidden"
        style={{ borderRadius: "var(--store-radius)" }}
      >
        {data.imageUrl && (
          <img
            src={data.imageUrl}
            alt={data.title}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div>
        <h2 className="text-[28px] font-medium leading-[1.1] tracking-[-0.03em] @3xl/store:text-[36px]">
          {data.title}
        </h2>
        <div className="mt-3 text-[26px] font-semibold @3xl/store:mt-4 @3xl/store:text-[32px]">
          {formatPrice(data.priceCents, data.currency)}
        </div>
        <button
          className="mt-6 w-full px-5 py-3.5 text-[13.5px] font-semibold @3xl/store:mt-8 @3xl/store:px-6 @3xl/store:py-4 @3xl/store:text-[14px]"
          style={{
            background: "var(--store-primary)",
            color: "var(--store-bg)",
            borderRadius: "var(--store-radius)",
          }}
        >
          Add to cart — {formatPrice(data.priceCents, data.currency)}
        </button>
      </div>
    </div>
  </section>
);
